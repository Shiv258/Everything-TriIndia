#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "deploy/scripts/setup.sh is deprecated. Use deploy/scripts/server-bootstrap.sh instead."
echo "Forwarding to server-bootstrap.sh..."

exec "${script_dir}/server-bootstrap.sh" "$@"
