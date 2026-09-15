# Aperçu — project status & handoff

_Last updated: 2026-09-12. Read this first to resume cold._

**Repo:** https://github.com/rabdabi/apercu (private, branch `main`, fully pushed)
**Production domain (target):** https://apercu.tech — not yet deployed.
**Local:** `nvm use` (Node 22) · `npm install` · `npm run dev` → http://localhost:4321

## What Aperçu is

A German-language storytelling platform (Astro 5 SSR, Node standalone, TypeScript
strict, Tailwind v4 tokens, MariaDB-ready). **Video-first:** the homepage leads with an
explainer + the animated character **Emil** + the character's films; the **journalism
(text) is a parallel track at `/perspectives`** (renamed from /stories; old URLs 301).
Powered by **Aperçu Motion** — a semi-automated pipeline for the animated world
(Moho films, Rive on the web).

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
- **Video-first re-architecture:** homepage rebuilt (explainer + animated `EmilFigure` +
  "Die Filme" featuring *Achtzehn Milliarden* as film → link to text); journalism moved
  to `/perspectives` (nav "Perspektiven", `/stories/*` → 301). Emil master-character
  brief at `content-bible/characters/emil/modelsheet-brief.md`; visible SVG stand-in
  `src/components/story/EmilFigure.astro` (also in the Rive placeholder). Asset swap
  paths in `docs/media-manifest.md`.
- **Movie plan pre-produced (text/specs; hands-on animation is yours):** method decided —
  **hand-directed Rive + Moho, solo, smallest-first**. Phase 0 Emil
  `content-bible/characters/emil/modelsheet-brief.md`; Phase 1 `…/rive-build-guide.md`;
  Phase 2 first short (gates 01–04) `episodes/kurzfilm-01-emil-geht/`; Phase 3 flagship
  film script (gates 01–02) `episodes/achtzehn-milliarden/`. **Next real progress is
  yours: Phase 0** (generate Emil's frames). Nothing more to pre-produce until then.
- **Homepage Emil is now alive:** `EmilFigure` is runtime-reactive (idle breathe/blink +
  sway, poses idle/walk/wave/point/shocked/look_up), sticky on desktop, and switches pose
  from the **same `emil:state` event** that `ScrollScene` dispatches and `RiveCharacter`
  consumes — so the scroll wiring is identical to the real Rive rig (only the figure swaps
  later). Reduced-motion → static idle. Homepage sections tagged idle→look_up→shocked→wave.
- **Pointer interactions (cursor-follow / hover / click) → Rive, via a ready-to-run prompt:**
  `docs/prompts/emil-rive-cli.md` is a self-contained brief to paste into a new session —
  it builds Emil's `.riv` with the **Rive CLI + RML** (eyes follow cursor, hover + click
  reactions), then wires it in (`public/media/emil.riv`, enhance `RiveCharacter.tsx` to feed
  `pointerX/Y`, swap the homepage). Runs against the existing `state` / `emil:state` contract.
- Verified each pass: `astro check` 0 errors, production build green.

## Next (pick up here)

1. **Deploy to Infomaniak** — needs the Manager (I can't do it): connect `rabdabi/apercu`,
   Node 22, build `npm ci && npm run build`, start `npm start`, env `NODE_ENV=production` +
   `PUBLIC_SITE_URL=https://apercu.tech`, let it inject `PORT`. Private repo → add
   Infomaniak's deploy key or make repo public. Steps: [`docs/DEPLOY-INFOMANIAK.md`](DEPLOY-INFOMANIAK.md).
2. Optional: flip repo public (one command) for the Git connection; add a GitHub Actions
   deploy once the deploy key exists.
3. ~~Source the `achtzehn-milliarden` figures~~ **DONE** — now real & cited (CNBC,
   TechCrunch, WSJ/Gulf News). Remaining: swap generated visuals for real
   photography/film via media `src` when available.
4. Real Emil: run `/apercu-modelsheet` → model sheet; drop a `.riv` at
   `public/episodes/<slug>/emil.riv` to activate the living character.
5. Later phases: community/auth, the agentic Aperçu (Phase 2 doc).

## Key commands

`npm run dev` · `npm run build` · `npm start` · `npm run check` · `npm test` ·
`npm run db:generate` / `db:migrate`.
