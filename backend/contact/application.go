package contact

import (
	"errors"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"net/mail"
	"net/url"
	"path"
	"path/filepath"
	"strings"
	"time"
)

const (
	maxApplicationRequestBytes = 32 << 20
	maxApplicationFileBytes    = 10 << 20
	maxApplicationFiles        = 3
	maxApplicationTotalFiles   = maxApplicationFileBytes * maxApplicationFiles
)

var allowedRoles = map[string]struct{}{
	"Frontend engineer": {},
	"Backend engineer":  {},
	"Platform engineer": {},
}

var allowedApplicationExtensions = map[string]string{
	".pdf":  "application/pdf",
	".doc":  "application/msword",
	".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".zip":  "application/zip",
}

type ApplicationSubmission struct {
	Name      string
	Email     string
	Role      string
	Portfolio string
	Message   string
	Website   string
}

func (h *Handler) application(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	mediaType, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || mediaType != "multipart/form-data" {
		writeError(w, http.StatusUnsupportedMediaType, "unsupported content type")
		return
	}
	if r.ContentLength > maxApplicationRequestBytes {
		writeError(w, http.StatusRequestEntityTooLarge, "request too large")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxApplicationRequestBytes)
	parseErr := r.ParseMultipartForm(1 << 20)
	if r.MultipartForm != nil {
		defer r.MultipartForm.RemoveAll()
	}
	if parseErr != nil {
		var maxBytesError *http.MaxBytesError
		if errors.As(parseErr, &maxBytesError) || errors.Is(parseErr, multipart.ErrMessageTooLarge) {
			writeError(w, http.StatusRequestEntityTooLarge, "request too large")
			return
		}
		writeError(w, http.StatusBadRequest, "invalid application")
		return
	}
	form := r.MultipartForm
	if !hasOnlyKeys(form.Value, "name", "email", "role", "portfolio", "message", "website") || !hasOnlyKeys(form.File, "attachments") || len(form.Value["attachments"]) != 0 {
		writeError(w, http.StatusBadRequest, "invalid application")
		return
	}
	submission := ApplicationSubmission{
		Name:      singleFormValue(form.Value, "name"),
		Email:     singleFormValue(form.Value, "email"),
		Role:      singleFormValue(form.Value, "role"),
		Portfolio: singleFormValue(form.Value, "portfolio"),
		Message:   singleFormValue(form.Value, "message"),
		Website:   singleFormValue(form.Value, "website"),
	}
	if err := validateApplication(&submission); err != nil {
		writeError(w, http.StatusBadRequest, "please check the application fields")
		return
	}
	fileHeaders := form.File["attachments"]
	if len(fileHeaders) > maxApplicationFiles {
		writeError(w, http.StatusBadRequest, "invalid application files")
		return
	}

	allowed, retryAfter := h.limiter.Allow(clientIP(r, h.trustedProxyIP))
	if !allowed {
		seconds := int(retryAfter.Seconds())
		if seconds < 1 {
			seconds = 1
		}
		w.Header().Set("Retry-After", fmt.Sprint(seconds))
		writeError(w, http.StatusTooManyRequests, "too many requests")
		return
	}
	if submission.Website != "" {
		writeQueued(w, 0)
		return
	}

	attachments, err := readApplicationAttachments(fileHeaders)
	if err != nil {
		if errors.Is(err, errApplicationTooLarge) {
			writeError(w, http.StatusRequestEntityTooLarge, "application files are too large")
			return
		}
		writeError(w, http.StatusBadRequest, "invalid application files")
		return
	}
	body := strings.Join([]string{
		"New job application",
		"",
		"Name: " + submission.Name,
		"Email: " + submission.Email,
		"Role: " + submission.Role,
		"Portfolio: " + submission.Portfolio,
		"",
		"Message:",
		submission.Message,
		"",
		"Submitted (UTC): " + time.Now().UTC().Format(time.RFC3339),
	}, "\n")
	message := MailMessage{
		ReplyTo:     submission.Email,
		Subject:     "New website job application",
		Body:        body,
		Attachments: attachments,
	}
	id, err := h.queue.Enqueue(r.Context(), "application", message)
	if err != nil {
		h.logger.Error("application could not be stored in outbox")
		writeError(w, http.StatusServiceUnavailable, "application could not be saved; please try again later")
		return
	}
	writeQueued(w, id)
}

func validateApplication(s *ApplicationSubmission) error {
	s.Name = strings.TrimSpace(s.Name)
	s.Email = strings.TrimSpace(s.Email)
	s.Role = strings.TrimSpace(s.Role)
	s.Portfolio = strings.TrimSpace(s.Portfolio)
	s.Message = strings.TrimSpace(s.Message)
	s.Website = strings.TrimSpace(s.Website)
	if !validText(s.Name, 1, 120) || !validText(s.Email, 1, 254) || !validText(s.Role, 1, 80) || !validText(s.Portfolio, 1, 2048) || !validText(s.Message, 1, 8000) || !validText(s.Website, 0, 500) {
		return errors.New("invalid field length or contents")
	}
	if strings.ContainsAny(s.Name+s.Email+s.Role+s.Portfolio, "\r\n") {
		return errors.New("line breaks are not allowed in application fields")
	}
	parsed, err := mail.ParseAddress(s.Email)
	if err != nil || parsed.Address != s.Email || strings.ContainsAny(s.Email, " \t") {
		return errors.New("invalid email address")
	}
	if _, ok := allowedRoles[s.Role]; !ok {
		return errors.New("unknown role")
	}
	portfolio, err := url.ParseRequestURI(s.Portfolio)
	if err != nil || portfolio.Host == "" || (portfolio.Scheme != "https" && portfolio.Scheme != "http") || portfolio.User != nil {
		return errors.New("invalid portfolio URL")
	}
	return nil
}

func singleFormValue(values map[string][]string, key string) string {
	if len(values[key]) != 1 {
		return ""
	}
	return values[key][0]
}

func hasOnlyKeys[T any](values map[string][]T, allowed ...string) bool {
	accepted := make(map[string]struct{}, len(allowed))
	for _, key := range allowed {
		accepted[key] = struct{}{}
	}
	for key := range values {
		if _, ok := accepted[key]; !ok {
			return false
		}
	}
	return true
}

var errApplicationTooLarge = errors.New("application file too large")

func readApplicationAttachments(files []*multipart.FileHeader) ([]Attachment, error) {
	attachments := make([]Attachment, 0, len(files))
	totalBytes := int64(0)
	for _, header := range files {
		extension := strings.ToLower(filepath.Ext(header.Filename))
		contentType, ok := allowedApplicationExtensions[extension]
		if !ok || len(header.Filename) == 0 || len(header.Filename) > 200 {
			return nil, errors.New("unsupported file")
		}
		filename := path.Base(strings.ReplaceAll(header.Filename, "\\", "/"))
		if filename == "." || strings.ContainsAny(filename, "\r\n") {
			return nil, errors.New("invalid file name")
		}
		if header.Size > maxApplicationFileBytes || totalBytes+header.Size > maxApplicationTotalFiles {
			return nil, errApplicationTooLarge
		}
		file, err := header.Open()
		if err != nil {
			return nil, errors.New("could not read file")
		}
		data, readErr := io.ReadAll(io.LimitReader(file, maxApplicationFileBytes+1))
		closeErr := file.Close()
		if readErr != nil || closeErr != nil {
			return nil, errors.New("could not read file")
		}
		if int64(len(data)) > maxApplicationFileBytes || int64(len(data)) != header.Size {
			return nil, errApplicationTooLarge
		}
		totalBytes += int64(len(data))
		attachments = append(attachments, Attachment{Filename: filename, ContentType: contentType, Data: data})
	}
	return attachments, nil
}
