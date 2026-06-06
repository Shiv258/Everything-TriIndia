---
name: reference_server_contabo
description: "Production server access — Contabo VPS hosting the Next.js site, Odoo CRM, and Docker workloads"
metadata: 
  node_type: memory
  type: reference
  originSessionId: cfdcd508-f719-419b-9626-d092f6d0edd0
---

**Production server (single VPS for everything right now):**
- Provider: Contabo. IP: `94.136.185.217`. OS: Ubuntu 24.04.
- SSH: `ssh root@94.136.185.217`.

**Next.js website service:**
- Path: `/opt/triindia/app`.
- Systemd unit: `/etc/systemd/system/triindia-platform.service`. Runs as `triindia` user. ExecStart: `/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000`. Enabled (survives reboot).
- Manage: `sudo systemctl status|restart|stop triindia-platform.service`.
- Behind nginx (port 443, Let's Encrypt) at https://triindiahospitality.com.

**Odoo:** Docker container on the same box, reachable at https://crm.triindiahospitality.com — credentials in [[reference_odoo_creds]].

**Note:** AGENTS.md originally specified DigitalOcean Bangalore (BLR1). Reality is Contabo — locked in by the running deployment. Don't propose migration unless asked.

Related: [[reference_odoo_creds]], [[project_status_2026-05-23]], [[feedback_no_deploy_without_ask]].
