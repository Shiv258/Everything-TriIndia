---
name: feedback_no_deploy_without_ask
description: Do not deploy the TriIndia website without explicit instruction
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Rule:** Do not deploy until Shiv explicitly asks. Stated verbatim in `c:\Users\hp\.opencode\TriIndia Website\AGENTS.md`.

Related rules from the same file: plan first before building; don't create random files without explaining; keep assets inside an `/assets` folder; do not commit API keys or secrets.

**Why:** Shiv controls release timing — production is on Contabo and serves the live triindiahospitality.com site. A push at the wrong moment breaks the running systemd service.

**How to apply:** Builds, commits, and PRs are fine on request. `git push` to a deploy branch, `vercel deploy`, anything that touches the Contabo box, or any action that flips bits in production needs an explicit go from Shiv. Phrase ambiguous "ship it" as "ready to deploy — confirm?" before acting.

Related: [[reference_server_contabo]], [[project_status_2026-05-23]].
