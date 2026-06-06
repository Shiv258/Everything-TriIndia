---
name: reference_odoo_creds
description: "Odoo 18 Community connection details — URL, database name (gotcha!), user, API key"
metadata: 
  node_type: memory
  type: reference
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Odoo 18 Community connection (verified working):**
- URL: `https://crm.triindiahospitality.com`
- **Database:** `TriIndia_Hospitality` ← exact case. NOT `triindia` (lowercase caused a 403 in prod).
- Username: `shiv@shivautomates.com`
- API key: `<see-private-gist>` (rotate before broader go-live; get the live value from Shiv's private Gist on day-1 setup).

**Verified:** XML-RPC reachable; OCR app created lead ID 59 ("Test Guest from OCR") through `/xmlrpc/2/common` + `/xmlrpc/2/object`. Custom utm.source `Hotel Register (OCR)` auto-created (ID 10).

**Per AGENTS.md:** Abstract the XML-RPC transport — Odoo plans to deprecate XML-RPC/JSON-RPC in Odoo 22 (2028) in favor of a new JSON-2 API, so a future swap should be cheap.

**How to apply:** When wiring any new integration to Odoo, pull these from env (`ODOO_URL`, `ODOO_DB`, `ODOO_USERNAME`, `ODOO_API_KEY`) — never hardcode. Double-check `ODOO_DB` casing — the lowercase-vs-cased bug already burned this project once.

Related: [[reference_server_contabo]], [[reference_ocr_app]], [[project_status_2026-05-23]].
