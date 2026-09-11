---
name: apercu-captions
description: Generate German captions (WebVTT) and distribution copy for a finished Aperçu episode. Use at the distribution gate after a render exists, to make the episode accessible and shareable.
---

# /apercu-captions — Caption & distribute

Gate 08. Make a finished episode accessible and ready to share, in the Aperçu voice.

## Inputs

- `episodes/<slug>/render/episode.webm` (finished render) and its `script.md`.

## Produce

1. **`public/episodes/<slug>/captions.vtt`** — WebVTT captions in German, timed to the
   render. Base them on `script.md` dialogue/narration; keep lines short and readable.
   These feed the `<track kind="captions">` in `EpisodePlayer`.
2. **`episodes/<slug>/social.md`** — distribution copy in the Aperçu voice:
   a one-line hook, a 2–3 sentence summary, and 3–5 topic tags. Serious, precise, no
   hype. German primary; an English variant is welcome for the bilingual roadmap.
3. Confirm the episode is in the RSS feed and sitemap (both regenerate on build).

## Rules

- Captions are accessibility, not decoration — accuracy and timing matter.
- Never invent facts in the summary; mirror the episode, and keep any unverified figure
  labelled illustrative.

## Outputs (commit)

`public/episodes/<slug>/captions.vtt` · `episodes/<slug>/social.md`
