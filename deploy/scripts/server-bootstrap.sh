#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root."
  exit 1
fi

RUN_APT_UPGRADE="${RUN_APT_UPGRADE:-0}"

apt update
if [ "$RUN_APT_UPGRADE" = "1" ]; then
  apt upgrade -y
else
  echo "Skipping apt upgrade. Run with RUN_APT_UPGRADE=1 to enable it."
fi
apt install -y curl git ufw fail2ban nginx certbot python3-certbot-nginx ca-certificates gnupg lsb-release

if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "$tmp_dir"' EXIT
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o "$tmp_dir/docker.gpg"
  install -m 0644 "$tmp_dir/docker.gpg" /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
  apt update
  apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

if ! id triindia >/dev/null 2>&1; then
  if [ ! -t 0 ]; then
    echo "The triindia user does not exist and this script is running without an interactive TTY."
    echo "Run this script from an interactive root shell so adduser can set the triindia password before firewall changes."
    exit 1
  fi
  adduser --gecos "TRIINDIA deploy user" triindia
fi
usermod -aG sudo,docker triindia

ufw allow OpenSSH
ssh_ports="22"
if command -v sshd >/dev/null 2>&1; then
  ssh_ports="${ssh_ports}
$(sshd -T 2>/dev/null | awk '/^port / {print $2}')"
fi
if [ -n "${SSH_CONNECTION:-}" ]; then
  ssh_ports="${ssh_ports}
$(printf '%s\n' "$SSH_CONNECTION" | awk '{print $4}')"
fi

printf '%s\n' "$ssh_ports" | awk '/^[0-9]+$/ && !seen[$1]++ {print $1}' | while read -r ssh_port; do
  if [ -n "$ssh_port" ]; then
    ufw allow "${ssh_port}/tcp"
  fi
done
ufw allow 'Nginx Full'
ufw --force enable

install -d -o triindia -g triindia /opt/triindia/qloapps /opt/triindia/odoo /opt/triindia/app /opt/triindia/backups

systemctl enable docker nginx fail2ban
systemctl start docker nginx fail2ban

echo "Bootstrap complete. Log out and back in as triindia before running Docker commands."
