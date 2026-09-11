# STYLE / ANIMATION PRINCIPLES

> The craft rules, at the frame level. Read together with `world/motion-language.md`
> (timing) and `world/palette.md` (colour). This file is about *how it is made*.

STATUS / CANON · UPDATED / 11.09.26

## Reference lineage

Blend three sources — as principles, never as designs to copy:

1. **Medieval illuminated manuscripts** — flat space, ornament, gold, symbolic scale
   (important figures drawn larger), decorated borders.
2. **1960s–70s European limited animation** — held drawings, ink outlines, gouache
   flats, economical movement, hand-painted backgrounds.
3. **Editorial / political cartooning** — a drawing that argues; exaggeration in service
   of a point.

## Line

- Imperfect ink outline, bound around every shape (`palette.md` → Ink).
- Weight varies slightly; edges may break. Never a clean, uniform vector stroke.
- Interior detail is minimal — suggest, don't render.

## Colour & fill

- Flat gouache-style fills. Poor world 2–3 colours; rich world dense (`palette.md`).
- Hard-stepped modelling only where allowed (rich drapery, gold). No soft digital
  gradients, ever.
- A low-opacity paper/grain texture sits over the whole frame.

## Backgrounds

- Hand-painted feel. Poor-world backgrounds may be reused across scenes/episodes.
- Rich-world backgrounds are bespoke, ornamented, symmetrical.

## Character construction (production)

- Rig Emil once in Moho (skeleton + Smart Bones for head turns and expressions), then
  mix rig with frame-by-frame where the shot needs a hand-drawn feel.
- Keep the rig's proportions locked to `characters/emil.md`.
- Reusable actions (walk, run, sit, carry) are built once and reused every episode.

## Title cards & type

- Hand-painted or hand-lettered title cards, held on screen.
- On-screen text is German; keep lettering plain and legible.

## Deliberate "imperfection" budget

Small wobble in held lines, slightly off registration between fill and outline (like
mis-printed colour), tiny timing irregularities. These are *designed*, kept subtle, and
never allowed to hurt readability.

## Canon checks (for `/apercu-canon`)

- [ ] Ink-bound imperfect line, not vector-clean.
- [ ] Flat fills; no soft gradients.
- [ ] Reused poor-world backgrounds acceptable; rich-world bespoke.
- [ ] Emil rig proportions match `characters/emil.md`.
