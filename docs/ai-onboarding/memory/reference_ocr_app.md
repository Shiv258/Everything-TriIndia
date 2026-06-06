---
name: reference_ocr_app
description: "OCR app repo + two Vercel deployments (mauve vs sage) and what's wrong with each"
metadata: 
  node_type: memory
  type: reference
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Repo:** https://github.com/shiv-automates/ocr-app — Flask app that extracts guest register data from hotel register images via Vision LLM (OpenRouter), then pushes valid records to Odoo as `crm.lead`. Local workspace copy: `c:\Users\hp\.opencode\TriIndia Website\SaaS\ocr-odoo-integration\` (`app.py`, `requirements.txt`, `.env.example`, `README.md`).

**Recent commits:**
- `abc56ee` — feat: auto-sync OCR guest register data to Odoo CRM
- `f873517` — fix: display Odoo CRM sync status in frontend

**Two Vercel deployments (as of 2026-05-23):**
| Deployment | LLM keys (`API_MODE`, `OPENROUTER_API_KEY`) | Odoo env vars | Status |
|---|---|---|---|
| `ocr-app-sage.vercel.app` (original) | ✅ set | `ODOO_DB=triindia` (WRONG — must be `TriIndia_Hospitality`); other Odoo vars unclear | Needs env fix |
| `ocr-app-mauve.vercel.app` (new) | ❌ missing | All 5 Odoo vars set correctly | Needs LLM keys |

**Recommended next step:** fix the sage deployment's `ODOO_DB` + ensure the other 4 Odoo vars are set, then redeploy. Or: add `API_MODE=openrouter` and `OPENROUTER_API_KEY` to the mauve deployment.

**OCR → Odoo field mapping (crm.lead):** name→name, mobile_no→phone, permanent_address→street, age + nationality + arrival info + reason + confidence → description (combined), type="lead", source_id = utm.source `Hotel Register (OCR)` (ID 10). Dedupe key: name + phone.

**GH token used:** `<see-private-gist>` (likely GitHub-auto-revoked since it was exposed; regenerate from https://github.com/settings/tokens before next OCR app deploy. Live value, if still valid, is in Shiv's private Gist).

Related: [[reference_odoo_creds]], [[project_status_2026-05-23]].
