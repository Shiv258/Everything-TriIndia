# TRIINDIA Platform Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the safe project foundation for TRIINDIA Hospitality using Next.js website, QloApps PMS, Odoo CRM, and code-first integrations.

**Architecture:** The existing Next.js app remains the public website and integration surface. QloApps is deployed as the PMS and booking source of truth. Odoo is deployed as the CRM and reporting layer. The first milestone isolates the GitHub repo and prepares deployment files without wiring payments, WhatsApp, or AI yet.

**Tech Stack:** Next.js 16, TypeScript, Prisma, PostgreSQL, QloApps Docker image, Odoo Docker image, Nginx, Certbot, GitHub CLI, Ubuntu VPS.

---

## File Structure

- `.git/` - nested Git repository inside `TriIndia Website`, isolated from the parent `.opencode` repository.
- `.env.example` - local Next.js app variables only; no real secrets.
- `hospitality-platform/START_HERE.md` - beginner-facing operating guide aligned with QloApps PMS + Odoo CRM.
- `deploy/README.md` - production setup guide for the Contabo VPS.
- `deploy/docker/qloapps-compose.yml` - QloApps + MySQL deployment stack.
- `deploy/docker/odoo-compose.yml` - Odoo + PostgreSQL deployment stack.
- `deploy/env/qloapps.env.example` - QloApps environment template.
- `deploy/env/odoo.env.example` - Odoo environment template.
- `deploy/nginx/triindia.conf` - Next.js public website reverse proxy.
- `deploy/nginx/book.conf` - QloApps reverse proxy.
- `deploy/nginx/crm.conf` - Odoo reverse proxy.
- `deploy/scripts/server-bootstrap.sh` - first VPS hardening and dependency setup script.
- `deploy/scripts/verify-foundation.sh` - VPS smoke checks for Docker, Nginx, SSL, and containers.

## Task 1: Isolate The GitHub Repository

**Files:**
- Create: `.git/`
- Modify: none

- [ ] **Step 1: Verify GitHub auth**

Run:

```powershell
gh auth status
```

Expected output includes:

```txt
Logged in to github.com account shiv-automates
```

- [ ] **Step 2: Create a nested Git repo for this project**

Run from `C:\Users\hp\.opencode\TriIndia Website`:

```powershell
git init
git branch -M main
```

Expected output includes:

```txt
Initialized empty Git repository
```

If Git says the repository already exists, continue to Step 3.

- [ ] **Step 3: Confirm the remote is empty or absent**

Run:

```powershell
git remote -v
```

Expected for a fresh nested repo:

```txt
```

If a remote named `origin` points to `digidzn-os`, run:

```powershell
git remote remove origin
```

- [ ] **Step 4: Create the GitHub repo**

Run:

```powershell
gh repo create shiv-automates/triindia-hospitality-platform --private --description "TRIINDIA Hospitality platform: Next.js website, QloApps PMS, Odoo CRM, and integrations" --source . --remote origin
```

Expected output includes:

```txt
https://github.com/shiv-automates/triindia-hospitality-platform
```

- [ ] **Step 5: Stage only project files**

Run:

```powershell
git status --short
```

Expected: only files under `TriIndia Website` appear because this is now a nested repo.

- [ ] **Step 6: Check secrets are not staged**

Run:

```powershell
git status --short | findstr /R "\.env$ .env.local .env.production"
```

Expected: no output. If output appears, stop and remove those files from staging.

- [ ] **Step 7: Push only after user approval**

Do not run `git push` until the user explicitly approves pushing the initial repository contents.

## Task 2: Align The Beginner Guide With QloApps + Odoo

**Files:**
- Modify: `hospitality-platform/START_HERE.md`

- [ ] **Step 1: Replace the Current Direction section**

Replace lines under `## Current Direction` with:

```md
## Current Direction

We are building TRIINDIA as a split hospitality platform.

- Next.js is the public premium website and custom integration layer.
- QloApps is the hotel PMS, booking engine, room inventory, rates, and availability source of truth.
- Odoo Community is the CRM for leads, guest history, Kalakar tracking, sales follow-up, and owner reporting.
- Custom code connects Next.js, QloApps, Odoo, Razorpay, WhatsApp, and AI.
- n8n is not hosted for now. If workflows become too complex later, it can be added as a separate decision.

The rule is simple: QloApps controls bookings and availability. Odoo tracks relationships and reporting. Next.js sells the experience.
```

- [ ] **Step 2: Replace the DNS plan**

Replace `## DNS Plan` with:

```md
## DNS Plan

Create these DNS records at your domain provider:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 94.136.185.217 |
| A | www | 94.136.185.217 |
| A | book | 94.136.185.217 |
| A | crm | 94.136.185.217 |

Optional later:

| Type | Name | Value |
| --- | --- | --- |
| A | api | 94.136.185.217 |
```

- [ ] **Step 3: Replace the Qlo decision section**

Replace `## Qlo / QloApps Decision` with:

```md
## QloApps And Odoo Decision

Use QloApps and Odoo together, but do not let them do the same job.

- QloApps: PMS, booking engine, rooms, rates, availability, booking operations.
- Odoo: CRM, leads, guest profiles, repeat tracking, Kalakar tracking, owner reporting.

Do not build another full PMS in Next.js. Next.js can collect leads and provide a premium booking entry point, but QloApps remains the booking source of truth.
```

- [ ] **Step 4: Run docs grep**

Run:

```powershell
rg "do not add it yet|custom platform first|Odoo optional" hospitality-platform/START_HERE.md
```

Expected: no output.

## Task 3: Add Deployment Environment Templates

**Files:**
- Create: `deploy/env/qloapps.env.example`
- Create: `deploy/env/odoo.env.example`

- [ ] **Step 1: Create QloApps env template**

Create `deploy/env/qloapps.env.example` with:

```env
USER_PASSWORD=change_this_qloapps_ssh_user_password
MYSQL_ROOT_PASSWORD=change_this_qloapps_root_password
MYSQL_DATABASE=qloapps
```

- [ ] **Step 2: Create Odoo env template**

Create `deploy/env/odoo.env.example` with:

```env
POSTGRES_DB=postgres
POSTGRES_USER=odoo
POSTGRES_PASSWORD=change_this_odoo_db_password
ODOO_MASTER_PASSWORD=change_this_odoo_master_password
```

- [ ] **Step 3: Verify no real secrets are present**

Run:

```powershell
rg "94\.136\.185\.217|gho_|sk-|rzp_|xox|AIza|whsec|change_this" deploy/env
```

Expected output contains only `change_this` example values and no real tokens.

## Task 4: Add QloApps Docker Compose

**Files:**
- Create: `deploy/docker/qloapps-compose.yml`

- [ ] **Step 1: Create QloApps compose file**

Create `deploy/docker/qloapps-compose.yml` with:

```yaml
# Production setup:
# 1. Copy deploy/env/qloapps.env.example to /opt/triindia/qloapps/.env on the VPS.
# 2. Run docker compose from /opt/triindia/qloapps so env_file: .env resolves correctly.

services:
  qloapps-web:
    image: webkul/qloapps_docker:latest
    container_name: qloapps-web
    restart: unless-stopped
    env_file:
      - .env
    environment:
      USER_PASSWORD: ${USER_PASSWORD:?Set USER_PASSWORD in /opt/triindia/qloapps/.env}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:?Set MYSQL_ROOT_PASSWORD in /opt/triindia/qloapps/.env}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-qloapps}
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - qloapps-web-data:/home/qloapps/www/QloApps
      - qloapps-mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "ps aux | grep -q '[a]pache2'"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - qloapps-network

volumes:
  qloapps-web-data:
  qloapps-mysql-data:

networks:
  qloapps-network:
    driver: bridge
```

- [ ] **Step 2: Validate compose syntax locally if Docker is available**

Run:

```powershell
docker compose -f deploy/docker/qloapps-compose.yml config
```

Expected: Docker prints the resolved compose config. If Docker is not installed locally, run this validation on the VPS after Docker installation.

## Task 5: Add Odoo Docker Compose

**Files:**
- Create: `deploy/docker/odoo-compose.yml`
- Leave existing: `deploy/docker/docker-compose.yml`

- [ ] **Step 1: Create Odoo compose file**

Create `deploy/docker/odoo-compose.yml` with:

```yaml
# Production setup:
# 1. Copy deploy/env/odoo.env.example to /opt/triindia/odoo/.env on the VPS.
# 2. Run docker compose from /opt/triindia/odoo so env_file: .env resolves correctly.

services:
  odoo-db:
    image: postgres:15-alpine
    container_name: odoo-db
    restart: unless-stopped
    env_file:
      - .env
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-postgres}
      POSTGRES_USER: ${POSTGRES_USER:-odoo}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in .env}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - odoo-db-data:/var/lib/postgresql/data/pgdata
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s
    networks:
      - odoo-network

  odoo-web:
    image: odoo:17.0
    container_name: odoo-web
    restart: unless-stopped
    env_file:
      - .env
    depends_on:
      odoo-db:
        condition: service_healthy
    command:
      - odoo
      - --admin-passwd=${ODOO_MASTER_PASSWORD:?Set ODOO_MASTER_PASSWORD in .env}
      - --proxy-mode
      - --gevent-port=8072
    ports:
      - "127.0.0.1:8069:8069"
      - "127.0.0.1:8072:8072"
    environment:
      HOST: odoo-db
      USER: ${POSTGRES_USER:-odoo}
      PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in .env}
    volumes:
      - odoo-web-data:/var/lib/odoo
      - ./addons:/mnt/extra-addons
    networks:
      - odoo-network

volumes:
  odoo-db-data:
  odoo-web-data:

networks:
  odoo-network:
    driver: bridge
```

- [ ] **Step 2: Validate compose syntax locally if Docker is available**

Run:

```powershell
docker compose -f deploy/docker/odoo-compose.yml config
```

Expected: Docker prints the resolved compose config. If Docker is not installed locally, run this validation on the VPS after Docker installation.

## Task 6: Add Nginx Reverse Proxy Configs

**Files:**
- Modify: `deploy/nginx/triindia.conf`
- Create: `deploy/nginx/book.conf`
- Modify: `deploy/nginx/crm.conf`

- [ ] **Step 1: Ensure website config proxies to Next.js**

`deploy/nginx/triindia.conf` should proxy `triindiahospitality.com` and `www.triindiahospitality.com` to local port `3000`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name triindiahospitality.com www.triindiahospitality.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name triindiahospitality.com www.triindiahospitality.com;

    ssl_certificate /etc/letsencrypt/live/triindiahospitality.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/triindiahospitality.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] **Step 2: Create QloApps config**

Create `deploy/nginx/book.conf` with:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name book.triindiahospitality.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name book.triindiahospitality.com;

    ssl_certificate /etc/letsencrypt/live/book.triindiahospitality.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/book.triindiahospitality.com/privkey.pem;

    client_max_body_size 64m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- [ ] **Step 3: Ensure Odoo config proxies to the renamed container port**

`deploy/nginx/crm.conf` should proxy `crm.triindiahospitality.com` to local port `8069` and Odoo websocket traffic to local port `8072`. Keep long read/send timeouts for Odoo, but use a sane connect timeout like `60` seconds. Use hostname-specific CRM SSL certificate paths and ensure the upstreams are:

```nginx
proxy_pass http://127.0.0.1:8069;
proxy_pass http://127.0.0.1:8072;
```

- [ ] **Step 4: Validate Nginx config names**

Run:

```powershell
rg "server_name|proxy_pass" deploy/nginx
```

Expected output includes:

```txt
triindiahospitality.com
book.triindiahospitality.com
crm.triindiahospitality.com
http://127.0.0.1:3000
http://127.0.0.1:8080
http://127.0.0.1:8069
http://127.0.0.1:8072
```

## Task 7: Add VPS Bootstrap And Verification Scripts

**Files:**
- Create: `deploy/scripts/server-bootstrap.sh`
- Create: `deploy/scripts/verify-foundation.sh`

- [ ] **Step 1: Create server bootstrap script**

Create `deploy/scripts/server-bootstrap.sh` with:

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root."
  exit 1
fi

RUN_APT_UPGRADE="${RUN_APT_UPGRADE:-0}"

apt update
if [ "$RUN_APT_UPGRADE" = "1" ]; then
  apt upgrade -y
else
  echo "Skipping apt upgrade. Run with RUN_APT_UPGRADE=1 to enable it."
fi
apt install -y curl git ufw fail2ban nginx certbot python3-certbot-nginx ca-certificates gnupg lsb-release

if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "$tmp_dir"' EXIT
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o "$tmp_dir/docker.gpg"
  install -m 0644 "$tmp_dir/docker.gpg" /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
  apt update
  apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

if ! id triindia >/dev/null 2>&1; then
  if [ ! -t 0 ]; then
    echo "The triindia user does not exist and this script is running without an interactive TTY."
    echo "Run this script from an interactive root shell so adduser can set the triindia password before firewall changes."
    exit 1
  fi
  adduser --gecos "TRIINDIA deploy user" triindia
fi
usermod -aG sudo,docker triindia

ufw allow OpenSSH
ssh_ports="22"
if command -v sshd >/dev/null 2>&1; then
  ssh_ports="${ssh_ports}
$(sshd -T 2>/dev/null | awk '/^port / {print $2}')"
fi
if [ -n "${SSH_CONNECTION:-}" ]; then
  ssh_ports="${ssh_ports}
$(printf '%s\n' "$SSH_CONNECTION" | awk '{print $4}')"
fi

printf '%s\n' "$ssh_ports" | awk '/^[0-9]+$/ && !seen[$1]++ {print $1}' | while read -r ssh_port; do
  if [ -n "$ssh_port" ]; then
    ufw allow "${ssh_port}/tcp"
  fi
done
ufw allow 'Nginx Full'
ufw --force enable

install -d -o triindia -g triindia /opt/triindia/qloapps /opt/triindia/odoo /opt/triindia/app /opt/triindia/backups

systemctl enable docker nginx fail2ban
systemctl start docker nginx fail2ban

echo "Bootstrap complete. Log out and back in as triindia before running Docker commands."
```

- [ ] **Step 2: Create verification script**

Create `deploy/scripts/verify-foundation.sh` with:

```bash
#!/usr/bin/env bash
set -uo pipefail

critical_failures=0
warnings=0

check_critical() {
  description="$1"
  shift

  echo "Checking ${description}..."
  if "$@"; then
    echo "PASS: ${description}"
  else
    echo "FAIL: ${description}"
    critical_failures=$((critical_failures + 1))
  fi
}

check_warning() {
  description="$1"
  shift

  echo "Checking ${description}..."
  if "$@"; then
    echo "PASS: ${description}"
  else
    echo "WARN: ${description}"
    warnings=$((warnings + 1))
  fi
}

check_critical "Docker CLI" docker --version
check_critical "Docker Compose plugin" docker compose version

check_critical "Nginx configuration" sudo nginx -t

check_critical "firewall status" sudo ufw status

echo "Checking containers..."
if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; then
  echo "PASS: container listing"
else
  echo "FAIL: container listing"
  critical_failures=$((critical_failures + 1))
fi

check_warning "QloApps on port 8080" curl -I --max-time 10 http://127.0.0.1:8080
check_warning "Odoo HTTP on port 8069" curl -I --max-time 10 http://127.0.0.1:8069
check_warning "Odoo websocket on port 8072" curl -I --max-time 10 http://127.0.0.1:8072
check_warning "Next.js on port 3000" curl -I --max-time 10 http://127.0.0.1:3000

echo "Foundation verification finished with ${critical_failures} critical failure(s) and ${warnings} warning(s)."

if [ "$critical_failures" -gt 0 ]; then
  exit 1
fi
```

- [ ] **Step 3: Validate shell syntax locally if Bash is available**

Run:

```powershell
bash -n deploy/scripts/server-bootstrap.sh
bash -n deploy/scripts/verify-foundation.sh
```

Expected: no output.

If Bash is not available locally, run the syntax checks on the VPS.

## Task 8: Update Deployment README

**Files:**
- Modify: `deploy/README.md`

- [ ] **Step 1: Replace the Architecture section**

Replace the top architecture section with:

```md
# TRIINDIA Hospitality - Deployment Guide

## Architecture

- VPS: Contabo Ubuntu server in Mumbai, IP `94.136.185.217`
- Website: Next.js app reverse-proxied by Nginx
- PMS: QloApps on `book.triindiahospitality.com`
- CRM: Odoo Community on `crm.triindiahospitality.com`
- SSL: Let's Encrypt via Certbot
- Automation: code-first integrations, no hosted n8n for now

QloApps is the booking and availability source of truth. Odoo is the CRM and reporting layer.
```

- [ ] **Step 2: Add DNS checklist**

Add this section after Architecture:

```md
## DNS Checklist

Create these A records before SSL setup:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 94.136.185.217 |
| A | www | 94.136.185.217 |
| A | book | 94.136.185.217 |
| A | crm | 94.136.185.217 |
```

- [ ] **Step 3: Add install order**

Add this section after DNS Checklist:

```md
## Install Order

1. Run `deploy/scripts/server-bootstrap.sh` as root.
2. Copy QloApps compose and env files to `/opt/triindia/qloapps`.
3. Copy Odoo compose and env files to `/opt/triindia/odoo`.
4. Start QloApps and Odoo containers.
5. Copy Nginx configs into `/etc/nginx/sites-available`.
6. Enable the Nginx sites.
7. Run Certbot for `triindiahospitality.com`, `www.triindiahospitality.com`, `book.triindiahospitality.com`, and `crm.triindiahospitality.com`.
8. Run `deploy/scripts/verify-foundation.sh`.
```

- [ ] **Step 4: Remove old static-export language**

Run:

```powershell
rg "static export|out/|rsync -avz --delete out|n8n" deploy/README.md
```

Expected: no output except the approved phrase `no hosted n8n for now` if present.

## Task 9: Run Local Quality Checks

**Files:**
- No file changes.

- [ ] **Step 1: Generate Prisma client**

Run:

```powershell
npm run db:generate
```

Expected output includes:

```txt
Generated Prisma Client
```

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: command exits successfully with no ESLint errors.

- [ ] **Step 3: Run typecheck**

Run:

```powershell
npm run typecheck
```

Expected: command exits successfully with no TypeScript errors.

- [ ] **Step 4: Run production build**

Run:

```powershell
npm run build
```

Expected output includes:

```txt
Compiled successfully
```

## Task 10: Prepare Push Checkpoint

**Files:**
- No required file changes.

- [ ] **Step 1: Show final project status**

Run:

```powershell
git status --short
```

Expected: all intended project files are listed; `.env`, `.env.local`, and real credential files are absent.

- [ ] **Step 2: Show remote**

Run:

```powershell
git remote -v
```

Expected output:

```txt
origin  https://github.com/shiv-automates/triindia-hospitality-platform.git (fetch)
origin  https://github.com/shiv-automates/triindia-hospitality-platform.git (push)
```

- [ ] **Step 3: Ask user before first commit and push**

Do not commit or push until the user explicitly says to do so. When approved, use:

```powershell
git add .
git commit -m "chore: initialize triindia hospitality platform"
git push -u origin main
```

Expected output includes:

```txt
branch 'main' set up to track 'origin/main'
```

## Self-Review Notes

- Spec coverage: this plan covers repo isolation, docs alignment, QloApps PMS scaffolding, Odoo CRM scaffolding, Nginx routing, VPS bootstrap, verification, and first GitHub checkpoint.
- Not covered by this first plan: Razorpay, WhatsApp provider, AI agent, QloApps-to-Odoo data sync, and manager walk-in UX. These are intentionally separate follow-up plans after foundation verification.
- Type consistency: domain names, ports, container names, and file paths are consistent across tasks.
