# Aperçu

**Aperçu** is an editorial storytelling platform for long-form technology journalism —
essays, investigations, and data-driven narratives that are meant to be _read_, not
skimmed. It is built to feel like a publication, not a SaaS product.

- **Aesthetic:** retro × modern × dark × editorial — 1970s editorial modernism, a touch
  of the 1990s terminal, contemporary Swiss composition. Text-forward and restrained;
  motion supports the story rather than performing.
- **Content model:** stories live in Git as MDX, composed from a reusable set of
  storytelling primitives. Adding a story means adding a file — no CMS required.
- **Language:** German today; the i18n architecture is prepared for a second locale.

> The published demo story, **_Achtzehn Milliarden_**, uses clearly-labelled
> **illustrative placeholder figures**. Real, sourced numbers drop into the wired-up
> `SourceNote` slots later.

---

## Technology stack

| Concern         | Choice                                              |
| --------------- | --------------------------------------------------- |
| Framework       | [Astro 5](https://astro.build) (SSR, `output: server`) |
| Runtime         | Node.js 22 LTS via `@astrojs/node` (standalone)     |
| Language        | TypeScript (strict)                                 |
| Interactivity   | React islands — used **only** for the stat counter  |
| Motion          | [`motion`](https://motion.dev) (one island) + native CSS |
| Styling         | Tailwind CSS v4 + CSS design tokens                 |
| Content         | Astro Content Collections + MDX                     |
| Validation      | Zod                                                 |
| Database        | MariaDB / MySQL via Drizzle ORM + `mysql2`          |
| Fonts           | Self-hosted: Space Grotesk · Newsreader · Space Mono |

## Architecture overview

```mermaid
flowchart TD
  subgraph Client
    B[Browser]
  end

  subgraph Server["Node 22 · standalone SSR (node ./dist/server/entry.mjs)"]
    MW[Security-headers middleware]
    PR[Prerendered pages<br/>home · stories · index · about · 404]
    API["/api/health · /api/contact · /api/newsletter"]
    RSS[/rss.xml · sitemap/]
  end

  subgraph Content["Git-versioned content"]
    MDX[src/content/stories/*.mdx]
    PRIM[Story primitives]
  end

  subgraph Data["Optional persistence"]
    DB[(MariaDB / MySQL)]
  end

  B -->|GET pages| PR
  B -->|POST forms / fetch| API
  MDX --> PR
  PRIM --> PR
  API -->|when DATABASE_URL set| DB
  API -.->|no DATABASE_URL → explicit dev-noop| B
  MW --- API
```

Pages are **prerendered** for performance; the API routes and error pages are
server-rendered on demand. No database is required to render the site.

## Prerequisites

- **Node.js 22 LTS** (`nvm use` reads [`.nvmrc`](.nvmrc))
- npm 10+
- Optional: a MariaDB/MySQL database (only needed to persist form submissions)

## Local development

```bash
nvm use            # Node 22
npm install
cp .env.example .env
npm run dev        # http://localhost:4321
```

The frontend runs fully without a database. Submitting a form without `DATABASE_URL`
returns an explicit `{ ok: true, persisted: false, mode: "development" }` response —
it never pretends to have stored anything.

## Environment setup

Copy `.env.example` to `.env`. Keys:

| Variable          | Required | Notes                                                        |
| ----------------- | -------- | ------------------------------------------------------------ |
| `NODE_ENV`        | no       | `development` \| `production`                                |
| `PUBLIC_SITE_URL` | no\*     | Canonical origin (canonical/OG/sitemap). Client-exposed.     |
| `PORT`            | no       | Dev default 4321. **In production the platform injects it.** |
| `DATABASE_URL`    | no       | `mysql://user:pass@host:port/db`. Enables persistence.       |

\* Defaults to `https://apercu.tech` at build time; override per environment.

## Database setup

```bash
# 1. Point DATABASE_URL at your MariaDB/MySQL instance in .env
# 2. Generate SQL from the schema (already committed under ./drizzle)
npm run db:generate
# 3. Apply migrations
npm run db:migrate
```

Schema lives in [`src/db/schema.ts`](src/db/schema.ts): `newsletter_subscriptions`
(unique email) and `contact_submissions`, both with UUID ids and indexed timestamps.

## Available scripts

| Script                | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Dev server                                     |
| `npm run build`       | Production build → `dist/`                     |
| `npm start`           | Run the built server (`node ./dist/server/entry.mjs`) |
| `npm run check`       | Astro + TypeScript + content diagnostics       |
| `npm test`            | Vitest unit tests (validation logic)           |
| `npm run test:e2e`    | Playwright smoke tests (builds + serves first) |
| `npm run db:generate` | Generate Drizzle migration from schema         |
| `npm run db:migrate`  | Apply migrations                               |
| `npm run format`      | Prettier                                       |

## Build instructions

```bash
npm run build
npm start            # honours process.env.PORT
```

## Project structure

```
src/
  components/
    core/          BaseHead, Texture
    navigation/    SiteNav, SiteFooter
    story/         storytelling primitives (the "story engine")
    interactive/   React island (StatCounter) + forms
  content/
    stories/       MDX stories (+ _template.mdx)
  db/              Drizzle schema + lazy client
  layouts/         BaseLayout, StoryLayout
  lib/             env, i18n, schemas, rate-limit, stories, format, api
  pages/
    api/           health, contact, newsletter
    stories/       listing + [...slug]
    index/         the /index register
  styles/          global.css (design tokens)
public/            favicon, og image, robots.txt
drizzle/           generated migrations
docs/              deployment + phase-2 plan
```

## Adding a new story

1. Copy `src/content/stories/_template.mdx` into a new folder:
   `src/content/stories/<slug>/index.mdx`.
2. Fill in the typed frontmatter (validated by Zod — the build fails on mistakes).
3. Compose the body from the primitives:
   `import { ChapterIntro, PullQuote, StatRow, ... } from '@/components/story'`.
4. Add any local media to `public/images/` (or rely on the generated visuals).
5. `npm run dev` and read it end to end.
6. Commit. Set `draft: false` when it's ready to publish.

## Deployment

Infomaniak managed Node.js hosting — see
[`docs/DEPLOY-INFOMANIAK.md`](docs/DEPLOY-INFOMANIAK.md).

## Aperçu Motion (animation pipeline)

A semi-automated production system for a recurring 2D animated world (the character
**Emil**), integrated into this site:

- [`content-bible/`](content-bible/) — the Git-versioned canon (Emil, world rules,
  palette, motion language) that is the single source of truth.
- [`episodes/`](episodes/) — per-episode production folders (`_template/` shows the
  eight pipeline gates); the `episodes` content collection publishes each `episode.mdx`.
- [`plugins/apercu-studio/`](plugins/apercu-studio/) — Claude Code skills
  (`/apercu-story`, `/apercu-canon`) that read the bible and drive the pipeline.
- Living character on the site: `RiveCharacter` island + `ScrollScene` drive Emil's
  state from scroll position.

## Roadmap

Community accounts, authentication, and the "agentic Aperçu" are planned as a
deliberate next phase — see [`docs/PHASE-2-COMMUNITY.md`](docs/PHASE-2-COMMUNITY.md).
The database schema and route structure are already shaped to accommodate them.
