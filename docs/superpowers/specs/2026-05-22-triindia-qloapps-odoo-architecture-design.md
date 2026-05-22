# TRIINDIA QloApps + Odoo Architecture Design

## Decision

TRIINDIA Hospitality will use a split architecture:

- Next.js for the premium public website and custom guest-facing experience.
- QloApps for hotel PMS, room inventory, rates, availability, and booking operations.
- Odoo Community for CRM, lead tracking, guest history, Kalakar tracking, owner reporting, and sales follow-up.
- Custom integration code for syncing data between the website, QloApps, Odoo, Razorpay, WhatsApp, and the AI agent.

This means Next.js is not the source of truth for room availability. QloApps is.

## Goals

- Launch J Residency as the first pilot property.
- Keep room availability and booking operations inside QloApps.
- Keep customer relationship management and owner visibility inside Odoo.
- Keep the public website premium, fast, mobile-first, and conversion-focused.
- Avoid n8n hosting for now. Build integrations in code.
- Keep the architecture understandable and maintainable for a first production rollout.

## Non-Goals

- Do not build a full custom PMS in Next.js.
- Do not let Odoo become the booking inventory source of truth.
- Do not host n8n unless a later workflow becomes too complex for code-first handling.
- Do not install cPanel, Plesk, or unrelated server panels.
- Do not expose raw database ports publicly.

## System Roles

### Next.js Website

Next.js owns the brand experience:

- Homepage at `triindiahospitality.com`.
- J Residency page.
- Future hotel landing pages.
- Premium room galleries and conversion copy.
- Guest-facing booking entry points.
- API routes for custom integrations where appropriate.

The current booking request flow can remain as a lead-capture layer, but the final booking and availability logic must route through QloApps.

### QloApps PMS

QloApps owns hotel operations:

- Room types.
- Room inventory.
- Rates.
- Availability.
- Booking records.
- Check-in/check-out workflows where practical.

QloApps should be installed on the VPS and exposed through a subdomain such as `book.triindiahospitality.com` or `pms.triindiahospitality.com`.

### Odoo CRM

Odoo owns business relationship data:

- Leads and guest profiles.
- Repeat customer history.
- Sales pipeline.
- Kalakar records and attribution.
- Owner reporting.
- Operational visibility.

Odoo should be installed on the VPS and exposed through `crm.triindiahospitality.com`.

### Custom Integration Layer

The custom integration layer connects systems without n8n:

- Website to QloApps for booking handoff.
- QloApps booking events to Odoo guest/lead records.
- Razorpay payment confirmation to booking/payment status.
- WhatsApp templates for booking confirmation, pre-arrival, in-stay, and post-stay flows.
- AI agent responses using approved hotel facts from QloApps/Odoo data.

This layer can initially live inside the Next.js app. If it grows too large, it can later become a separate Node.js service.

## Domain Plan

- `triindiahospitality.com` - public website.
- `www.triindiahospitality.com` - public website alias.
- `book.triindiahospitality.com` - QloApps booking/PMS guest entry point.
- `crm.triindiahospitality.com` - Odoo CRM.
- `api.triindiahospitality.com` - optional future integration service.

## Data Flow

### Direct Website Booking

1. Guest lands on the Next.js J Residency page.
2. Guest clicks Book Now.
3. Website either redirects to QloApps booking flow or submits an inquiry that is checked against QloApps availability.
4. QloApps creates or updates the booking.
5. Integration code syncs guest and booking summary to Odoo.
6. Razorpay payment confirmation updates booking/payment status.
7. WhatsApp confirmation is sent through the selected provider.

### WhatsApp Inquiry

1. Guest messages the WhatsApp Business number.
2. WhatsApp provider sends webhook to the custom integration layer.
3. AI agent answers using approved hotel facts and current booking logic.
4. If booking intent is detected, the guest is sent to QloApps or a controlled booking/payment link.
5. Booking and guest summary sync to Odoo.
6. Complex requests are escalated to the manager.

### Walk-In / Kalakar Booking

1. Manager creates the booking in QloApps or a controlled manager form.
2. Source is marked as Walk-in, OTA, Website, WhatsApp, or Kalakar.
3. Kalakar attribution syncs to Odoo.
4. Owner dashboard reads CRM/reporting data from Odoo or the integration database.

## Server Plan

The Contabo VPS can host QloApps and Odoo for Phase 1.

Server details:

- IP: `94.136.185.217`.
- Region: Mumbai, India.
- Use Ubuntu.
- Use Docker where stable and practical.
- Use Nginx as reverse proxy.
- Use Certbot for SSL.
- Use firewall rules allowing only SSH, HTTP, and HTTPS publicly.

The Next.js website can either run on the same VPS or later move to Vercel. For the first integrated deployment, using the VPS is acceptable because QloApps and Odoo are also there.

## GitHub Plan

Create a new GitHub repository under `shiv-automates`:

`triindia-hospitality-platform`

The current local folder is inside a larger repository with an unrelated remote. The new repo must avoid pushing to the existing DigiDZN remote.

## Error Handling

- If QloApps is unavailable, website booking CTA should fall back to WhatsApp inquiry.
- If Odoo sync fails, booking should remain valid in QloApps and the sync failure should be logged for retry.
- If Razorpay webhook repeats, payment processing must be idempotent.
- If WhatsApp template sending fails, the booking must still remain confirmed and the manager should see a resend/manual-contact task.
- If AI lacks reliable information, it must not invent answers and must escalate.

## Testing

Minimum checks before production use:

- Next.js lint, typecheck, and production build.
- QloApps installation smoke test.
- Odoo installation smoke test.
- DNS and SSL verification for each subdomain.
- End-to-end test booking from website to QloApps.
- Booking sync test from QloApps to Odoo.
- Razorpay test-mode payment and webhook verification.
- WhatsApp test template send.
- AI agent refusal/escalation tests for unknown facts.

## Immediate Implementation Order

1. Create the new GitHub repo and isolate this project from the wrong remote.
2. Update local docs and deployment files to match QloApps PMS + Odoo CRM.
3. Harden the VPS basics.
4. Install QloApps on a subdomain.
5. Install Odoo on a subdomain.
6. Connect the Next.js website to the selected booking handoff path.
7. Add integration sync from QloApps booking data to Odoo.
8. Add Razorpay payment flow.
9. Add WhatsApp provider integration.
10. Add AI WhatsApp agent.

## Open Follow-Up Decisions

- Final QloApps subdomain: `book.triindiahospitality.com` or `pms.triindiahospitality.com`.
- Whether Next.js production runs on VPS first or Vercel first.
- Which WhatsApp provider to use first: AiSensy or Wati.
- Whether manager walk-in entry starts in QloApps directly or in a custom simplified manager form.
