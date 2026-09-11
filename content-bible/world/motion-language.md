# WORLD / MOTION LANGUAGE

> How things move. This is what makes Aperçu look intentionally *old* rather than like
> smooth 2025 AI video. Timing is the signature.

STATUS / CANON · UPDATED / 11.09.26

## The target feeling

**1960s–1970s European limited animation.** Not full animation, not motion graphics.
Movement is economical, held, and slightly imperfect.

## Frame-rate & timing

- Work at **12 drawings per second** feel (animate on **2s**), inside a 24/25 fps file.
- Hold key drawings for **2–4 frames**; deliberate holds of longer are allowed for
  weight and comedy.
- Characters are **often completely still**. Stillness is a valid, wanted state.
- Avoid inbetween-heavy easing. Prefer fewer, stronger drawings.

## What moves, and what doesn't

- **Mouth:** simple 3–4 shape cycles (closed / open / wide / consonant). No lip-sync
  realism.
- **Eyes & brows:** the primary acting tool. A brow raise carries a line of dialogue.
- **Body:** small shifts, tilts, a step. Big physical action is rare and therefore
  lands hard.
- **Cloth & hair:** move as one silhouette shape, not as simulated fabric.

## Cuts & transitions

- **Hard cuts** dominate. No dissolves in the poor world.
- Title cards are hand-painted and held.
- Chapter transitions may use a manuscript wipe (an ornament closing over the frame).

## Camera

Covered in detail in `world/camera-grammar.md`. In short: slow or static; the camera
observes, it does not perform.

## Texture

- Subtle paper/gouache grain over the whole frame (very low opacity).
- No motion blur. No lens effects. No glow.

## Reduced-motion (web)

The interactive character and any web motion must degrade to a **still, on-model pose**
under `prefers-reduced-motion`. The story must be fully understandable with no motion —
the same rule the website already follows.

## Canon checks (for `/apercu-canon`)

- [ ] Timing described on 2s / with holds, never "smooth 60fps".
- [ ] Stillness used deliberately.
- [ ] No dissolves/blur/glow specified.
- [ ] Mouth = simple cycle, not realistic lip-sync.
