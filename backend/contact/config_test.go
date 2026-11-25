package contact

import (
	"strings"
	"testing"
	"time"
)

func setValidEnvironment(t *testing.T) {
	t.Helper()
	values := map[string]string{
		"SMTP_HOST":                 "smtp.purelymail.com",
		"SMTP_PORT":                 "465",
		"SMTP_USERNAME":             "query@example.com",
		"SMTP_PASSWORD":             "test-only-password",
		"SMTP_FROM":                 "query@example.com",
		"CONTACT_RECIPIENT":         fixedRecipient,
		"CONTACT_RATE_LIMIT_MAX":    "",
		"CONTACT_RATE_LIMIT_WINDOW": "",
	}
	for key, value := range values {
		t.Setenv(key, value)
	}
}

func TestLoadConfig(t *testing.T) {
	setValidEnvironment(t)
	cfg, err := LoadConfig()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.RateLimit != 5 || cfg.RateWindow != 15*time.Minute || cfg.Recipient != fixedRecipient {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
	if !cfg.SMTPConfigured {
		t.Fatal("expected SMTP to be configured")
	}
}

func TestLoadConfigMissingRequiredValues(t *testing.T) {
	for _, key := range []string{"SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"} {
		t.Run(key, func(t *testing.T) {
			setValidEnvironment(t)
			t.Setenv(key, "")
			if _, err := LoadConfig(); err == nil {
				t.Fatalf("expected partial SMTP configuration without %s to fail", key)
			}
		})
	}
}

func TestLoadConfigAllowsSMTPToBeUnconfigured(t *testing.T) {
	setValidEnvironment(t)
	for _, key := range []string{"SMTP_HOST", "SMTP_PORT", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"} {
		t.Setenv(key, "")
	}
	cfg, err := LoadConfig()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.SMTPConfigured || cfg.SMTPPort != 465 || cfg.Recipient != fixedRecipient {
		t.Fatalf("unexpected queue-only config: %+v", cfg)
	}
}

func TestConfigAllowsConfiguredRecipientAndRejectsUnsafeAddresses(t *testing.T) {
	setValidEnvironment(t)
	t.Setenv("CONTACT_RECIPIENT", "query@tonrax.com")
	cfg, err := LoadConfig()
	if err != nil || cfg.Recipient != "query@tonrax.com" {
		t.Fatalf("expected configured recipient to load, config=%+v err=%v", cfg, err)
	}
	setValidEnvironment(t)
	t.Setenv("SMTP_FROM", "sender@example.com\r\nBcc: other@example.com")
	if _, err := LoadConfig(); err == nil {
		t.Fatal("expected header injection sender to fail")
	}
	setValidEnvironment(t)
	t.Setenv("CONTACT_RECIPIENT", "query@tonrax.com\r\nBcc: other@example.com")
	if _, err := LoadConfig(); err == nil {
		t.Fatal("expected header injection recipient to fail")
	}
}

func TestConfigErrorsDoNotIncludeSecrets(t *testing.T) {
	setValidEnvironment(t)
	t.Setenv("SMTP_PASSWORD", "never-log-this-secret")
	t.Setenv("SMTP_PORT", "invalid")
	_, err := LoadConfig()
	if err == nil || strings.Contains(err.Error(), "never-log-this-secret") {
		t.Fatalf("unexpected config error: %v", err)
	}
}

func TestConfigValidationUsesEnvironment(t *testing.T) {
	setValidEnvironment(t)
	t.Setenv("SMTP_PORT", "587")
	t.Setenv("CONTACT_RATE_LIMIT_MAX", "12")
	t.Setenv("CONTACT_RATE_LIMIT_WINDOW", "20m")
	t.Setenv("CONTACT_LISTEN_ADDR", "0.0.0.0:8080")
	t.Setenv("CONTACT_TRUSTED_PROXY_IP", "172.30.0.10")
	cfg, err := LoadConfig()
	if err != nil || cfg.SMTPPort != 587 || cfg.RateLimit != 12 || cfg.RateWindow != 20*time.Minute || cfg.ListenAddr != "0.0.0.0:8080" || cfg.TrustedProxyIP != "172.30.0.10" {
		t.Fatalf("config=%+v err=%v", cfg, err)
	}
}

func TestConfigRejectsUnsafeListenAndProxyAddresses(t *testing.T) {
	for _, test := range []struct {
		name, listen, trusted string
	}{
		{"public nonstandard bind", "0.0.0.0:9000", ""},
		{"invalid trusted proxy", "0.0.0.0:8080", "not-an-ip"},
	} {
		t.Run(test.name, func(t *testing.T) {
			setValidEnvironment(t)
			t.Setenv("CONTACT_LISTEN_ADDR", test.listen)
			t.Setenv("CONTACT_TRUSTED_PROXY_IP", test.trusted)
			if _, err := LoadConfig(); err == nil {
				t.Fatal("expected invalid deployment configuration to fail")
			}
		})
	}
}
