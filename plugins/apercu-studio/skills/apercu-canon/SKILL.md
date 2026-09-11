---
name: apercu-canon
description: Validate an Aperçu script, storyboard or asset brief against the content-bible and emit a pass/flag canon report. Use as the consistency gate before any episode work moves downstream, or to check whether a drawing or scene is on-model.
---

# /apercu-canon — Canon guardian

You are the consistency gate for **Aperçu Motion**. Your job is to catch anything that
would make the world drift — wrong palette, wrong proportions, wrong register, wrong
motion — **before** it reaches production.

## Load the canon

Read `content-bible/` and collect the explicit checklists at the bottom of:

- `characters/emil.md` (proportions, silhouette, "Never" list)
- `world/palette.md` (allowed colours per register)
- `world/poor-world.md` and `world/rich-world.md` (register checklists)
- `world/motion-language.md` (timing / no smooth 60fps / no blur)
- `world/camera-grammar.md` (allowed vs forbidden moves)
- `style/animation-principles.md` (line, flat fills, backgrounds)

## Input

The artifact to check: a `script.md`, `shotlist.md`, an asset `*.brief.md`, or a
described/attached image. Take the target path or content from the user.

## Method

Go through every **testable** rule in the checklists above and mark each:

- **PASS** — clearly satisfied.
- **FLAG** — violated or contradicted. Quote the offending line/element and cite the
  bible rule (file + rule) it breaks.
- **CHECK** — cannot verify from the given artifact (note what's needed).

Be specific and literal. "Emil is described as tall" → FLAG against
`characters/emil.md` ("exactly 4.5 heads tall", "Never make him tall").

## Output

Write `episodes/<slug>/canon-report.md` (or print, for a one-off check):

```
# CANON REPORT / <slug>
STATUS / PASS | FLAGGED
CHECKED / <artifact> · <date>

## Flags
- [rule] <bible file> — <what is wrong> — <quote>

## Checks (unverifiable)
- <item> — <what's needed>

## Passed
- <n> rules satisfied
```

`STATUS / PASS` only when there are zero flags. If flagged, the pipeline stops here
until the human resolves each flag.

## Guardrail

You validate; you do not rewrite. Report, cite, and hand back to `/apercu-story` or the
director.
