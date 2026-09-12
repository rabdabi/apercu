# Aperçu — project status & handoff

_Last updated: 2026-09-12. Read this first to resume cold._

**Repo:** https://github.com/rabdabi/apercu (private, branch `main`, fully pushed)
**Production domain (target):** https://apercu.org — not yet deployed.
**Local:** `nvm use` (Node 22) · `npm install` · `npm run dev` → http://localhost:4321

## What Aperçu is

A German-language editorial storytelling platform (Astro 5 SSR, Node standalone,
TypeScript strict, Tailwind v4 tokens, MariaDB-ready). Text-forward long-form reading
punctuated by cinematic full-bleed chapters. Plus **Aperçu Motion** — a semi-automated
pipeline for a recurring 2D animated world (character **Emil**).

## Design system (locked)

- **Two registers:** bold *shell* (home, hero, cinematic chapters) / calm *reading*.
- **Ground:** warm **paper-white** whole site; warm near-black ink.
- **Accent:** rubric red everyday · signal lime = rare full-bleed only · full-bleed dark
  chapters. Type: Space Grotesk / Newsreader / Space Mono.
- **References synthesised:** White Desert (silence), Anveril (precision), Studio Loop
  (collage + type courage — the *loop interaction was dropped*), Arc'teryx System_0
  (cinematic content/video), plnty (confirms paper + monumental type).
- Full grammar: [`docs/visual-language.md`](visual-language.md);
  [`docs/reference-analysis-studio-loop.md`](reference-analysis-studio-loop.md).

## Done

- v1 platform: story engine (MDX primitives), homepage, `/stories`, `/index`, `/about`,
  `/episodes`, 404/500, `/api/health|contact|newsletter`, Drizzle schema + migration,
  SEO/RSS/sitemap, security middleware, Vitest + Playwright.
- Paper-white + cinematic **design do-over**: `CinematicChapter`, `RevealText`,
  `AmbientClip` (generated canvas until real footage), `Motif`, `MediaMask`,
  `MediaMosaic`, `MediaCollage`, `FilmPlayer`. Homepage + demo story fully art-directed.
  All pages unified via `MetaRule` header signature; About has a cinematic beat; 404
  verified on paper.
- **Aperçu Motion:** `content-bible/` (Emil + world canon), `episodes/` collection +
  `_template`, `plugins/apercu-studio/` skills (`/apercu-story`, `-canon`, `-storyboard`,
  `-modelsheet`, `-rive`, `-publish`, `-captions`). See
  [`docs/PHASE-2-COMMUNITY.md`](PHASE-2-COMMUNITY.md).
- Verified each pass: `astro check` 0 errors, production build green.

## Next (pick up here)

1. **Deploy to Infomaniak** — needs the Manager (I can't do it): connect `rabdabi/apercu`,
   Node 22, build `npm ci && npm run build`, start `npm start`, env `NODE_ENV=production` +
   `PUBLIC_SITE_URL=https://apercu.org`, let it inject `PORT`. Private repo → add
   Infomaniak's deploy key or make repo public. Steps: [`docs/DEPLOY-INFOMANIAK.md`](DEPLOY-INFOMANIAK.md).
2. Optional: flip repo public (one command) for the Git connection; add a GitHub Actions
   deploy once the deploy key exists.
3. Content: replace the *illustrative* figures in `achtzehn-milliarden` with sourced
   numbers (SourceNote slots are wired); real photography/film swaps into media `src`.
4. Real Emil: run `/apercu-modelsheet` → model sheet; drop a `.riv` at
   `public/episodes/<slug>/emil.riv` to activate the living character.
5. Later phases: community/auth, the agentic Aperçu (Phase 2 doc).

## Key commands

`npm run dev` · `npm run build` · `npm start` · `npm run check` · `npm test` ·
`npm run db:generate` / `db:migrate`.
