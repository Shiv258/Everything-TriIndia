# TriIndia OCR → Odoo CRM Integration — Session Handoff

## Project Overview
- **Project:** TRIINDIA Hospitality Digital Platform
- **Website:** triindiahospitality.com (Next.js, deployed on Contabo VPS at 94.136.185.217)
- **OCR App:** Extracts guest register data from hotel register images using Vision LLMs
- **CRM:** Odoo 18 Community at crm.triindiahospitality.com
- **Server:** Contabo VPS, Ubuntu 24.04, IP: 94.136.185.217

---

## What Was Completed This Session

### 1. OCR App — Odoo CRM Auto-Sync Integration
**Status: Backend DONE, Frontend DONE, Odoo connection VERIFIED**

- Updated `app.py` in the OCR app (https://github.com/shiv-automates/ocr-app) to add Odoo CRM sync
- After extracting guest data from register images, valid records (confidence != low) are automatically pushed to Odoo as `crm.lead` entries
- Deduplication: skips if a lead with same name + phone already exists
- Graceful error handling: if Odoo is down/misconfigured, OCR still works and returns error details
- Frontend templates (`single.html`, `bulk.html`) updated to show Odoo sync status (synced count, skipped, duplicates, errors)

**Odoo connection details (VERIFIED WORKING):**
- URL: https://crm.triindiahospitality.com
- Database: `TriIndia_Hospitality` (NOT "triindia" — this was the bug that caused the 403)
- Username: shiv@shivautomates.com
- API Key: <see-private-gist>
- A test lead was successfully created (ID: 59, "Test Guest from OCR")

**Field mapping (OCR → Odoo crm.lead):**
| OCR Field | Odoo Field |
|-----------|-----------|
| name | name (lead title) |
| mobile_no | phone |
| permanent_address | street |
| age, nationality, from_where_lodger_arrived, date_and_time_of_arrival, reason_of_visit, date, confidence | description (combined) |
| — | type = "lead" |
| — | source_id = "Hotel Register (OCR)" (auto-created, ID: 10) |

### 2. Server Fix — 502 Bad Gateway
**Status: FIXED**

- The website was down because Next.js was running in an interactive SSH session (killed when PowerShell closed)
- Created systemd service file at `/etc/systemd/system/triindia-platform.service`
- WorkingDirectory: `/opt/triindia/app`
- ExecStart: `/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000`
- Runs as `triindia` user
- Service is enabled (survives reboots)
- Website confirmed working at https://triindiahospitality.com

### 3. Vercel Deployment
**Status: PARTIALLY DONE — needs one more env var**

- New Vercel project deployed: `https://ocr-app-mauve.vercel.app`
- Original project: `https://ocr-app-sage.vercel.app`
- All Odoo env vars are set on the NEW project:
  - ODOO_URL=https://crm.triindiahospitality.com
  - ODOO_DB=TriIndia_Hospitality
  - ODOO_USERNAME=shiv@shivautomates.com
  - ODOO_API_KEY=<see-private-gist>
  - ODOO_SYNC_ENABLED=true

**MISSING on the new Vercel project:**
- `API_MODE` (should be `openrouter`)
- `OPENROUTER_API_KEY` (the LLM key for image extraction)

The original `ocr-app-sage.vercel.app` deployment HAS these keys already but has WRONG `ODOO_DB=triindia`. Need to fix it to `TriIndia_Hospitality`.

---

## What Needs To Be Done Next

### CRITICAL: Fix Odoo sync on the ORIGINAL Vercel project

The original `ocr-app-sage.vercel.app` deployment has:
- ✅ OPENROUTER_API_KEY (LLM key is set)
- ✅ Other LLM config
- ❌ ODOO_DB=triindia (WRONG — should be TriIndia_Hospitality)
- ❌ ODOO_URL, ODOO_USERNAME, ODOO_API_KEY, ODOO_SYNC_ENABLED (may or may not be set)

**Option A (Recommended):** Log into Vercel dashboard → find original ocr-app project → Settings → Environment Variables → update ODOO_DB to `TriIndia_Hospitality` and add the other 4 Odoo vars → redeploy.

**Option B:** Use the NEW deployment at `ocr-app-mauve.vercel.app` but add the LLM keys (API_MODE and OPENROUTER_API_KEY) first.

### Odoo Cleanup Needed
- Odoo was installed with demo data (Acme Corporation, Azure Interior, etc.)
- These should be removed: Settings → Technical → Modules → Uninstall demo data
- Then manually delete demo contacts and leads
- The test lead "Test Guest from OCR" (ID: 59) can be deleted or kept as verification

### Original ocr-app repo
- GitHub: https://github.com/shiv-automates/ocr-app
- Commits pushed:
  - `abc56ee` — feat: auto-sync OCR guest register data to Odoo CRM
  - `f873517` — fix: display Odoo CRM sync status in frontend
- GitHub token used: `<see-private-gist>` (likely GitHub-auto-revoked since it leaked; regenerate before next OCR app deploy)

---

## Key Files Modified/Created

### In ocr-app repo (pushed to GitHub):
- `app.py` — Added Odoo XML-RPC sync functions (odoo_authenticate, get_or_create_odoo_source, build_lead_description, sync_records_to_odoo)
- `templates/single.html` — Added odoo_sync display in stats bar
- `templates/bulk.html` — Added odoo_sync display in results summary
- `.env.example` — Added ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, ODOO_SYNC_ENABLED

### On the server (94.136.185.217):
- `/etc/systemd/system/triindia-platform.service` — Systemd service for Next.js website
- Website runs at 127.0.0.1:3000, behind nginx on port 443

### In local workspace (C:\Users\hp\.opencode\TriIndia Website\SaaS\ocr-odoo-integration\):
- `app.py` — Updated copy with Odoo sync
- `requirements.txt` — Same as original (no new deps)
- `.env.example` — Shows all env vars needed
- `README.md` — Setup documentation

---

## Server Access
- **SSH:** `ssh root@94.136.185.217`
- **Website systemd service:** `sudo systemctl status/restart/stop triindia-platform.service`
- **Website location on server:** `/opt/triindia/app`
- **Odoo:** Running in Docker at `crm.triindiahospitality.com` (database: TriIndia_Hospitality)

---

## Architecture Context (from AGENTS.md)
- The platform uses QloApps (PMS), Odoo 18 (CRM), a Node/TS glue service, and Next.js website
- This OCR → Odoo integration is an early implementation of what will eventually be part of the glue service (Phase 1.5)
- The OCR app currently pushes directly to Odoo (Approach A), later to be migrated to the glue service