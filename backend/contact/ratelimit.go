package contact

import (
	"math"
	"sync"
	"time"
)

type rateEntry struct {
	started time.Time
	count   int
}

type RateLimiter struct {
	mu         sync.Mutex
	entries    map[string]rateEntry
	max        int
	window     time.Duration
	maxEntries int
	now        func() time.Time
}

func NewRateLimiter(max int, window time.Duration, maxEntries int) *RateLimiter {
	return &RateLimiter{entries: make(map[string]rateEntry), max: max, window: window, maxEntries: maxEntries, now: time.Now}
}

func (l *RateLimiter) Allow(key string) (bool, time.Duration) {
	now := l.now()
	l.mu.Lock()
	defer l.mu.Unlock()

	for address, entry := range l.entries {
		if !now.Before(entry.started.Add(l.window)) {
			delete(l.entries, address)
		}
	}

	entry, exists := l.entries[key]
	if !exists {
		if len(l.entries) >= l.maxEntries {
			return false, l.window
		}
		l.entries[key] = rateEntry{started: now, count: 1}
		return true, 0
	}
	if entry.count >= l.max {
		remaining := entry.started.Add(l.window).Sub(now)
		if remaining < time.Second {
			remaining = time.Second
		}
		return false, time.Duration(math.Ceil(remaining.Seconds())) * time.Second
	}
	entry.count++
	l.entries[key] = entry
	return true, 0
}

func (l *RateLimiter) Len() int {
	l.mu.Lock()
	defer l.mu.Unlock()
	return len(l.entries)
}
