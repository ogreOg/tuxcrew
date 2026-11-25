package contact

import (
	"bufio"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"net"
	"strconv"
	"strings"
	"testing"
	"time"
)

type smtpTestServer struct {
	listener  net.Listener
	cert      tls.Certificate
	message   chan string
	recipient string
	failed    bool
}

func newSMTPTestServer(t *testing.T, implicitTLS, failData bool) *smtpTestServer {
	t.Helper()
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal(err)
	}
	certificate := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject:      pkix.Name{CommonName: "localhost"},
		DNSNames:     []string{"localhost"},
		NotBefore:    time.Now().Add(-time.Minute),
		NotAfter:     time.Now().Add(time.Hour),
		KeyUsage:     x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
	}
	der, err := x509.CreateCertificate(rand.Reader, certificate, certificate, &key.PublicKey, key)
	if err != nil {
		t.Fatal(err)
	}
	keyDER, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		t.Fatal(err)
	}
	serverCert, err := tls.X509KeyPair(pemCertificate(der), pemPrivateKey(keyDER))
	if err != nil {
		t.Fatal(err)
	}
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	server := &smtpTestServer{listener: listener, cert: serverCert, message: make(chan string, 1), recipient: fixedRecipient, failed: failData}
	if implicitTLS {
		server.listener = tls.NewListener(listener, &tls.Config{Certificates: []tls.Certificate{serverCert}, MinVersion: tls.VersionTLS12})
	}
	t.Cleanup(func() { _ = server.listener.Close() })
	go server.serve(t, implicitTLS)
	return server
}

func (s *smtpTestServer) serve(t *testing.T, implicitTLS bool) {
	t.Helper()
	conn, err := s.listener.Accept()
	if err != nil {
		return
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(5 * time.Second))
	if implicitTLS {
		if tlsConn, ok := conn.(*tls.Conn); ok {
			if err := tlsConn.Handshake(); err != nil {
				return
			}
		}
	}
	reader := bufio.NewReader(conn)
	write := func(response string) { _, _ = fmt.Fprint(conn, response+"\r\n") }
	write("220 localhost ESMTP")
	if !smtpCommand(reader, "EHLO ") {
		return
	}
	write("250-localhost")
	write("250-STARTTLS")
	write("250 AUTH PLAIN")
	if !implicitTLS {
		line, _ := reader.ReadString('\n')
		if !strings.HasPrefix(strings.ToUpper(line), "STARTTLS") {
			return
		}
		write("220 ready for TLS")
		tlsConn := tls.Server(conn, &tls.Config{Certificates: []tls.Certificate{s.cert}, MinVersion: tls.VersionTLS12})
		if err := tlsConn.Handshake(); err != nil {
			return
		}
		conn = tlsConn
		_ = conn.SetDeadline(time.Now().Add(5 * time.Second))
		reader = bufio.NewReader(conn)
		write = func(response string) { _, _ = fmt.Fprint(conn, response+"\r\n") }
		if !smtpCommand(reader, "EHLO ") {
			return
		}
		write("250 AUTH PLAIN")
	}
	if !smtpCommand(reader, "AUTH PLAIN ") {
		return
	}
	write("235 authenticated")
	if !smtpCommand(reader, "MAIL FROM:") {
		return
	}
	write("250 sender accepted")
	if !smtpCommand(reader, "RCPT TO:<"+s.recipient+">") {
		return
	}
	write("250 recipient accepted")
	if !smtpCommand(reader, "DATA") {
		return
	}
	write("354 enter message")
	var message strings.Builder
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return
		}
		if line == ".\r\n" {
			break
		}
		message.WriteString(line)
	}
	s.message <- message.String()
	if s.failed {
		write("550 rejected")
	} else {
		write("250 queued")
	}
	if !s.failed {
		_, _ = reader.ReadString('\n')
		write("221 goodbye")
	}
}

func smtpCommand(reader *bufio.Reader, prefix string) bool {
	line, err := reader.ReadString('\n')
	return err == nil && strings.HasPrefix(strings.ToUpper(line), strings.ToUpper(prefix))
}

func pemCertificate(der []byte) []byte {
	return pemEncode("CERTIFICATE", der)
}

func pemPrivateKey(der []byte) []byte {
	return pemEncode("PRIVATE KEY", der)
}

func pemEncode(kind string, der []byte) []byte {
	return pem.EncodeToMemory(&pem.Block{Type: kind, Bytes: der})
}

func TestSMTPMailerTLSDelivery(t *testing.T) {
	for _, test := range []struct {
		name       string
		port       int
		implicitTL bool
	}{
		{"implicit TLS", 465, true},
		{"STARTTLS", 587, false},
	} {
		t.Run(test.name, func(t *testing.T) {
			server := newSMTPTestServer(t, test.implicitTL, false)
			cert := server.cert.Leaf
			if cert == nil {
				cert, _ = x509.ParseCertificate(server.cert.Certificate[0])
			}
			roots := x509.NewCertPool()
			roots.AddCert(cert)
			cfg := Config{SMTPHost: "localhost", SMTPPort: test.port, SMTPUsername: "query@example.com", SMTPPassword: "test-password", SMTPFrom: "query@example.com", Recipient: fixedRecipient}
			mailer := NewSMTPMailer(cfg)
			mailer.tlsRoots = roots
			mailer.implicitTLSOverride = &test.implicitTL
			mailer.config.SMTPHost = "localhost"
			if _, port, err := net.SplitHostPort(server.listener.Addr().String()); err == nil {
				mailer.config.SMTPPort, _ = strconv.Atoi(port)
			}
			if err := mailer.Send(MailMessage{ReplyTo: "visitor@example.com", Subject: "New website contact enquiry", Body: "Name: Visitor\nMessage:\nHello\nThere"}); err != nil {
				t.Fatal(err)
			}
			select {
			case message := <-server.message:
				for _, expected := range []string{"To: query@example.com", "Reply-To: <visitor@example.com>", "Name: Visitor", "Message:\r\nHello\r\nThere"} {
					if !strings.Contains(message, expected) {
						t.Errorf("email missing %q in %q", expected, message)
					}
				}
			case <-time.After(5 * time.Second):
				t.Fatal("SMTP server did not receive email")
			}
		})
	}
}

func TestSMTPMailerRejectsDelivery(t *testing.T) {
	server := newSMTPTestServer(t, true, true)
	cert := server.cert.Leaf
	if cert == nil {
		cert, _ = x509.ParseCertificate(server.cert.Certificate[0])
	}
	roots := x509.NewCertPool()
	roots.AddCert(cert)
	cfg := Config{SMTPHost: "localhost", SMTPPort: 465, SMTPUsername: "query@example.com", SMTPPassword: "test-password", SMTPFrom: "query@example.com", Recipient: fixedRecipient}
	mailer := NewSMTPMailer(cfg)
	mailer.tlsRoots = roots
	implicitTLS := true
	mailer.implicitTLSOverride = &implicitTLS
	_, port, _ := net.SplitHostPort(server.listener.Addr().String())
	mailer.config.SMTPPort, _ = strconv.Atoi(port)
	if err := mailer.Send(MailMessage{ReplyTo: "visitor@example.com", Subject: "New website contact enquiry", Body: "Name: Visitor\nMessage: Hello"}); err == nil {
		t.Fatal("expected SMTP rejection")
	}
}

func TestSMTPMailerSendsMIMEAttachments(t *testing.T) {
	server := newSMTPTestServer(t, true, false)
	cert := server.cert.Leaf
	if cert == nil {
		cert, _ = x509.ParseCertificate(server.cert.Certificate[0])
	}
	roots := x509.NewCertPool()
	roots.AddCert(cert)
	cfg := Config{SMTPHost: "localhost", SMTPPort: 465, SMTPUsername: "query@example.com", SMTPPassword: "test-password", SMTPFrom: "query@example.com", Recipient: fixedRecipient}
	mailer := NewSMTPMailer(cfg)
	mailer.tlsRoots = roots
	implicitTLS := true
	mailer.implicitTLSOverride = &implicitTLS
	_, port, _ := net.SplitHostPort(server.listener.Addr().String())
	mailer.config.SMTPPort, _ = strconv.Atoi(port)
	err := mailer.Send(MailMessage{
		ReplyTo: "applicant@example.com",
		Subject: "New website job application",
		Body:    "Role: Frontend engineer",
		Attachments: []Attachment{{
			Filename:    "resume.pdf",
			ContentType: "application/pdf",
			Data:        []byte("pdf bytes"),
		}},
	})
	if err != nil {
		t.Fatal(err)
	}
	select {
	case message := <-server.message:
		for _, expected := range []string{"Content-Type: multipart/mixed;", "Reply-To: <applicant@example.com>", "filename=resume.pdf", "Content-Transfer-Encoding: base64", "cGRmIGJ5dGVz"} {
			if !strings.Contains(message, expected) {
				t.Errorf("email missing %q in %q", expected, message)
			}
		}
	case <-time.After(5 * time.Second):
		t.Fatal("SMTP server did not receive email")
	}
}

func TestSMTPMailerUsesConfiguredRecipient(t *testing.T) {
	server := newSMTPTestServer(t, true, false)
	server.recipient = "query@tonrax.com"
	cert := server.cert.Leaf
	if cert == nil {
		cert, _ = x509.ParseCertificate(server.cert.Certificate[0])
	}
	roots := x509.NewCertPool()
	roots.AddCert(cert)
	cfg := Config{SMTPHost: "localhost", SMTPPort: 465, SMTPUsername: "query@example.com", SMTPPassword: "test-password", SMTPFrom: "query@example.com", Recipient: server.recipient}
	mailer := NewSMTPMailer(cfg)
	mailer.tlsRoots = roots
	implicitTLS := true
	mailer.implicitTLSOverride = &implicitTLS
	_, port, _ := net.SplitHostPort(server.listener.Addr().String())
	mailer.config.SMTPPort, _ = strconv.Atoi(port)
	if err := mailer.Send(MailMessage{ReplyTo: "visitor@example.com", Subject: "Recipient config test", Body: "hello"}); err != nil {
		t.Fatal(err)
	}
	select {
	case message := <-server.message:
		if !strings.Contains(message, "To: query@tonrax.com") {
			t.Fatalf("email used wrong To header: %q", message)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("SMTP server did not receive email")
	}
}
