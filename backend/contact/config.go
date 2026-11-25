package contact

import (
	"fmt"
	"net"
	"net/mail"
	"os"
	"strconv"
	"strings"
	"time"
)

const fixedRecipient = "query@example.com"

type Config struct {
	ListenAddr     string
	TrustedProxyIP string
	OutboxDBPath   string
	RetentionDays  int
	OutboxMaxBytes int64
	SMTPHost       string
	SMTPPort       int
	SMTPConfigured bool
	SMTPUsername   string
	SMTPPassword   string
	SMTPFrom       string
	Recipient      string
	RateLimit      int
	RateWindow     time.Duration
}

func LoadConfig() (Config, error) {
	smtpHost := strings.TrimSpace(os.Getenv("SMTP_HOST"))
	smtpPortValue := strings.TrimSpace(os.Getenv("SMTP_PORT"))
	smtpUsername := strings.TrimSpace(os.Getenv("SMTP_USERNAME"))
	smtpPassword := os.Getenv("SMTP_PASSWORD")
	smtpFrom := strings.TrimSpace(os.Getenv("SMTP_FROM"))
	smtpConfigured := smtpHost != "" || smtpPortValue != "" || smtpUsername != "" || smtpPassword != "" || smtpFrom != ""
	if smtpConfigured && (smtpHost == "" || smtpUsername == "" || smtpPassword == "" || smtpFrom == "") {
		return Config{}, fmt.Errorf("SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, and SMTP_FROM must be configured together")
	}
	smtpPort := 465
	if smtpPortValue != "" {
		var err error
		smtpPort, err = strconv.Atoi(smtpPortValue)
		if err != nil {
			return Config{}, fmt.Errorf("SMTP_PORT must be 465 or 587")
		}
	}
	var err error
	limit := 5
	if value := os.Getenv("CONTACT_RATE_LIMIT_MAX"); value != "" {
		limit, err = strconv.Atoi(value)
		if err != nil || limit < 1 || limit > 100 {
			return Config{}, fmt.Errorf("CONTACT_RATE_LIMIT_MAX must be between 1 and 100")
		}
	}
	window := 15 * time.Minute
	if value := os.Getenv("CONTACT_RATE_LIMIT_WINDOW"); value != "" {
		window, err = time.ParseDuration(value)
		if err != nil || window < time.Minute || window > 24*time.Hour {
			return Config{}, fmt.Errorf("CONTACT_RATE_LIMIT_WINDOW must be between 1m and 24h")
		}
	}

	cfg := Config{
		ListenAddr:     strings.TrimSpace(os.Getenv("CONTACT_LISTEN_ADDR")),
		TrustedProxyIP: strings.TrimSpace(os.Getenv("CONTACT_TRUSTED_PROXY_IP")),
		OutboxDBPath:   strings.TrimSpace(os.Getenv("OUTBOX_DB_PATH")),
		SMTPHost:       smtpHost,
		SMTPPort:       smtpPort,
		SMTPConfigured: smtpConfigured,
		SMTPUsername:   smtpUsername,
		SMTPPassword:   smtpPassword,
		SMTPFrom:       smtpFrom,
		Recipient:      strings.TrimSpace(os.Getenv("CONTACT_RECIPIENT")),
		RateLimit:      limit,
		RateWindow:     window,
	}
	retentionDays := 90
	if value := os.Getenv("OUTBOX_RETENTION_DAYS"); value != "" {
		retentionDays, err = strconv.Atoi(value)
		if err != nil || retentionDays < 30 || retentionDays > 3650 {
			return Config{}, fmt.Errorf("OUTBOX_RETENTION_DAYS must be between 30 and 3650")
		}
	}
	cfg.RetentionDays = retentionDays
	outboxMaxBytes := int64(512 << 20)
	if value := os.Getenv("OUTBOX_MAX_BYTES"); value != "" {
		outboxMaxBytes, err = strconv.ParseInt(value, 10, 64)
		if err != nil || outboxMaxBytes < 64<<20 || outboxMaxBytes > 5<<30 {
			return Config{}, fmt.Errorf("OUTBOX_MAX_BYTES must be between 64 MiB and 5 GiB")
		}
	}
	cfg.OutboxMaxBytes = outboxMaxBytes
	if cfg.ListenAddr == "" {
		cfg.ListenAddr = "127.0.0.1:8080"
	}
	if cfg.OutboxDBPath == "" {
		cfg.OutboxDBPath = "./data/tonrax-outbox.db"
	}
	if cfg.Recipient == "" {
		cfg.Recipient = fixedRecipient
	}
	if err := cfg.Validate(); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

func (c Config) Validate() error {
	host, port, err := net.SplitHostPort(c.ListenAddr)
	if err != nil || port != "8080" || (host != "127.0.0.1" && host != "0.0.0.0") {
		return fmt.Errorf("CONTACT_LISTEN_ADDR must be 127.0.0.1:8080 or 0.0.0.0:8080")
	}
	if c.TrustedProxyIP != "" && net.ParseIP(c.TrustedProxyIP) == nil {
		return fmt.Errorf("CONTACT_TRUSTED_PROXY_IP must be a valid IP address")
	}
	if c.OutboxDBPath == "" || c.RetentionDays < 30 || c.RetentionDays > 3650 || c.OutboxMaxBytes < 64<<20 || c.OutboxMaxBytes > 5<<30 {
		return fmt.Errorf("outbox configuration is invalid")
	}
	if c.SMTPConfigured {
		if c.SMTPHost == "" || strings.ContainsAny(c.SMTPHost, " \r\n/\\") {
			return fmt.Errorf("SMTP_HOST must be a hostname")
		}
		if c.SMTPPort != 465 && c.SMTPPort != 587 {
			return fmt.Errorf("SMTP_PORT must be 465 (implicit TLS) or 587 (STARTTLS)")
		}
		if c.SMTPUsername == "" || c.SMTPPassword == "" {
			return fmt.Errorf("SMTP_USERNAME and SMTP_PASSWORD are required when SMTP is configured")
		}
		if strings.ContainsAny(c.SMTPUsername+c.SMTPPassword, "\r\n") {
			return fmt.Errorf("SMTP credentials contain invalid characters")
		}
		if !isMailbox(c.SMTPFrom) {
			return fmt.Errorf("SMTP_FROM must be a single email address")
		}
	} else if c.SMTPHost != "" || c.SMTPUsername != "" || c.SMTPPassword != "" || c.SMTPFrom != "" {
		return fmt.Errorf("SMTP configuration is incomplete")
	}
	if !isMailbox(c.Recipient) {
		return fmt.Errorf("CONTACT_RECIPIENT must be a single email address")
	}
	if c.RateLimit < 1 || c.RateLimit > 100 || c.RateWindow < time.Minute || c.RateWindow > 24*time.Hour {
		return fmt.Errorf("contact rate-limit configuration is invalid")
	}
	return nil
}

func isMailbox(value string) bool {
	if value == "" || strings.ContainsAny(value, "\r\n") {
		return false
	}
	address, err := mail.ParseAddress(value)
	return err == nil && address.Address == value
}
