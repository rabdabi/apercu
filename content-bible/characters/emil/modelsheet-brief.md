# EMIL — MODEL-SHEET BRIEF (image-generation prompt pack)

STATUS / DRAFT · produced per `/apercu-modelsheet` · bound to
[`../emil.md`](../emil.md), [`../../world/palette.md`](../../world/palette.md),
[`../../world/poor-world.md`](../../world/poor-world.md),
[`../../style/animation-principles.md`](../../style/animation-principles.md)

> These are **reference prompts**, not final art. Generate, then a human cleans up and
> commits the canonical frames to `content-bible/characters/emil/assets/`. Only a frame
> that passes the checklist becomes canon. Never let a generator "decide" the nose.

---

## Global prompt preamble (prepend to EVERY prompt)

```
A small medieval commoner boy, "Emil". EXACT PROPORTIONS: 4.5 heads tall, deliberately
short. Large rounded egg-shaped head, wider at the jaw. Two thin almond eyes set wide,
pale green iris, small pupils. Eyebrows are two short independent ink strokes. Nose is a
SINGLE soft curved line ending in a small rounded bulb — this exact nose never changes.
Small low-set ears half hidden by hair. Rust-orange blunt medieval bowl cut drawn as ONE
silhouette shape with 3–5 interior strokes. Four-fingered mitten-simple hands, slightly
too large. Costume: undyed oat linen knee-length tunic gathered with a plain cord, plus a
short over-tunic with a WIDE FOLDED COLLAR (silhouette key); rough hose; soft leather
shoes, no laces. Everything hangs slightly crooked.
STYLE: 1960s–70s European limited animation + illuminated-manuscript flatness. Imperfect
hand-inked outline (weight varies, edges may break), flat gouache fills, low paper grain.
COLOURS ONLY: ink #241f1a, oat #d9ccaa, clay #b07a4f (skin/wood), iron #6f7466, rust
#c0562f (hair + at most one object). Plain oat/parchment background.
NEGATIVE: no smooth 3D, no vector-clean line, no cel-shading gradients, no extra colours,
no realistic proportions, no tall body, not symmetrical, never change the nose, no text.
```

## Turnaround (4)

| # | Prompt suffix |
| - | ------------- |
| 01 | `…, FRONT view, neutral stance, full body, arms at sides.` |
| 02 | `…, SIDE profile (left), full body — show the nose bulb and collar silhouette.` |
| 03 | `…, THREE-QUARTER view, full body, slight turn.` |
| 04 | `…, BACK view, full body — show bowl-cut silhouette and collar from behind.` |

## Expressions (12 · head-and-shoulders, brows do the acting)

`neutral` · `curious` (one brow up, leaning in) · `shocked` (wide eyes, mouth open) ·
`angry` (brows down + together) · `sad` (brows up-inner) · `sly` (half-lidded, one
corner up) · `tired` · `delighted` · `afraid` · `unimpressed` (flat, one brow) ·
`determined` · `crying`.
Prompt each as: `…, head and shoulders, expression: <name>, mouth as a simple shape.`

## Hand poses (8)

`open` · `point` · `fist` · `carry` (both hands cupped) · `offer` (one hand out) ·
`shield-eyes` · `count-on-fingers` · `hide-face`.
Prompt each as: `…, close-up of Emil's four-fingered hands, pose: <name>, mitten-simple.`

## Action cycles (key drawings)

For each, generate the labelled key poses (animate-on-2s feel, hold 2–4 frames):

- `walk` — contact · down · passing · up (4 keys)
- `run` — contact · recoil · passing · high-point (4 keys)
- `sit` — stand → lower → seated (3 keys)
- `eat` — reach · to-mouth · chew (3 keys)
- `carry` — pick up · hold-at-waist · walk-with-load (3 keys)
- `exhausted` — slump · hands-on-knees · head-down (3 keys)

Prompt each key as: `…, WALK cycle key "passing position", side view, full body.`

## Cleanup checklist (before any frame becomes canon)

```
- [ ] Proportions match ../emil.md (4.5 heads, short; large egg head)
- [ ] The nose is the single soft curved line + bulb — unchanged
- [ ] Silhouette test passes (bowl cut + collar + short stature read in black)
- [ ] Only palette.md colours present (ink/oat/clay/iron/rust)
- [ ] Line is imperfect hand ink, not vector-clean; fills flat (no gradients)
- [ ] Committed to content-bible/characters/emil/assets/ as the canonical frame
```

## Downstream

Once canonical frames exist, `/apercu-canon` validates every episode drawing against
them, and the Rive rig (`content-bible/characters/emil.md` → web states) is built from
this set. Until then the site uses the generated-SVG stand-in
(`src/components/story/EmilFigure.astro`).
