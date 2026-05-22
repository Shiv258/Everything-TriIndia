# TRIINDIA Hospitality Platform - Start Here

## Current Direction

We are building TRIINDIA as a split hospitality platform.

- Next.js is the public premium website and custom integration layer.
- QloApps is the hotel PMS, booking engine, room inventory, rates, and availability source of truth.
- Odoo Community is the CRM for leads, guest history, Kalakar tracking, sales follow-up, and owner reporting.
- Custom code connects Next.js, QloApps, Odoo, Razorpay, WhatsApp, and AI.
- n8n is not hosted for now. If workflows become too complex later, it can be added as a separate decision.

The rule is simple: QloApps controls bookings and availability. Odoo tracks relationships and reporting. Next.js sells the experience.

## Server You Bought

- Provider: Contabo
- IP: 94.136.185.217
- Region: Mumbai, India
- Domain: triindiahospitality.com

Do not paste the root password into chat. Keep it in a password manager.

## DNS Plan

Create these DNS records at your domain provider:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 94.136.185.217 |
| A | www | 94.136.185.217 |
| A | book | 94.136.185.217 |
| A | crm | 94.136.185.217 |

Optional later:

| Type | Name | Value |
| --- | --- | --- |
| A | api | 94.136.185.217 |

## First Server Login

Run this from Windows PowerShell:

```powershell
ssh root@94.136.185.217
```

If it asks `Are you sure you want to continue connecting?`, type:

```txt
yes
```

Then paste the root password you chose during Contabo checkout.

## First Server Commands

Run these after logging in:

```bash
apt update && apt upgrade -y
apt install -y curl git ufw fail2ban nginx certbot python3-certbot-nginx ca-certificates gnupg
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
adduser triindia
usermod -aG sudo triindia
```

After that, log out and log back in as the safer user:

```bash
exit
```

From PowerShell:

```powershell
ssh triindia@94.136.185.217
```

## GitHub Status

GitHub CLI is not logged in locally yet.

Run locally:

```powershell
gh auth login
```

Choose:

- GitHub.com
- HTTPS
- Login with browser

After that, we can create the new GitHub repo from this project.

## QloApps And Odoo Decision

Use QloApps and Odoo together, but do not let them do the same job.

- QloApps: PMS, booking engine, rooms, rates, availability, booking operations.
- Odoo: CRM, leads, guest profiles, repeat tracking, Kalakar tracking, owner reporting.

Do not build another full PMS in Next.js. Next.js can collect leads and provide a premium booking entry point, but QloApps remains the booking source of truth.

## Local Development Commands

Install dependencies:

```bash
npm install
```

Generate database client:

```bash
npm run db:generate
```

Start local Postgres if Docker is installed:

```bash
docker compose -f docker-compose.local.yml up -d
```

Push schema:

```bash
npm run db:push
```

Seed J Residency rooms:

```bash
npm run db:seed
```

Start app:

```bash
npm run dev
```

Test pages:

- `/jresidency`
- `/book/j-residency`
- `/admin`
- `/api/health`

## Build Order

1. Local booking request flow
2. Local admin dashboard
3. GitHub repo
4. Server hardening
5. Server Postgres
6. First production deploy
7. Razorpay payment
8. WhatsApp provider
9. AI WhatsApp agent
10. Manager walk-in form
