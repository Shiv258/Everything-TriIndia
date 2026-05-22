#!/usr/bin/env bash
set -uo pipefail

critical_failures=0
warnings=0

check_critical() {
  description="$1"
  shift

  echo "Checking ${description}..."
  if "$@"; then
    echo "PASS: ${description}"
  else
    echo "FAIL: ${description}"
    critical_failures=$((critical_failures + 1))
  fi
}

check_warning() {
  description="$1"
  shift

  echo "Checking ${description}..."
  if "$@"; then
    echo "PASS: ${description}"
  else
    echo "WARN: ${description}"
    warnings=$((warnings + 1))
  fi
}

check_critical "Docker CLI" docker --version
check_critical "Docker Compose plugin" docker compose version

check_critical "Nginx configuration" sudo nginx -t

check_critical "firewall status" sudo ufw status

echo "Checking containers..."
if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; then
  echo "PASS: container listing"
else
  echo "FAIL: container listing"
  critical_failures=$((critical_failures + 1))
fi

check_warning "QloApps on port 8080" curl -I --max-time 10 http://127.0.0.1:8080
check_warning "Odoo HTTP on port 8069" curl -I --max-time 10 http://127.0.0.1:8069
check_warning "Odoo websocket on port 8072" curl -I --max-time 10 http://127.0.0.1:8072
check_warning "Next.js on port 3000" curl -I --max-time 10 http://127.0.0.1:3000

echo "Foundation verification finished with ${critical_failures} critical failure(s) and ${warnings} warning(s)."

if [ "$critical_failures" -gt 0 ]; then
  exit 1
fi
