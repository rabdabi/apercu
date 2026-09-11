---
name: apercu-rive
description: Specify Emil's Rive web state machine and map an episode's scroll positions to states. Use to define the living-character interaction for the website, producing the rig contract and the scroll-map the site consumes.
---

# /apercu-rive — Living-character spec

Define how the interactive Emil behaves on the website for an episode. You write the
**spec and the map**; a human rigs the `.riv` in Rive.

## Read first

- `content-bible/characters/emil.md` (canonical web state names + order).
- The episode `script.md` / `beats.md` (where the emotional beats fall).
- `src/components/interactive/RiveCharacter.tsx` (the rig contract already in code).

## Rig contract (must match the code)

- One state machine (default name `State Machine 1`).
- One **number input `state`**; the site sets it to an index to switch pose.
- Indices follow the canonical order in `emil.md`:
  `idle 0 · walk 1 · run 2 · look_up 3 · shocked 4 · point 5 · sit 6 · sleep 7 ·
   wave 8 · angry 9 · confused 10 · sad 11 · laugh 12`.

## Produce

1. **`rive/emil.states.md`** — for the animator: the states this episode needs, the
   transitions between them, and any per-episode notes (kept on-model to `emil.md`).
2. **`scroll-map.json`** (schema as in `episodes/_template/scroll-map.json`) — ordered
   `scenes[]` of `{ anchor, state }`, where `anchor` matches a `<ScrollScene state="…">`
   id in `episode.mdx`, and every `state` is a canonical name.

## Rules

- Reduced-motion must remain coherent: the site shows a still on-model pose; do not
  design an interaction that only reads while animating.
- Reuse existing states before inventing new ones. A new state means editing `emil.md`
  (canon change) first.

## Outputs (commit)

`episodes/<slug>/rive/emil.states.md` · `episodes/<slug>/scroll-map.json`

## Hand-off

Animator rigs `public/episodes/<slug>/emil.riv`; `/apercu-publish` wires it in.
