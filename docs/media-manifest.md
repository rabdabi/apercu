# Media asset manifest

Every visual on the site is currently a **generated stand-in** (SVG / canvas). This maps
each slot to the **real asset** that replaces it and the exact **prop/`src` to set** — so
photography, Moho films and the Emil `.riv` drop in without touching layout.

Convention: real media lives in `public/` (e.g. `public/episodes/<slug>/…`,
`public/media/…`) and is referenced by root-relative path.

## Homepage (`src/pages/index.astro`) — video-first front

| Slot | Component | Generated now | Real asset needed | How to swap |
| ---- | --------- | ------------- | ----------------- | ----------- |
| Protagonist | `EmilFigure` | SVG Emil (idle, sway) | Emil Rive rig | Replace `EmilFigure` with the `RiveCharacter` island + `.riv` (see below) |
| Premise chapter bg | `CinematicChapter variant="film"` | `AmbientClip` canvas drift | 8–20s seamless cinematic loop, dark, muted | `<CinematicChapter clipSrc="/media/premise.webm" clipPoster="…">` |
| Featured film | `FilmPlayer` (pending) | "Film folgt" panel | Finished film + poster + captions | `<FilmPlayer webm poster captions>` |

## Perspective — `achtzehn-milliarden` (`src/content/stories/…/index.mdx`)

| Slot | Component | Generated now | Real asset needed | How to swap |
| ---- | --------- | ------------- | ----------------- | ----------- |
| Hero | `StoryHero` (generated visual) | orbit `PlaceholderVisual` | 16:10 hero image | add `heroImage`/`heroAlt` to frontmatter (schema already supports it) |
| Fragment | `MediaMosaic` | generated "system" SVG | portrait/subject, 4:3, that reads when fragmented | `<MediaMosaic src="/media/…jpg">` |
| Motion beat | `AmbientClip` | canvas drift | short muted loop (feedback/motion), dark | `<AmbientClip src="/media/…webm" poster="…">` |
| Observation | `MediaMask shape="aperture"` | orbit `PlaceholderVisual` | square-ish subject to mask | `<MediaMask src="/media/…jpg" alt="…">` |
| Sources collage | `MediaCollage` | generated fragments | scanned docs / stills | **needs `src` support — follow-up** (add `src`/`alt` to `MediaCollage.astro`) |
| Film | `FilmPlayer` (pending) | "Film folgt" | finished film + poster + captions | `<FilmPlayer webm poster captions>` |

## Episode template (`episodes/_template/episode.mdx`)

All via frontmatter (schema in `src/content.config.ts`), media under
`public/episodes/<slug>/`:

| Field | Real asset |
| ----- | ---------- |
| `poster` | 16:9 poster frame |
| `videoWebm` / `videoMp4` | the finished film |
| `captions` | German WebVTT (`/apercu-captions`) |
| `riveSrc` + `riveStateMachine` | Emil `.riv` (rig contract in `RiveCharacter.tsx` — number input `state`) |

## Producing the assets

- **Emil** — generate from `content-bible/characters/emil/modelsheet-brief.md`, clean up,
  commit canonical frames, then rig the `.riv` in Rive.
- **Films** — hand-directed in Moho from the `apercu-studio` pipeline (see
  `docs/PHASE-2-COMMUNITY.md` / the concept). Export WebM + poster + VTT.
- **Stills / photography** — drop into `public/media/` and set the `src` above.

## Follow-ups

- Add optional `src`/`alt` to `src/components/media/MediaCollage.astro` for full parity.
- Consider a `<picture>`/responsive-image pass once real photography exists.
