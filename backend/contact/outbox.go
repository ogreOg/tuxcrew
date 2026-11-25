package contact

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

const (
	OutboxPending = "pending"
	OutboxSending = "sending"
	OutboxSent    = "sent"
	OutboxFailed  = "failed"
	maxSendTries  = 10
)

var ErrOutboxFull = errors.New("outbox capacity reached")

type QueuedMessage struct {
	ID        int64
	Kind      string
	Status    string
	Message   MailMessage
	CreatedAt time.Time
	UpdatedAt time.Time
	Attempts  int
	NextTryAt time.Time
	LastError string
}

type Queue interface {
	Enqueue(context.Context, string, MailMessage) (int64, error)
}

type Outbox struct {
	db            *sql.DB
	maxQueueBytes int64
}

func OpenOutbox(path string, maxQueueBytes ...int64) (*Outbox, error) {
	if path == "" {
		return nil, errors.New("OUTBOX_DB_PATH is required")
	}
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return nil, fmt.Errorf("create outbox directory: %w", err)
	}
	if err := os.Chmod(filepath.Dir(path), 0700); err != nil {
		return nil, fmt.Errorf("restrict outbox directory permissions: %w", err)
	}
	db, err := sql.Open("sqlite", "file:"+filepath.ToSlash(path)+"?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=synchronous(FULL)&_pragma=foreign_keys(1)&_pragma=secure_delete(ON)")
	if err != nil {
		return nil, fmt.Errorf("open outbox database: %w", err)
	}
	db.SetMaxOpenConns(1)
	if _, err := db.Exec(`
		PRAGMA secure_delete = ON;
		CREATE TABLE IF NOT EXISTS outbox (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			kind TEXT NOT NULL CHECK (kind IN ('contact', 'application')),
			status TEXT NOT NULL CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
			payload BLOB NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			attempts INTEGER NOT NULL DEFAULT 0,
			next_try_at INTEGER NOT NULL,
			last_error TEXT NOT NULL DEFAULT ''
		);
		CREATE INDEX IF NOT EXISTS outbox_delivery_idx ON outbox(status, next_try_at, id);
		CREATE INDEX IF NOT EXISTS outbox_retention_idx ON outbox(status, updated_at);
	`); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("initialize outbox database: %w", err)
	}
	if err := os.Chmod(path, 0600); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("restrict outbox database permissions: %w", err)
	}
	maxBytes := int64(512 << 20)
	if len(maxQueueBytes) > 0 {
		maxBytes = maxQueueBytes[0]
	}
	return &Outbox{db: db, maxQueueBytes: maxBytes}, nil
}

func (o *Outbox) RecoverInterrupted(ctx context.Context) error {
	now := time.Now().UTC().Unix()
	_, err := o.db.ExecContext(ctx, `UPDATE outbox SET status = ?, next_try_at = ?, updated_at = ? WHERE status = ?`, OutboxPending, now, now, OutboxSending)
	return err
}

func (o *Outbox) Close() error {
	return o.db.Close()
}

func (o *Outbox) Enqueue(ctx context.Context, kind string, message MailMessage) (int64, error) {
	if kind != "contact" && kind != "application" {
		return 0, errors.New("invalid outbox message kind")
	}
	payload, err := json.Marshal(message)
	if err != nil {
		return 0, fmt.Errorf("encode outbox message: %w", err)
	}
	tx, err := o.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, fmt.Errorf("begin outbox transaction: %w", err)
	}
	defer tx.Rollback()
	var queuedBytes int64
	if err := tx.QueryRowContext(ctx, `SELECT COALESCE(SUM(length(payload)), 0) FROM outbox`).Scan(&queuedBytes); err != nil {
		return 0, fmt.Errorf("check outbox capacity: %w", err)
	}
	if queuedBytes+int64(len(payload)) > o.maxQueueBytes {
		return 0, ErrOutboxFull
	}
	now := time.Now().UTC().Unix()
	result, err := tx.ExecContext(ctx, `INSERT INTO outbox (kind, status, payload, created_at, updated_at, next_try_at) VALUES (?, ?, ?, ?, ?, ?)`, kind, OutboxPending, payload, now, now, now)
	if err != nil {
		return 0, fmt.Errorf("store outbox message: %w", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	if err := tx.Commit(); err != nil {
		return 0, fmt.Errorf("commit outbox message: %w", err)
	}
	return id, nil
}

func (o *Outbox) ClaimDue(ctx context.Context, limit int) ([]QueuedMessage, error) {
	if limit < 1 {
		return nil, nil
	}
	tx, err := o.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	rows, err := tx.QueryContext(ctx, `SELECT id, kind, status, payload, created_at, updated_at, attempts, next_try_at, last_error FROM outbox WHERE status = ? AND next_try_at <= ? ORDER BY id LIMIT ?`, OutboxPending, time.Now().UTC().Unix(), limit)
	if err != nil {
		return nil, err
	}
	var messages []QueuedMessage
	for rows.Next() {
		message, err := scanQueuedMessage(rows)
		if err != nil {
			_ = rows.Close()
			return nil, err
		}
		messages = append(messages, message)
	}
	if err := rows.Err(); err != nil {
		_ = rows.Close()
		return nil, err
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	now := time.Now().UTC().Unix()
	for index := range messages {
		result, err := tx.ExecContext(ctx, `UPDATE outbox SET status = ?, attempts = attempts + 1, updated_at = ? WHERE id = ? AND status = ?`, OutboxSending, now, messages[index].ID, OutboxPending)
		if err != nil {
			return nil, err
		}
		changed, err := result.RowsAffected()
		if err != nil || changed != 1 {
			return nil, errors.New("outbox item changed while claiming")
		}
		messages[index].Status = OutboxSending
		messages[index].Attempts++
		messages[index].UpdatedAt = time.Unix(now, 0).UTC()
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return messages, nil
}

func (o *Outbox) MarkSent(ctx context.Context, id int64) error {
	_, err := o.db.ExecContext(ctx, `UPDATE outbox SET status = ?, updated_at = ?, last_error = '' WHERE id = ? AND status = ?`, OutboxSent, time.Now().UTC().Unix(), id, OutboxSending)
	return err
}

func (o *Outbox) MarkRetry(ctx context.Context, id int64, attempts int, safeError string) (string, time.Time, error) {
	now := time.Now().UTC()
	status := OutboxPending
	nextTry := now.Add(retryDelay(attempts))
	if attempts >= maxSendTries {
		status = OutboxFailed
		nextTry = now
	}
	_, err := o.db.ExecContext(ctx, `UPDATE outbox SET status = ?, updated_at = ?, next_try_at = ?, last_error = ? WHERE id = ? AND status = ?`, status, now.Unix(), nextTry.Unix(), safeError, id, OutboxSending)
	return status, nextTry, err
}

func retryDelay(attempt int) time.Duration {
	if attempt < 1 {
		attempt = 1
	}
	if attempt > 10 {
		attempt = 10
	}
	delay := time.Minute * time.Duration(1<<(attempt-1))
	if delay > 6*time.Hour {
		return 6 * time.Hour
	}
	return delay
}

func (o *Outbox) Get(ctx context.Context, id int64) (QueuedMessage, error) {
	row := o.db.QueryRowContext(ctx, `SELECT id, kind, status, payload, created_at, updated_at, attempts, next_try_at, last_error FROM outbox WHERE id = ?`, id)
	return scanQueuedMessage(row)
}

func (o *Outbox) List(ctx context.Context, status string, limit int) ([]QueuedMessage, error) {
	if limit < 1 || limit > 500 {
		limit = 100
	}
	query := `SELECT id, kind, status, created_at, updated_at, attempts, next_try_at, last_error FROM outbox`
	args := []any{}
	if status != "" {
		if status != OutboxPending && status != OutboxSending && status != OutboxSent && status != OutboxFailed {
			return nil, errors.New("invalid outbox status")
		}
		query += ` WHERE status = ?`
		args = append(args, status)
	}
	query += ` ORDER BY id DESC LIMIT ?`
	args = append(args, limit)
	rows, err := o.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var messages []QueuedMessage
	for rows.Next() {
		var message QueuedMessage
		var createdAt, updatedAt, nextTryAt int64
		if err := rows.Scan(&message.ID, &message.Kind, &message.Status, &createdAt, &updatedAt, &message.Attempts, &nextTryAt, &message.LastError); err != nil {
			return nil, err
		}
		message.CreatedAt = time.Unix(createdAt, 0).UTC()
		message.UpdatedAt = time.Unix(updatedAt, 0).UTC()
		message.NextTryAt = time.Unix(nextTryAt, 0).UTC()
		messages = append(messages, message)
	}
	return messages, rows.Err()
}

func (o *Outbox) Requeue(ctx context.Context, id int64) error {
	now := time.Now().UTC().Unix()
	result, err := o.db.ExecContext(ctx, `UPDATE outbox SET status = ?, attempts = 0, updated_at = ?, next_try_at = ?, last_error = '' WHERE id = ? AND status = ?`, OutboxPending, now, now, id, OutboxFailed)
	if err != nil {
		return err
	}
	changed, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if changed != 1 {
		return sql.ErrNoRows
	}
	return nil
}

func (o *Outbox) Delete(ctx context.Context, id int64) error {
	result, err := o.db.ExecContext(ctx, `DELETE FROM outbox WHERE id = ?`, id)
	if err != nil {
		return err
	}
	changed, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if changed != 1 {
		return sql.ErrNoRows
	}
	if _, err := o.db.ExecContext(ctx, `PRAGMA wal_checkpoint(TRUNCATE)`); err != nil {
		return fmt.Errorf("checkpoint deleted outbox data: %w", err)
	}
	return nil
}

func (o *Outbox) PruneSent(ctx context.Context, retention time.Duration) (int64, error) {
	if retention < 24*time.Hour {
		return 0, errors.New("sent-record retention must be at least one day")
	}
	result, err := o.db.ExecContext(ctx, `DELETE FROM outbox WHERE status = ? AND updated_at < ?`, OutboxSent, time.Now().UTC().Add(-retention).Unix())
	if err != nil {
		return 0, err
	}
	deleted, err := result.RowsAffected()
	if err != nil || deleted == 0 {
		return deleted, err
	}
	if _, err := o.db.ExecContext(ctx, `PRAGMA wal_checkpoint(TRUNCATE)`); err != nil {
		return deleted, fmt.Errorf("checkpoint pruned outbox data: %w", err)
	}
	return deleted, nil
}

func (o *Outbox) Backup(ctx context.Context, destination string) error {
	if destination == "" {
		return errors.New("backup destination is required")
	}
	absolutePath, err := filepath.Abs(destination)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(absolutePath), 0700); err != nil {
		return fmt.Errorf("create backup directory: %w", err)
	}
	if err := os.Chmod(filepath.Dir(absolutePath), 0700); err != nil {
		return fmt.Errorf("restrict backup directory permissions: %w", err)
	}
	if _, err := os.Stat(absolutePath); err == nil {
		return errors.New("backup destination already exists")
	} else if !errors.Is(err, os.ErrNotExist) {
		return err
	}
	if _, err := o.db.ExecContext(ctx, `VACUUM INTO ?`, absolutePath); err != nil {
		return fmt.Errorf("create SQLite backup: %w", err)
	}
	if err := os.Chmod(absolutePath, 0600); err != nil {
		return fmt.Errorf("restrict backup permissions: %w", err)
	}
	return nil
}

type rowScanner interface {
	Scan(...any) error
}

func scanQueuedMessage(row rowScanner) (QueuedMessage, error) {
	var message QueuedMessage
	var payload []byte
	var createdAt, updatedAt, nextTryAt int64
	if err := row.Scan(&message.ID, &message.Kind, &message.Status, &payload, &createdAt, &updatedAt, &message.Attempts, &nextTryAt, &message.LastError); err != nil {
		return QueuedMessage{}, err
	}
	if err := json.Unmarshal(payload, &message.Message); err != nil {
		return QueuedMessage{}, fmt.Errorf("decode outbox message %d: %w", message.ID, err)
	}
	message.CreatedAt = time.Unix(createdAt, 0).UTC()
	message.UpdatedAt = time.Unix(updatedAt, 0).UTC()
	message.NextTryAt = time.Unix(nextTryAt, 0).UTC()
	return message, nil
}
