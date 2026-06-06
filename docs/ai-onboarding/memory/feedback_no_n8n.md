---
name: feedback_no_n8n
description: "Tech stack is locked — Node/TS glue service replaces n8n entirely; don't propose n8n"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Rule:** Do not introduce n8n. Automation lives in a custom Node.js + TypeScript glue service. The stack is locked in `AGENTS.md`: QloApps = PMS, Odoo 18 Community = CRM only, Node/TS glue = integration/automation, Next.js = guest website.

Hard rules that follow from this:
- Never rebuild PMS features in Odoo. QloApps owns PMS (rooms, bookings, front desk, billing).
- Never install paid Odoo hotel modules (e.g. Ksolves).
- Never do 5 separate QloApps installs — use the multi-property feature in ONE install.
- Never edit QloApps/Odoo core when the Webservice API or config can do the job.

**Why:** Shiv chose code over n8n for control, simplicity, and long-term maintainability. The KNOWLEDGE_BASE.md (older client doc) mentions n8n — that's superseded by AGENTS.md. If a request implies n8n, push back and route to the glue service instead. The KB also originally said "Odoo hotel module" — superseded; QloApps is the PMS.

**How to apply:** When you see automation work (cron, webhooks, scheduled sync), implement it as TypeScript in the glue service (`glue/src/`). Build API clients as thin typed wrappers in `glue/src/qloapps/` and `glue/src/odoo/` — never scatter raw API calls. Idempotent sync logic (running twice must not duplicate). Log every external API call.

Related: [[project_triindia_overview]], [[reference_project_docs]].
