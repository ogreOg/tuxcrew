package contact

import (
	"context"
	"database/sql"
	"errors"
	"io"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"
)

func openTestOutbox(t *testing.T) (*Outbox, string) {
	t.Helper()
	path := filepath.Join(t.TempDir(), "private", "outbox.db")
	outbox, err := OpenOutbox(path)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = outbox.Close() })
	return outbox, path
}

func TestOutboxPersistsQueuedMessages(t *testing.T) {
	outbox, path := openTestOutbox(t)
	want := MailMessage{ReplyTo: "person@example.com", Subject: "Application", Body: "hello", Attachments: []Attachment{{Filename: "resume.pdf", ContentType: "application/pdf", Data: []byte("test resume")}}}
	id, err := outbox.Enqueue(context.Background(), "application", want)
	if err != nil {
		t.Fatal(err)
	}
	if err := outbox.Close(); err != nil {
		t.Fatal(err)
	}
	outbox, err = OpenOutbox(path)
	if err != nil {
		t.Fatal(err)
	}
	defer outbox.Close()
	got, err := outbox.Get(context.Background(), id)
	if err != nil {
		t.Fatal(err)
	}
	if got.Status != OutboxPending || got.Kind != "application" || got.Message.ReplyTo != want.ReplyTo || len(got.Message.Attachments) != 1 || string(got.Message.Attachments[0].Data) != "test resume" {
		t.Fatalf("restored message mismatch: %+v", got)
	}
	info, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}
	if info.Mode().Perm() != 0600 {
		t.Fatalf("database mode=%o, want 600", info.Mode().Perm())
	}
	directoryInfo, err := os.Stat(filepath.Dir(path))
	if err != nil || directoryInfo.Mode().Perm() != 0700 {
		t.Fatalf("database directory mode=%v err=%v", directoryInfo.Mode().Perm(), err)
	}
}

func TestOutboxClaimRetryAndDeadLetter(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	id, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Contact", Body: "hello"})
	if err != nil {
		t.Fatal(err)
	}
	claimed, err := outbox.ClaimDue(context.Background(), 10)
	if err != nil || len(claimed) != 1 || claimed[0].ID != id || claimed[0].Attempts != 1 {
		t.Fatalf("claimed=%+v err=%v", claimed, err)
	}
	claimedAgain, err := outbox.ClaimDue(context.Background(), 10)
	if err != nil || len(claimedAgain) != 0 {
		t.Fatalf("claimed sending item twice: %+v err=%v", claimedAgain, err)
	}
	status, next, err := outbox.MarkRetry(context.Background(), id, 1, "SMTP delivery failed")
	if err != nil || status != OutboxPending || time.Until(next) < 50*time.Second {
		t.Fatalf("status=%s next=%s err=%v", status, next, err)
	}
	if _, err := outbox.db.Exec(`UPDATE outbox SET next_try_at = ? WHERE id = ?`, time.Now().Add(-time.Second).Unix(), id); err != nil {
		t.Fatal(err)
	}
	claimed, err = outbox.ClaimDue(context.Background(), 10)
	if err != nil || len(claimed) != 1 || claimed[0].Attempts != 2 {
		t.Fatalf("second claim=%+v err=%v", claimed, err)
	}
	status, _, err = outbox.MarkRetry(context.Background(), id, maxSendTries, "SMTP delivery failed")
	if err != nil || status != OutboxFailed {
		t.Fatalf("status=%s err=%v", status, err)
	}
	failed, err := outbox.Get(context.Background(), id)
	if err != nil || failed.Status != OutboxFailed || failed.Attempts != 2 {
		t.Fatalf("failed=%+v err=%v", failed, err)
	}
}

func TestOutboxRestartRecoveryIsExplicit(t *testing.T) {
	path := filepath.Join(t.TempDir(), "outbox.db")
	outbox, err := OpenOutbox(path)
	if err != nil {
		t.Fatal(err)
	}
	id, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: "hello"})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.ClaimDue(context.Background(), 1); err != nil {
		t.Fatal(err)
	}
	if err := outbox.Close(); err != nil {
		t.Fatal(err)
	}
	outbox, err = OpenOutbox(path)
	if err != nil {
		t.Fatal(err)
	}
	defer outbox.Close()
	message, err := outbox.Get(context.Background(), id)
	if err != nil || message.Status != OutboxSending {
		t.Fatalf("admin opening unexpectedly recovered worker claim: %+v err=%v", message, err)
	}
	if err := outbox.RecoverInterrupted(context.Background()); err != nil {
		t.Fatal(err)
	}
	message, err = outbox.Get(context.Background(), id)
	if err != nil || message.Status != OutboxPending {
		t.Fatalf("startup recovery did not reset interrupted claim: %+v err=%v", message, err)
	}
}

func TestOutboxAdminRequeueDeleteAndRetention(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	ctx := context.Background()
	failedID, err := outbox.Enqueue(ctx, "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Contact", Body: "queued"})
	if err != nil {
		t.Fatal(err)
	}
	claimed, err := outbox.ClaimDue(ctx, 10)
	if err != nil || len(claimed) != 1 {
		t.Fatalf("claim=%+v err=%v", claimed, err)
	}
	if _, _, err := outbox.MarkRetry(ctx, failedID, maxSendTries, "SMTP delivery failed"); err != nil {
		t.Fatal(err)
	}
	if err := outbox.Requeue(ctx, failedID); err != nil {
		t.Fatal(err)
	}
	queued, err := outbox.Get(ctx, failedID)
	if err != nil || queued.Status != OutboxPending || queued.Attempts != 0 || queued.LastError != "" {
		t.Fatalf("requeued=%+v err=%v", queued, err)
	}
	if err := outbox.Requeue(ctx, failedID); !errors.Is(err, sql.ErrNoRows) {
		t.Fatalf("expected only failed messages to be manually requeued, got %v", err)
	}
	sentID, err := outbox.Enqueue(ctx, "application", MailMessage{ReplyTo: "person@example.com", Subject: "Application", Body: "sent"})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.db.Exec(`UPDATE outbox SET status = ?, updated_at = ? WHERE id = ?`, OutboxSent, time.Now().Add(-31*24*time.Hour).Unix(), sentID); err != nil {
		t.Fatal(err)
	}
	deleted, err := outbox.PruneSent(ctx, 30*24*time.Hour)
	if err != nil || deleted != 1 {
		t.Fatalf("deleted=%d err=%v", deleted, err)
	}
	if _, err := outbox.Get(ctx, sentID); !errors.Is(err, sql.ErrNoRows) {
		t.Fatalf("expected pruned row, got %v", err)
	}
	if err := outbox.Delete(ctx, failedID); err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.Get(ctx, failedID); !errors.Is(err, sql.ErrNoRows) {
		t.Fatalf("expected deleted row, got %v", err)
	}
}

type workerSender struct {
	mu    sync.Mutex
	calls int
	err   error
}

func (s *workerSender) Send(MailMessage) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.calls++
	return s.err
}

func TestWorkerMarksSuccessfulMessageSent(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	id, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: "hello"})
	if err != nil {
		t.Fatal(err)
	}
	sender := &workerSender{}
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	processOutboxBatch(context.Background(), outbox, sender, logger)
	message, err := outbox.Get(context.Background(), id)
	if err != nil || message.Status != OutboxSent || sender.calls != 1 {
		t.Fatalf("message=%+v calls=%d err=%v", message, sender.calls, err)
	}
}

func TestWorkerFailureKeepsMessageForRetryWithoutSensitiveError(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	id, err := outbox.Enqueue(context.Background(), "application", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: "hello"})
	if err != nil {
		t.Fatal(err)
	}
	sender := &workerSender{err: errors.New("SMTP AUTH secret password rejected")}
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	processOutboxBatch(context.Background(), outbox, sender, logger)
	message, err := outbox.Get(context.Background(), id)
	if err != nil || message.Status != OutboxPending || message.Attempts != 1 || message.LastError != "SMTP delivery failed" {
		t.Fatalf("message=%+v err=%v", message, err)
	}
}

func TestQueueOnlyWorkerKeepsPendingAndPrunesSent(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	ctx := context.Background()
	pendingID, err := outbox.Enqueue(ctx, "contact", MailMessage{ReplyTo: "pending@example.com", Subject: "Queued", Body: "keep me"})
	if err != nil {
		t.Fatal(err)
	}
	sentID, err := outbox.Enqueue(ctx, "contact", MailMessage{ReplyTo: "sent@example.com", Subject: "Sent", Body: "remove me"})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.db.Exec(`UPDATE outbox SET status = ?, updated_at = ? WHERE id = ?`, OutboxSent, time.Now().Add(-40*24*time.Hour).Unix(), sentID); err != nil {
		t.Fatal(err)
	}
	pruneSent(ctx, outbox, slog.New(slog.NewTextHandler(io.Discard, nil)), 30*24*time.Hour)
	workerCtx, cancel := context.WithCancel(ctx)
	cancel()
	RunOutboxWorker(workerCtx, outbox, nil, slog.New(slog.NewTextHandler(io.Discard, nil)), 30*24*time.Hour)
	pending, err := outbox.Get(ctx, pendingID)
	if err != nil || pending.Status != OutboxPending {
		t.Fatalf("pending item changed without SMTP: %+v err=%v", pending, err)
	}
	if _, err := outbox.Get(ctx, sentID); !errors.Is(err, sql.ErrNoRows) {
		t.Fatalf("expired sent item remained: %v", err)
	}
}

func TestOutboxListDoesNotLoadMessagePayload(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	if _, err := outbox.Enqueue(context.Background(), "application", MailMessage{ReplyTo: "person@example.com", Subject: "Resume", Body: "private body", Attachments: []Attachment{{Filename: "resume.pdf", Data: []byte("private file")}}}); err != nil {
		t.Fatal(err)
	}
	items, err := outbox.List(context.Background(), OutboxPending, 10)
	if err != nil || len(items) != 1 {
		t.Fatalf("items=%+v err=%v", items, err)
	}
	if items[0].Message.Body != "" || len(items[0].Message.Attachments) != 0 {
		t.Fatalf("list unexpectedly loaded private payload: %+v", items[0].Message)
	}
}

func TestOutboxCapacityAndPrivateBackup(t *testing.T) {
	path := filepath.Join(t.TempDir(), "outbox.db")
	outbox, err := OpenOutbox(path, 512)
	if err != nil {
		t.Fatal(err)
	}
	defer outbox.Close()
	if _, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: "small"}); err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: strings.Repeat("x", 1000)}); !errors.Is(err, ErrOutboxFull) {
		t.Fatalf("expected bounded queue error, got %v", err)
	}
	backupPath := filepath.Join(t.TempDir(), "backup", "outbox-copy.db")
	if err := outbox.Backup(context.Background(), backupPath); err != nil {
		t.Fatal(err)
	}
	info, err := os.Stat(backupPath)
	if err != nil || info.Mode().Perm() != 0600 {
		t.Fatalf("backup permissions=%v err=%v", info, err)
	}
	backup, err := OpenOutbox(backupPath)
	if err != nil {
		t.Fatal(err)
	}
	defer backup.Close()
	messages, err := backup.List(context.Background(), OutboxPending, 10)
	if err != nil || len(messages) != 1 {
		t.Fatalf("backup messages=%d err=%v", len(messages), err)
	}
	if err := outbox.Backup(context.Background(), backupPath); err == nil {
		t.Fatal("expected backup to refuse overwriting an existing file")
	}
}

func TestOutboxCapacityIncludesSentRecordsUnderRetention(t *testing.T) {
	outbox, _ := openTestOutbox(t)
	outbox.maxQueueBytes = 512
	id, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: "small"})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.db.Exec(`UPDATE outbox SET status = ? WHERE id = ?`, OutboxSent, id); err != nil {
		t.Fatal(err)
	}
	if _, err := outbox.Enqueue(context.Background(), "contact", MailMessage{ReplyTo: "person@example.com", Subject: "Test", Body: strings.Repeat("x", 1000)}); !errors.Is(err, ErrOutboxFull) {
		t.Fatalf("expected retained sent message to consume capacity, got %v", err)
	}
}
