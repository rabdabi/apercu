#!/bin/bash
# moho-keepalive.sh — hands-free polling helper for MohoMCP on macOS.
#
# WHY: the MohoMCP Lua plugin only processes Claude's commands while Moho's
# viewport is repainting (its poll runs inside tool DrawMe / menu IsEnabled
# callbacks). macOS throttles background apps and Moho 14.4's self-refresh does
# not sustain repaints, so requests stall unless something drives the viewport.
# This script nudges Moho's canvas ~2x/sec so polling stays alive without you
# having to scribble by hand.
#
# REQUIREMENTS
#   1. cliclick            → brew install cliclick
#   2. Accessibility        → System Settings ▸ Privacy & Security ▸ Accessibility
#      granted to the TERMINAL APP you run this from (Terminal.app / iTerm).
#      A normal /Applications terminal is far easier to authorize than Claude's
#      nested helper app. Verify with:  cliclick p   (must print coordinates).
#
# TRADE-OFF: each tick the mouse cursor briefly hops into the Moho window and
# back. Run this only during a Claude↔Moho working session; Ctrl-C to stop.
# It never clicks — it only moves the cursor, so it cannot edit your artwork.
#
# STATUS: written 2026-09-15; validate the first time you have Accessibility
# actually active (see docs/MOHO-MCP-SETUP.md → "macOS polling").
set -u

command -v cliclick >/dev/null 2>&1 || { echo "cliclick not found → brew install cliclick"; exit 1; }
if ! cliclick p >/dev/null 2>&1; then
  echo "This terminal lacks Accessibility permission."
  echo "Grant it: System Settings ▸ Privacy & Security ▸ Accessibility ▸ enable your terminal app, then rerun."
  exit 1
fi

# Locate the Moho window (position + size) via JXA.
read -r WX WY WW WH < <(osascript -l JavaScript -e '
try {
  const se = Application("System Events");
  const p = se.processes.byName("Moho");
  const w = p.windows[0];
  const pos = w.position(); const sz = w.size();
  `${Math.round(pos[0])} ${Math.round(pos[1])} ${Math.round(sz[0])} ${Math.round(sz[1])}`;
} catch (e) { "" }' 2>/dev/null)

if [ -z "${WX:-}" ]; then
  echo "Could not find the Moho window. Is Moho running and not minimized?"
  exit 1
fi

# A point near the middle of the canvas.
CX=$(( WX + WW/2 )); CY=$(( WY + WH/2 ))
INT=${1:-0.5}   # seconds between nudges (default 0.5)

echo "MohoMCP keep-alive: nudging Moho canvas at ($CX,$CY) every ${INT}s. Ctrl-C to stop."
trap 'echo; echo "keep-alive stopped."; exit 0' INT TERM

while true; do
  # Save the current cursor, nudge inside Moho (two moves = a mouseMoved event), restore.
  read -r PX PY < <(cliclick p 2>/dev/null | tr ',' ' ')
  cliclick "m:${CX},${CY}" "m:$((CX+3)),${CY}" >/dev/null 2>&1
  if [ -n "${PX:-}" ]; then cliclick "m:${PX},${PY}" >/dev/null 2>&1; fi
  sleep "$INT"
done
