# Aperçu — Visual language

Our own grammar, synthesised from White Desert (sequence, silence), Anveril (precision,
hierarchy), Studio Loop (collage, typographic play) and Arc'teryx System_0 (cinematic
content & video treatment) — belonging to none of them. plnty confirms the confident
paper-ground + monumental type direction. This is the source of truth future pages
follow so they stay Aperçu without copying existing layouts.

> **Signature:** the **cinematic chapter** — a full-bleed dark (or flood-colour) scene
> with a numbered index, a centered small-caps title that reveals word-by-word on
> scroll, a recurring line-motif and a "+" disclosure, punctuating the paper flow. (The
> earlier "Story Loop" drag-rail idea is dropped.)

**Creative priority:** ~40% cinema · 30% editorial experimentation · 20% technical
precision · 10% unexpected. **Two registers:** a bold *shell* (home, hero, index,
chapter breaks, the loop) and *calm reading* (long-form bodies stay legible).

---

## 01 · Typography

- **Display** — Space Grotesk, 500–600, tight (`letter-spacing:-0.02em`), `text-wrap:balance`.
  Goes monumental: `clamp()` up to ~13vw on the shell.
- **Body / editorial** — Newsreader (serif). Now the primary reading face on paper, and
  used **in italic** as an accent inside display lines (the Studio Loop "one word in
  serif" move).
- **Interface / metadata** — Space Mono, uppercase, `letter-spacing:0.14em`, small.
- **Courage moves** (shell only): a word may cross an image, start off-viewport, occupy
  ~80vw, or set a single accent word in Newsreader italic + rubric red. The DOM stays
  semantic and readable — effects are CSS only, never letterspaced characters in content.

## 02 · Grid

- Underlying **12-column** editorial grid (`.grid-editorial`), max 1680px, fluid gutter.
- A measured reading column (`--measure: 66ch`) for bodies.
- **Non-linear grid (allowed, deliberately):** images break past columns, captions float
  far from their image, a headline crosses columns, a small image sits in large empty
  space, two media misalign. Controlled imbalance — the grid still underlies it.

## 03 · Corporate colours (the evolved CI)

```
--paper:        #F5F1E8   /* warm paper ground (whole site) */
--paper-deep:   #ECE6D8   /* raised panels */
--paper-shadow: #E3DBC8   /* insets, sunken */
--ink:          #1A1712   /* warm near-black — primary text */
--ink-soft:     #4A443A   /* secondary text */
--ink-faint:    #8A8271   /* metadata / tertiary */
--rubric:       #CB3321   /* PRIMARY ACCENT — manuscript red */
--rubric-deep:  #9E2716   /* red for body links (contrast-safe) */
--lime:         #C6F24E   /* RARE full-bleed "electric" chapter only */
--ink-ground:   #17140F   /* full-bleed DARK chapter ground */
--line:         #D9D1BF   /* thin rule on paper */
--line-strong:  #C4BAA3
```

Rules: **black + red + paper** carries ~90% of the site. **Lime never appears small** on
paper — only as a full-bleed flood chapter. Never dilute red or lime into gradients.

## 04 · Editorial colours (media grading)

Generated media and collage grade to a warm, slightly desaturated range that sits on
paper: sepia-warm mids, deep ink shadows, one red or lime spark max per composition.
No cold blue-grey stock look.

## 05 · Image treatments (`src/components/media/`)

Reusable, each takes a `src` (generated visual now; real photo/film later):
`MediaFullBleed` · `MediaCollage` · `MediaMask` · `MediaMosaic`. Build only what a story
needs; architect `StoryExperience` so `MediaDiptych/Triptych/Magnifier/Archive/ContactSheet`
can be added without refactor. Every image has intrinsic ratio (no layout shift) and alt.

## 06 · Video treatments

- **`AmbientClip`** — behaves like an *image*: muted, loop, autoplay-on-visible, poster
  first, `reducedMotionPoster` fallback, no chrome. For moving illustration/texture.
- **`FilmPlayer`** — behaves like a *player*: native controls, no autoplay, captions,
  for intentional viewing with sound. Two roles, two components — never conflate.

## 07 · Collage rules

Collage is **punctuation, not wallpaper**. Use it to reinforce a story beat. Ingredients:
generated fragments, video stills, diagrams, documents, texture. Compositions:
image-over-image, text-over-image, image-through-mask, image-cut-into-grid, detail
magnification, circular/extreme crop, asymmetric split. Never arbitrary aesthetic noise
on a serious story.

## 08 · Masks & windows

Not every image is a rectangle. Mask must relate to subject:
observation → **aperture/viewfinder**; AI → **detection window/mosaic**; cities → **map
aperture**; memory → **torn/archival frame**. Implemented as SVG `clip-path`/mask,
degrade to a plain rectangle if unsupported.

## 09 · Cinematic chapters & recurring motifs

The signature register (Arc'teryx System_0), plus quiet recurrence — no drag-loop:
1. **Cinematic chapter** (`CinematicChapter`) — full-bleed dark or flood-colour scene:
   numbered index, centered small-caps title revealing word-by-word (`RevealText`),
   `AmbientClip` background (generated canvas now, real footage later), the `Motif`, and a
   "+" disclosure. Used as punctuation between paper sections.
2. **Recurring motif** — the aperture/overlapping-circle `Motif` reappears across chapters
   and section breaks (visual memory).
3. **Returning imagery** — an image reappears cropped / collaged / as diagram.
4. **Narrative echo** — a story's end refers back to its opening composition, with new
   meaning. The loop is *narrative*, not an interface widget.

## 10 · Motion

Animate `transform`, `opacity`, `clip-path` only. Slow, editorial easing
(`cubic-bezier(0.16,1,0.3,1)`). Reveal-on-scroll from a **visible** resting state.
No scroll-jacking, no blur/glow, no sci-fi HUD. Heavy interactions (Story Loop, mosaic)
are lazy `client:visible` islands; no heavy animation libraries.

## 11 · Diagram language

Editorial diagram, not HUD. Primitives from the identity: `• ○ — + → ↳`, thin rules,
arcs, numbered nodes, coordinate points. Connect story elements:
`01 •————• 02 ————• 03`. Rubric red or ink; never neon on dark.

## 12 · Texture

Subtle and **local**, never a permanent global overlay: faint paper grain, film grain on
media, halftone on a collage, scan artefacts on an "archival" frame. Appears as part of a
composition, at low opacity, and never harms readability or performance.

## 13 · Story transitions

Between reading sections: quiet reveal-on-scroll, a moving dot/line diagram tracing
between media. Pacing like film editing — `FAST FAST SLOW SILENCE REVEAL`. After density,
give a near-empty viewport (White Desert silence).

## 14 · Chapter transitions

Chapters are marked by **ground change**: paper → full-bleed **dark** (`--ink-ground`),
or the rare full-bleed **lime** / **red** chapter, then back to paper. A colour chapter is
an emotional shift, held briefly, then released. `ChapterBreak` component owns this.

## 15 · Reduced-motion behaviour

Everything degrades to a **legible still**: Story Loop becomes a static, keyboard-
navigable, horizontally-scrollable strip; AmbientClip shows its poster; mosaic shows the
resolved image; loops stop; reveals show at rest. The complete site is understandable and
attractive with motion disabled — this is a hard requirement, tested every pass.

---

## Coherence guardrails (never chaotic)

Clear nav, clear hierarchy, readable stories, consistent interaction rules, strong a11y,
fast performance. Studio Loop grants permission to experiment **within** this system —
not to confuse. Target feeling: *"not a template → a publication → a film → an
exhibition → I want to continue."*
