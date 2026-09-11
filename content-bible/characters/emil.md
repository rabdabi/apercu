# CHARACTER / EMIL

> The permanent protagonist of the Aperçu world. Design once, reuse forever.
> If a drawing contradicts this file, the drawing is wrong.

STATUS / CANON · UPDATED / 11.09.26

## One-line

A small, watchful commoner who keeps ending up at the edges of power and quietly
notices what nobody is supposed to notice.

## Proportions (hard constraints)

- **Height:** exactly **4.5 heads tall**. Deliberately short — he is dwarfed by
  architecture and by the rich world.
- **Head:** large relative to body; rounded, slightly egg-shaped, wider at the jaw.
- **Eyes:** two thin almond shapes, set fairly wide, pale green iris. Pupils small.
  Eyebrows are two short independent strokes — they do most of the acting.
- **Nose:** a single soft curved line ending in a small rounded bulb. **This nose is
  the character.** It never changes shape between episodes.
- **Ears:** small, low-set, half-hidden by hair.
- **Hair:** rust-orange, blunt medieval bowl cut, drawn as one silhouette shape with
  3–5 interior strokes, never individual hairs.
- **Hands:** four-fingered, mitten-simple, slightly too large for the arms.
- **Feet:** small, soft leather shoes, no laces.

## Silhouette test

Emil must be recognisable in pure black silhouette from: the bowl-cut head shape, the
short stature, and the layered tunic collar. If those three read, it is Emil.

## Costume (default / poor register)

- Undyed linen tunic, knee-length, gathered at the waist with a plain cord.
- A second short over-tunic with a wide folded collar (the collar is a silhouette key).
- Rough hose and soft shoes.
- Colours pulled only from `world/palette.md` → oat, clay, iron.
- Everything hangs slightly crooked. No pressed, symmetrical clothing on Emil ever.

When Emil appears inside the **rich world**, he keeps the same costume — the contrast
between his plain clothes and the gold surroundings is the point (see
`world/rich-world.md`). He is never re-dressed to fit in.

## Personality (drives performance, not just looks)

- Curious before he is brave. He leans in, then reacts.
- Under-reacts to danger, over-reacts to small injustices.
- Rarely speaks; carries scenes with the eyebrows and a tilt of the head.
- Never the hero who fixes things — the witness who makes the audience see them.

## Required model-sheet poses (the permanent asset)

Front · side · three-quarter · back ·
**12 expressions:** neutral, curious, shocked, angry, sad, sly, tired, delighted,
afraid, unimpressed, determined, crying ·
**8 hand poses:** open, point, fist, carry, offer, shield-eyes, count-on-fingers, hide-face ·
**cycles:** walk · run · sit · eat · carry · exhausted.

Produce this once (`/apercu-modelsheet`), clean up by hand, commit as the canonical set.

## Web states (Rive)

The interactive character reuses one rig. Canonical state names — keep these exact,
they are referenced by `scroll-map.json`:

`idle` · `walk` · `run` · `look_up` · `shocked` · `point` · `sit` · `sleep` ·
`wave` · `angry` · `confused` · `sad` · `laugh`

## Never

- Never change the nose.
- Never make him tall or symmetrical.
- Never give him smooth, high-frame-rate movement (see `world/motion-language.md`).
- Never dress him in the rich world's colours.
