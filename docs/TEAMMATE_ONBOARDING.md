# TriIndia Hospitality — Teammate Onboarding

Welcome. This document gets you from a fresh laptop to a running local copy of the TriIndia website + understanding of where the rest of the platform (QloApps PMS, Odoo CRM, glue service, OCR app) lives.

Estimated time: **30–45 minutes** end-to-end, assuming Node and Docker are installed.

---

## Step 1 — Tools you need installed

| Tool | Why | Minimum version |
|---|---|---|
| **Node.js** | Next.js website + future glue service | ≥ 20.x |
| **npm** | Bundled with Node | ≥ 10 |
| **Git** | Source control | recent |
| **Docker Desktop** | Local Postgres for the website's Prisma DB | recent |
| **Claude Code** (CLI) | Pair-programming with the AI that has full context — see [claude.com/claude-code](https://claude.com/claude-code) | latest |

Optional but recommended:
- **VS Code** (or your preferred editor) — the repo expects normal IDE setup
- **PostgreSQL client** like `psql` or DBeaver

---

## Step 2 — Clone the repo

```bash
git clone https://github.com/Shiv258/Everything-TriIndia.git
cd Everything-TriIndia
```

---

## Step 3 — Get the secrets from Shiv

Shiv will share a **private GitHub Gist URL** with you in WhatsApp / Signal. The Gist contains the `.env` contents.

1. Open the Gist URL
2. Copy the entire file content
3. Create a `.env` file at the repo root:

   ```bash
   cp .env.example .env
   ```

4. Replace the contents of `.env` with what's in the Gist

**Do NOT** commit your `.env` to git. It's in `.gitignore` for a reason. If you accidentally do, tell Shiv immediately — every secret will need rotation.

---

## Step 4 — Install dependencies

```bash
npm install
```

This will take 1–3 minutes the first time.

---

## Step 5 — Start the local database

```bash
docker compose -f docker-compose.local.yml up -d
```

This runs Postgres 16 on `localhost:5432` with the credentials baked into the compose file. The website uses this for its Prisma DB (bookings, guests).

Verify it's up:

```bash
docker ps
# you should see triindia-postgres-local running
```

---

## Step 6 — Run Prisma migrations + seed

```bash
npx prisma migrate dev
npx prisma db seed
```

This creates the Booking, Guest, Property, Room, Kalakar, Payment tables and seeds J Residency.

---

## Step 7 — Start the dev server

```bash
npm run dev
```

Open http://localhost:3000. You should see:

- Tiranga splash on first load (sessionStorage caches it after — use `?splash=1` to force-replay)
- The new home page: hero → about → featured stays → Delhi map → why TriIndia → portfolio marquee → footer
- The 5 hotel detail pages at `/hotels/j-residency`, `/hotels/hotel-ashram-view`, `/hotels/hotel-preet-place`, `/hotels/hotel-samrat-residency`, `/hotels/hotel-satwah-29`

If the Delhi map shows "Map unavailable", your `NEXT_PUBLIC_MAPBOX_TOKEN` isn't set in `.env`. Re-check the Gist.

---

## Step 8 — Brief your Claude

This is the most important step for matching Shiv's pace.

1. Open Claude Code in this repo: `claude` (from the repo root)
2. Open [docs/ai-onboarding/CLAUDE-KICKOFF-PROMPT.md](ai-onboarding/CLAUDE-KICKOFF-PROMPT.md)
3. Copy the **entire** block under "Paste this entire block into Claude (verbatim)"
4. Paste it as your first message to Claude
5. Wait for Claude to read every file and return a summary
6. Confirm the summary is accurate (or correct anything it got wrong)
7. From this point on, your Claude has the same context Shiv's Claude has

---

## Step 9 — Read the architecture before changing anything

In this order:

1. [AGENTS.md](../AGENTS.md) — outer rules for website work
2. [SaaS/AGENTS.md](../SaaS/AGENTS.md) — the LOCKED tech stack and hard rules. **Read this fully.** It tells you what NOT to do (no n8n, no PMS in Odoo, no 5 separate QloApps installs, etc.)
3. [SaaS/KNOWLEDGE_BASE.md](../SaaS/KNOWLEDGE_BASE.md) — the 70-page client + business KB
4. [docs/ai-onboarding/plans/website-and-qloapps-plan.md](ai-onboarding/plans/website-and-qloapps-plan.md) — the active multi-phase plan

---

## Step 10 — Understand the platform shape

```
                                      INTERNET
                                          │
                            ┌─────────────▼─────────────┐
                            │  Nginx + Let's Encrypt    │
                            │  on Contabo VPS           │
                            │  94.136.185.217           │
                            └──┬────┬────┬───────┬─────┘
                               │    │    │       │
            triindiahospitality│    │    │       │ crm.triindiahospitality
                ▼              │    ▼    │       ▼
          Next.js              │   QloApps│      Odoo 18 CRM
          (this repo)          │   (PMS)  │      (Docker)
          systemd service      │   Docker │      PostgreSQL
          PostgreSQL (Prisma)  │  MariaDB │      Custom utm.source
                               │          │
                book.triindiahospitality.com
                               │
                               ▼
                          (Webservice API
                           coming online —
                           Stage 1 of the
                           QloApps plan)

       ┌─────────────────┐
       │ Separate side   │
       │ projects:       │
       │  • SaaS/ocr-... │  ← OCR app → Odoo CRM (PROVEN, working)
       │                 │
       │ Future:         │
       │  • glue/        │  ← Node/TS poller QloApps → Postgres → Odoo
       └─────────────────┘
```

The current state:
- **Website** (`triindiahospitality.com`): live, redesigned, 5 hotel detail pages
- **QloApps** (`book.triindiahospitality.com`): live but broken (storefront → admin disconnect). Fix is documented in [the plan](ai-onboarding/plans/website-and-qloapps-plan.md) Stage 1.
- **Odoo** (`crm.triindiahospitality.com`): live, OCR app pushing leads successfully
- **Glue service**: not yet built. See [the plan](ai-onboarding/plans/website-and-qloapps-plan.md) Stage 3.

---

## Step 11 — Where to read more about each piece

| Piece | Repo location | Read this |
|---|---|---|
| Website code | `app/`, `components/`, `lib/` | [AGENTS.md](../AGENTS.md), [docs/ai-onboarding/plans/website-and-qloapps-plan.md](ai-onboarding/plans/website-and-qloapps-plan.md) |
| Hotel data | `lib/hotels.ts` | Source — single source of truth for the 5 hotels |
| Skill for new hotel pages | `.opencode/skills/premium-hotel-landing-page/` | `SKILL.md` + 2 references |
| OCR app (Python) | `SaaS/ocr-odoo-integration/` | `README.md` + `app.py` (THE pattern to copy for glue) |
| Deployment | `deploy/` | `deploy/README.md` |
| Docker for local Postgres | `docker-compose.local.yml` | (already on Step 5) |
| Past chat handoffs | `docs/session-handoff-*.md` | each file is a session summary |

---

## Step 12 — Where production lives

| Surface | URL | Hosting |
|---|---|---|
| Public website | https://triindiahospitality.com | Contabo VPS, systemd `triindia-platform.service`, `/opt/triindia/app` |
| Public website (www) | https://www.triindiahospitality.com | same |
| QloApps PMS (admin + storefront) | https://book.triindiahospitality.com | Contabo VPS, Docker, `/opt/triindia/qloapps/` |
| Odoo CRM | https://crm.triindiahospitality.com | Contabo VPS, Docker, `/opt/triindia/odoo/` |
| OCR app | https://ocr-app-mauve.vercel.app (new) / `-sage` (legacy) | Vercel, GitHub repo at shiv-automates/ocr-app |

Server access is via SSH key — Shiv has the key. You don't need server access to do website + glue work locally; you only need it for deploys and for QloApps DB debugging (Stage 1 of the QloApps plan).

---

## Step 13 — Rules you must NEVER break

These are non-negotiable. They're enshrined in [SaaS/AGENTS.md](../SaaS/AGENTS.md) Section 7, and the project memories under `docs/ai-onboarding/memory/feedback_*.md`:

1. **Never commit secrets**, API keys, passwords, or `.env` files
2. **Never deploy** to production without explicit instruction from Shiv
3. **Never introduce n8n** — automation is code, in the glue service
4. **Never rebuild PMS features in Odoo** — QloApps is the PMS
5. **Never do 5 separate QloApps installs** — multi-property feature, ONE install
6. **Never edit QloApps or Odoo core files** — use Webservice API, config, or proper override mechanisms
7. **Never expose database ports** publicly
8. **Never jump ahead to Phase 2/3 work** during Phase 1 without confirming
9. **Never make a major architecture decision silently** — flag it, explain, get a yes
10. **Never use technical jargon** when talking with the 3 partners (Hansraj, Habib, Aftab). They're not technical. Use plain language.

---

## Step 14 — How to ask for help

- **Architecture questions**: read [SaaS/AGENTS.md](../SaaS/AGENTS.md) first, then ask Shiv
- **Stuck on a bug**: paste the exact error to your Claude. It has the same context Shiv's does.
- **Need a secret you don't have**: ask Shiv on WhatsApp / Signal — never request in a public channel, never request via git issue
- **Want to deploy**: ask Shiv first. Always.

Welcome to the team.
