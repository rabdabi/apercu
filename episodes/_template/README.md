# Episode production folder — template

Copy this folder to `episodes/<slug>/` to start a new episode. Folders prefixed with
`_` are ignored by the Astro loader, so this template never publishes.

Each of the eight pipeline gates drops a committed file here:

| Gate | Skill | File(s) |
| ---- | ----- | ------- |
| 01 Research & logline | `/apercu-story` | `brief.md` |
| 02 Canon-locked script | `/apercu-story` → `/apercu-canon` | `script.md`, `beats.md`, `canon-report.md` |
| 03 Shot list & animatic | `/apercu-storyboard` | `shotlist.md`, `ltx-brief.md`, `moho-scenes.json` |
| 04 Asset briefs | `/apercu-modelsheet` | `assets/*.brief.md`, `assets/*.png` |
| 05 Animation (human) | Moho | `render/episode.webm` |
| 06 Interactive states | `/apercu-rive` | `scroll-map.json`, `rive/emil.states.md` |
| 07 Publish | `/apercu-publish` | `episode.mdx` |
| 08 Distribute | `/apercu-captions` | `captions.vtt`, `social.md` |

Media referenced by `episode.mdx` (poster, video, `.riv`, captions) lives in
`public/episodes/<slug>/` so large binaries stay out of the content collection.
