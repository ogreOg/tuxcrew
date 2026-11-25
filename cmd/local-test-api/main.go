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

type mailSink struct {
	logger *slog.Logger
}

func (s mailSink) Enqueue(_ context.Context, _ string, message contact.MailMessage) (int64, error) {
	s.logger.Info("mock message accepted; SMTP was not used", "attachment_count", len(message.Attachments))
	return 1, nil
}

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	handler := contact.NewHandler(&mailSink{logger: logger}, contact.NewRateLimiter(5, 15*time.Minute, 10000), logger, "")
	server := &http.Server{
		Addr:              "127.0.0.1:18080",
		Handler:           handler.Routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       90 * time.Second,
		WriteTimeout:      120 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    8 << 10,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	serverErrors := make(chan error, 1)
	go func() {
		logger.Info("local SMTP-free test API listening", "address", server.Addr)
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-serverErrors:
		if !errors.Is(err, http.ErrServerClosed) {
			logger.Error("test API stopped", "error", err.Error())
			os.Exit(1)
		}
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			logger.Error("test API shutdown failed", "error", err.Error())
			_ = server.Close()
			os.Exit(1)
		}
		logger.Info("local test API stopped")
	}
}
