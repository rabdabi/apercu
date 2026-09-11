---
name: apercu-publish
description: Assemble a finished Aperçu episode into a publishable page — scaffold the episode.mdx, place media, wire the player, Rive island and captions, and run the build. Use as the pipeline exit gate once the render, .riv and metadata exist.
---

# /apercu-publish — Publisher

Turn a finished episode into a built, publishable page. This is gate 07 — run only when
the render (and, if used, the `.riv`) exist.

## Inputs

- `episodes/<slug>/render/episode.webm` (and/or `.mp4`), a poster frame.
- `episodes/<slug>/scroll-map.json` and `public/episodes/<slug>/emil.riv` (if interactive).
- `episodes/<slug>/captions.vtt` (if produced) — else run `/apercu-captions` first.

## Steps

1. **Place media** under `public/episodes/<slug>/` (poster.png, episode.webm,
   captions.vtt, emil.riv). Large binaries live in `public/`, never in the content dir.
2. **Scaffold `episodes/<slug>/episode.mdx`** from `episodes/_template/episode.mdx`:
   fill frontmatter (title, subtitle, description ≤200, publishedAt, topics, poster,
   videoWebm, captions, durationSeconds, riveSrc, riveStateMachine), set `draft: false`
   when ready, and set `illustrative: true` if any figure is not yet sourced.
3. **Wire the reading layer:** turn beats into `<ScrollScene state="…">` blocks whose
   ids and states match `scroll-map.json`; place `AmbientClip`/`FilmPlayer` and media
   treatments per the story.
4. **Validate:** run `npm run check` then `npm run build`. Fix any error. Confirm the
   episode route renders and the player/Rive island mount.
5. **Cross-link:** ensure it appears in `/episodes` and the RSS/sitemap update on build.

## Guardrails

- No autoplay with sound; `FilmPlayer` for intentional viewing, `AmbientClip` for
  moving-illustration clips. Respect reduced-motion (poster fallback).
- Never publish an unverified figure about a real person as fact — keep it labelled
  illustrative until sourced (same rule as the website).
- Report the real build result; do not claim success unless the build passed.

## Output (commit)

`episodes/<slug>/episode.mdx` + media in `public/episodes/<slug>/`, build green.
