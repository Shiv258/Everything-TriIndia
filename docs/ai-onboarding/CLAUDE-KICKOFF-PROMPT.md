# Claude Code Kickoff Prompt — TriIndia Hospitality Platform

> **How to use this file.** When you open Claude Code (or any other Claude interface) for the first time in this repo, paste **the entire prompt below** as your first message. Your Claude will read all the context files, understand the project state, and be on the same page as Shiv's Claude on the day this repo was bundled.

---

## Paste this entire block into Claude (verbatim):

```
You are joining the TriIndia Hospitality Platform build mid-flight. Another instance of you (on Shiv's machine) has been building this for the last several weeks and has full context. I am Shiv's teammate. To get onto the same page, do the following in order, then summarise what you've learned back to me before any code work:

1. Read these files at the repository root, in this order:
   - AGENTS.md (outer rules for the Next.js website work)
   - CLAUDE.md (if present)
   - SaaS/AGENTS.md (the LOCKED tech stack — QloApps PMS, Odoo CRM, Node/TS glue, Next.js website; hard rules; build phases)
   - SaaS/KNOWLEDGE_BASE.md (70-page client + business KB)
   - docs/superpowers/specs/2026-05-22-triindia-qloapps-odoo-architecture-design.md (the architecture decision)

2. Read the AI onboarding bundle — these mirror Shiv's Claude's auto-memory and active plan:
   - docs/ai-onboarding/memory/MEMORY.md (the index)
   - docs/ai-onboarding/memory/user_shiv.md (operator profile)
   - docs/ai-onboarding/memory/project_triindia_overview.md
   - docs/ai-onboarding/memory/project_status_2026-05-23.md (snapshot — re-verify before acting; decays fast)
   - docs/ai-onboarding/memory/feedback_no_n8n.md (HARD RULE — Node/TS glue replaces n8n)
   - docs/ai-onboarding/memory/feedback_no_deploy_without_ask.md (HARD RULE)
   - docs/ai-onboarding/memory/feedback_non_technical_partners.md (HARD RULE — no jargon to Hansraj/Habib/Aftab)
   - docs/ai-onboarding/memory/feedback_phase_discipline.md (HARD RULE — stay inside current phase)
   - docs/ai-onboarding/memory/reference_server_contabo.md (production server access)
   - docs/ai-onboarding/memory/reference_odoo_creds.md (Odoo connection; case matters)
   - docs/ai-onboarding/memory/reference_ocr_app.md (OCR app + Vercel deploys)
   - docs/ai-onboarding/memory/reference_project_docs.md (where the locked spec + KB live)
   - docs/ai-onboarding/plans/website-and-qloapps-plan.md (the active multi-phase plan — website redesign + QloApps fix + glue service)

3. Read the deployment runbook:
   - deploy/README.md (server architecture, install order, useful commands)
   - deploy/docker/qloapps-compose.yml + deploy/nginx/book.conf (PMS infra)

4. Read the latest session handoff for project history beyond auto-memory:
   - docs/session-handoff-2026-05-23.md (OCR → Odoo integration completion; Vercel env state)
   - docs/hermes-agent-deployment-spec.md (Hermes WhatsApp agent spec, if relevant to current work)

5. Skim the new skill we built so you can use it for hotel pages:
   - .opencode/skills/premium-hotel-landing-page/SKILL.md + references/

6. Look at the current state of the codebase:
   - app/ (the Next.js 16 app router site)
   - components/ (split: components/home/ for landing, components/hotels/ for per-hotel pages, components/splash/, components/map/)
   - lib/hotels.ts (single source of truth for all 5 active hotels — adding hotels happens here)
   - lib/stats.ts (derived stats for the home page)
   - prisma/schema.prisma (Booking, Guest, Property, Room, Kalakar, Payment models)
   - SaaS/ocr-odoo-integration/app.py (PROVEN Python pattern for Odoo XML-RPC sync — copy this shape when building the glue service)

7. Important: I do NOT have the .env file in the repo. Ask me (Shiv's teammate) for the secrets, or check the private Gist Shiv shared with us. The .env.example at the repo root lists every key you need.

8. Adhere to every HARD RULE in the AGENTS.md files and the feedback memories:
   - Never commit secrets
   - Never deploy without explicit ask
   - Never propose n8n
   - Never edit QloApps core PHP (config + .htaccess + override/ pattern only)
   - Never rebuild PMS features inside Odoo
   - Stay inside the current build phase

9. **Before writing any code**, summarise back to me:
   - What project state you understand
   - What phase we are in
   - What is currently broken (the QloApps storefront-to-admin disconnect + the missing glue service)
   - What you would propose to work on first
   - Any gaps or contradictions you noticed between docs

10. After I confirm your summary, proceed with whatever task I give you next, following the rules above.

Start now by reading file 1 and continuing through the list. Do not skip files. Do not summarise from memory of similar projects — read the actual files. The TriIndia rules are specific and override any general best-practice you'd normally apply.
```

---

## Why this prompt is structured this way

- **Forces a sequential read of the rule-defining files first** so the Claude doesn't latch onto generic best practice and miss the locked decisions.
- **Mirrors the AI memory layout Shiv's Claude has** — these are exact copies (in `docs/ai-onboarding/memory/`) of the auto-memory files on Shiv's machine.
- **Requires summary back before coding** — catches misunderstandings before they turn into wrong code.
- **Calls out hard rules explicitly** — Claude tends to follow general patterns unless told the project has specific exceptions.

## When to re-run

- After every significant context change (new hotel, new integration, new phase)
- If your Claude session resets or loses context
- If memory files in `docs/ai-onboarding/memory/` are updated by Shiv
- Before starting a new work session, as a routine warmup
