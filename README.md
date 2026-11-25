# Tonrax Contact Form API

This repository contains the existing static React/Vite website and a Go API with a durable SQLite email outbox. The Contact form sends JSON (`name`, `email`, optional `phone`, `subject`, and `message`) to same-origin `POST /api/contact`. The Applicant form sends multipart data (`name`, `email`, `role`, `portfolio`, `message`, optional honeypot, and up to three `attachments`) to same-origin `POST /api/application`. Each attachment is limited to 10 MiB and must use PDF, DOC, DOCX, or ZIP format. Both flows go to the server-configured recipient in `CONTACT_RECIPIENT`; browsers cannot choose the recipient or headers. Valid submissions are committed to SQLite before the API returns `202 Accepted`; a background worker sends queued mail and retries temporary SMTP failures. In local runs the API listens on `127.0.0.1:8080`; in Docker it listens only inside its container on the shared `proxy` network, with no host port published.

Both forms confirm that a submission was durably queued, not that SMTP delivered it. HTTP 400/413/415 show a validation message, 429 shows a rate-limit message, and database/network errors show a generic failure message. Failed submissions retain their fields and files. The hidden `website` honeypot is not included in email.

## SMTP and Outbox

Purelymail's official [Technical Setup documentation](https://purelymail.com/docs/setup/technical) lists `smtp.purelymail.com:465` with SSL/TLS, or port `587` with STARTTLS. The backend supports those modes and verifies the server certificate using Go's system trust store. Use the full mailbox address for `SMTP_USERNAME`; Purelymail documents that accounts with two-factor authentication must use an app password. SMTP authentication and the sender address must be authorized for the mailbox/domain you configure.

SMTP is optional at startup. With all SMTP settings omitted, the API still commits submissions to SQLite and reports them as queued, but no email worker runs. Configure the complete SMTP setting set and recreate the API container to begin draining queued records. Partial SMTP configuration is rejected. SMTP failures are retried with capped exponential backoff; after 10 attempts a row becomes `failed` and is retained for review. SMTP delivery is at-least-once, so a connection failure after provider acceptance may cause a duplicate. Successfully delivered records are pruned after 90 days by default; failed records remain until reviewed or deleted. Queue payload storage is capped at 512 MiB by default.

The repository's `.env.example` contains placeholders only. Never commit a real `.env` file or put SMTP values in Vite environment variables. Production SMTP secrets belong in `/etc/tonrax-contact-api.env`, outside the website root. The SQLite database lives in a dedicated persistent Docker volume, not in the frontend image or public web root.

## Local Development

Requirements: Go 1.23 or newer and Node.js/npm compatible with the existing Vite project.

```sh
go test ./...
go test -race ./...
go build -o build/contact-api ./cmd/contact-api
npm ci
npm run build
```

### Browser Test Without SMTP

To exercise both forms before configuring an SMTP account, run the real API handlers with an in-memory queue sink. This validates request parsing, fields, file checks, rate limits, and frontend success/error handling without connecting to SMTP or sending email. The sink stores no message contents and logs only acceptance plus attachment count. Its listener is restricted to `127.0.0.1:18080`.

In terminal one:

```sh
go run ./cmd/local-test-api
```

In terminal two:

```sh
CONTACT_API_TARGET=http://127.0.0.1:18080 npm run dev -- --port 5174
```

Open `http://127.0.0.1:5174/contact#contact-form` and `http://127.0.0.1:5174/apply`. Use synthetic form data and a dummy allowed file. A success message in this mode means the local mock accepted the request; it does not mean an email was sent. Stop both processes with Ctrl+C. The normal `cmd/contact-api` service still requires real SMTP configuration and must not be used for this test.

The production handler can also be run locally in queue-only mode without SMTP. Set a private database path, start the API and frontend as separate processes, then inspect queued records with the admin CLI:

```sh
OUTBOX_DB_PATH=./data/dev-outbox.db go run ./cmd/contact-api
```

In another terminal, run Vite (it proxies `/api` to port 8080) and use the forms with synthetic data. `202 Accepted` means SQLite stored the record; no email is sent until all SMTP settings are configured. Review the payload locally with:

```sh
OUTBOX_DB_PATH=./data/dev-outbox.db go run ./cmd/outbox-admin list
OUTBOX_DB_PATH=./data/dev-outbox.db go run ./cmd/outbox-admin show 1
```

`show` prints personal data and attachments; use it only with synthetic data or in a trusted local terminal. To enable actual delivery locally, create a mode-0600 env file from `.env.example` in an editor and load it without printing its contents. The API health check is `http://127.0.0.1:8080/healthz`.

## Deploy With Your Caddy Compose Setup

Your separate, long-running Caddy Compose project joins the external Docker network named `proxy`. The app Compose file builds and runs both the static frontend container (`tonrax-frontend`) and Go API (`tonrax-contact-api`) on that same network. It does not define, update, or restart Caddy. Neither app container publishes a port on the VPS. Caddy proxies `/api/*` and `/healthz` to `tonrax-contact-api:8080`, and all other requests to `tonrax-frontend:8080`.

The current workspace cannot access your VPS or its Docker daemon, so these steps are instructions only. They do not change the live Caddy configuration or send a real email.

### 1. Identify Caddy's current network IP

Docker Compose service names provide stable DNS names (`tonrax-frontend` and `tonrax-contact-api`), so neither app container needs a fixed IP. The Go rate limiter trusts `X-Real-IP` only when the request's TCP peer is the actual Caddy container IP. Inspect that address on the VPS:

```sh
cd ~/caddy
docker network inspect proxy --format '{{range .IPAM.Config}}Subnet={{.Subnet}} Gateway={{.Gateway}} IPRange={{.IPRange}}{{end}}'
docker inspect caddy --format '{{(index .NetworkSettings.Networks "proxy").IPAddress}}'
```

Use the IP returned by the second command as `CONTACT_TRUSTED_PROXY_IP` in the protected API environment file. Do not guess the address. It will normally remain while the Caddy container exists, but if Caddy is recreated and its address changes, update this setting and recreate the API container. No Caddy IP pinning or Caddy Compose changes are required.

### 2. Create protected Purelymail settings

Create the environment file outside the static web root. The host-owned file is read by the API Compose project and injected only into the backend container:

```sh
sudo install -o root -g root -m 0600 /dev/null /etc/tonrax-contact-api.env
sudoedit /etc/tonrax-contact-api.env
sudo stat -c '%U %G %a %n' /etc/tonrax-contact-api.env
```

Initially, you can configure only the non-secret settings below. Leave `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_FROM` absent. The API will still start, validate submissions, and commit them to SQLite; mail remains pending and no SMTP connection is attempted:

```text
CONTACT_RECIPIENT=query@tonrax.com
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW=15m
CONTACT_TRUSTED_PROXY_IP=the-caddy-ip-from-step-1
OUTBOX_DB_PATH=/var/lib/tonrax/outbox.db
OUTBOX_RETENTION_DAYS=90
OUTBOX_MAX_BYTES=536870912
```

`CONTACT_RECIPIENT` is validated and read only by the backend; browser requests cannot override it. The example uses your VPS recipient, `query@tonrax.com`. `OUTBOX_DB_PATH` is set by Compose and must match its mounted volume path. The environment file is not mounted into Caddy or kept under the website directory. Docker administrators can inspect container configuration, so restrict VPS Docker access to trusted administrators. Delivered records are retained for 90 days by default; failed records remain until reviewed or deleted. `OUTBOX_MAX_BYTES` bounds all retained payloads, including delivered records still within retention, to 512 MiB by default; at capacity, new submissions are rejected and remain in the visitor's form.

After SMTP is purchased/configured, add the complete settings using `sudoedit` (never use a command that prints the file or place the password in shell history):

```text
SMTP_HOST=smtp.purelymail.com
SMTP_PORT=465
SMTP_USERNAME=your-full-mailbox-address
SMTP_PASSWORD=your-private-password-or-app-password
SMTP_FROM=your-authorized-sender-address
```

Purelymail requires a full mailbox username and an app password when 2FA is enabled. The sender must be authorized for the mailbox/domain. Partial SMTP configuration is rejected rather than starting in a misleading state. After saving the protected env file, recreate only the API service to start the delivery worker and drain pending submissions:

```sh
cd ~/tonrax
sudo docker compose -f deploy/compose.contact-api.yml up -d --force-recreate tonrax-contact-api
sudo docker logs --since 10m tonrax-contact-api
```

### 3. Build the frontend and API image

On the VPS, ensure the repository is checked out at `~/tonrax`. Run backend tests; the frontend Docker build runs `npm ci` and `npm run build` in its build stage:

```sh
cd ~/tonrax
go test ./...
go test -race ./...
```

The frontend Dockerfile builds the Vite app into a static Nginx image; the API Dockerfile builds Go and the admin CLI into a non-root distroless image. No SMTP credentials are included in either image. The API volume `tonrax_outbox` persists the SQLite database across container recreation. Start the frontend and API together from the repository root:

```sh
sudo docker compose -f deploy/compose.contact-api.yml config --quiet
sudo docker compose -f deploy/compose.contact-api.yml up -d --build
sudo docker compose -f deploy/compose.contact-api.yml ps
sudo docker logs --since 30m tonrax-contact-api
```

This separate Compose project declares `proxy` as an external network and adds only the frontend and API containers to it. Do not add a Caddy service or run this Compose project against `~/caddy/compose.yml`.

### 4. Review the outbox over SSH

There is deliberately no public admin API or web dashboard. Run the bundled admin tool in the API container from an authenticated SSH session:

```sh
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin list
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin list status=pending
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin list status=failed
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin show 123
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin requeue 123
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin delete 123
```

`list` shows record ID, type, status, timestamps, attempt count, and a generic error. `show` prints personal data and attachments as base64 JSON; use only over trusted SSH and do not paste it into tickets or chats. `requeue` is restricted to failed records. Retrying can create a duplicate if SMTP accepted a message just before its acknowledgement was lost. Deletion is permanent unless a backup exists.

The worker retries at 1, 2, 4, 8, 16, 32, 64, 128, then 256 minutes, up to 10 attempts. After the limit, a record enters `failed` and is retained for review. Delivery is at-least-once, not exactly-once. Sent records are removed after the configured retention; failed records remain until reviewed or deleted. The payload cap includes sent records during retention; if the bounded outbox fills, new submissions are not acknowledged as accepted.

The application does not encrypt SQLite data. The database directory is mode `0700`, the database file mode `0600`, and only the API container mounts the volume. Protect host disks and backups with host-level encryption and restrict SSH/Docker access to trusted administrators.

Create an online consistent backup in the mounted database directory, then copy and encrypt it off-host:

```sh
BACKUP_NAME="outbox-backup-$(date +%Y%m%d-%H%M%S).db"
sudo docker compose -f deploy/compose.contact-api.yml exec tonrax-contact-api /outbox-admin backup "/var/lib/tonrax/$BACKUP_NAME"
sudo docker cp "tonrax-contact-api:/var/lib/tonrax/$BACKUP_NAME" "/secure/backup/location/$BACKUP_NAME"
```

The backup may contain contact details and resumes. Secure it immediately and encrypt before external storage; set a defined backup expiry and securely remove expired copies. The command refuses to overwrite an existing backup file. To restore, stop only the API container, retain the current database as a rollback copy, replace the volume database with the chosen backup using a one-off helper container on the volume, then restart the API. Validate the restored database first with `/outbox-admin list`. Never replace the database while the API is running.

### 5. Update only the Tonrax Caddy site block

Back up the active host-mounted Caddyfile before editing it. Replace only the `tonrax.com` block with the following shape, preserving the `music.askhome.site` and `n8n.tonrax.com` blocks unchanged:

```sh
cd ~/caddy
cp -a conf/Caddyfile "conf/Caddyfile.bak.$(date +%Y%m%d%H%M%S)"
nano conf/Caddyfile
```

```caddyfile
tonrax.com {
    encode gzip zstd

    @tonrax_api path /api /api/* /healthz
    handle @tonrax_api {
        reverse_proxy tonrax-contact-api:8080 {
            header_up X-Real-IP {http.request.remote.host}
        }
    }

    handle {
        reverse_proxy tonrax-frontend:8080
    }
}
```

Your already-running Caddy container and both app containers use the existing `proxy` network, even though they are started from separate Compose projects. Caddy replaces `X-Real-IP` with the actual browser peer address. The Go service honors that header only when the TCP peer matches `CONTACT_TRUSTED_PROXY_IP`; it ignores forwarded headers from other sources. The frontend's Nginx server handles SPA history routes. Keep the mutually exclusive Caddy `handle` blocks so API requests cannot fall through to the frontend. The old `/home/ubuntu/tonrax/dist/public:/srv/tonrax` Caddy bind mount is no longer used by this routing; remove it from the Caddy Compose file during a planned Caddy Compose recreation if you want to clean up the unused mount.

### 6. Validate and reload the existing Caddy container

```sh
cd ~/caddy
sudo docker exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

This reloads Caddy gracefully without stopping or recreating its container. The app Compose file has neither `ports:` nor `expose:` entries. Both container ports are reachable to Caddy over the shared Docker network, but neither is published on the VPS host. Verify service status and that Docker reports no published app ports:

```sh
cd ~/tonrax
sudo docker compose -f deploy/compose.contact-api.yml ps
sudo docker port tonrax-contact-api
sudo docker port tonrax-frontend
sudo docker logs --since 30m tonrax-contact-api
```

Both `docker port` commands should print no mappings. The backend listens on `0.0.0.0:8080` only inside its container and Nginx listens on `8080` only inside its container so Caddy can reach both over the Docker bridge. No app listener is published on the VPS host. The API container uses a bounded `/tmp` tmpfs for Go multipart parsing while its root filesystem stays read-only. The runtime images intentionally contain no general-purpose shell; use the HTTPS health request below to test routing. Do not add host firewall rules for app ports.

### 7. Verify HTTPS and durable queue acceptance

After Caddy reloads, verify the existing domain and SPA route, then make one deliberate test submission. A valid POST returns `202 Accepted` after its data is committed to SQLite. SMTP delivery takes place asynchronously. Without SMTP settings, records remain pending in SQLite rather than being lost:

```sh
curl --fail https://tonrax.com/healthz
curl --fail https://tonrax.com/
curl -i -X POST https://tonrax.com/api/contact -H 'Content-Type: application/json' --data '{"name":"Deployment test","email":"your-test-address@example.net","phone":"","subject":"Contact API deployment test","message":"This test sends a real email."}'
```

An HTTP 202 response means the message is durably queued, not delivered. Check its current state using the SSH admin command below. After SMTP credentials are installed and the API container recreated, pending records are sent by the worker. Verify delivery through the recipient mailbox. Temporary SMTP failures schedule retries, while exhausted retries appear with status `failed` for admin review. Then verify `tonrax.com:8080` is unreachable externally. Do not expect `/healthz` to work on the host's port 8080; it is intentionally not published.

The in-memory limiter defaults to 5 submissions per visitor IP per 15 minutes, removes expired entries, and bounds its map to 10,000 clients. It resets when the container restarts and is local to one API container. If the table is full of active addresses, new addresses fail closed with 429 until entries expire; sustained distributed abuse may therefore block newly seen visitors temporarily. Apply upstream network-level protection if that threat becomes relevant.

### Updates and rollback

For code updates, build/test the frontend and API as above, then recreate both app images with the same Compose command. The named SQLite volume remains attached and preserves the queue across container recreations. Caddy remains in its separate project and does not need rebuilding. If an app image fails, deploy the previous Git revision or image tags and run `up -d` again. Before any Caddy edit, retain the timestamped `Caddyfile` backup; to roll back, restore that file, validate it, and reload:

```sh
cd ~/caddy
cp -a conf/Caddyfile.bak.YYYYMMDDHHMMSS conf/Caddyfile
sudo docker exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```