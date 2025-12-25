#!/bin/bash

FILES="main.hs shoggothstaring.cabal"
RESTART_DELAY=1
WATCH_PIDS=""

log_path() {
  local name=$1
  echo "/tmp/${name}-${$}.log" # Use /tmp and the script's PID for unique, temporary logs
}

run_watchers() {
  cabal run shoggothstaring rebuild
  notify-send "Compiled"

  # Redirect all output to log files
  local CABAL_LOG=$(log_path "cabal-watch")
  cabal run shoggothstaring watch -- --no-server >$CABAL_LOG 2>&1 &
  CABAL_PID=$!

  local SUPERSTATIC_LOG=$(log_path "superstatic")
  npx superstatic _site --config '{"cleanUrls": true}' >$SUPERSTATIC_LOG 2>&1 &
  SUPERSTATIC_PID=$!

  echo "$CABAL_PID $SUPERSTATIC_PID"
}

print_logs() {
  local cabal_log=$(log_path "cabal-watch")
  local superstatic_log=$(log_path "superstatic")

  echo "-------------------------------------"
  echo "--- Cabal Watch Output ($cabal_log) ---"
  [ -f "$cabal_log" ] && cat "$cabal_log"
  echo "-------------------------------------"
  echo "--- Superstatic Output ($superstatic_log) ---"
  [ -f "$superstatic_log" ] && cat "$superstatic_log"
  echo "-------------------------------------"
}

kill_pid() {
  local pids=$1
  [ -z "$pids" ] && return
  echo "Stopping processes..."
  kill -TERM $pids 2>/dev/null

  # Aggressively kill wrappers/children (necessary for cabal and npx)
  pkill -f 'shoggothstaring watch' 2>/dev/null
  pkill -f 'superstatic' 2>/dev/null

  wait $pids 2>/dev/null
  echo "Cleanup complete."
}

cleanup() {
  kill_pid "$WATCH_PIDS"
  # Clean up log files on exit
  rm -f $(log_path "cabal-watch") $(log_path "superstatic") 2>/dev/null
  exit 0
}

trap cleanup INT TERM

echo "Starting cabal build/watch cycle..."

while true; do
  PIDS=$(run_watchers)
  WATCH_PIDS=$PIDS
  echo "Running commands with PIDS: $WATCH_PIDS"

  print_logs # Show the initial output immediately

  echo "Watching for changes in $FILES..."
  inotifywait -e close_write,delete,move -q $FILES

  if [ ! -z "$WATCH_PIDS" ]; then
    echo "File change detected."
    kill_pid "$WATCH_PIDS"
  fi

  WATCH_PIDS=""
  echo "Restarting in $RESTART_DELAY second(s)..."
  sleep $RESTART_DELAY
done
