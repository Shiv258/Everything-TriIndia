---
name: reference_project_docs
description: "Where the locked TriIndia spec and the 70-page Knowledge Base live, and which wins when they conflict"
metadata: 
  node_type: memory
  type: reference
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Two project docs, hierarchy when they disagree:**

1. **`c:\Users\hp\.opencode\TriIndia Website\AGENTS.md`** — outer-level rules for the Next.js website work. Short. Says: plan first, no random files, keep assets in `/assets`, no committed secrets, no deploys without explicit ask. Points to the Seedance skill at `.opencode/skills/seedance-loop-prompt/SKILL.md` for video prompt generation.

2. **`c:\Users\hp\.opencode\TriIndia Website\SaaS\AGENTS.md`** — the technical command file. **Locked tech stack** (QloApps PMS + Odoo 18 CRM + Node/TS glue + Next.js). Hard rules (no n8n, no paid Odoo hotel modules, ONE QloApps install for 5 properties, never expose DB ports, etc.). Build phases 1→1.6 → 2 → 3 in strict order. **This file wins over the KB when they conflict.**

3. **`c:\Users\hp\.opencode\TriIndia Website\SaaS\KNOWLEDGE_BASE.md`** — 70-page client/business KB (2580 lines). Contains: client identity (3 partners), Kalakar system, business pain points, component-by-component specs (website, Odoo, WhatsApp, AI agent, walk-in form, owner dashboard, pre/in/post-stay flows, OCR migration), guest journey walkthrough (Priya example), 50-day timeline, Phase 2/3 roadmap. **Older — references n8n and DigitalOcean and Hotel module choices that the locked AGENTS.md has since overridden.**

4. **`c:\Users\hp\.opencode\TriIndia Website\hospitality-platform\AGENTS.md`** — exists but not yet read; check before assuming it's redundant.

5. **Handoff:** `c:\Users\hp\.opencode\TriIndia Website\docs\session-handoff-2026-05-23.md` — what was done in the last session. Snapshot in [[project_status_2026-05-23]].

**How to apply:** When designing or estimating, read the SaaS/AGENTS.md spec for the locked decision, then the KB for the why and the component specs. If they disagree (e.g. n8n in KB vs. no-n8n in AGENTS.md), AGENTS.md wins — see [[feedback_no_n8n]].
