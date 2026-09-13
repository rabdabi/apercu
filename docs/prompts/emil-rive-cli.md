# PROMPT — Build Emil in Rive (CLI/RML) with cursor-follow, hover & click reactions

> Paste this whole file as the opening message of a **new Claude Code session** run
> **inside the Aperçu repo** (`rabdabi/apercu`). It is self-contained — it names every
> file and contract you need; you should not need the conversation it came from.

---

You are the animation-tooling engineer for **Aperçu**, an editorial + video storytelling
platform. Your job: build the recurring character **Emil** as a real Rive file and make
him **react to the pointer** — his eyes/head follow the cursor, he reacts on hover, and he
reacts on click/tap — then wire the `.riv` into the site. Use the **Rive CLI + RML** so you
build the file programmatically and headlessly.

Work autonomously through setup → build → wire → verify. Make sensible calls on minor
ambiguities and document them. Do **not** break the existing runtime contract (below).

## 0 · Setup

- Install the Rive CLI (official installer):
  ```bash
  curl -fsSL https://releases.rive.app/cli/install.sh | sh
  ```
- Read the CLI + RML docs before building: <https://rive.app/docs/cli/reference/commands>
  and the Listeners guide <https://help.rive.app/editor/state-machine/listeners>
  (Pointer Enter/Exit, Click, Mouse Move, and the **Align Target** action for
  cursor-follow). RML is a text format you can read/write/diff; you can push to the Rive
  editor and pull back if needed.

## 1 · Read these repo files first (the source of truth)

| File | Why |
| ---- | --- |
| `content-bible/characters/emil.md` | Canon: **4.5-heads** proportions, the nose, silhouette keys, the **13 web states** + order, "Never" list |
| `content-bible/characters/emil/modelsheet-brief.md` | Full look/pose spec |
| `content-bible/characters/emil/rive-build-guide.md` | **The rig contract** — artboard, bones, Smart Bones, the `state` state machine, export path, homepage drop-in |
| `content-bible/world/palette.md` | Only allowed colours (ink `#241f1a`, oat `#d9ccaa`, clay `#b07a4f`, iron `#6f7466`, rust `#c0562f`) |
| `content-bible/world/motion-language.md` | The "old" feel: **animate-on-2s**, holds, no smooth easing |
| `src/components/story/EmilFigure.astro` | **The existing vector Emil** — translate its SVG shapes into RML as your starting art (front view, palette-correct) |
| `src/components/interactive/RiveCharacter.tsx` | **Runtime contract** you must satisfy (see §4) |
| `docs/media-manifest.md` | Where media lives |

## 2 · Build the base rig (RML)

Recreate Emil as vector shapes in RML from `EmilFigure.astro` (egg head, rust bowl cut,
almond eyes, soft nose bulb, wide-collar oat tunic, mitten hands, short proportions).
Then rig per `rive-build-guide.md`:

- Artboard **`Emil`**, ~300×400, transparent.
- Bone hierarchy: root→spine→neck→head (jaw, brows, hair), arms→hands, legs→feet.
- State machine named exactly **`State Machine 1`** with a **Number input `state`** and
  **13 states** at indices `idle 0 · walk 1 · run 2 · look_up 3 · shocked 4 · point 5 ·
  sit 6 · sleep 7 · wave 8 · angry 9 · confused 10 · sad 11 · laugh 12`. From **Any State**,
  transition into each on `state == index`.
- Motion feel: Hold interpolation, animate-on-2s, few keys, deliberate holds.

**Do not change** the `State Machine 1` name, the `state` input, or the indices — the site
already drives them.

## 3 · Add the three pointer interactions (the point of this task)

Add these **without** disturbing the `state` contract — they are extra inputs/listeners.

### a) Eyes/head follow the cursor
- Create a **look-target** the eyes (and a slight head tilt) aim at. Constrain rotation so
  Emil never over-rotates (clamp ~±12° head, small pupil travel).
- For pointer **inside** the canvas: a **Mouse-Move listener** + **Align Target** on the
  look-target.
- For following the cursor **anywhere on the page**: expose two **Number inputs**
  `pointerX` and `pointerY` (normalized **0–1**); drive the look-target from them. The site
  runtime (§4) feeds the global pointer into these.

### b) Hover reaction
- **Pointer Enter** → a subtle reaction (glance at the viewer / a micro-wave); **Pointer
  Exit** → settle back to `idle`. Implement via a Boolean input `hover` or dedicated states.

### c) Click / tap reaction
- **Click** listener → fire a **Trigger input `poke`** → play a reaction (use `shocked` or
  `laugh`) **plus** a small squash-bounce, then settle to `idle`. Works for touch tap too.

Document the exact input names/types you added at the top of the RML and in a short note in
`content-bible/characters/emil/rive-build-guide.md`.

## 4 · Wire the `.riv` into the site

- **Export** the built file to **`public/media/emil.riv`**.
- **Enhance `src/components/interactive/RiveCharacter.tsx`** (keep everything it already
  does — the `emil:state` listener, the `state` number input, the placeholder fallback):
  - After load, look up optional inputs `pointerX` / `pointerY`; if present, add a
    `pointermove` listener on `window` that maps the global cursor to 0–1 and writes them,
    **throttled with `requestAnimationFrame`**.
  - Skip all pointer-follow under `prefers-reduced-motion: reduce` (Emil stays a still).
  - Pointer Enter/Exit/Click **inside** the canvas are captured by Rive automatically — no
    extra JS needed for hover/click.
- **Swap the homepage** figure: in `src/pages/index.astro` replace the hero `EmilFigure`
  with `RiveCharacter` (the exact diff is in `rive-build-guide.md`). Keep the reactive
  `ScrollScene` wiring — `emil:state` still drives the `state` input.

## 5 · Constraints (non-negotiable)

- Palette + proportions strictly per `content-bible/`. Never change the nose; keep him short.
- Motion is animate-on-2s, held — not smooth/60fps; no blur/glow.
- **Reduced-motion:** no cursor-follow, no idle motion — Emil is a legible still.
- **Touch:** no hover on touch devices; click/tap must still trigger the poke reaction.
- **Performance:** pause when offscreen; the `.riv` loads only where mounted (it already
  dynamic-imports). Keep the file small.
- Do not break the `state` state-machine contract or the `emil:state` event.

## 6 · Acceptance criteria & verification

1. `emil.riv` builds via the CLI; a **headless run asserts** the 13 states exist and
   `state = 0..12` selects them, and that `pointerX/pointerY`, `hover`, `poke` exist.
2. In the repo: `npm run check` → 0 errors; `NODE_ENV=production npm run build` → green.
3. In-browser (`npm run dev`): on the homepage Emil's **eyes follow the cursor**;
   **hovering** him reacts; **clicking/tapping** him reacts with a bounce; scrolling still
   changes his pose (`emil:state`); **reduced-motion** → static, no follow; **375px mobile**
   → no horizontal scroll, tap still reacts.
4. Then **commit + push** with a clear message, and update `docs/STATUS.md` (Emil is live in
   Rive with pointer interactions).

If any step needs a real design decision (e.g. how far the eyes travel), make a tasteful
call, keep it on-model, and note it. Report at the end: what you built, the input names you
added, commands run, verification results, and how to see it locally.
