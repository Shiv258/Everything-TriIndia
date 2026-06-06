# AGENTS.md — TRIINDIA Hospitality Digital Platform

> **This file is the single source of truth for this project. Read it fully at the start of every session before doing anything. Do not act on assumptions that contradict this file. If something here conflicts with what you find in the codebase, stop and ask.**

---

## 0. HOW TO USE THIS FILE

You are Claude Code, the build agent for this project. This file tells you:
- What we are building and why
- The exact tech stack (already decided — do not propose alternatives)
- The architecture and how the ppieces connect
- The build phases, in strict order
- What is done, what is in progress, what is next
- The rules you must never break

There is also a separate **70-page Knowledge Base document** the operator (Shiv) will provide. That document contains the full business context, the client details, the guest-journey flows, the component specifications, and the operational requirements. **When the KB is provided, read it once in full before building anything. This CLAUDE.md is the technical command file; the KB is the business brain. They work together.**

When you start a session:
1. Read this entire file.
2. If the KB file is present in the repo (look in `/docs/`), read it.
3. Check the "BUILD STATUS" section at the bottom to see what phase we are in.
4. Confirm the current phase with the operator in one sentence before writing code.
5. Build only what the current phase requires. Do not jump ahead.

---

## 1. PROJECT IDENTITY

**Project name:** TRIINDIA Hospitality Digital Platform

**What it is:** A complete digital operating system for a 5-hotel chain in Delhi NCR, India, that currently runs entirely on pen and paper. We are digitizing everything: room bookings, front-desk operations, guest data, billing, marketing, and guest communication.

**The client:** TRIINDIA Hospitality — a partnership firm running 5 budget/mid-range hotels in Delhi:
- J Residency (the pilot property — build and prove everything here first)
- Hotel Satwah 29
- Hotel Ashram View
- Hotel Preet Place
- Hotel Samrat Residency

**The operator:** Shiv (Shiv Automates), the developer and consultant building this. Solo developer using Claude Code for the build. Based in Delhi.

**Core goal:** Build a system that is self-sufficient, runs for years, is cheap to operate (self-hosted, open-source where possible), and that a non-technical hotel staff can actually use day to day.

---

## 2. TECH STACK (LOCKED — DO NOT CHANGE WITHOUT EXPLICIT APPROVAL)

These choices are final. Do not suggest replacing them. Do not introduce new major dependencies without asking.

### Infrastructure
- **Server:** Single DigitalOcean Droplet, Bangalore region (BLR1), Ubuntu 24.04 LTS, 2 vCPU / 4 GB RAM / 80 GB SSD to start. May scale to 8 GB if RAM-constrained during multi-service run.
- **Containerization:** Docker + Docker Compose. Every service runs in its own container. Local dev environment must mirror the droplet exactly via the same `docker-compose.yml`.
- **Reverse proxy:** Nginx (containerized) routing subdomains to the right service.
- **SSL:** Let's Encrypt via Certbot (or Nginx companion container).
- **Domain:** triindia.in (and subdomains — see routing below).

### The Four Application Layers

| Layer | Technology | Role | License |
|-------|-----------|------|---------|
| **PMS** | QloApps (latest 1.7.x) | Property Management System — rooms, bookings, front desk, billing, GST invoices, booking engine | OSL-3.0, free, self-hosted |
| **CRM** | Odoo 18 Community Edition | Guest profiles, segmentation, marketing campaigns, email marketing, reporting | LGPLv3, free, self-hosted |
| **Glue / Integration** | Node.js + TypeScript service (custom) | Connects QloApps ↔ Odoo, handles webhooks, scheduled syncs, WhatsApp automation. **This replaces n8n entirely — we are NOT using n8n.** | our code |
| **Guest Website** | Next.js (already built, on GitHub) | Public-facing hotel website + booking entry. Already live/in-repo — we connect and host it. | our code |

### Stack rationale (so you understand the "why" and don't fight it)
- **QloApps is the PMS, NOT Odoo.** QloApps already has the booking engine, room calendar, front-desk UI, and billing built. Odoo does not. Do NOT try to build PMS features in Odoo. Do NOT install paid Odoo hotel modules.
- **Odoo is the CRM only.** Use it for guest data, marketing campaigns, segmentation, reporting. Nothing else.
- **The Node/TS glue service replaces n8n.** All automation (sync between systems, WhatsApp flows, scheduled jobs, webhook handling) is written as code in this service. The operator chose code over n8n for control and simplicity. If automation ever gets too complex, n8n may be revisited in the future — but for now, everything is code.
- **Databases:** QloApps uses MySQL/MariaDB. Odoo uses PostgreSQL. Each runs in its own container. Do not try to merge them.

### Languages
- Glue/integration service: **Node.js + TypeScript**
- Guest website: **Next.js (React/TypeScript)**
- QloApps internals (if customization needed): **PHP** (PrestaShop-based, Smarty templating) — touch only when necessary, prefer the Webservice API over core edits
- Odoo customizations (if needed): **Python** — prefer configuration and API over custom modules

---

## 3. ARCHITECTURE

```
                          INTERNET (guests, staff, owners)
                                      │
                          ┌───────────▼────────────┐
                          │   Nginx (reverse proxy) │
                          │   + Let's Encrypt SSL    │
                          └───────────┬─────────────┘
        ┌─────────────────┬───────────┼───────────┬──────────────────┐
        │                 │           │           │                  │
        ▼                 ▼           ▼           ▼                  ▼
  triindia.in       book.triindia  crm.tri...  api.tri...      (admin paths)
  (Next.js          (QloApps        (Odoo 18    (Node/TS
   website)          booking +       Community   glue service
                     PMS admin)      CRM)        + webhooks)
        │                 │           │           │
        │                 ▼           ▼           │
        │            ┌─────────┐  ┌─────────┐     │
        │            │ MariaDB │  │Postgres │     │
        │            │(QloApps)│  │ (Odoo)  │     │
        │            └─────────┘  └─────────┘     │
        │                 ▲           ▲           │
        └─────────────────┴───────────┴───────────┘
                  All wired together by the
                  Node/TS glue service via:
                  - QloApps Webservice API (REST/XML)
                  - Odoo XML-RPC / JSON-RPC API
                  - WhatsApp Business API (later phase)
                  - Razorpay webhooks (payments)
```

### Subdomain routing (set up in Nginx)
- `triindia.in` and `www.triindia.in` → Next.js guest website
- `book.triindia.in` → QloApps (booking engine + PMS admin at `/adminhtl`)
- `crm.triindia.in` → Odoo 18
- `api.triindia.in` → Node/TS glue service (webhooks, integration endpoints)

(Subdomains can be adjusted, but keep services cleanly separated. Confirm final naming with operator before configuring SSL.)

### How data flows
1. **Booking comes in** (website, walk-in, or OTA) → lands in QloApps (single source of truth for rooms/availability).
2. **Glue service** listens for QloApps booking events (via Webservice API polling or webhook) → creates/updates the guest record in Odoo CRM with source attribution.
3. **Odoo** owns the guest relationship: profiles, segments, marketing campaigns, lifetime value.
4. **Guest communication** (WhatsApp pre-arrival, post-stay, etc. — later phase) is triggered by the glue service reading state from QloApps + Odoo.
5. **OTA bookings** (Phase 1): entered into QloApps manually by the manager OR auto-parsed from OTA confirmation emails by the glue service. **No automated two-way OTA channel sync in Phase 1** — that is a future custom build against the QloApps Webservice API.

---

## 4. BUILD PHASES (STRICT ORDER — DO NOT SKIP AHEAD)

Build one phase at a time. Fully complete and test a phase before moving to the next. Confirm with the operator before starting each new phase.

### PHASE 1 — Foundation & Core Systems
This is everything we are building right now. Sub-steps in order:

**1.1 — Repo scaffold + local dev environment**
- Scaffold the full monorepo folder structure (see Section 5).
- Create the root `docker-compose.yml` that can run all services locally.
- Set up `.env.example`, `.gitignore`, README.
- Get the operator able to run `docker compose up` locally and see placeholder services respond.

**1.2 — Server + Docker setup**
- Document and script the DigitalOcean droplet provisioning (Ubuntu 24.04).
- Install Docker + Docker Compose on the droplet.
- Basic security hardening (UFW firewall, fail2ban, non-root user, SSH).
- Nginx reverse proxy container + SSL setup via Let's Encrypt.
- Deploy script: how local code gets pushed to the droplet.

**1.3 — QloApps live**
- QloApps running in Docker (use official `webkul/qloapps_docker` image) with its MariaDB container.
- Complete the QloApps installer.
- Configure all 5 hotels using QloApps multi-property feature (ONE install, 5 properties — do NOT do 5 separate installs).
- Set up room types, occupancy, basic rates per hotel.
- **Enable the QloApps Webservice API** (Advanced Parameters → Webservice), generate an API key, and verify a test call works. This is the integration backbone — do this early.

**1.4 — Odoo live**
- Odoo 18 Community in Docker with its PostgreSQL container.
- Create the database (no demo data).
- Install/configure CRM, Contacts, Email Marketing modules (all free in Community).
- Set up custom fields needed for guest records (see KB for the exact field list).
- Verify XML-RPC / JSON-RPC API is reachable from the glue service.

**1.5 — Connect QloApps ↔ Odoo (the glue service)**
- Build the Node/TS glue service.
- First integration: when a booking is created in QloApps, create/update the matching guest contact in Odoo with source attribution.
- Build it resilient: retries, logging, idempotency (don't create duplicate Odoo contacts).
- This is custom code — no n8n.

**1.6 — Connect & host the Next.js guest website**
- The website code already exists on GitHub. Connect that repo into this project (as a folder or submodule — confirm with operator).
- Wire the website's booking flow to QloApps (so a booking on the site lands in QloApps).
- Host the website on the droplet behind Nginx with SSL.
- Get triindia.in serving the live site.

When all of 1.1–1.6 are done, tested, and the operator confirms — Phase 1 is complete.

### PHASE 2 — Automation & Guest Communication (NOT NOW — future)
- WhatsApp Business API integration (via the glue service)
- Pre-arrival / in-stay / post-stay automated flows
- AI WhatsApp agent
- Razorpay payment integration deepening
- Owner dashboard
- Referral / Kalakar tracking
- Historical data migration (OCR import of old paper registers)

### PHASE 3 — Scale & Optimize (NOT NOW — future)
- Custom OTA sync layer (your own code against QloApps Webservice API)
- Marketing engine, campaigns
- Advanced reporting
- Roll-out refinements across all 5 properties

**Do not build Phase 2 or Phase 3 work during Phase 1. If the operator asks for something that belongs to a later phase, flag it and confirm before building.**

---

## 5. REPOSITORY STRUCTURE

Scaffold this monorepo structure in Phase 1.1:

```
triindia-platform/
├── CLAUDE.md                    # this file — the command center
├── README.md                    # human-readable project overview + setup
├── .gitignore
├── .env.example                 # template for all env vars (never commit real .env)
├── docker-compose.yml           # local dev: runs all services
├── docker-compose.prod.yml      # production overrides for the droplet
│
├── docs/                        # all documentation
│   ├── KNOWLEDGE_BASE.md         # the 70-page KB (operator provides)
│   ├── architecture.md
│   ├── deployment.md             # how to deploy local → droplet
│   ├── api-integration.md        # QloApps + Odoo API notes
│   └── runbook.md                # ops: backups, restarts, troubleshooting
│
├── infra/                       # infrastructure as code / scripts
│   ├── nginx/                    # nginx configs + SSL
│   ├── scripts/                  # provisioning, deploy, backup scripts
│   └── droplet-setup.md          # step-by-step server setup
│
├── qloapps/                     # QloApps (PMS) — Docker setup + any customizations
│   ├── docker-compose.qloapps.yml
│   └── custom/                   # any custom modules/overrides (avoid if possible)
│
├── odoo/                        # Odoo (CRM) — Docker setup + config
│   ├── docker-compose.odoo.yml
│   ├── config/                   # odoo.conf
│   └── addons/                   # custom addons only if absolutely needed
│
├── glue/                        # Node/TS integration service (replaces n8n)
│   ├── src/
│   │   ├── index.ts
│   │   ├── qloapps/              # QloApps Webservice API client
│   │   ├── odoo/                 # Odoo XML-RPC/JSON-RPC client
│   │   ├── sync/                 # booking → guest sync logic
│   │   ├── webhooks/             # incoming webhook handlers
│   │   └── jobs/                 # scheduled jobs
│   ├── package.json
│   └── tsconfig.json
│
└── website/                     # Next.js guest website (connect existing GitHub repo)
    └── (existing code)
```

Adjust only with operator approval. Keep services cleanly separated.

---

## 6. CODING CONVENTIONS & RULES

### General
- **TypeScript everywhere** in the glue service and website. Strict mode on.
- **Small, focused commits.** One logical change per commit. Clear commit messages.
- **Never commit secrets.** All credentials in `.env` (gitignored). Maintain `.env.example` with dummy values.
- **Environment parity.** Local Docker setup must match the droplet. Same compose file logic.
- **Idempotency in all sync logic.** Running a sync twice must not create duplicates.
- **Log everything in the glue service.** Structured logs. Every API call to QloApps/Odoo logged with outcome.
- **Comment the "why," not the "what."** Especially for any API quirks in QloApps or Odoo.

### API integration
- **QloApps:** use the Webservice API (REST-style, PrestaShop-inherited). Enable it in admin, use an API key. Prefer API over editing QloApps core/PHP.
- **Odoo:** use XML-RPC (`/xmlrpc/2/common`, `/xmlrpc/2/object`) or JSON-RPC. Note: Odoo plans to deprecate these in Odoo 22 (2028) in favor of a new JSON-2 API — abstract the transport layer so a future swap is easy.
- **Build API clients as thin, typed wrappers** in `glue/src/qloapps/` and `glue/src/odoo/`. Never scatter raw API calls across the codebase.

### Security
- Non-root Docker users where possible.
- UFW firewall on the droplet: only 22 (SSH), 80, 443 open to the world. Database ports never exposed publicly.
- All public traffic over HTTPS.
- Comply with India's DPDP Act for guest personal data.
- Rotate any API keys before go-live; never use installer defaults in production.

### Testing
- Test every integration end-to-end before declaring a sub-phase done.
- For the glue service: write tests for the sync logic (booking → Odoo contact).
- Smoke-test after every deploy to the droplet.

---

## 7. HARD RULES — NEVER DO THESE

1. **NEVER rebuild PMS features in Odoo.** QloApps is the PMS. Odoo is CRM only.
2. **NEVER install paid Odoo hotel modules** (Ksolves $250 etc.). Not needed.
3. **NEVER introduce n8n** unless the operator explicitly says so. Automation is code, in the glue service.
4. **NEVER do 5 separate QloApps installs.** Use the multi-property feature in ONE install.
5. **NEVER commit secrets, API keys, passwords, or `.env` files.**
6. **NEVER expose database ports** (MySQL 3306, Postgres 5432) to the public internet.
7. **NEVER jump ahead to Phase 2/3 work** during Phase 1 without confirming.
8. **NEVER edit QloApps or Odoo core files** when the Webservice API / config can do the job. If you must override, do it through their proper extension mechanisms (QloApps: modules/hooks/overrides; Odoo: custom addons).
9. **NEVER make a major architecture or dependency decision silently.** Flag it, explain the tradeoff, get a yes.
10. **NEVER assume the build environment.** Confirm whether you're working locally or on the droplet before running destructive commands.

---

## 8. THE OPERATOR (HOW TO WORK WITH SHIV)

- Solo developer, fast-moving, prefers to execute and ship.
- Not deeply experienced with PMS systems — explain hotel-domain concepts plainly when relevant.
- Comfortable with code and low-code; strong on automation thinking.
- Prefers code over visual tools (chose code over n8n).
- Wants things cheap, self-hosted, durable for years.
- When stuck, he'll paste exact errors. Give exact fixes — full commands, not vague guidance.
- Keep responses focused and actionable. He's building live, in real time.
- Ask one sharp question at a time when blocked, not a wall of questions.

---

## 9. KEY EXTERNAL RESOURCES

- QloApps GitHub: `github.com/Qloapps/QloApps`
- QloApps Docker image: `hub.docker.com/r/webkul/qloapps_docker`
- QloApps dev docs: `devdocs.qloapps.com`
- QloApps install guide: `github.com/Qloapps/qloapps-docs/blob/master/docs/introduction/installation.md`
- QloApps Webservice API: `devdocs.qloapps.com` → Webservice API section
- QloApps live demo: `demo.qloapps.com` (admin at `/adminhtl`)
- Odoo source: `github.com/odoo/odoo` (branch `18.0`)
- Odoo Docker image: `hub.docker.com/_/odoo`
- Odoo install docs: `odoo.com/documentation/18.0/administration/on_premise.html`
- Odoo external API: `odoo.com/documentation/18.0/developer/reference/external_api.html`

---

## 10. BUILD STATUS (UPDATE THIS AS YOU GO)

> Keep this section current. At the end of every session, update what's done and what's next so the next session has zero ramp-up.

**Current phase:** Phase 1 — Foundation & Core Systems
**Current sub-step:** 1.1 — Repo scaffold + local dev environment (NOT STARTED)

**Done:**
- (nothing yet — fresh start)

**In progress:**
- (none)

**Next up:**
- 1.1 Scaffold the monorepo structure + root docker-compose.yml + local dev env

**Blockers / open questions:**
- Confirm final subdomain naming with operator before SSL setup
- Confirm how the existing Next.js website repo gets pulled in (folder copy vs git submodule)

**Environment notes:**
- Droplet: NOT yet provisioned. Bare — nothing installed.
- Local dev: operator works locally (machine OS to be confirmed), pushes to droplet.
- Website: exists on GitHub, needs connecting + hosting in Phase 1.6.