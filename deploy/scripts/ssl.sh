#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root."
  exit 1
fi

EMAIL="${CERTBOT_EMAIL:-admin@triindiahospitality.com}"
DOMAINS=(
  triindiahospitality.com
  www.triindiahospitality.com
  book.triindiahospitality.com
  crm.triindiahospitality.com
)

echo "====================================="
echo "  TRIINDIA First SSL Certificate Setup"
echo "====================================="
echo "Using Certbot email: ${EMAIL}"

tmp_site="/etc/nginx/sites-available/triindia-first-cert.conf"
tmp_enabled="/etc/nginx/sites-enabled/triindia-first-cert.conf"
disabled_dir="/etc/nginx/sites-enabled/triindia-disabled-for-first-cert"

mkdir -p "$disabled_dir"

for site in triindia.conf book.conf crm.conf; do
  if [ -L "/etc/nginx/sites-enabled/${site}" ] || [ -e "/etc/nginx/sites-enabled/${site}" ]; then
    mv "/etc/nginx/sites-enabled/${site}" "${disabled_dir}/${site}"
  fi
done

cat > "$tmp_site" <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name triindiahospitality.com www.triindiahospitality.com book.triindiahospitality.com crm.triindiahospitality.com;

    location / {
        return 200 "TRIINDIA certificate bootstrap\n";
        add_header Content-Type text/plain;
    }
}
NGINX

ln -sf "$tmp_site" "$tmp_enabled"
nginx -t
systemctl reload nginx

certbot certonly --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  -d "${DOMAINS[0]}" \
  -d "${DOMAINS[1]}" \
  -d "${DOMAINS[2]}" \
  -d "${DOMAINS[3]}"

rm -f "$tmp_enabled" "$tmp_site"

for site in triindia.conf book.conf crm.conf; do
  if [ -e "${disabled_dir}/${site}" ]; then
    mv "${disabled_dir}/${site}" "/etc/nginx/sites-enabled/${site}"
  fi
done

rmdir "$disabled_dir" 2>/dev/null || true

nginx -t
systemctl reload nginx

echo "====================================="
echo "  SSL Certificates Installed"
echo "====================================="
echo "Certificates issued for: ${DOMAINS[*]}"
echo "Test renewal: certbot renew --dry-run"
