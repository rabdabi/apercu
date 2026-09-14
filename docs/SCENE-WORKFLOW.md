# Scene workflow

How Claude (via the `apercu-animation` skill) turns one entry in an episode's
`moho-scenes.json` into a finished, reviewed Moho shot. This is the OBSERVE → PLAN →
EXECUTE → RENDER → REVIEW → CORRECT → VERIFY → SAVE loop, made concrete.

## 1. Read the plan (OBSERVE, off-Moho)

- `episodes/<slug>/moho-scenes.json` — the shot entry (`id`, `location`, `register`,
  `camera`, `backgrounds`, `characters`, `action`, `holdFrames`). Schema:
  `plugins/apercu-studio/skills/apercu-animation/references/scene-schema.md`.
- `episodes/<slug>/shotlist.md` and `canon-report.md` (must be STATUS/PASS).
- Canon for every character in the shot (`content-bible/characters/*`), plus
  `world/camera-grammar.md` and `world/motion-language.md`.

## 2. Prepare the scene file (non-destructive)

- Copy the relevant master(s) from `animation/moho/masters/` into
  `animation/moho/scenes/<slug>-<id>.moho`. **Never open a master to animate.**
- Add backgrounds/props for the shot (built from `episodes/<slug>/assets/*.brief.md`).

## 3. Inspect the live rig (OBSERVE, in Moho)

With Moho running and MohoMCP connected (`docs/MOHO-MCP-SETUP.md`):
`document_getInfo` → `document_getLayers` → `layer_getBones` on the character layer →
`animation_getKeyframes` → note existing reusable Actions. **Rediscover IDs — never reuse
remembered ones.**

## 4. Plan key poses (PLAN)

From the shot's `action`, choose key poses from the character's `poses.yaml`/`actions.yaml`
and place them on a timeline: anticipation → action → settle → hold. Respect `holdFrames`
and the on-2s feel. Decide the camera move (default static; motivated `PUSH`/`PAN` only).

## 5. Apply keys (EXECUTE)

Set keyframes via `animation_setKeyframe` / `bone_setTransform` / `layer_setTransform`;
set interpolation with `animation_setInterpolation` (`step` for held/graphic, `linear` for
mechanical, `smooth`/`ease_*` for selected organic/camera). **Batch** related independent
keyframes with `batch_execute`; do **not** batch when you need to look between steps.

## 6. Capture & review (RENDER → REVIEW)

`document_setFrame` + `document_screenshot` at representative frames (start · anticipation ·
extreme · settle · final) → save to `animation/renders/previews/`. **Look at them.** Check
silhouette, proportions, timing, continuity, camera.

## 7. Correct, verify, save (CORRECT → VERIFY → SAVE)

Fix what reads wrong and re-render. Verify layers/bones/actions intact and proportions
on-model. Save into the **scene copy** only. Approved renders → `animation/renders/finals/`.

## Per-shot notes (optional)

If a shot needs more direction than the manifest holds, add
`episodes/<slug>/scene-notes/<id>.md` (human-readable prose, not a new DSL). The
`moho-scenes.json` entry stays the machine-facing source.
