# Moho MCP operating policy

The `moho-mcp` server (upstream `neosh11/moho-mcp-server` v0.1.0) exposes **26 tools** and
2 resources over file-based JSON-RPC IPC. Setup/recovery: `docs/MOHO-MCP-SETUP.md`.

## Golden rules

1. **Read the live inventory.** Fetch the `moho://tools` resource (and `moho://shortcuts`)
   at runtime for exact, current schemas. **Never invent tool names or parameters.** If the
   installed version differs from this file, the installed tools win.
2. **Prefer structured tools over UI input.** Mouse/keyboard simulation is a last resort.
3. **Rediscover IDs.** layer/bone IDs are session-scoped — re-read them each session.
4. **Batch** 2+ independent ops; never batch `document_screenshot`; don't batch when an
   intermediate visual check matters or a later op depends on an earlier result.

## Tool inventory (categories)

| Area | Tools |
|---|---|
| **Document / inspect** | `document_getInfo`, `document_getLayers`, `document_setFrame`, `document_screenshot` |
| **Layer** | `layer_getProperties`, `layer_getChildren`, `layer_getBones`, `layer_setTransform`, `layer_setVisibility`, `layer_setOpacity`, `layer_setName`, `layer_selectLayer` |
| **Bone** | `bone_getProperties`, `bone_setTransform`, `bone_selectBone` |
| **Animation / keyframes** | `animation_getKeyframes`, `animation_getFrameState`, `animation_setKeyframe`, `animation_deleteKeyframe`, `animation_setInterpolation` |
| **Mesh** | `mesh_getPoints`, `mesh_getShapes` |
| **Input (fallback)** | `input_mouseClick`, `input_mouseDrag`, `input_sendKeys` |
| **Batch** | `batch_execute` |

Resources: `moho://tools` (full schemas), `moho://shortcuts` (Moho keyboard shortcuts).

## Key parameter notes (verify against `moho://tools`)

- Transforms/keyframes are addressed by `layerId` (+ `boneId` for bones) and a `frame`.
- `animation_setInterpolation`: `{ layerId, channel, frame, mode }` where `mode` ∈
  `linear | smooth | ease_in | ease_out | step`. Keyframe `value` shapes vary by channel
  (e.g. `{x,y}` for translation, scalar angle for a bone).
- Inside `batch_execute`, method names use **dot** notation (`bone.setTransform`,
  `layer.getProperties`), not underscores; each op's `params` match that tool's schema.
- `document_screenshot` is heavyweight (~render latency) and cannot appear in a batch.

## Read-only vs. write

- **Read-only** (safe any time): `*_getInfo`, `*_getLayers`, `*_getProperties`,
  `*_getChildren`, `*_getBones`, `animation_get*`, `mesh_get*`, `document_screenshot`.
- **Write** (needs the non-destructive discipline in SKILL.md): `*_setTransform`,
  `*_setVisibility/Opacity/Name`, `animation_setKeyframe/deleteKeyframe/setInterpolation`,
  `document_setFrame`, all `input_*`.

## IPC / connection facts

- Bridge ↔ Moho via JSON files in `$MOHO_MCP_IPC_DIR` (default `<tmp>/moho-mcp`). The Moho
  plugin and bridge must share that directory.
- A tool call errors with "not connected / no status file" until Moho is running with the
  MohoMCP Server started **and** the MohoMCP Poller tool selected. That is a human step —
  see `docs/MOHO-MCP-SETUP.md`.
