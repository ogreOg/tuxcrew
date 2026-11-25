package contact

import (
	"net"
	"net/http"
)

func clientIP(r *http.Request, trustedProxyIP string) string {
	remoteHost, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "unknown"
	}
	remoteIP := net.ParseIP(remoteHost)
	if remoteIP == nil {
		return "unknown"
	}
	trustedProxy := net.ParseIP(trustedProxyIP)
	if !remoteIP.IsLoopback() && (trustedProxy == nil || !remoteIP.Equal(trustedProxy)) {
		return remoteIP.String()
	}

	forwarded := net.ParseIP(r.Header.Get("X-Real-IP"))
	if forwarded == nil {
		return remoteIP.String()
	}
	return forwarded.String()
}
