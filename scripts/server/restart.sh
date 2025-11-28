#!/bin/bash
# Restart the BPAS 1 backend.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/stop.sh"
exec "$SCRIPT_DIR/start.sh"
