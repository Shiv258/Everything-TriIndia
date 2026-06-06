# Odoo CRM Integration for OCR App

This folder contains the updated OCR app with **automatic Odoo CRM Lead sync**.

## What Changed

- After extracting guest data from register images, valid records (confidence != low) are automatically pushed to Odoo as `crm.lead` entries.
- Deduplication: skips if a lead with the same name + phone already exists.
- Graceful error handling: if Odoo is down or misconfigured, OCR still works and returns an error log.

## Files

| File | Description |
|------|-------------|
| `app.py` | Updated FastAPI app with Odoo XML-RPC sync built in |
| `requirements.txt` | Python dependencies (no new packages needed — `xmlrpc.client` is built-in) |
| `.env.example` | All environment variables you need to set |

## Quick Start

1. **Copy these files** into your `ocr-app` repo (replace `app.py` and `requirements.txt`).
2. **Add the new env vars** from `.env.example` to your existing `.env` file.
3. **In Odoo**, make sure the CRM module is installed and the user has write access to `crm.lead`.
4. **Deploy** as usual (`uvicorn app:app` or Vercel).

## API Response

Both `/api/single` and `/api/bulk` now return an extra `odoo_sync` field:

```json
{
  "success": true,
  "records": [...],
  "download_url": "/download/...",
  "odoo_sync": {
    "synced_count": 3,
    "skipped_low_confidence": 1,
    "duplicates_skipped": 0,
    "errors": []
  }
}
```

If Odoo sync fails, errors are listed in `odoo_sync.errors` but the OCR extraction still succeeds.
