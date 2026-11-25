package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"tonrax/contact-api/backend/contact"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	cfg, err := contact.LoadConfig()
	if err != nil {
		logger.Error("invalid service configuration", "error", err.Error())
		os.Exit(1)
	}
	if err := cfg.Validate(); err != nil {
		logger.Error("invalid service configuration", "error", err.Error())
		os.Exit(1)
	}
	outbox, err := contact.OpenOutbox(cfg.OutboxDBPath, cfg.OutboxMaxBytes)
	if err != nil {
		logger.Error("could not open durable outbox", "error", err.Error())
		os.Exit(1)
	}
	defer outbox.Close()
	if err := outbox.RecoverInterrupted(context.Background()); err != nil {
		logger.Error("could not recover interrupted outbox deliveries", "error", err.Error())
		os.Exit(1)
	}
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	workerDone := make(chan struct{})
	var mailer contact.DeliverySender
	if cfg.SMTPConfigured {
		mailer = contact.NewSMTPMailer(cfg)
	} else {
		logger.Warn("SMTP is not configured; submissions will be stored in the outbox until credentials are added")
	}
	go func() {
		defer close(workerDone)
		contact.RunOutboxWorker(ctx, outbox, mailer, logger, time.Duration(cfg.RetentionDays)*24*time.Hour)
	}()

	server := &http.Server{
		Addr:              cfg.ListenAddr,
		Handler:           contact.NewHandler(outbox, contact.NewRateLimiter(cfg.RateLimit, cfg.RateWindow, 10000), logger, cfg.TrustedProxyIP).Routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       90 * time.Second,
		WriteTimeout:      120 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    8 << 10,
	}

	serverErrors := make(chan error, 1)
	go func() {
		logger.Info("contact API listening", "address", server.Addr)
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-serverErrors:
		if !errors.Is(err, http.ErrServerClosed) {
			logger.Error("HTTP server stopped", "error", err.Error())
			os.Exit(1)
		}
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			logger.Error("graceful shutdown failed", "error", err.Error())
			_ = server.Close()
			os.Exit(1)
		}
		logger.Info("contact API stopped")
	}
	stop()
	<-workerDone
}
