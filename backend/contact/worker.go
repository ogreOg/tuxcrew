package contact

import (
	"context"
	"log/slog"
	"time"
)

type DeliverySender interface {
	Send(MailMessage) error
}

func RunOutboxWorker(ctx context.Context, outbox *Outbox, sender DeliverySender, logger *slog.Logger, retention time.Duration) {
	deliveryTicker := time.NewTicker(5 * time.Second)
	defer deliveryTicker.Stop()
	retentionTicker := time.NewTicker(24 * time.Hour)
	defer retentionTicker.Stop()
	if sender != nil {
		processOutboxBatch(ctx, outbox, sender, logger)
	}
	pruneSent(ctx, outbox, logger, retention)
	for {
		select {
		case <-ctx.Done():
			return
		case <-deliveryTicker.C:
			if sender != nil {
				processOutboxBatch(ctx, outbox, sender, logger)
			}
		case <-retentionTicker.C:
			pruneSent(ctx, outbox, logger, retention)
		}
	}
}

func pruneSent(ctx context.Context, outbox *Outbox, logger *slog.Logger, retention time.Duration) {
	if _, err := outbox.PruneSent(ctx, retention); err != nil && ctx.Err() == nil {
		logger.Error("outbox retention cleanup failed", "error", err.Error())
	}
}

func processOutboxBatch(ctx context.Context, outbox *Outbox, sender DeliverySender, logger *slog.Logger) {
	items, err := outbox.ClaimDue(ctx, 10)
	if err != nil {
		if ctx.Err() == nil {
			logger.Error("could not claim outbox messages", "error", err.Error())
		}
		return
	}
	for _, item := range items {
		if err := ctx.Err(); err != nil {
			return
		}
		if err := sender.Send(item.Message); err != nil {
			status, nextTry, markErr := outbox.MarkRetry(ctx, item.ID, item.Attempts, "SMTP delivery failed")
			if markErr != nil {
				logger.Error("could not update failed outbox message", "id", item.ID, "error", markErr.Error())
				continue
			}
			if status == OutboxFailed {
				logger.Error("outbox message entered failed state after retry limit", "id", item.ID, "attempts", item.Attempts)
			} else {
				logger.Warn("outbox message delivery failed; will retry", "id", item.ID, "attempts", item.Attempts, "next_attempt_at", nextTry.Format(time.RFC3339))
			}
			continue
		}
		if err := outbox.MarkSent(ctx, item.ID); err != nil {
			logger.Error("SMTP accepted message but outbox status update failed", "id", item.ID, "error", err.Error())
			continue
		}
		logger.Info("outbox message delivered", "id", item.ID, "kind", item.Kind, "attempts", item.Attempts)
	}
}
