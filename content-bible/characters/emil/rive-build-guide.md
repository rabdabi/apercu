# EMIL — RIVE BUILD GUIDE (the living web character)

Step-by-step to rig Emil in [Rive](https://rive.app) and drop him into the site. The
website already expects a specific rig — **build to this contract exactly** and the
`.riv` works with zero code changes.

STATUS / PRODUCTION HOW-TO · pairs with
[`modelsheet-brief.md`](modelsheet-brief.md) and [`../emil.md`](../emil.md)

> Phase 1 of the movie plan (see `docs/STATUS.md`). Prerequisite: **canonical Emil
> frames exist** (generate from `modelsheet-brief.md`, clean up, commit to
> `content-bible/characters/emil/assets/`). Rig the front view first.

---

## The contract the site enforces (do not deviate)

The runtime is `src/components/interactive/RiveCharacter.tsx`. It will:

- load the `.riv`, play **one state machine** (default name **`State Machine 1`**),
- find **one number input named exactly `state`**, and
- set `state` to an **index** to switch pose.

**State → index (from `../emil.md`, order is fixed):**

| idx | state | idx | state | idx | state |
| --- | ----- | --- | ----- | --- | ----- |
| 0 | `idle` | 5 | `point` | 10 | `confused` |
| 1 | `walk` | 6 | `sit` | 11 | `sad` |
| 2 | `run` | 7 | `sleep` | 12 | `laugh` |
| 3 | `look_up` | 8 | `wave` | | |
| 4 | `shocked` | 9 | `angry` | | |

On the site, `<ScrollScene state="walk">` dispatches an `emil:state` event; the runtime
maps the name → index and sets the input. So in Rive you only build the state machine —
the mapping is already done in code.

## 1 · Artboard

- New file → artboard **`Emil`**, ~**300 × 400** (matches the canvas). Transparent bg.
- Import the canonical **front** frame as reference; trace as **vector shapes** (don't
  ship the bitmap) so it scales and re-colours. Use the palette hex from
  `../../world/palette.md` (ink `#241f1a`, oat `#d9ccaa`, clay `#b07a4f`, iron `#6f7466`,
  rust `#c0562f`). Keep the imperfect ink outline — thicken/roughen strokes slightly.

## 2 · Bone hierarchy (rig once, reuse forever)

Build this skeleton (matches the concept's Emil rig):

```
root (hips)
├── spine → neck → HEAD
│                   ├── jaw (mouth)
│                   ├── brow_L / brow_R
│                   └── hair (single shape)
├── arm_L → forearm_L → hand_L
├── arm_R → forearm_R → hand_R
├── leg_L → shin_L → foot_L
└── leg_R → shin_R → foot_R
```

- Bind the traced shapes to bones (mesh + weights) so limbs bend without breaking the
  ink line. Keep proportions locked to `../emil.md` (**4.5 heads tall**, large egg head).
- Use **IK** on arms/legs for walk/run; **FK** for small gestures.

## 3 · Smart Bones (the cheap-but-rich acting)

- **head_turn** Smart Bone: drives a slight L/R head rotation + eye/nose shift in one
  control — most expressions read from the brows + a head tilt.
- **brow** Smart Bone(s): neutral → up (sad/afraid) → down (angry) → raised (shocked).
- **mouth**: 3–4 shapes only (closed / open / wide / consonant) — simple cycle, never
  realistic lip-sync (`../../world/motion-language.md`).

## 4 · The 13 states + the `state` input

1. Add a **Number input** named exactly **`state`** (default `0`).
2. Create **13 animations/timelines**, one per pose above. `idle` and `walk`/`run` loop;
   `wave`, `point`, `shocked`, `laugh`, etc. can be one-shots that settle back to a hold.
3. In the state machine (**rename it `State Machine 1`**), add a state per pose and, from
   **Any State**, a transition into each guarded by `state == <index>` (idle = 0 …
   laugh = 12). Set transition duration ~120–200 ms.
4. Test in the **State Machine** play mode by typing the input value 0–12.

## 5 · Motion feel (make it look OLD, not smooth)

- Target a **12 fps / animate-on-2s** feel: use **Hold** interpolation on keys, few
  keys, deliberate 2–4 frame holds. Avoid dense easing.
- Small motions; Emil is often nearly still. Cloth/hair move as one shape, no simulation.
- No blur/glow. This is what separates it from generic web animation.

## 6 · Export & place

- **Export → Runtime (`.riv`)**. Name it `emil.riv`.
- Put it at **`public/media/emil.riv`** (create `public/media/`). It is then served at
  `/media/emil.riv`.

## 7 · Drop into the site

The homepage currently uses the SVG stand-in. Swap it for the live rig:

In `src/pages/index.astro`, replace the import + hero figure:

```diff
- import EmilFigure from '@/components/story/EmilFigure.astro';
+ import RiveCharacter from '@/components/interactive/RiveCharacter.tsx';

- <EmilFigure pose="idle" sway size={300} />
+ <RiveCharacter client:visible src="/media/emil.riv" stateMachine="State Machine 1" initialState="idle" />
```

- `RiveCharacter` already handles **reduced-motion** (shows a still) and falls back to
  the SVG Emil if the `.riv` is missing — so nothing breaks mid-migration.
- On **story/episode pages**, `<ScrollScene state="…">` blocks already drive Emil's state
  on scroll (no extra wiring). For episodes, set `riveSrc: '/media/emil.riv'` +
  `riveStateMachine: 'State Machine 1'` in frontmatter.

## 8 · Verify

```
- [ ] `state` = 0..12 switches poses in Rive's state-machine preview
- [ ] npm run build → green; homepage shows Emil animating (idle)
- [ ] a page with <ScrollScene state="walk"> switches Emil to walk on scroll
- [ ] reduced-motion (OS setting) → Emil renders a still, no animation
- [ ] proportions/nose/palette match ../emil.md (run /apercu-canon on a screenshot)
```

## Next

Once Emil lives on the web (Phase 1 done), move to Phase 2: a 15–30s Moho short via
`/apercu-storyboard`. Emil's rig proportions here become the reference for the Moho rig.
