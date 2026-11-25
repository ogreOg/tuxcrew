package contact

import (
	"bytes"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

type multipartFile struct {
	name string
	data []byte
}

func applicationRequest(handler http.Handler, fields map[string]string, files []multipartFile, remoteIP string) *httptest.ResponseRecorder {
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	for key, value := range fields {
		_ = writer.WriteField(key, value)
	}
	for _, file := range files {
		part, err := writer.CreateFormFile("attachments", file.name)
		if err != nil {
			panic(err)
		}
		_, _ = part.Write(file.data)
	}
	_ = writer.Close()
	request := httptest.NewRequest(http.MethodPost, "/api/application", &body)
	request.RemoteAddr = remoteIP + ":12345"
	request.Header.Set("Content-Type", writer.FormDataContentType())
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	return response
}

func validApplicationFields() map[string]string {
	return map[string]string{
		"name":      "Jane Applicant",
		"email":     "jane@example.com",
		"role":      "Frontend engineer",
		"portfolio": "https://portfolio.example/projects",
		"message":   "I build accessible web applications.",
	}
}

func TestApplicationValidSubmissionAndAttachments(t *testing.T) {
	sender := &mockSender{}
	handler := testHandler(sender, NewRateLimiter(5, time.Minute, 100))
	response := applicationRequest(handler, validApplicationFields(), []multipartFile{
		{name: "resume.pdf", data: []byte("pdf bytes")},
		{name: "work samples.zip", data: []byte("zip bytes")},
	}, "192.0.2.20")
	if response.Code != http.StatusAccepted || sender.count() != 1 {
		t.Fatalf("status=%d deliveries=%d body=%s", response.Code, sender.count(), response.Body)
	}
	sender.mu.Lock()
	message := sender.messages[0]
	sender.mu.Unlock()
	if message.ReplyTo != "jane@example.com" || message.Subject != "New website job application" || !strings.Contains(message.Body, "Role: Frontend engineer") || len(message.Attachments) != 2 {
		t.Fatalf("unexpected application mail: %+v", message)
	}
	if message.Attachments[0].Filename != "resume.pdf" || string(message.Attachments[0].Data) != "pdf bytes" || message.Attachments[1].Filename != "work samples.zip" {
		t.Fatalf("attachments not preserved: %+v", message.Attachments)
	}
}

func TestApplicationValidatesRequiredAndRestrictedFields(t *testing.T) {
	tests := []struct {
		name   string
		mutate func(map[string]string)
	}{
		{"missing required role", func(fields map[string]string) { fields["role"] = "" }},
		{"invalid email", func(fields map[string]string) { fields["email"] = "not-an-email" }},
		{"unsupported role", func(fields map[string]string) { fields["role"] = "CEO" }},
		{"unsafe portfolio scheme", func(fields map[string]string) { fields["portfolio"] = "javascript:alert(1)" }},
		{"header injection", func(fields map[string]string) { fields["name"] = "Jane\r\nBcc: other@example.com" }},
		{"unexpected field", func(fields map[string]string) { fields["recipient"] = "attacker@example.com" }},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			fields := validApplicationFields()
			test.mutate(fields)
			response := applicationRequest(testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100)), fields, nil, "192.0.2.20")
			if response.Code != http.StatusBadRequest {
				t.Fatalf("got %d, want 400: %s", response.Code, response.Body)
			}
		})
	}
}

func TestApplicationRejectsUnsupportedTypeTooManyAndUnexpectedFiles(t *testing.T) {
	server := testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100))
	request := httptest.NewRequest(http.MethodPost, "/api/application", strings.NewReader("{}"))
	request.RemoteAddr = "192.0.2.20:12345"
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()
	server.ServeHTTP(response, request)
	if response.Code != http.StatusUnsupportedMediaType {
		t.Fatalf("unsupported type got %d", response.Code)
	}

	tooMany := []multipartFile{{name: "1.pdf", data: []byte("1")}, {name: "2.pdf", data: []byte("2")}, {name: "3.pdf", data: []byte("3")}, {name: "4.pdf", data: []byte("4")}}
	response = applicationRequest(server, validApplicationFields(), tooMany, "192.0.2.20")
	if response.Code != http.StatusBadRequest {
		t.Fatalf("too many files got %d", response.Code)
	}

	response = applicationRequest(server, validApplicationFields(), []multipartFile{{name: "payload.exe", data: []byte("no")}}, "192.0.2.21")
	if response.Code != http.StatusBadRequest {
		t.Fatalf("unsupported file got %d", response.Code)
	}
}

func TestApplicationHoneypotAndRateLimit(t *testing.T) {
	sender := &mockSender{}
	handler := testHandler(sender, NewRateLimiter(1, time.Minute, 100))
	fields := validApplicationFields()
	fields["website"] = "bot-filled"
	response := applicationRequest(handler, fields, nil, "192.0.2.30")
	if response.Code != http.StatusAccepted || sender.count() != 0 {
		t.Fatalf("honeypot status=%d deliveries=%d", response.Code, sender.count())
	}
	fields = validApplicationFields()
	response = applicationRequest(handler, fields, nil, "192.0.2.31")
	if response.Code != http.StatusAccepted || sender.count() != 1 {
		t.Fatalf("valid application status=%d deliveries=%d", response.Code, sender.count())
	}
	response = applicationRequest(handler, fields, nil, "192.0.2.31")
	if response.Code != http.StatusTooManyRequests || response.Header().Get("Retry-After") == "" {
		t.Fatalf("rate limit status=%d retry=%q", response.Code, response.Header().Get("Retry-After"))
	}
}

func TestApplicationSenderFailureIsGeneric(t *testing.T) {
	sender := &mockSender{err: fmt.Errorf("sensitive SMTP failure")}
	response := applicationRequest(testHandler(sender, NewRateLimiter(5, time.Minute, 100)), validApplicationFields(), nil, "192.0.2.40")
	if response.Code != http.StatusServiceUnavailable || strings.Contains(response.Body.String(), "sensitive") {
		t.Fatalf("unsafe failure: %d %s", response.Code, response.Body)
	}
}

func TestApplicationBodyLimit(t *testing.T) {
	fields := validApplicationFields()
	fields["message"] = strings.Repeat("x", maxApplicationRequestBytes)
	response := applicationRequest(testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100)), fields, nil, "192.0.2.50")
	if response.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("got %d, want 413", response.Code)
	}
}

func TestApplicationFileSizeLimit(t *testing.T) {
	file := multipartFile{name: "large.pdf", data: bytes.Repeat([]byte("x"), maxApplicationFileBytes+1)}
	response := applicationRequest(testHandler(&mockSender{}, NewRateLimiter(5, time.Minute, 100)), validApplicationFields(), []multipartFile{file}, "192.0.2.60")
	if response.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("got %d, want 413", response.Code)
	}
}
