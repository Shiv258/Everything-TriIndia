---
name: project_status_2026-05-23
description: "Snapshot of TriIndia build state as of 2026-05-23 — what's done, what's broken, what's next"
metadata: 
  node_type: memory
  type: project
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Snapshot date:** 2026-05-23. Re-verify before acting; this decays fast.

**Done:**
- Next.js website live at https://triindiahospitality.com on Contabo VPS (94.136.185.217), behind nginx with SSL, running under systemd as `triindia-platform.service` from `/opt/triindia/app`. Previously broke when an interactive SSH session was closed — systemd unit fixed that.
- Odoo 18 Community CRM live at https://crm.triindiahospitality.com (Docker on the same Contabo box). Database name is `TriIndia_Hospitality` (NOT `triindia` — that bug caused a 403). Test lead ID 59 ("Test Guest from OCR") successfully created via XML-RPC.
- OCR app (https://github.com/shiv-automates/ocr-app) auto-syncs guest register extractions to Odoo as `crm.lead` records. Backend (`app.py`) + frontend (`single.html`, `bulk.html`) both wired. Dedupe by name+phone. Source `Hotel Register (OCR)` auto-created as utm.source ID 10. Two commits pushed: `abc56ee` and `f873517`.

**Pending (next session priority):**
1. **Fix Vercel env on `ocr-app-sage.vercel.app`** — currently has `ODOO_DB=triindia` (wrong). Update to `TriIndia_Hospitality` and add the 4 other Odoo vars (ODOO_URL, ODOO_USERNAME, ODOO_API_KEY, ODOO_SYNC_ENABLED). Or: add `API_MODE=openrouter` + `OPENROUTER_API_KEY` to the new `ocr-app-mauve.vercel.app` (which already has Odoo vars).
2. **Odoo demo-data cleanup** — Odoo was installed with demo data (Acme Corp, Azure Interior). Settings → Technical → Modules → uninstall demo data, then delete demo contacts/leads.

**Architecture note:** The OCR app currently pushes directly to Odoo (Approach A). Per [[feedback_no_n8n]], this is interim — it should later be migrated into the Node/TS glue service when that exists. That migration is Phase 1.5 territory.

**Why:** Captures current state so a new session doesn't re-investigate. **How to apply:** Read this first when resuming TriIndia work, then verify with [[reference_server_contabo]] and [[reference_odoo_creds]] before acting — server state changes.
