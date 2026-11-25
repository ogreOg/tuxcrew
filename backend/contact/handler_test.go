package contact

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"
)

type mockSender struct {
	mu       sync.Mutex
	messages []MailMessage
	err      error
	nextID   int64
}

func (m *mockSender) Enqueue(_ context.Context, _ string, message MailMessage) (int64, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.messages = append(m.messages, message)
	m.nextID++
	return m.nextID, m.err
}

func (m *mockSender) count() int {
	m.mu.Lock()
	defer m.mu.Unlock()
	return len(m.messages)
}

func testHandler(sender Queue, limiter *RateLimiter, trustedProxyIP ...string) http.Handler {
	trusted := ""
	if len(trustedProxyIP) > 0 {
		trusted = trustedProxyIP[0]
	}
	return NewHandler(sender, limiter, slog.New(slog.NewTextHandler(io.Discard, nil)), trusted).Routes()
}

type fullQueue struct{}

func (fullQueue) Enqueue(context.Context, string, MailMessage) (int64, error) {
	return 0, ErrOutboxFull
}

func request(handler http.Handler, method, contentType, body, remoteIP string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, "/api/contact", strings.NewReader(body))
	req.RemoteAddr = remoteIP + ":12345"
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, req)
	return response
}

func validBody() string {
	return `{"name":"Example Visitor","email":"visitor@example.com","phone":"+1 555 0100","subject":"Project inquiry","message":"Tell me more."}`
}

func TestContactValidSubmission(t *testing.T) {
	sender := &mockSender{}
	response := request(testHandler(sender, NewRateLimiter(5, time.Minute, 100)), http.MethodPost, "application/json", validBody(), "192.0.2.10")
	if response.Code != http.StatusAccepted || sender.count() != 1 {
		t.Fatalf("status=%d deliveries=%d body=%s", response.Code, sender.count(), response.Body)
	}
	if response.Header().Get("Cache-Control") != "no-store" {
		t.Fatal("response should not be cached")
	}
	sender.mu.Lock()
	message := sender.messages[0]
	sender.mu.Unlock()
	if message.ReplyTo != "visitor@example.com" || message.Subject != "New website contact enquiry" || !strings.Contains(message.Body, "Phone: +1 555 0100") {
		t.Fatalf("unexpected contact message: %+v", message)
	}
}

func TestContactRejectsInvalidRequests(t *testing.T) {
	tests := []struct {
		name        string
		contentType string
		body        string
		wantStatus  int
	}{
		{"missing required fields", "application/json", `{"name":"N"}`, http.StatusBadRequest},
		{"invalid email", "application/json", `{"name":"N","email":"bad","subject":"S","message":"M"}`, http.StatusBadRequest},
		{"malformed JSON", "application/json", `{"name":`, http.StatusBadRequest},
		{"unsupported content type", "text/plain", `{}`, http.StatusUnsupportedMediaType},
		{"oversized body", "application/json", strings.Repeat("x", maxRequestBytes+1), http.StatusBadRequest},
		{"too-long field", "application/json", fmt.Sprintf(`{"name":"%s","email":"a@example.com","subject":"S","message":"M"}`, strings.Repeat("n", 121)), http.StatusBadRequest},
		{"header injection", "application/json", `{"name":"N\r\nBcc: victim@example.com","email":"a@example.com","subject":"S","message":"M"}`, http.StatusBadRequest},
		{"unexpected field", "application/json", `{"name":"N","email":"a@example.com","subject":"S","message":"M","recipient":"attacker@example.com"}`, http.StatusBadRequest},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			response := request(testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100)), http.MethodPost, test.contentType, test.body, "192.0.2.10")
			if response.Code != test.wantStatus {
				t.Fatalf("got status %d, want %d: %s", response.Code, test.wantStatus, response.Body)
			}
		})
	}
}

func TestOversizedRequestReturns413(t *testing.T) {
	body, err := json.Marshal(Submission{Name: "Visitor", Email: "visitor@example.com", Subject: "Question", Message: strings.Repeat("x", maxRequestBytes)})
	if err != nil {
		t.Fatal(err)
	}
	response := request(testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100)), http.MethodPost, "application/json", string(body), "192.0.2.10")
	if response.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("got status %d, want 413", response.Code)
	}
}

func TestHoneypotDoesNotSend(t *testing.T) {
	sender := &mockSender{}
	body := strings.TrimSuffix(validBody(), "}") + `,"website":"bot content"}`
	response := request(testHandler(sender, NewRateLimiter(5, time.Minute, 100)), http.MethodPost, "application/json", body, "192.0.2.10")
	if response.Code != http.StatusAccepted || sender.count() != 0 || !strings.Contains(response.Body.String(), `"status":"queued"`) {
		t.Fatalf("status=%d deliveries=%d", response.Code, sender.count())
	}
}

func TestRateLimit(t *testing.T) {
	sender := &mockSender{}
	handler := testHandler(sender, NewRateLimiter(1, time.Minute, 100))
	first := request(handler, http.MethodPost, "application/json", validBody(), "192.0.2.10")
	second := request(handler, http.MethodPost, "application/json", validBody(), "192.0.2.10")
	if first.Code != http.StatusAccepted || second.Code != http.StatusTooManyRequests || second.Header().Get("Retry-After") == "" {
		t.Fatalf("first=%d second=%d retry-after=%q", first.Code, second.Code, second.Header().Get("Retry-After"))
	}
}

func TestRateLimitUsesVisitorIPsBehindDockerCaddy(t *testing.T) {
	sender := &mockSender{}
	handler := testHandler(sender, NewRateLimiter(1, time.Minute, 100), "172.30.0.10")
	submit := func(visitorIP string) *httptest.ResponseRecorder {
		req := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(validBody()))
		req.RemoteAddr = "172.30.0.10:8080"
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-Real-IP", visitorIP)
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, req)
		return response
	}
	if response := submit("198.51.100.1"); response.Code != http.StatusAccepted {
		t.Fatalf("first visitor got %d", response.Code)
	}
	if response := submit("198.51.100.2"); response.Code != http.StatusAccepted {
		t.Fatalf("second visitor was incorrectly grouped with first: %d", response.Code)
	}
	if response := submit("198.51.100.1"); response.Code != http.StatusTooManyRequests {
		t.Fatalf("repeated first visitor got %d, want 429", response.Code)
	}
}

func TestSenderFailureIsSafe(t *testing.T) {
	sender := &mockSender{err: fmt.Errorf("secret smtp diagnostic")}
	response := request(testHandler(sender, NewRateLimiter(5, time.Minute, 100)), http.MethodPost, "application/json", validBody(), "192.0.2.10")
	if response.Code != http.StatusServiceUnavailable || strings.Contains(response.Body.String(), "secret") {
		t.Fatalf("unsafe failure response: %d %s", response.Code, response.Body)
	}
}

func TestFullOutboxReturnsSafeStorageError(t *testing.T) {
	response := request(testHandler(fullQueue{}, NewRateLimiter(5, time.Minute, 100)), http.MethodPost, "application/json", validBody(), "192.0.2.10")
	if response.Code != http.StatusServiceUnavailable || strings.Contains(response.Body.String(), "SQLite") || strings.Contains(response.Body.String(), "capacity") {
		t.Fatalf("unsafe or incorrect queue-full response: %d %s", response.Code, response.Body)
	}
}

func TestNoCORSAndHealth(t *testing.T) {
	handler := testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100))
	req := httptest.NewRequest(http.MethodOptions, "/api/contact", nil)
	req.Header.Set("Origin", "https://attacker.example")
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, req)
	if response.Code != http.StatusMethodNotAllowed || response.Header().Get("Access-Control-Allow-Origin") != "" {
		t.Fatalf("unexpected CORS response: %d %#v", response.Code, response.Header())
	}
	health := httptest.NewRecorder()
	handler.ServeHTTP(health, httptest.NewRequest(http.MethodGet, "/healthz", nil))
	if health.Code != http.StatusOK || health.Body.String() != "ok\n" {
		t.Fatalf("unexpected health response: %d %q", health.Code, health.Body.String())
	}
}

func TestMethodNotAllowedAndSafeError(t *testing.T) {
	response := request(testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100)), http.MethodGet, "", "", "192.0.2.10")
	if response.Code != http.StatusMethodNotAllowed || response.Header().Get("Allow") != http.MethodPost {
		t.Fatalf("unexpected method response: %d %#v", response.Code, response.Header())
	}
	var payload map[string]string
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil || len(payload) == 0 {
		t.Fatalf("expected safe JSON error response: %v", err)
	}
}

func TestClientIPTrustBoundary(t *testing.T) {
	tests := []struct {
		name, remote, realIP, forwarded, trustedProxy, want string
	}{
		{"loopback uses overwritten real IP", "127.0.0.1:443", "198.51.100.8", "203.0.113.1", "", "198.51.100.8"},
		{"configured Caddy IP uses real IP", "172.30.0.2:443", "198.51.100.8", "203.0.113.1", "172.30.0.2", "198.51.100.8"},
		{"untrusted peer ignores headers", "192.0.2.5:443", "198.51.100.8", "203.0.113.1", "172.30.0.2", "192.0.2.5"},
		{"invalid proxy header falls back", "127.0.0.1:443", "not an ip", "", "", "127.0.0.1"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/", bytes.NewBuffer(nil))
			req.RemoteAddr = test.remote
			req.Header.Set("X-Real-IP", test.realIP)
			req.Header.Set("X-Forwarded-For", test.forwarded)
			if got := clientIP(req, test.trustedProxy); got != test.want {
				t.Fatalf("got %q, want %q", got, test.want)
			}
		})
	}
}

func TestRateLimiterConcurrentAndBounded(t *testing.T) {
	limiter := NewRateLimiter(10, time.Minute, 100)
	var wg sync.WaitGroup
	var allowed int
	var mu sync.Mutex
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			ok, _ := limiter.Allow("192.0.2.1")
			if ok {
				mu.Lock()
				allowed++
				mu.Unlock()
			}
		}()
	}
	wg.Wait()
	if allowed != 10 {
		t.Fatalf("allowed %d requests, want 10", allowed)
	}
	for i := 0; i < 1000; i++ {
		limiter.Allow(fmt.Sprintf("198.51.100.%d", i))
	}
	if limiter.Len() > 100 {
		t.Fatalf("limiter grew to %d entries", limiter.Len())
	}
}

func TestRateLimiterCleansExpiredEntries(t *testing.T) {
	limiter := NewRateLimiter(1, time.Minute, 10)
	clock := time.Now()
	limiter.now = func() time.Time { return clock }
	if ok, _ := limiter.Allow("192.0.2.1"); !ok {
		t.Fatal("first request should pass")
	}
	clock = clock.Add(time.Minute)
	if ok, _ := limiter.Allow("192.0.2.2"); !ok {
		t.Fatal("request after expiry should pass")
	}
	if limiter.Len() != 1 {
		t.Fatalf("expired entry was not cleaned: %d entries", limiter.Len())
	}
}
