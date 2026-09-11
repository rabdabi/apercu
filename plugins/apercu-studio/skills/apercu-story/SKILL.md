---
name: apercu-story
description: Develop an Aperçu episode from a brief or logline into a canon-consistent German script and beat sheet, grounded in the content-bible. Use when starting a new episode or turning a real subject into a medieval-staged story for the Emil world.
---

# /apercu-story — Episode writer

You are writing for **Aperçu Motion**: a recurring 2D animated world where contemporary
stories about power, money and attention are staged in a timeless medieval register.
The protagonist **Emil** recurs across every episode.

## Before you write — read the canon

Read the **entire** `content-bible/` in the repo root. It is the source of truth:

- `characters/emil.md` — who Emil is, exactly (never contradict proportions/personality).
- `world/world-rules.md` — genre, tone, the Crown/Ledger/Tithe/Commons vocabulary.
- `world/poor-world.md` + `world/rich-world.md` — the two registers.
- `world/motion-language.md` + `world/camera-grammar.md` — timing and camera tokens.

If a story idea conflicts with the bible, the bible wins — or propose a bible change
explicitly and let the human decide.

## Inputs

- `episodes/<slug>/brief.md` if it exists, otherwise a logline from the user.

## Steps

1. **Lock the real subject.** Identify the contemporary thing the episode is about. Any
   number must be **true and sourced**, or explicitly labelled illustrative (same rule as
   the website). Do not invent statistics about real people.
2. **Translate to the staging.** Map the subject onto Crown / Ledger / Tithe / Commons.
3. **Write the logline** — one sentence: Emil witnesses X; the audience sees Y.
4. **Plan registers.** Decide which beats are POOR and which are RICH, and where the cut
   between them lands (the contrast carries the meaning).
5. **Write `beats.md`** — the ordered beat sheet with register per beat.
6. **Write `script.md`** — German, sparse. Scene headers as
   `## SZENE NN — <ort> — POOR|RICH — <CAMERA>` using camera tokens from
   `camera-grammar.md`. Emil carries scenes with the eyebrows; keep dialogue minimal.
7. **Run the canon gate.** Invoke `/apercu-canon` on `script.md`. Do not hand off to
   storyboard until `canon-report.md` is STATUS / PASS.

## Outputs (commit each)

- `episodes/<slug>/beats.md`
- `episodes/<slug>/script.md`
- (then) `episodes/<slug>/canon-report.md` via `/apercu-canon`

## Guardrails

- German output. Plain, readable diction — not fake archaic German.
- No modern objects on screen; modernity appears only as metaphor.
- Restraint over spectacle; stillness is valid.
- Never change Emil's canonical design.
