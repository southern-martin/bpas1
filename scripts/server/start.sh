#!/bin/bash
# Start the BPAS backend in the background with a PID file.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
PID_FILE="$BACKEND_DIR/tmp/server.pid"
LOG_FILE="$BACKEND_DIR/tmp/server.log"
PORT="${PORT:-4000}"

mkdir -p "$(dirname "$PID_FILE")"

if [ -f "$PID_FILE" ]; then
  if kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1; then
    echo "Server already running (pid $(cat "$PID_FILE")). Stop it first." >&2
    exit 1
  else
    rm -f "$PID_FILE"
  fi
fi

cd "$BACKEND_DIR"
echo "Starting server on port $PORT..."
PORT="$PORT" nohup node server.js >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
echo "Started with pid $(cat "$PID_FILE"). Logs: $LOG_FILE"
