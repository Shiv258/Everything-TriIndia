# Hermes Agent Deployment on TriIndia VPS — Full Spec

**Document Purpose:** This is a handoff-ready, agent-executable spec. Any AI coding agent (Claude, OpenAI, Cursor, Codex, etc.) should be able to read this document and deploy Hermes Agent on the TriIndia VPS without needing any additional context. It contains everything: what's already deployed, why we're doing this, how to isolate it, and step-by-step commands.

**Date:** 2026-05-24
**Author:** Shiv Automates
**Status:** Ready for implementation

---

## Table of Contents

1. [What This Document Is](#1-what-this-document-is)
2. [VPS Overview — What's Already Deployed](#2-vps-overview--whats-already-deployed)
3. [What Is Hermes Agent](#3-what-is-hermes-agent)
4. [Why Deploy Hermes on This VPS](#4-why-deploy-hermes-on-this-vps)
5. [Architecture — How Everything Fits Together](#5-architecture--how-everything-fits-together)
6. [Security Model — Why Docker Isolation Matters](#6-security-model--why-docker-isolation-matters)
7. [Prerequisites Before Starting](#7-prerequisites-before-starting)
8. [Step-by-Step Deployment](#8-step-by-step-deployment)
9. [Post-Deployment Verification](#9-post-deployment-verification)
10. [Ongoing Management](#10-ongoing-management)
11. [Monitoring & Resource Limits](#11-monitoring--resource-limits)
12. [What Could Go Wrong & How to Fix It](#12-what-could-go-wrong--how-to-fix-it)
13. [Things I Might Forget — Checklist](#13-things-i-might-forget--checklist)

---

## 1. What This Document Is

This document is the **complete, self-contained deployment guide** for adding a Hermes Agent instance to the existing TriIndia Hospitality VPS at `94.136.185.217`. It assumes NO prior knowledge of this specific setup — every detail is spelled out.

Any developer or AI agent should be able to:
1. Read this document from top to bottom
2. SSH into the server
3. Follow every step
4. End up with a working Hermes Agent that is fully isolated from the TriIndia production services

---

## 2. VPS Overview — What's Already Deployed

### Server Specs

| Spec | Value |
|------|-------|
| **Provider** | Contabo |
| **IP** | `94.136.185.217` |
| **OS** | Ubuntu 24.04 LTS |
| **CPU** | 6 vCPU |
| **RAM** | 12 GB |
| **Disk** | 200 GB NVMe |
| **IPv6** | `2400:d321:2331:8165::1/64` |
| **Plan** | Cloud VPS 20 NVMe |
| **Monthly Cost** | $21.48 |
| **Auto Backup** | Enabled |

### Current Services Running

| Service | Technology | Container | Port | Purpose | RAM Usage (est.) |
|---------|-----------|-----------|------|---------|-------------------|
| **Nginx** | Reverse proxy | Native (systemd) | 80, 443 | SSL termination, subdomain routing | ~50 MB |
| **TriIndia Website** | Next.js 16.2.6 | Native (systemd) | 127.0.0.1:3000 | Public hotel website | ~200-400 MB |
| **QloApps** | PHP + MariaDB | Docker (`qloapps-network`) | 127.0.0.1:8080 | PMS (bookings, rooms, billing) | ~500-800 MB |
| **Odoo 17** | Python + PostgreSQL | Docker (`odoo-network`) | 127.0.0.1:8069, 127.0.0.1:8072 | CRM (guest data, marketing) | ~400-700 MB |
| **System** | Ubuntu + Docker daemon | — | — | OS overhead | ~300-500 MB |
| **TOTAL** | | | | | **~1.5–2.4 GB** |

### Directory Structure

```
/opt/triindia/
├── app/            # Next.js website (git clone)
├── qloapps/        # QloApps Docker (docker-compose.yml + .env)
├── odoo/            # Odoo Docker (docker-compose.yml + .env + addons/)
└── backups/         # Backup directory
```

### Nginx Subdomain Routing

| Subdomain | Service | Port |
|-----------|---------|------|
| `triindiahospitality.com` | Next.js website | 3000 |
| `www.triindiahospitality.com` | Next.js website | 3000 |
| `book.triindiahospitality.com` | QloApps PMS | 8080 |
| `crm.triindiahospitality.com` | Odoo CRM | 8069 |

### Systemd Service

The Next.js website runs as a systemd service:

```ini
# /etc/systemd/system/triindia-platform.service
[Unit]
Description=TriIndia Next.js Website
After=network.target

[Service]
Type=simple
User=triindia
Group=triindia
WorkingDirectory=/opt/triindia/app
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Docker Networks

Two isolated Docker networks exist:
- `odoo-network` (bridge) — Odoo web + Odoo DB
- `qloapps-network` (bridge) — QloApps + MariaDB

These networks are isolated from each other. Neither can reach the other's databases.

### Firewall (UFW)

Only these ports are open:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)

All database ports (3306 MySQL, 5432 PostgreSQL) are NOT exposed to the internet.

### SSL Certificates

Let's Encrypt certificates via Certbot for:
- `triindiahospitality.com`
- `www.triindiahospitality.com`
- `book.triindiahospitality.com`
- `crm.triindiahospitality.com`

---

## 3. What Is Hermes Agent

Hermes Agent is an open-source AI agent from NousResearch. It runs on your own infrastructure and provides:

- **Memory** — Persistent context across sessions (`user.md`, `memory.md`)
- **Skills** — Reusable procedural playbooks for repeated tasks
- **Soul** — Personality/behavior configuration (`soul.md`)
- **Crons** — Scheduled automations (daily news briefing, server checks, etc.)
- **Self-improving loop** — Learns from interactions, updates its own skills and memory
- **Multi-channel** — Telegram, Discord, Slack, web UI
- **684+ community skills** available

**GitHub:** https://github.com/NousResearch/hermes-agent
**Website:** https://hermes-agent.nousresearch.com/

**Key technical details:**
- Written in Python
- Uses external LLM APIs (OpenAI, Anthropic, etc.) — no local model inference
- Lightweight: ~1-2 GB RAM for the agent process
- Can run in Docker or bare-metal
- Has terminal access (this is important — see Security Model)
- Stores data in local SQLite + markdown files
- Backs up to GitHub

---

## 4. Why Deploy Hermes on This VPS

1. **Shiv (the operator) manages both** — The TriIndia client is a close friend, and Shiv will handle this infrastructure long-term. Having everything on one server simplifies management.

2. **Resource headroom** — The VPS has 12 GB RAM. Current usage is ~2 GB. Hermes needs ~1-2 GB. Leaves ~8 GB free. No resource concerns.

3. **Hermes can monitor TriIndia** — Crons can check service health, SSL renewal, backup status, and alert via Telegram.

4. **Cost efficiency** — No need for a separate VPS. The Contabo plan already has plenty of room.

5. **Future glue service** — The AGENTS.md spec calls for a Node/TS "glue service" (api.triindia.in). Hermes can coexist with this when it's built.

---

## 5. Architecture — How Everything Fits Together

```
┌──────────────────────────────────────────────────────────────────┐
│                    CONTABO VPS (94.136.185.217)                 │
│                    Ubuntu 24.04 · 6 vCPU · 12 GB RAM            │
│                                                                  │
│  ┌─────────────┐                                                │
│  │   Nginx      │─── triindiahospitality.com → :3000 (Next.js)  │
│  │   (systemd)  │─── book.triindiahospitality.com → :8080       │
│  │              │─── crm.triindiahospitality.com → :8069         │
│  │              │─── hermes.triindia.in → :8000 (HERMES - NEW)  │
│  └─────────────┘                                                │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  QloApps          │  │  Odoo 17          │                    │
│  │  Docker            │  │  Docker            │                    │
│  │  qloapps-network   │  │  odoo-network      │                    │
│  │  :8080             │  │  :8069, :8072      │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────────────────────┐    │
│  │  Next.js          │  │  Hermes Agent (NEW)              │    │
│  │  systemd          │  │  Docker container                  │    │
│  │  triindia user     │  │  hermes-network (ISOLATED)        │    │
│  │  :3000             │  │  :8000 (internal only)            │    │
│  └──────────────────┘  │  mem_limit: 2g                     │    │
│                          │  cpus: 1.5                          │    │
│                          │  NO access to triindia envs        │    │
│                          │  NO access to DB ports              │    │
│                          │  Separate non-root user            │    │
│                          └──────────────────────────────────┘    │
│                                                                  │
│  /opt/triindia/          — TriIndia services (EXISTING)        │
│  /opt/hermes/             — Hermes Agent (NEW, isolated)         │
└──────────────────────────────────────────────────────────────────┘
```

### Key Isolation Points

| Isolation Layer | How | Why |
|----------------|-----|-----|
| **Docker network** | `hermes-network` is a separate bridge network. No connection to `odoo-network` or `qloapps-network`. | Hermes cannot directly access QloApps or Odoo databases. |
| **Filesystem** | `/opt/hermes/` is owned by `hermes` user. `/opt/triindia/` is owned by `triindia` user. No read/write cross-access. | If Hermes is compromised, attacker can't read TriIndia env files, API keys, or database passwords. |
| **User** | `hermes` user (new, to be created). Not in `sudo` group. Not in `docker` group. | Even if Hermes terminal is exploited, the attacker can't sudo or manage other containers. |
| **Resource limits** | Docker `mem_limit: 2g`, `cpus: 1.5`. | Hermes can't OOM the server and take down TriIndia services. |
| **Port exposure** | Hermes container port 8000 is NOT exposed to the internet directly. Only via Nginx reverse proxy. | No direct attack surface. |
| **Process isolation** | Hermes runs as a container, TriIndia services run as native systemd or in their own Docker networks. | A crash in Hermes doesn't affect QloApps, Odoo, or the website. |

---

## 6. Security Model — Why Docker Isolation Matters

**The single biggest risk of this deployment is that Hermes Agent has terminal access.** If someone compromises your Telegram bot token, they get a shell on the same machine that runs:

- Your client's hotel booking system (QloApps)
- Your client's CRM with all guest data (Odoo)
- Your client's public website (Next.js)
- The OCR app that pushes guest data to Odoo

**This is why we use Docker isolation:**

1. **Container boundary** — Hermes runs in its own container. Even with terminal access, the attacker is inside the container. They can see the container's filesystem but NOT the host filesystem, NOT `/opt/triindia/`, NOT the other Docker containers.

2. **Network boundary** — `hermes-network` is a separate Docker bridge. The Hermes container cannot reach `odoo-network` or `qloapps-network`. It cannot connect to MySQL (3306) or PostgreSQL (5432) inside those networks.

3. **User boundary** — The `hermes` Linux user is not in the `docker` group. It can't start/stop other containers. It can't read `/opt/triindia/` files.

4. **Resource boundary** — Even if Hermes goes haywire (infinite loop, memory leak), Docker will kill the container at 2 GB RAM. The TriIndia services continue unaffected.

5. **Credential boundary** — TriIndia credentials (Odoo API keys, QloApps passwords, database passwords) are in `/opt/triindia/*/` files and Docker env files. The `hermes` user has NO read access to these. Hermes's own credentials go in `/opt/hermes/`.

**What Hermes CAN do (by design):**
- Access the internet (for LLM API calls)
- Talk to Telegram/Discord/Slack APIs
- Run terminal commands INSIDE its own container
- Write to `/opt/hermes/data/`

**What Hermes CANNOT do (by design):**
- Reach QloApps MariaDB on port 3306
- Reach Odoo PostgreSQL on port 5432
- Read `/opt/triindia/` env files
- Manage other Docker containers
- Access the TriIndia website's `.env` file
- SSH to other servers (no SSH keys in the container)
- Use `sudo` (hermes user is not in sudoers)

---

## 7. Prerequisites Before Starting

### 7.1 What You Need

- SSH access to `94.136.185.217` as `root`
- A Telegram account (for the bot)
- A GitHub account (for Hermes backup)
- An LLM API key (OpenAI, Anthropic, or OpenRouter)

### 7.2 What You DON'T Need

- A separate VPS
- Any changes to the TriIndia services

### 7.3 Subdomain Setup

We want a web UI for Hermes at `hermes.triindia.in`:

1. Add an A record in your DNS: `hermes.triindia.in → 94.136.185.217`
2. We'll add an Nginx config for it later (Step 8.7)

### 7.4 Telegram Bot Setup

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Choose a name (e.g., "Shiv's Hermes")
4. Choose a username (e.g., `shiv_hermes_bot`)
5. BotFather gives you a token like `123456:ABC-DEF...`
6. Save this token — you'll need it in the `.env` file
7. Get your Telegram user ID: message `@userinfobot` and copy your ID
8. You'll configure the allowed user ID during Hermes onboarding

---

## 8. Step-by-Step Deployment

### Step 8.1: SSH into the Server

```bash
ssh root@94.136.185.217
```

### Step 8.2: Verify Current State

Before touching anything, verify all existing services are healthy:

```bash
# Check all Docker containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check TriIndia website
systemctl status triindia-platform.service

# Check memory usage
free -h

# Check disk usage
df -h

# Check Docker networks
docker network ls
```

Expected output:
- 4 Docker containers running (qloapps-web, qloapps-db, odoo-web, odoo-db)
- TriIndia website active and running
- ~2-3 GB RAM used, ~8-9 GB free
- ~20-40 GB disk used, ~160 GB free

### Step 8.3: Create the Hermes User

```bash
# Create a dedicated user for Hermes (NOT in docker group, NOT in sudo)
adduser --gecos "Hermes Agent Service" --disabled-password hermes

# Create the Hermes directory structure
mkdir -p /opt/hermes/data
chown -R hermes:hermes /opt/hermes

# Verify the user was created
id hermes
# Expected output: uid=10XX(hermes) gid=10XX(hermes) groups=10XX(hermes)

# CRITICAL: Verify hermes is NOT in docker or sudo groups
groups hermes
# Expected: hermes ONLY. If 'docker' or 'sudo' shows up, remove them:
# sudo deluser hermes docker
# sudo deluser hermes sudo
```

### Step 8.4: Create the Hermes Docker Network

```bash
# Create an isolated Docker network for Hermes
docker network create hermes-network

# Verify it was created
docker network ls | grep hermes
```

### Step 8.5: Create the Docker Compose File

```bash
cat > /opt/hermes/docker-compose.yml << 'EOF'
version: "3.8"

services:
  hermes:
    image: ghcr.io/nousresearch/hermes-agent:latest
    container_name: hermes-agent
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - ./data:/opt/hermes/data
    deploy:
      resources:
        limits:
          memory: 2g
          cpus: "1.5"
        reservations:
          memory: 512m
          cpus: "0.5"
    networks:
      - hermes-network

networks:
  hermes-network:
    external: true
EOF

chown hermes:hermes /opt/hermes/docker-compose.yml
```

**Why these resource limits:**
- `memory: 2g` — Hermes won't eat more than 2 GB even under heavy use. Leaves 10 GB for everything else.
- `cpus: "1.5"` — Limits CPU to 1.5 cores. The VPS has 6, so Hermes can burst but won't starve other services.
- `127.0.0.1:8000:8000` — Binds to localhost only. NOT exposed to the internet. Access via Nginx proxy only.
- `hermes-network` — Separate Docker network. Cannot reach `odoo-network` or `qloapps-network`.

### Step 8.6: Create the .env File

```bash
cat > /opt/hermes/.env << 'EOF'
# ============================================================
# HERMES AGENT — ENVIRONMENT VARIABLES
# ============================================================
# This file contains sensitive credentials. NEVER commit this to git.
# The 'hermes' user must be able to read this file.
# The 'triindia' and 'root' users should NOT need access to this.

# LLM Provider — choose one and fill in the key
# Options: openai, anthropic, openrouter, google, ollama
# Uncomment the one you want to use:

# Option 1: OpenAI
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-your-openai-key-here

# Option 2: OpenRouter (supports multiple models)
# LLM_PROVIDER=openrouter
# OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Option 3: Anthropic
# LLM_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Default model
LLM_MODEL=gpt-4o

# Hermes admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=CHANGE_THIS_TO_A_STRONG_PASSWORD

# Telegram bot token (get from @BotFather)
TELEGRAM_BOT_TOKEN=

# GitHub backup (optional but recommended)
# Create a private repo and add a PAT with repo access
GITHUB_TOKEN=

# Timezone
TZ=Asia/Kolkata
EOF

chmod 640 /opt/hermes/.env
chown hermes:hermes /opt/hermes/.env
```

**Now edit the file with your actual values:**

```bash
nano /opt/hermes/.env
```

Fill in:
- `LLM_PROVIDER` and corresponding API key (uncomment the lines for your chosen provider)
- `ADMIN_PASSWORD` — choose a strong password
- `TELEGRAM_BOT_TOKEN` — from @BotFather (see Step 7.4)
- `GITHUB_TOKEN` — optional, for automated backups

### Step 8.7: Pull and Start the Container

```bash
cd /opt/hermes
docker compose pull
docker compose up -d

# Verify it's running
docker compose ps
docker compose logs --tail=30
```

You should see the Hermes Agent container running with status "Up".

### Step 8.8: Configure Nginx Reverse Proxy for Web UI

Create the Nginx config for `hermes.triindia.in`:

```bash
cat > /etc/nginx/sites-available/hermes.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name hermes.triindia.in;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hermes.triindia.in;

    ssl_certificate /etc/letsencrypt/live/hermes.triindia.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hermes.triindia.in/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    client_max_body_size 64m;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
EOF
```

### Step 8.9: Issue SSL Certificate

Before issuing the cert, make sure the DNS A record is pointing to the server:

```bash
# Verify DNS is pointing to this server
dig +short hermes.triindia.in
# Should return: 94.136.185.217

# If DNS is not ready yet, stop here and set up DNS first.
# The certbot --nginx method requires DNS to be resolving.

# Once DNS is confirmed, issue the certificate:
sudo certbot certonly --nginx -d hermes.triindia.in

# If certbot asks about redirecting HTTP to HTTPS, choose Yes (2)
```

### Step 8.10: Enable the Nginx Config

```bash
# Create symlink to enable the site
sudo ln -sf /etc/nginx/sites-available/hermes.conf /etc/nginx/sites-enabled/hermes.conf

# Test Nginx config syntax
sudo nginx -t
# Expected output: "syntax is ok" and "test is successful"

# Reload Nginx to pick up the new config
sudo systemctl reload nginx
```

### Step 8.11: Configure UFW Firewall

The firewall should already be configured from the initial server bootstrap. Verify:

```bash
sudo ufw status
# Expected: 22, 80, 443 allowed. Nothing else.
# Hermes is accessed via Nginx on port 443 — no additional port needed.
```

### Step 8.12: Set Up Hermes Watchdog Cron

Create a simple cron job that restarts Hermes if it crashes:

```bash
echo "*/5 * * * * root docker start hermes-agent 2>/dev/null" > /etc/cron.d/hermes-watchdog
chmod 644 /etc/cron.d/hermes-watchdog
```

This checks every 5 minutes if the container is running and starts it if not.

### Step 8.13: Onboard Hermes

You can onboard Hermes via the web UI or Telegram.

**Option A: Web UI**

```bash
# From your local machine, SSH tunnel to access the web UI:
ssh -L 8000:127.0.0.1:8000 root@94.136.185.217

# Then open http://localhost:8000 in your browser
# Or once DNS + SSL is set up: https://hermes.triindia.in
```

**Option B: Telegram**

1. Open Telegram and find your bot (the one you created via @BotFather)
2. Send `/start` to begin onboarding
3. Follow the prompts

**During onboarding, tell Hermes:**

1. **Your name and role** — "I'm Shiv, I manage this VPS and build automation/SaaS systems."
2. **What services are running** — "This server runs TriIndia Hospitality: Next.js website on port 3000, QloApps PMS on port 8080, Odoo CRM on port 8069."
3. **What it should NOT do** — "Never touch /opt/triindia/, never restart other Docker containers, never access database ports, never attempt to read credential files outside /opt/hermes/."
4. **Set up a daily backup cron** — "Every night at 2 AM IST, commit all changes in /opt/hermes/data/ to the GitHub repo."

---

## 9. Post-Deployment Verification

Run ALL of these on the server to confirm everything is working:

```bash
# 1. Check all Docker containers are running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
# Expected: qloapps-web, qloapps-db, odoo-web, odoo-db, hermes-agent all "Up"

# 2. Check Hermes container specifically
docker inspect hermes-agent --format '{{.State.Status}}'
# Expected: "running"

# 3. Check Hermes resource limits
docker inspect hermes-agent --format '{{.HostConfig.Memory}}'
# Expected: 2147483648 (2 GB in bytes)

docker inspect hermes-agent --format '{{.HostConfig.NanoCpus}}'
# Expected: 1500000000 (1.5 CPUs in nanocores)

# 4. Check Hermes is responding
curl -s http://127.0.0.1:8000 | head -20

# 5. Check TriIndia services are still fine
curl -I https://triindiahospitality.com
curl -I https://book.triindiahospitality.com
curl -I https://crm.triindiahospitality.com

# 6. Check resource usage
free -h
df -h

# 7. SECURITY: Verify Hermes can't reach TriIndia databases
docker exec hermes-agent curl -s http://127.0.0.1:3306 2>&1 | head -5
# Should FAIL — container can't reach host's MySQL

docker exec hermes-agent curl -s http://127.0.0.1:5432 2>&1 | head -5
# Should FAIL — container can't reach host's PostgreSQL

# 8. SECURITY: Verify filesystem isolation
docker exec hermes-agent ls /opt/triindia 2>&1
# Should FAIL — /opt/triindia is not mounted in the container

# 9. SECURITY: Verify hermes user can't access triindia files
sudo -u hermes ls /opt/triindia/
# Should FAIL — permission denied

sudo -u hermes cat /opt/triindia/qloapps/.env
# Should FAIL — permission denied

sudo -u hermes cat /opt/triindia/odoo/.env
# Should FAIL — permission denied

# 10. SECURITY: Verify hermes user can't use docker or sudo
sudo -u hermes docker ps
# Should FAIL — hermes is not in docker group

sudo -u hermes sudo whoami
# Should FAIL — hermes is not in sudoers
```

**If ANY of the security checks in steps 7-10 pass (i.e., Hermes CAN access things it shouldn't), STOP and fix the isolation before proceeding.**

---

## 10. Ongoing Management

### Useful Commands

```bash
# View Hermes logs
cd /opt/hermes && docker compose logs -f

# Restart Hermes
cd /opt/hermes && docker compose restart

# Stop Hermes
cd /opt/hermes && docker compose down

# Start Hermes
cd /opt/hermes && docker compose up -d

# Update Hermes to latest version
cd /opt/hermes && docker compose pull && docker compose up -d

# Check resource usage
docker stats --no-stream

# Check Hermes container specifically
docker stats hermes-agent --no-stream

# SSH into the Hermes container (for debugging)
docker exec -it hermes-agent /bin/bash

# Restart TriIndia website (COMPLETELY SEPARATE from Hermes)
sudo systemctl restart triindia-platform.service

# Restart QloApps (COMPLETELY SEPARATE from Hermes)
cd /opt/triindia/qloapps && docker compose restart

# Restart Odoo (COMPLETELY SEPARATE from Hermes)
cd /opt/triindia/odoo && docker compose restart
```

### Backup Strategy

1. **Hermes data backup:** Set up a cron in Hermes to push `/opt/hermes/data/` to a private GitHub repo daily.

2. **Hermes data backup (manual):**
   ```bash
   # Create a backup
   cd /opt/hermes
   tar -czf /opt/triindia/backups/hermes-data-$(date +%Y%m%d).tar.gz data/

   # List backups
   ls -la /opt/triindia/backups/hermes-data-*.tar.gz

   # Restore from backup
   cd /opt/hermes
   docker compose down
   tar -xzf /opt/triindia/backups/hermes-data-YYYYMMDD.tar.gz
   docker compose up -d
   ```

3. **Server-level backup:** Contabo auto-backups are enabled. Verify in their dashboard.

### Updating Hermes

```bash
# Pull the latest image and restart
cd /opt/hermes
docker compose pull
docker compose up -d

# If something breaks, rollback:
docker compose down
docker compose up -d  # Uses cached image
```

To pin a specific version, edit `docker-compose.yml` and change:
```yaml
image: ghcr.io/nousresearch/hermes-agent:v0.4.0  # Pin to specific version
```

---

## 11. Monitoring & Resource Limits

### Resource Allocation

| Service | Memory Limit | CPU Limit | Priority |
|---------|-------------|-----------|----------|
| **QloApps** (Docker) | No limit | No limit | CRITICAL — client's business |
| **Odoo** (Docker) | No limit | No limit | CRITICAL — client's CRM |
| **Next.js** (systemd) | ~400 MB typical | No limit | CRITICAL — client's website |
| **Nginx** (systemd) | ~50 MB | No limit | CRITICAL — routing |
| **Hermes** (Docker) | **2 GB hard limit** | **1.5 cores** | LOW — can be restarted anytime |
| **System overhead** | ~500 MB | — | — |
| **TOTAL used** | **~2.5-3.2 GB** | **~2-3 cores** | — |
| **REMAINING** | **~8-9 GB** | **~3-4 cores** | Available for future services |

### What Happens Under Memory Pressure

1. Hermes reaches 2 GB → Docker kills the container → auto-restarts via `restart: unless-stopped`
2. If server still has pressure → OOM killer targets highest-RAM processes → QloApps/Odoo might be killed
3. **Prevention:** The watchdog cron restarts Hermes if it's down. The 2 GB limit ensures Hermes never consumes more than its fair share.

### Recommended Hermes Crons for Monitoring

Set these up during onboarding or later via the Telegram bot:

```yaml
# Daily server health check at 8 AM IST
schedule: "0 8 * * *"
task: |
  Check and report via Telegram:
  1. All Docker containers running? (docker ps)
  2. Website up? (curl -I https://triindiahospitality.com)
  3. Odoo up? (curl -I https://crm.triindiahospitality.com)
  4. QloApps up? (curl -I https://book.triindiahospitality.com)
  5. Disk usage under 80%? (df -h)
  6. Memory usage? (free -h)

# Weekly SSL certificate check at 9 AM IST on Mondays
schedule: "0 9 * * 1"
task: |
  Check SSL certificate expiry for:
  1. triindiahospitality.com
  2. book.triindiahospitality.com
  3. crm.triindiahospitality.com
  4. hermes.triindia.in
  Alert if any cert expires in < 14 days.

# Nightly backup at 2 AM IST
schedule: "0 2 * * *"
task: |
  Commit all changes in /opt/hermes/data/ to the GitHub backup repo.
```

---

## 12. What Could Go Wrong & How to Fix It

| Problem | Symptoms | Fix |
|---------|----------|-----|
| **Hermes crashes the server** | All services down, 502 errors | Unlikely with `mem_limit: 2g`. If it happens, Docker kills the container, not the host. Check `docker logs hermes-agent`. Restart: `cd /opt/hermes && docker compose restart`. |
| **Hermes gets compromised via Telegram** | Unauthorized commands on your VPS | The attacker is inside a Docker container with no access to TriIndia services. 1. Revoke the Telegram bot token from @BotFather. 2. `cd /opt/hermes && docker compose down`. 3. Generate new token from @BotFather. 4. Update `.env`. 5. `docker compose up -d`. |
| **Hermes container uses too much disk** | Disk fills up, other services fail | Hermes data is in `/opt/hermes/data/`. Monitor with `du -sh /opt/hermes/data/`. Set up a cron to prune old conversation history if needed. |
| **Hermes updates break something** | Container won't start after `docker compose pull` | Roll back: `cd /opt/hermes && docker compose down && docker compose up -d` (pulls the old image from cache). If that doesn't work, pin the version in `docker-compose.yml`: `image: ghcr.io/nousresearch/hermes-agent:v0.4.0`. |
| **QloApps or Odoo go down** | 502/500 errors on book.triindia.in or crm.triindia.in | Nothing to do with Hermes. Restart Docker: `cd /opt/triindia/qloapps && docker compose restart` or `cd /opt/triindia/odoo && docker compose restart`. |
| **Nginx config error** | All sites down | `sudo nginx -t` to check syntax. `sudo systemctl reload nginx` to apply. |
| **SSL certificate expires** | Browser warnings on any subdomain | Certbot auto-renews. Check: `sudo certbot certificates`. Manual renew: `sudo certbot renew`. |
| **VPS runs out of disk space** | Services start failing | Check: `df -h`. Prune: `docker system prune -a --volumes` (careful — removes unused Docker data). Trim logs: `journalctl --vacuum-size=100M`. |
| **DNS not resolving hermes.triindia.in** | Can't access web UI | Check DNS: `dig +short hermes.triindia.in`. Should return `94.136.185.217`. If not, add the A record in your DNS provider. |
| **Certbot fails for hermes.triindia.in** | No SSL, site won't load | Make sure DNS is pointing to this server first. Then retry: `sudo certbot certonly --nginx -d hermes.triindia.in`. |

---

## 13. Things I Might Forget — Checklist

### Before Deployment

- [ ] SSH into the server and run `free -h` and `docker stats --no-stream` to confirm current resource usage
- [ ] Verify all TriIndia services are running: `docker ps` and `systemctl status triindia-platform.service`
- [ ] Take a snapshot/backup of the current VPS state (Contabo has auto-backups, verify it's recent)
- [ ] Have your LLM API key ready (OpenAI, Anthropic, or OpenRouter)
- [ ] Have a Telegram account ready
- [ ] Add DNS A record: `hermes.triindia.in → 94.136.185.217`
- [ ] Choose a strong admin password for Hermes
- [ ] Create a Telegram bot via @BotFather and save the token

### During Deployment

- [ ] Create `hermes` user WITHOUT docker or sudo access
- [ ] Create `/opt/hermes/` directory owned by `hermes:hermes`
- [ ] Create `hermes-network` Docker network (separate from `odoo-network` and `qloapps-network`)
- [ ] Write `docker-compose.yml` with resource limits (`mem_limit: 2g`, `cpus: 1.5`)
- [ ] Write `.env` file with all credentials, `chmod 640`
- [ ] Port 8000 bound to `127.0.0.1` only (NOT `0.0.0.0`) — already in the compose file
- [ ] Run `docker compose pull` and `docker compose up -d`
- [ ] Verify container is running: `docker compose ps`
- [ ] Create Nginx config for `hermes.triindia.in`
- [ ] Issue SSL certificate: `sudo certbot certonly --nginx -d hermes.triindia.in`
- [ ] Enable Nginx config and reload
- [ ] Set up watchdog cron: `echo "*/5 * * * * root docker start hermes-agent 2>/dev/null" > /etc/cron.d/hermes-watchdog`

### After Deployment

- [ ] Verify TriIndia services are still running (website, QloApps, Odoo)
- [ ] Verify Hermes is accessible via Telegram
- [ ] Verify Hermes is accessible via web UI at `https://hermes.triindia.in`
- [ ] Run ALL security verification checks from Section 9
- [ ] Set up GitHub backup in Hermes (private repo)
- [ ] Set up daily server health cron in Hermes
- [ ] Test that restarting Hermes doesn't affect TriIndia: `cd /opt/hermes && docker compose restart`, then check TriIndia services

### Security Hardening (Post-Deployment)

- [ ] Change the default Hermes admin password to a strong one
- [ ] Only allow your Telegram user ID in Hermes config
- [ ] Verify UFW is active: `sudo ufw status`
- [ ] Verify UFW rate limiting: `sudo ufw limit OpenSSH`
- [ ] Check Fail2ban is installed and running: `sudo systemctl status fail2ban`
- [ ] Review Hermes's `.env` file permissions: `ls -la /opt/hermes/.env` — should be `-rw-r----- hermes hermes`
- [ ] NEVER put TriIndia credentials (Odoo API key, QloApps password, database passwords) in Hermes's memory, skills, or env files
- [ ] When talking to Hermes via Telegram, NEVER paste passwords, API keys, or sensitive credentials in the chat
- [ ] Consider adding HTTP Basic Auth to the Nginx config for `hermes.triindia.in` as an extra layer

### Quick Reference: File Locations

| File | Path | Purpose |
|------|------|---------|
| Hermes docker-compose | `/opt/hermes/docker-compose.yml` | Container config with resource limits |
| Hermes env | `/opt/hermes/.env` | API keys, passwords, config |
| Hermes data | `/opt/hermes/data/` | Skills, memory, conversation history |
| Hermes watchdog cron | `/etc/cron.d/hermes-watchdog` | Auto-restart if container dies |
| TriIndia website | `/opt/triindia/app/` | Next.js website |
| TriIndia website service | `/etc/systemd/system/triindia-platform.service` | Systemd service |
| QloApps compose | `/opt/triindia/qloapps/docker-compose.yml` | QloApps Docker |
| QloApps env | `/opt/triindia/qloapps/.env` | QloApps credentials |
| Odoo compose | `/opt/triindia/odoo/docker-compose.yml` | Odoo Docker |
| Odoo env | `/opt/triindia/odoo/.env` | Odoo credentials |
| Hermes Nginx config | `/etc/nginx/sites-available/hermes.conf` | Reverse proxy + SSL for web UI |
| Other Nginx configs | `/etc/nginx/sites-available/` | All subdomain configs |
| SSL certs | `/etc/letsencrypt/live/` | Let's Encrypt certificates |
| UFW firewall config | `sudo ufw status verbose` | Port rules |

---

## End of Document

This spec is complete and self-contained. Any agent or developer should be able to deploy Hermes Agent on this VPS using only this document and SSH access to `94.136.185.217`.