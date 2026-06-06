---
name: feedback_phase_discipline
description: Build only the current phase — do not jump ahead to Phase 2 or Phase 3 features
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Rule:** Build one phase at a time. Fully complete and test a phase before moving on. If the user asks for something that belongs to a later phase, flag it and confirm before building.

**Phase 1 (now):** repo scaffold, server+Docker, QloApps live, Odoo live, glue service connecting them, Next.js site hosted.

**Phase 2 (later, NOT NOW):** WhatsApp Business API + AI agent, pre/in/post-stay flows, Razorpay deepening, owner dashboard, referral/Kalakar tracking, OCR historical migration.

**Phase 3 (later, NOT NOW):** custom OTA sync, marketing engine, advanced reporting, multi-property rollout refinement.

**Why:** AGENTS.md is explicit — "Do not build Phase 2 or Phase 3 work during Phase 1. If the operator asks for something that belongs to a later phase, flag it and confirm before building." The scope is large enough that drift kills the 50-day timeline.

**How to apply:** Before starting a task, ask which sub-step in AGENTS.md Section 4 it maps to. If it's outside the current sub-step, raise it instead of silently building. Exception: OCR→Odoo sync is technically Phase 2 territory but is being built early as an interim (per [[project_status_2026-05-23]]) — that was an explicit operator decision.

Related: [[project_triindia_overview]], [[reference_project_docs]].
