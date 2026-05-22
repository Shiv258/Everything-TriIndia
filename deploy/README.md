# TRIINDIA Hospitality - Deployment Guide

## Architecture

- VPS: Contabo Ubuntu server in Mumbai, IP `94.136.185.217`
- Website: Next.js app reverse-proxied by Nginx
- PMS: QloApps on `book.triindiahospitality.com`
- CRM: Odoo Community on `crm.triindiahospitality.com`
- SSL: Let's Encrypt via Certbot
- Automation: code-first integrations, no hosted n8n for now

QloApps is the booking and availability source of truth. Odoo is the CRM and reporting layer.

## DNS Checklist

Create these A records before SSL setup:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 94.136.185.217 |
| A | www | 94.136.185.217 |
| A | book | 94.136.185.217 |
| A | crm | 94.136.185.217 |

Verify DNS before running Certbot:

```bash
dig +short triindiahospitality.com
dig +short www.triindiahospitality.com
dig +short book.triindiahospitality.com
dig +short crm.triindiahospitality.com
```

Each command should return `94.136.185.217`.

## Install Order

1. Run `deploy/scripts/server-bootstrap.sh` as root.
2. Copy QloApps compose and env files to `/opt/triindia/qloapps`.
3. Copy Odoo compose and env files to `/opt/triindia/odoo`.
4. Start QloApps and Odoo containers.
5. Install and start the Next.js systemd service.
6. Copy Nginx SSL configs into `/etc/nginx/sites-available`, but do not enable them before certificates exist.
7. Run the first-certificate flow for `triindiahospitality.com`, `www.triindiahospitality.com`, `book.triindiahospitality.com`, and `crm.triindiahospitality.com`.
8. Enable the Nginx SSL sites.
9. Run `deploy/scripts/verify-foundation.sh`.

## 1. Bootstrap The VPS

Connect as root:

```bash
ssh root@94.136.185.217
```

Upload this repository or at least the `deploy/` folder, then run the bootstrap script from the repository root:

```bash
chmod +x deploy/scripts/server-bootstrap.sh
./deploy/scripts/server-bootstrap.sh
```

This installs Docker, the Docker Compose plugin, Nginx, Certbot, UFW, and Fail2ban. It also creates these directories:

```txt
/opt/triindia/qloapps
/opt/triindia/odoo
/opt/triindia/app
/opt/triindia/backups
```

After bootstrap, log out and back in as `triindia` before running Docker commands.

## 2. Prepare QloApps

Copy the compose file and environment template:

```bash
sudo cp deploy/docker/qloapps-compose.yml /opt/triindia/qloapps/docker-compose.yml
sudo cp deploy/env/qloapps.env.example /opt/triindia/qloapps/.env
sudo chown -R triindia:triindia /opt/triindia/qloapps
```

Edit `/opt/triindia/qloapps/.env` and replace every `change_this` value before startup:

```bash
nano /opt/triindia/qloapps/.env
```

Start QloApps:

```bash
cd /opt/triindia/qloapps
docker compose up -d
```

QloApps listens on `127.0.0.1:8080`. Nginx publishes it at `https://book.triindiahospitality.com`.

## 3. Prepare Odoo

Copy the compose file and environment template:

```bash
sudo cp deploy/docker/odoo-compose.yml /opt/triindia/odoo/docker-compose.yml
sudo cp deploy/env/odoo.env.example /opt/triindia/odoo/.env
sudo mkdir -p /opt/triindia/odoo/addons
sudo chown -R triindia:triindia /opt/triindia/odoo
```

Edit `/opt/triindia/odoo/.env` and replace every `change_this` value before startup:

```bash
nano /opt/triindia/odoo/.env
```

Start Odoo:

```bash
cd /opt/triindia/odoo
docker compose up -d
```

Odoo listens on `127.0.0.1:8069` and websocket traffic on `127.0.0.1:8072`. Nginx publishes it at `https://crm.triindiahospitality.com`.

## 4. Run The Next.js Website

Deploy the Next.js app into `/opt/triindia/app` and run it as a server process on `127.0.0.1:3000`. Nginx expects the website to be available on that local port.

Minimum production flow from the app directory:

```bash
cd /opt/triindia/app
npm ci
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Install the provided systemd unit so the Next.js process survives SSH disconnects and server restarts:

```bash
sudo cp deploy/systemd/triindia-platform.service /etc/systemd/system/triindia-platform.service
sudo systemctl daemon-reload
sudo systemctl enable triindia-platform
sudo systemctl start triindia-platform
sudo systemctl status triindia-platform --no-pager
```

The service runs from `/opt/triindia/app`, loads `/opt/triindia/app/.env`, and starts Next.js with `--hostname 127.0.0.1 --port 3000` so it only listens behind Nginx.

## 5. Copy Nginx SSL Configs

Copy the Nginx configs:

```bash
sudo cp deploy/nginx/triindia.conf /etc/nginx/sites-available/triindia.conf
sudo cp deploy/nginx/book.conf /etc/nginx/sites-available/book.conf
sudo cp deploy/nginx/crm.conf /etc/nginx/sites-available/crm.conf
```

Do not enable these configs until certificates exist. They reference `/etc/letsencrypt/live/...` paths and `nginx -t` will fail before the first certificates are issued.

## 6. Issue First SSL Certificates

Run Certbot after DNS points to `94.136.185.217`.

Primary supported flow:

```bash
sudo env CERTBOT_EMAIL=admin@triindiahospitality.com deploy/scripts/ssl.sh
```

`deploy/scripts/ssl.sh` is the first-certificate helper. It temporarily disables any enabled TRIINDIA SSL configs, installs a temporary HTTP-only Nginx server for all four domains, runs `certbot certonly --nginx`, restores the TRIINDIA configs, and reloads Nginx after `nginx -t` passes.

Manual equivalent if you do not use the helper:

1. Ensure no SSL config that references missing certificate files is enabled.
2. Enable a temporary HTTP-only Nginx server block for `triindiahospitality.com`, `www.triindiahospitality.com`, `book.triindiahospitality.com`, and `crm.triindiahospitality.com`.
3. Run:

```bash
sudo certbot certonly --nginx \
  -d triindiahospitality.com \
  -d www.triindiahospitality.com \
  -d book.triindiahospitality.com \
  -d crm.triindiahospitality.com
```

4. Remove the temporary HTTP-only config.
5. Enable the checked-in SSL configs.

Enable the SSL configs after certificates exist:


```bash
sudo ln -sf /etc/nginx/sites-available/triindia.conf /etc/nginx/sites-enabled/triindia.conf
sudo ln -sf /etc/nginx/sites-available/book.conf /etc/nginx/sites-enabled/book.conf
sudo ln -sf /etc/nginx/sites-available/crm.conf /etc/nginx/sites-enabled/crm.conf
sudo nginx -t
sudo systemctl reload nginx
```

Confirm renewal is installed:

```bash
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

## 7. Verify The Foundation

Run the verification script from the repository root:

```bash
chmod +x deploy/scripts/verify-foundation.sh
./deploy/scripts/verify-foundation.sh
```

The script checks Docker, Docker Compose, Nginx syntax, UFW, running containers, and local service ports for QloApps, Odoo, Odoo websocket, and Next.js.

Manual smoke checks:

```bash
curl -I https://triindiahospitality.com
curl -I https://book.triindiahospitality.com
curl -I https://crm.triindiahospitality.com
docker ps
sudo nginx -t
```

## Useful Commands

```bash
# QloApps logs
cd /opt/triindia/qloapps
docker compose logs -f

# Odoo logs
cd /opt/triindia/odoo
docker compose logs -f

# Restart QloApps
cd /opt/triindia/qloapps
docker compose restart

# Restart Odoo
cd /opt/triindia/odoo
docker compose restart

# Reload Nginx after config changes
sudo nginx -t
sudo systemctl reload nginx

# Renew SSL manually
sudo certbot renew
```

## Troubleshooting

### DNS Does Not Resolve

Recheck the four A records in the DNS checklist and wait for propagation. Certbot will fail until each domain resolves to `94.136.185.217`.

### Nginx Fails Before SSL Exists

The checked-in Nginx configs are SSL configs and intentionally reference certificate paths. Do not enable them before first certificate issuance. Use `deploy/scripts/ssl.sh` or a temporary HTTP-only config, issue certificates with `certbot certonly --nginx`, then enable the SSL configs.

### QloApps Or Odoo Is Not Reachable

Check containers and local ports first:

```bash
docker ps
curl -I http://127.0.0.1:8080
curl -I http://127.0.0.1:8069
curl -I http://127.0.0.1:8072
```

### Website Is Not Reachable

Confirm the Next.js process is running on `127.0.0.1:3000`:

```bash
curl -I http://127.0.0.1:3000
```

## File Map

```txt
deploy/
├── docker/
│   ├── docker-compose.yml          # Legacy Odoo compose, not used by this foundation flow
│   ├── platform-postgres.yml       # Optional platform database compose for later app features
│   ├── qloapps-compose.yml
│   └── odoo-compose.yml
├── .env.example                    # Legacy deploy env template, not used by QloApps/Odoo foundation flow
├── env/
│   ├── qloapps.env.example
│   └── odoo.env.example
├── nginx/
│   ├── triindia.conf
│   ├── book.conf
│   └── crm.conf
├── scripts/
│   ├── ssl.sh                      # First-certificate helper for all production domains
│   ├── server-bootstrap.sh
│   └── verify-foundation.sh
├── systemd/
│   └── triindia-platform.service   # Next.js service bound to 127.0.0.1:3000
└── README.md
```
