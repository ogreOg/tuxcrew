package contact

import (
	"bytes"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"mime/quotedprintable"
	"net"
	"net/mail"
	"net/smtp"
	"net/textproto"
	"path"
	"strconv"
	"strings"
	"time"
)

type SMTPMailer struct {
	config              Config
	timeout             time.Duration
	tlsRoots            *x509.CertPool
	implicitTLSOverride *bool
}

func NewSMTPMailer(config Config) *SMTPMailer {
	return &SMTPMailer{config: config, timeout: 10 * time.Second}
}

func (m *SMTPMailer) Send(message MailMessage) error {
	address := net.JoinHostPort(m.config.SMTPHost, fmt.Sprint(m.config.SMTPPort))
	dialer := &net.Dialer{Timeout: m.timeout}
	tlsConfig := &tls.Config{ServerName: m.config.SMTPHost, MinVersion: tls.VersionTLS12, RootCAs: m.tlsRoots}

	var conn net.Conn
	var err error
	implicitTLS := m.config.SMTPPort == 465
	if m.implicitTLSOverride != nil {
		implicitTLS = *m.implicitTLSOverride
	}
	if implicitTLS {
		conn, err = tls.DialWithDialer(dialer, "tcp", address, tlsConfig)
	} else {
		conn, err = dialer.Dial("tcp", address)
	}
	if err != nil {
		return fmt.Errorf("connect SMTP server: %w", err)
	}
	defer conn.Close()
	if err := conn.SetDeadline(time.Now().Add(m.timeout)); err != nil {
		return fmt.Errorf("set SMTP deadline: %w", err)
	}

	client, err := smtp.NewClient(conn, m.config.SMTPHost)
	if err != nil {
		return fmt.Errorf("create SMTP client: %w", err)
	}
	defer client.Close()
	if !implicitTLS {
		if ok, _ := client.Extension("STARTTLS"); !ok {
			return fmt.Errorf("SMTP server does not offer STARTTLS")
		}
		if err := client.StartTLS(tlsConfig); err != nil {
			return fmt.Errorf("start SMTP TLS: %w", err)
		}
	}
	if err := client.Auth(smtp.PlainAuth("", m.config.SMTPUsername, m.config.SMTPPassword, m.config.SMTPHost)); err != nil {
		return fmt.Errorf("authenticate with SMTP server: %w", err)
	}

	from, err := mail.ParseAddress(m.config.SMTPFrom)
	if err != nil {
		return fmt.Errorf("parse configured sender: %w", err)
	}
	if err := client.Mail(from.Address); err != nil {
		return fmt.Errorf("set SMTP sender: %w", err)
	}
	if err := client.Rcpt(m.config.Recipient); err != nil {
		return fmt.Errorf("set SMTP recipient: %w", err)
	}
	writer, err := client.Data()
	if err != nil {
		return fmt.Errorf("start SMTP message: %w", err)
	}
	if strings.ContainsAny(message.Subject, "\r\n") || strings.ContainsAny(message.ReplyTo, "\r\n") {
		_ = writer.Close()
		return fmt.Errorf("invalid email header value")
	}
	replyTo, err := mail.ParseAddress(message.ReplyTo)
	if err != nil || replyTo.Address != message.ReplyTo {
		_ = writer.Close()
		return fmt.Errorf("invalid reply-to address")
	}
	var content bytes.Buffer
	contentType := "text/plain; charset=UTF-8"
	if len(message.Attachments) == 0 {
		content.WriteString(normalizeLines(message.Body))
	} else {
		multipartWriter := multipart.NewWriter(&content)
		contentType = "multipart/mixed; boundary=" + strconv.Quote(multipartWriter.Boundary())
		textHeader := textproto.MIMEHeader{}
		textHeader.Set("Content-Type", "text/plain; charset=UTF-8")
		textHeader.Set("Content-Transfer-Encoding", "quoted-printable")
		textPart, err := multipartWriter.CreatePart(textHeader)
		if err != nil {
			_ = writer.Close()
			return fmt.Errorf("create email body part: %w", err)
		}
		quotedWriter := quotedprintable.NewWriter(textPart)
		if _, err := quotedWriter.Write([]byte(normalizeLines(message.Body))); err != nil {
			_ = quotedWriter.Close()
			_ = writer.Close()
			return fmt.Errorf("write email body part: %w", err)
		}
		if err := quotedWriter.Close(); err != nil {
			_ = writer.Close()
			return fmt.Errorf("finish email body part: %w", err)
		}
		for _, attachment := range message.Attachments {
			filename := path.Base(strings.ReplaceAll(attachment.Filename, "\\", "/"))
			if filename == "." || strings.ContainsAny(filename, "\r\n") || strings.ContainsAny(attachment.ContentType, "\r\n") {
				_ = writer.Close()
				return fmt.Errorf("invalid email attachment metadata")
			}
			contentDisposition := mime.FormatMediaType("attachment", map[string]string{"filename": filename})
			attachmentHeader := textproto.MIMEHeader{}
			attachmentHeader.Set("Content-Type", mime.FormatMediaType(attachment.ContentType, map[string]string{"name": filename}))
			attachmentHeader.Set("Content-Disposition", contentDisposition)
			attachmentHeader.Set("Content-Transfer-Encoding", "base64")
			attachmentPart, err := multipartWriter.CreatePart(attachmentHeader)
			if err != nil {
				_ = writer.Close()
				return fmt.Errorf("create attachment part: %w", err)
			}
			encoded := base64.StdEncoding.EncodeToString(attachment.Data)
			for len(encoded) > 76 {
				if _, err := io.WriteString(attachmentPart, encoded[:76]+"\r\n"); err != nil {
					_ = writer.Close()
					return fmt.Errorf("write attachment: %w", err)
				}
				encoded = encoded[76:]
			}
			if _, err := io.WriteString(attachmentPart, encoded+"\r\n"); err != nil {
				_ = writer.Close()
				return fmt.Errorf("write attachment: %w", err)
			}
		}
		if err := multipartWriter.Close(); err != nil {
			_ = writer.Close()
			return fmt.Errorf("finish multipart message: %w", err)
		}
	}
	headerLines := []string{
		"From: " + from.String(),
		"To: " + m.config.Recipient,
		"Reply-To: " + replyTo.String(),
		"Subject: " + message.Subject,
		"Date: " + time.Now().UTC().Format(time.RFC1123Z),
		"MIME-Version: 1.0",
		"Content-Type: " + contentType,
	}
	if len(message.Attachments) == 0 {
		headerLines = append(headerLines, "Content-Transfer-Encoding: 8bit")
	}
	fullMessage := strings.Join(headerLines, "\r\n") + "\r\n\r\n" + content.String()
	if _, err := io.WriteString(writer, fullMessage); err != nil {
		_ = writer.Close()
		return fmt.Errorf("write SMTP message: %w", err)
	}
	if err := writer.Close(); err != nil {
		return fmt.Errorf("finish SMTP message: %w", err)
	}
	if err := client.Quit(); err != nil {
		return fmt.Errorf("finish SMTP session: %w", err)
	}
	return nil
}

func normalizeLines(value string) string {
	value = strings.ReplaceAll(value, "\r\n", "\n")
	value = strings.ReplaceAll(value, "\r", "\n")
	return strings.ReplaceAll(value, "\n", "\r\n")
}
