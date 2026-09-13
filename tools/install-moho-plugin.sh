#!/bin/bash
# Aperçu — Moho MCP Lua plugin installer (path-corrected wrapper)
#
# Why this exists: upstream tools/moho-mcp/install-plugin.sh hardcodes
#   /Applications/Moho 14/Moho Pro.app/...
# but Moho 14.4 on this machine installs as /Applications/Moho.app.
# This wrapper auto-detects the real bundle and copies exactly the same
# files as the reviewed upstream installer (SHA 8e1925d). No sudo: the
# bundle is user-owned. It never touches unrelated Moho scripts.
#
# Re-run any time to reinstall/update after `git -C tools/moho-mcp pull`.
set -euo pipefail

echo "============================================"
echo " Aperçu MohoMCP Plugin Installer (macOS)"
echo "============================================"

SRC="$(cd "$(dirname "$0")" && pwd)/moho-mcp/moho-plugin"
if [ ! -d "$SRC" ]; then
    echo "ERROR: plugin source not found at $SRC" >&2
    echo "Clone/build first: gh repo clone neosh11/moho-mcp-server tools/moho-mcp" >&2
    exit 1
fi

# Auto-detect the Moho application bundle.
APP=""
for candidate in \
    "/Applications/Moho.app" \
    "/Applications/Moho 14/Moho Pro.app" \
    "/Applications/Moho Pro.app"; do
    if [ -d "$candidate/Contents/Resources/Support/Scripts" ]; then
        APP="$candidate"
        break
    fi
done
if [ -z "$APP" ]; then
    echo "ERROR: could not find a Moho install with a Scripts directory." >&2
    echo "Edit APP candidates in this script to point at your Moho.app." >&2
    exit 1
fi
echo "Moho bundle: $APP"

SCRIPTS="$APP/Contents/Resources/Support/Scripts"
DEST="$SCRIPTS/Menu/MohoMCP"
TOOL_DEST="$SCRIPTS/Tool"

echo "Creating directories..."
mkdir -p "$DEST/moho_mcp/tools"

echo "Copying main script and JSON library..."
cp -f "$SRC/MohoMCP_Server.lua" "$DEST/MohoMCP_Server.lua"
cp -f "$SRC/json.lua"           "$DEST/json.lua"

echo "Copying core modules..."
cp -f "$SRC/moho_mcp/server.lua"    "$DEST/moho_mcp/server.lua"
cp -f "$SRC/moho_mcp/protocol.lua"  "$DEST/moho_mcp/protocol.lua"
cp -f "$SRC/moho_mcp/validator.lua" "$DEST/moho_mcp/validator.lua"

echo "Copying tool handlers..."
for t in document layer bone animation mesh batch; do
    cp -f "$SRC/moho_mcp/tools/$t.lua" "$DEST/moho_mcp/tools/$t.lua"
done

echo "Copying MohoMCP Poller tool script..."
cp -f "$SRC/MohoMCP_Poller.lua" "$TOOL_DEST/MohoMCP_Poller.lua"

echo "Registering tool in tool list..."
if ! grep -q "MohoMCP_Poller" "$TOOL_DEST/_tool_list.txt" 2>/dev/null; then
    printf 'tool\tMohoMCP_Poller\t...\n' >> "$TOOL_DEST/_tool_list.txt"
    echo "  Added MohoMCP_Poller to _tool_list.txt"
else
    echo "  MohoMCP_Poller already registered"
fi

echo ""
echo "Verifying installation..."
find "$DEST" -type f | sort
ls -la "$TOOL_DEST/MohoMCP_Poller.lua"

echo ""
echo "============================================"
echo " Installation complete."
echo "============================================"
echo "Next: open Moho > Scripts > MohoMCP > Start/Stop MohoMCP Server,"
echo "then select the 'MohoMCP Poller' tool from the toolbar."
echo "macOS may require Accessibility permission for input simulation."
