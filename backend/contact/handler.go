package contact

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"mime"
	"net/http"
	"net/mail"
	"strconv"
	"strings"
	"unicode/utf8"
)

const maxRequestBytes = 16 << 10

type Submission struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Subject string `json:"subject"`
	Message string `json:"message"`
	Website string `json:"website"`
}

type Attachment struct {
	Filename    string
	ContentType string
	Data        []byte
}

type MailMessage struct {
	ReplyTo     string
	Subject     string
	Body        string
	Attachments []Attachment
}

type Handler struct {
	queue          Queue
	limiter        *RateLimiter
	logger         *slog.Logger
	trustedProxyIP string
}

func NewHandler(queue Queue, limiter *RateLimiter, logger *slog.Logger, trustedProxyIP string) *Handler {
	return &Handler{queue: queue, limiter: limiter, logger: logger, trustedProxyIP: trustedProxyIP}
}

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = io.WriteString(w, "ok\n")
	})
	mux.HandleFunc("/api/contact", h.contact)
	mux.HandleFunc("/api/application", h.application)
	return securityHeaders(mux)
}

func (h *Handler) contact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	mediaType, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || mediaType != "application/json" {
		writeError(w, http.StatusUnsupportedMediaType, "unsupported content type")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBytes)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	var submission Submission
	if err := decoder.Decode(&submission); err != nil {
		var maxBytesError *http.MaxBytesError
		if errors.As(err, &maxBytesError) {
			writeError(w, http.StatusRequestEntityTooLarge, "request too large")
			return
		}
		writeError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		writeError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if err := validateSubmission(&submission); err != nil {
		writeError(w, http.StatusBadRequest, "please check the form fields")
		return
	}

	allowed, retryAfter := h.limiter.Allow(clientIP(r, h.trustedProxyIP))
	if !allowed {
		seconds := int(retryAfter.Seconds())
		if seconds < 1 {
			seconds = 1
		}
		w.Header().Set("Retry-After", strconv.Itoa(seconds))
		writeError(w, http.StatusTooManyRequests, "too many requests")
		return
	}
	if submission.Website != "" {
		writeQueued(w, 0)
		return
	}

	mailMessage := MailMessage{
		ReplyTo: submission.Email,
		Subject: "New website contact enquiry",
		Body: strings.Join([]string{
			"New website contact enquiry",
			"",
			"Name: " + submission.Name,
			"Email: " + submission.Email,
			"Phone: " + optionalValue(submission.Phone),
			"Subject: " + submission.Subject,
			"",
			"Message:",
			submission.Message,
		}, "\n"),
	}
	id, err := h.queue.Enqueue(r.Context(), "contact", mailMessage)
	if err != nil {
		h.logger.Error("contact could not be stored in outbox")
		writeError(w, http.StatusServiceUnavailable, "message could not be saved; please try again later")
		return
	}
	writeQueued(w, id)
}

func validateSubmission(s *Submission) error {
	s.Name = strings.TrimSpace(s.Name)
	s.Email = strings.TrimSpace(s.Email)
	s.Phone = strings.TrimSpace(s.Phone)
	s.Subject = strings.TrimSpace(s.Subject)
	s.Message = strings.TrimSpace(s.Message)
	s.Website = strings.TrimSpace(s.Website)
	if !validText(s.Name, 1, 120) || !validText(s.Email, 1, 254) || !validText(s.Phone, 0, 40) || !validText(s.Subject, 1, 160) || !validText(s.Message, 1, 8000) || !validText(s.Website, 0, 500) {
		return errors.New("invalid field length or contents")
	}
	if strings.ContainsAny(s.Name+s.Email+s.Phone+s.Subject, "\r\n") {
		return errors.New("line breaks are not allowed in header-sensitive fields")
	}
	parsed, err := mail.ParseAddress(s.Email)
	if err != nil || parsed.Address != s.Email || strings.ContainsAny(s.Email, " \t") {
		return errors.New("invalid email address")
	}
	return nil
}

func validText(value string, min, max int) bool {
	length := utf8.RuneCountInString(value)
	return utf8.ValidString(value) && length >= min && length <= max
}

func optionalValue(value string) string {
	if value == "" {
		return "N/A"
	}
	return value
}

func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func writeQueued(w http.ResponseWriter, id int64) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	_ = json.NewEncoder(w).Encode(map[string]any{"status": "queued", "id": id})
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}
