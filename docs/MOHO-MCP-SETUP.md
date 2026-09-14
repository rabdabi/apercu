# Moho MCP — setup & recovery

_Last updated: 2026-09-13. This doc lets a cold Claude session recover the whole Moho
integration without conversation history._

## What this is

A local bridge that lets Claude Code drive **Moho Pro 14** as an authored 2D-animation
tool. It is **not** AI video generation — Claude inspects and animates a permanent
character rig. Chain:

```
Claude Code  →  apercu-animation skill (judgement)  →  moho-mcp server (hands)
             →  Moho Lua plugin  →  Moho Pro 14  →  render/export  →  website
```

## Implementation (pinned)

| Field | Value |
|---|---|
| Upstream repo | `neosh11/moho-mcp-server` (adapted from `Kveto/MohoMCP`) |
| Commit installed | **`8e1925d904c94fcf5b3c6fc8ed2b264fc9991c0f`** (2026-08-07), release **v0.1.0** |
| License | **Apache-2.0** (portions MIT — see `tools/moho-mcp/THIRD_PARTY_NOTICES.md`) |
| Location | `tools/moho-mcp/` — **git-ignored** (not vendored in-tree); reproduced by clone + build |
| Bridge entry | `tools/moho-mcp/dist/moho-mcp-server.mjs` (built via `npm run build`) |
| Node bridge | 26 MCP tools + `moho://tools`, `moho://shortcuts` resources |
| IPC | file-based JSON-RPC in `$MOHO_MCP_IPC_DIR` (default `<tmp>/moho-mcp`) |
| Install date | 2026-09-13 |
| Moho found | Moho **14.4** at `/Applications/Moho.app` (Apple Silicon, macOS 26.6) |

### Security review (of commit `8e1925d`) — PASS

Reviewed before build/install:
- **No network at runtime.** No `fetch`/http/socket in the Node bridge or the Lua plugin.
  The only URLs in the source are documentation citations in `src/resources.ts`.
- **Child processes** (Node) are macOS built-ins via `execFile` with array args (no shell
  string interpolation): `osascript`, `cliclick`, `screencapture`, `sips`; plus one
  `spawn` for the keep-alive (`osascript`). No `eval`, no remote code.
- **Lua plugin** uses `io.popen` only for `mkdir -p` and listing `req_*.json` inside the
  IPC temp dir; no `os.execute`, no network, no credential access. File I/O confined to
  the IPC dir and a temp screenshot file; `os.remove` only on IPC/temp files.
- **No credential access, no shell persistence** (no login items / launchd / cron), **no
  destructive commands** on user data.
- **Installer** writes only into Moho's own `Scripts/{Menu/MohoMCP,Tool}` dirs and makes
  one idempotent append to `_tool_list.txt`. It touches no unrelated Moho scripts.

### Files copied into Moho (`/Applications/Moho.app/Contents/Resources/Support/Scripts/`)

```
Menu/MohoMCP/MohoMCP_Server.lua
Menu/MohoMCP/json.lua
Menu/MohoMCP/moho_mcp/{server,protocol,validator}.lua
Menu/MohoMCP/moho_mcp/tools/{document,layer,bone,animation,mesh,batch}.lua
Tool/MohoMCP_Poller.lua
Tool/_tool_list.txt        ← one appended line registering MohoMCP_Poller
```

Installed by `tools/install-moho-plugin.sh` (a path-corrected wrapper — see note below).
Re-run it any time to reinstall/update.

> **Why a wrapper, not the upstream `install-plugin.sh`?** Upstream hardcodes
> `/Applications/Moho 14/Moho Pro.app/...` and exits with an error on this machine, whose
> app is `/Applications/Moho.app`. `tools/install-moho-plugin.sh` auto-detects the bundle
> and copies exactly the same file set (no sudo — the bundle is user-owned).

## Claude Code configuration

`/.mcp.json` (project scope, no secrets):

```json
{ "mcpServers": { "moho-mcp": {
  "command": "node",
  "args": ["/Users/raberer/dev_rab/apercutechno27/tools/moho-mcp/dist/moho-mcp-server.mjs"] } } }
```

`args` is an absolute path so the server launches regardless of Claude Code's cwd.
If the repo moves, update this path and `tools/install-moho-plugin.sh` will still find Moho.

## MANUAL ACTION REQUIRED

These need you (a human) at macOS / Moho. Everything else is already done.

1. **App Management permission** — granting Claude Code (its host app/terminal) permission
   to modify `/Applications/Moho.app` was required to install the plugin. ✅ _Granted
   2026-09-13._ (System Settings ▸ Privacy & Security ▸ App Management.) Needed again only
   if you reinstall the plugin from a different app.
2. **Accessibility permission** — for simulated mouse/keyboard (`input_*` tools) and
   `cliclick`. Grant it to the app that launches the MCP server (Claude Code / its
   terminal): **System Settings ▸ Privacy & Security ▸ Accessibility ▸ enable it.**
   Read-only inspection and screenshots work without this; only UI-input tools need it.
3. **Restart Claude Code** so it discovers the new `.mcp.json` (see verification below).
4. **Start MohoMCP inside Moho**, each session:
   1. Open Moho Pro 14 and load (or create) a project.
   2. **Scripts ▸ MohoMCP ▸ Start/Stop MohoMCP Server**.
   3. Select the **MohoMCP Poller** tool from the toolbar (last tool group). While it is
      selected, Moho polls for requests. A keep-alive keeps the viewport refreshing.

## Start a working session

1. Moho running, MohoMCP Server started, Poller tool selected (step 4 above).
2. In Claude Code, invoke the **`apercu-animation`** skill.
3. First do read-only checks (proves the connection): `document_getInfo`,
   `document_getLayers`, current frame; then `document_screenshot`.

## Verify

- **MCP discovered:** `claude mcp list` should list `moho-mcp`. (Requires the Claude Code
  restart above.)
- **Bundle sane (no Moho needed):** the server starts and lists 26 tools over stdio.
- **Live connection:** a `document_getInfo` call returns the real document name /
  resolution / fps / frame range. If it errors "not connected / no status file", Moho
  isn't running the server or the Poller tool isn't selected.

## Common failures

| Symptom | Cause / fix |
|---|---|
| `not connected` / `no status file` | MohoMCP Server not started, or Poller tool not selected in Moho. |
| Requests time out after ~10 s | Poller not the active tool, or viewport not repainting — reselect the Poller. |
| `input_*` do nothing / cliclick warns | Accessibility permission not granted (manual step 2). |
| Plugin missing from Scripts menu | Re-run `bash tools/install-moho-plugin.sh`; restart Moho. |
| `mkdir … Operation not permitted` during install | App Management permission not granted (manual step 1). |
| `moho-mcp` absent from `claude mcp list` | Claude Code not restarted after `.mcp.json`, or JSON invalid (`node -e 'require("./.mcp.json")'`). |

## Update safely

```bash
git -C tools/moho-mcp pull          # review the diff first
cd tools/moho-mcp && npm install && npm run build && cd -
bash tools/install-moho-plugin.sh   # re-copy the Lua plugin
```
Then restart Moho and Claude Code. Record the new commit SHA in this file. Re-run the
security review checklist above on any upstream change before trusting it.
