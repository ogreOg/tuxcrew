package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strconv"
	"time"

	"tonrax/contact-api/backend/contact"
)

func main() {
	databasePath := flag.String("db", envOrDefault("OUTBOX_DB_PATH", "./data/tonrax-outbox.db"), "path to the private SQLite outbox database")
	flag.Parse()
	if flag.NArg() == 0 {
		usage()
	}
	outbox, err := contact.OpenOutbox(*databasePath)
	if err != nil {
		fatal(err)
	}
	defer outbox.Close()
	ctx := context.Background()

	switch flag.Arg(0) {
	case "list":
		status := ""
		limit := 100
		for _, argument := range flag.Args()[1:] {
			if len(argument) > 7 && argument[:7] == "status=" {
				status = argument[7:]
			}
			if len(argument) > 6 && argument[:6] == "limit=" {
				parsed, err := strconv.Atoi(argument[6:])
				if err != nil {
					fatal(fmt.Errorf("invalid limit"))
				}
				limit = parsed
			}
		}
		messages, err := outbox.List(ctx, status, limit)
		if err != nil {
			fatal(err)
		}
		for _, message := range messages {
			fmt.Printf("id=%d kind=%s status=%s attempts=%d created=%s next_try=%s last_error=%q\n", message.ID, message.Kind, message.Status, message.Attempts, message.CreatedAt.Format(time.RFC3339), message.NextTryAt.Format(time.RFC3339), message.LastError)
		}
	case "show":
		id := requiredID(flag.Args())
		message, err := outbox.Get(ctx, id)
		if err != nil {
			fatal(err)
		}
		printJSON(message)
	case "requeue":
		id := requiredID(flag.Args())
		if err := outbox.Requeue(ctx, id); err != nil {
			fatal(err)
		}
		fmt.Printf("requeued id=%d\n", id)
	case "delete":
		id := requiredID(flag.Args())
		if err := outbox.Delete(ctx, id); err != nil {
			fatal(err)
		}
		fmt.Printf("deleted id=%d\n", id)
	case "prune-sent":
		if flag.NArg() != 2 {
			usage()
		}
		days, err := strconv.Atoi(flag.Arg(1))
		if err != nil || days < 30 {
			fatal(fmt.Errorf("retention must be at least 30 days"))
		}
		count, err := outbox.PruneSent(ctx, time.Duration(days)*24*time.Hour)
		if err != nil {
			fatal(err)
		}
		fmt.Printf("pruned_sent=%d\n", count)
	case "backup":
		if flag.NArg() != 2 {
			usage()
		}
		if err := outbox.Backup(ctx, flag.Arg(1)); err != nil {
			fatal(err)
		}
		fmt.Println("backup created with mode 0600")
	default:
		usage()
	}
}

func requiredID(arguments []string) int64 {
	if len(arguments) != 2 {
		usage()
	}
	id, err := strconv.ParseInt(arguments[1], 10, 64)
	if err != nil || id < 1 {
		fatal(fmt.Errorf("invalid outbox ID"))
	}
	return id
}

func printJSON(value any) {
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(value); err != nil {
		fatal(err)
	}
}

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func usage() {
	fmt.Fprintln(os.Stderr, "Usage: outbox-admin [-db PATH] list [status=pending|sending|sent|failed] [limit=N] | show ID | requeue ID | delete ID | prune-sent DAYS | backup PATH")
	os.Exit(2)
}

func fatal(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
