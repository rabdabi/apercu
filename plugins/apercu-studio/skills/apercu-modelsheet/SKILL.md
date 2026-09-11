---
name: apercu-modelsheet
description: Produce an image-generation prompt pack and human-cleanup checklist for a character model sheet or a new background/prop, strictly bound to the content-bible. Use to create the permanent Emil reference set, or to brief a new canonical asset a storyboard requires.
---

# /apercu-modelsheet — Reference spec

Generate the **briefs and prompts** for canonical visual assets. You do not draw the
final art — you specify it so a human cleans up and commits the canonical version.

## Read first

- `content-bible/characters/<name>.md` (proportions, silhouette, "Never" list) — for a
  character sheet.
- `content-bible/world/palette.md` (exact hex per register).
- `content-bible/world/poor-world.md` / `rich-world.md` and `style/animation-principles.md`
  (line quality, flat fills, imperfect ink).

## For a CHARACTER model sheet (e.g. Emil)

Produce prompts covering the full permanent set from the character file:
front · side · three-quarter · back · the 12 named expressions · the 8 hand poses ·
walk · run · sit · eat · carry · exhausted.

Each prompt must encode: exact proportions (e.g. "4.5 heads tall"), the silhouette keys
(bowl cut, collar, short stature), palette hex, imperfect ink outline, flat gouache
fills — and an explicit **negative list** (no smooth 3D, no vector-clean line, no extra
colours, never change the nose).

## For a BACKGROUND / PROP

One brief per asset: register, palette group, layout constraints, whether it is a
reusable poor-world plate or a bespoke rich-world plate.

## Always output a CLEANUP CHECKLIST

Because generated images are references only:

```
- [ ] Proportions match characters/<name>.md
- [ ] Only palette.md colours present
- [ ] Line is imperfect ink, not vector-clean
- [ ] Silhouette test passes
- [ ] Committed as canonical to content-bible/…/assets or public/episodes/<slug>/
```

## Outputs (commit)

`content-bible/characters/<name>/modelsheet-brief.md` (+ prompt list), or
`episodes/<slug>/assets/<asset>.brief.md`.

## Guardrail

Generated frames are drafts. Only a human promotes a frame to canon after the checklist
passes. Then `/apercu-canon` can validate downstream use against it.
