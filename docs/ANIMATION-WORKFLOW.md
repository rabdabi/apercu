# Animation workflow

End-to-end path from idea to a clip on the website. It reuses the existing Aperçu pipeline
(`content-bible/`, `episodes/`, `plugins/apercu-studio/`) and adds the Moho production
stage. Nothing here replaces the story-side skills; it plugs Moho onto the end.

```
idea
 → script            /apercu-story        → episodes/<slug>/script.md, beats.md
 → canon check       /apercu-canon        → episodes/<slug>/canon-report.md  (must PASS)
 → storyboard        /apercu-storyboard   → shotlist.md, ltx-brief.md, moho-scenes.json
 → (animatic)        LTX brief            → timing only, never the final look
 → Moho scene        apercu-animation     → animation/moho/scenes/<slug>-NN.moho (copy of master)
 → key poses         apercu-animation     → strong held keys, on 2s
 → breakdowns        apercu-animation     → minimal inbetweens; step/linear/ease chosen per shot
 → screenshots       document_screenshot  → animation/renders/previews/  (REVIEW them)
 → review + correct  apercu-animation     → fix what reads wrong; re-render
 → render            Moho                 → animation/renders/finals/
 → web export        (optimize)           → animation/exports/web/  → website public/
```

## Where each thing lives

- **Canon & rules:** `content-bible/` (characters, world, style) + `docs/visual-language.md`.
- **Per-episode plan:** `episodes/<slug>/` (`script.md`, `shotlist.md`, `moho-scenes.json`,
  `canon-report.md`, `assets/*.brief.md`).
- **Moho binaries / renders / exports / rig maps:** `animation/`.
- **How Claude drives Moho:** the `apercu-animation` skill + `docs/MOHO-MCP-SETUP.md`.

## The production stage (apercu-animation) in brief

For every shot, follow the mandatory loop: **OBSERVE → PLAN → EXECUTE → RENDER → REVIEW →
CORRECT → VERIFY → SAVE** (full detail in the skill). Never start by writing keyframes;
never animate on a master; always screenshot and actually look.

## Timing contract

24 fps file, movement **on 2s**, holds 2–4 frames, stillness is valid. Interpolation is
chosen deliberately (`step` for held/graphic changes; `smooth`/`ease` only for selected
organic or camera motion). Details: `content-bible/world/motion-language.md`.

## Web hand-off (kept decoupled)

Optimize finals into `animation/exports/web/` (WebM + MP4 fallback + poster still), then
deliberately copy the chosen assets into the site's `public/` and reference them per
`docs/media-manifest.md`. No Moho dependency ships in the Astro/Node runtime; nothing Moho
runs on Infomaniak.
