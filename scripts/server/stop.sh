#!/bin/bash
# Stop the BPAS backend using the PID file.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
PID_FILE="$BACKEND_DIR/tmp/server.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "No PID file found at $PID_FILE (server not running?)."
  exit 0
fi

PID="$(cat "$PID_FILE")"
if kill -0 "$PID" >/dev/null 2>&1; then
  echo "Stopping server (pid $PID)..."
  kill "$PID"
  rm -f "$PID_FILE"
  echo "Stopped."
else
  echo "Process $PID not running. Cleaning PID file."
  rm -f "$PID_FILE"
fi
