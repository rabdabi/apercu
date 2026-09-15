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
  "args": ["/Users/raberer/dev_rab/apercutechno27/tools/moho-mcp/dist/moho-mcp-server.mjs"],
  "env": { "MOHO_MCP_IPC_DIR": "/var/folders/2w/vm6mp76j4_50khbb14tl0fx00000gn/T/moho-mcp" } } } }
```

`args` is an absolute path so the server launches regardless of Claude Code's cwd.
If the repo moves, update this path and `tools/install-moho-plugin.sh` will still find Moho.

**Why the `env.MOHO_MCP_IPC_DIR`? (critical fix, 2026-09-15):** the bridge picks its IPC
folder from Node's `os.tmpdir()`, which returns `/tmp` when `TMPDIR` is unset in the
bridge's launch environment — but the Moho Lua plugin uses Moho's own `TMPDIR`
(`$(getconf DARWIN_USER_TEMP_DIR)/moho-mcp`, e.g.
`/var/folders/2w/…/T/moho-mcp`). If they differ, the bridge writes requests to a folder
Moho never reads → every call fails with "MOHO MCP server is not running. No status file".
Pinning `MOHO_MCP_IPC_DIR` to Moho's folder forces both sides to agree. The value is this
user's stable Darwin per-user temp (persists across reboots); confirm with
`getconf DARWIN_USER_TEMP_DIR`. This must also match what the console prints on
"MohoMCP Server started. IPC directory: …" (a harmless double slash there is the same path).

**Single registration.** `moho-mcp` must be defined once. A parallel session had also
registered it at **user scope** pointing at a second clone (`~/mcp-servers/MohoMCP`,
`Kveto/MohoMCP`); that was removed (`claude mcp remove moho-mcp -s user`) so only the
project-scope neosh11 bridge remains — the one whose Lua plugin is actually installed in
Moho. Do not run two bridges against the same IPC dir (they collide on request IDs).

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

## macOS polling — known issue & operating modes (2026-09-15)

**Symptom:** the connection is correct (folder shared, `status.json running:true`, console
shows all handlers + `Injected polling into 21 tool DrawMe callbacks`), yet tool calls time
out — a request file (`req_<id>.json`) is written but **never consumed**.

**Cause:** the plugin only calls `poll()` from Moho tool `DrawMe` callbacks and the Server
menu's `IsEnabled` — all **viewport-repaint / UI-validation driven**. On macOS, background
apps are throttled and Moho 14.4's `moho:UpdateUI()` does not reliably self-sustain repaints,
so the poll loop stalls unless Moho is actively generating repaints. This is an upstream
limitation (commit `8e1925d`, no fix upstream), not a config error in this repo.

**Verified working once:** a `document.getInfo` returned real data
(`Untitled.moho`, 1200×1224, 24fps, frames 1–143) while the user was actively moving the
mouse in the canvas — so the pipeline is sound; the open problem is *keeping the poller fed*.

**Operating modes:**
- **Manual (no extra permission):** keep the mouse actively moving/dragging **inside the
  Moho canvas** while a tool call runs. Batch operations (`batch_execute`) so one interaction
  window covers many ops. Fragile but needs nothing installed.
- **Hands-free (needs Accessibility):** run **`tools/moho-keepalive.sh`** from a terminal
  that has Accessibility permission (Terminal.app / iTerm are far easier to authorize than
  Claude's nested helper app). It nudges Moho's canvas ~2×/sec via `cliclick` so the poller
  stays fed with zero manual scribbling; Ctrl-C to stop. The cursor briefly hops into the
  Moho window each tick (it only *moves*, never clicks), so run it during a working session.
  The bridge also ships a built-in keep-alive, but its macOS path is buggy (an `on idle`
  handler that `osascript` never loops) — the standalone script supersedes it. Confirmed
  fact: when Moho *is* being fed repaints (real scribbling), calls return in ~1s — so this
  script is the reliable way to sustain that automatically.

**Accessibility — which app:** the process tree is
`zsh → …/claude-code/<ver>/claude.app → /Applications/Claude.app/Contents/Helpers/disclaimer
→ /Applications/Claude.app`. macOS attributes TCC to the top app, so enable
**`/Applications/Claude.app`** in System Settings ▸ Privacy & Security ▸ Accessibility, then
**fully Quit (⌘Q) and reopen** the app (a new grant never applies to an already-running
process). Verify instantly (no Moho needed) with `cliclick p` — it must print coordinates,
not the "Accessibility privileges not enabled" warning. Caveat: the helper path is
version-stamped (`claude-code/<ver>/claude.app`), so a Claude Code auto-update can reset the
grant; re-add if `cliclick` starts failing after an update.

**Diagnose from the filesystem (no GUI needed):**
```bash
D="$(getconf DARWIN_USER_TEMP_DIR)moho-mcp"
cat "$D/status.json"                 # {"running":true,...} => server started
printf '%s' '{"jsonrpc":"2.0","id":1,"method":"document.getInfo","params":{}}' > "$D/req_1.json"
sleep 5; ls "$D/req_1.json" 2>/dev/null && echo "NOT consumed (poller idle)" || cat "$D/resp_1.json"
```

## Update safely

```bash
git -C tools/moho-mcp pull          # review the diff first
cd tools/moho-mcp && npm install && npm run build && cd -
bash tools/install-moho-plugin.sh   # re-copy the Lua plugin
```
Then restart Moho and Claude Code. Record the new commit SHA in this file. Re-run the
security review checklist above on any upstream change before trusting it.
