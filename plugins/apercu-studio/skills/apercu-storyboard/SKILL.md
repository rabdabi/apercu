---
name: apercu-storyboard
description: Turn a canon-passed Aperçu script into a shot list, an LTX Studio animatic prompt pack, and a Moho scene manifest. Use after /apercu-story and /apercu-canon PASS, to prepare an episode for animatic and production.
---

# /apercu-storyboard — Shot breakdown

Prepare an episode for the animatic and for Moho production. Run only after
`canon-report.md` is STATUS / PASS.

## Read first

- `episodes/<slug>/script.md` and `beats.md`.
- `content-bible/world/camera-grammar.md` (shot tokens, allowed moves).
- `content-bible/world/poor-world.md` + `rich-world.md` (register per scene).
- `content-bible/world/motion-language.md` (holds, timing).

## Produce

1. **`shotlist.md`** — one row per shot:
   `NN · SZENE · REGISTER(poor|rich) · CAMERA(WIDE|MED|CLOSE|INSERT|PAN-L|PAN-R|PUSH|CARD) ·
   backgrounds · characters · action · hold(frames) · duration`.
   Respect camera-grammar (poor = mostly static; rich = slow deliberate moves).

2. **`ltx-brief.md`** — an LTX Studio prompt pack to build the animatic: reusable
   Characters/Objects/Locations (Elements), per-shot prompts, visual references, and
   camera/keyframe notes. LTX is for **planning/timing only** — never the final look.

3. **`moho-scenes.json`** — the machine manifest the animator imports (schema as in
   `episodes/_template/moho-scenes.json`): fps 24, feel "animate-on-2s", scenes[] with
   id, location, register, camera, backgrounds, characters, action, holdFrames.

## Rules

- Every camera move must land on a beat; no move for its own sake.
- Flag any shot that needs a **new** background/prop so `/apercu-modelsheet` can brief it.
- Keep the shot count honest to the target runtime.

## Outputs (commit)

`episodes/<slug>/shotlist.md` · `ltx-brief.md` · `moho-scenes.json`

## Hand-off

New assets → `/apercu-modelsheet`. Otherwise → Moho (human animation).
