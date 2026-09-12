# Deploying Aperçu to Infomaniak (managed Node.js)

This guide describes deploying Aperçu to **Infomaniak's managed Node.js hosting** with
GitHub as the source of truth. It contains **no credentials** — every secret is entered
in the Infomaniak Manager or your Git provider, never in this repository.

## Domains

- **Deploy target now:** `apercu.tech` — attach this and set
  `PUBLIC_SITE_URL=https://apercu.tech`.
- **Future master:** `apercu.org` — currently **inactive**. When it goes live, point it at
  the same app, change `PUBLIC_SITE_URL` to `https://apercu.org`, rebuild, and 301 the
  other host to it.

## Repository access (private repo)

`rabdabi/apercu` is **private**. Two supported ways for Infomaniak to pull it — no
credentials go in this repo:

1. **GitHub authorization** — in the Manager's Git step, authorize Infomaniak's GitHub
   integration for your account; select `rabdabi/apercu` and branch `main`. (Simplest.)
2. **SSH deploy key** — if the Manager gives you a public key, add it under
   GitHub → the repo → **Settings → Deploy keys** (read-only is enough), then use the
   SSH clone URL.

## What the app expects

| Setting              | Value                                                         |
| -------------------- | ------------------------------------------------------------- |
| Node version         | **22 LTS** (matches `.nvmrc` and `engines`)                   |
| Execution directory  | `./` (repository root)                                        |
| Build command        | `npm ci && npm run build`                                     |
| Start command        | `npm start` → `node ./dist/server/entry.mjs`                  |
| Listening port       | **Injected by Infomaniak via `PORT`** — do not hard-code      |
| Entry after build    | `dist/server/entry.mjs`                                       |

The standalone server reads `process.env.PORT` (and `HOST`) automatically. Locally it
defaults to `4321`; in production it binds whatever port Infomaniak provides.

## Step-by-step

1. **Create the Node.js site.** In the Infomaniak Manager, add a new Node.js
   application for your domain/subdomain.
2. **Choose custom installation** (not a one-click template) so you control the build
   and start commands.
3. **Connect the Git repository.** Point it at the GitHub repository and the branch you
   deploy from (e.g. `main`).
4. **Select Node.js 22 LTS** to match this project.
5. **Configure the build command:** `npm ci && npm run build`.
   (`npm ci` requires the committed `package-lock.json`, which is present.)
6. **Configure the start command:** `npm start`.
7. **Align the port.** Ensure Infomaniak's expected application port and the port passed
   to the app as `PORT` agree. The app binds `process.env.PORT`; do not set a fixed port
   in code or in the start command.
8. **Set environment variables** in the Manager:
   - `NODE_ENV=production`
   - `PUBLIC_SITE_URL=https://your-domain` (e.g. `https://apercu.tech`)
   - `PORT` — only if Infomaniak asks you to set it explicitly; otherwise it is provided.
9. **Configure `DATABASE_URL`** _only if_ you enable MariaDB:
   `mysql://USER:PASSWORD@HOST:PORT/DATABASE`. Create the database in the Manager first,
   then run migrations (see below). Without it, the site runs fine but form submissions
   are not persisted (they return an explicit non-persistent response).
10. **Attach the domain** `apercu.tech` to the application.
11. **Enable the HTTPS certificate** (Let's Encrypt) for `apercu.tech`.
12. **Build** the application from the Manager.
13. **Start / restart** the application.
14. **Verify `/api/health`** returns `{"status":"ok", ...}` and shows
    `"database":"configured"` once `DATABASE_URL` is set.
15. **Verify the homepage and the demo story** (`/` and
    `/stories/achtzehn-milliarden`) render correctly.
16. **Check the execution logs** in the Manager for build/runtime errors.

## Database migrations on Infomaniak

Migrations are committed under `./drizzle`. With `DATABASE_URL` configured, apply them
once (via an SSH session or a one-off command runner, per your Infomaniak plan):

```bash
npm run db:migrate
```

If your plan has no shell access, run `npm run db:migrate` locally against the remote
`DATABASE_URL`, or execute the generated SQL in `drizzle/*.sql` via the database manager.

## Security headers (important)

Astro middleware sets security headers (`Content-Security-Policy`, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) on **dynamic**
routes (the API and error pages). **Prerendered pages are static files and bypass
middleware**, so to apply these headers site-wide, configure them at the Infomaniak /
reverse-proxy layer (custom response headers) using the same values found in
[`src/middleware.ts`](../src/middleware.ts). The v1 app ships no auth or cookies, so this
is hardening rather than a blocker.

## Rate limiting note

The form rate limiter is **in-memory and per-instance** (see
[`src/lib/rate-limit.ts`](../src/lib/rate-limit.ts)). It resets on restart and is not
shared across multiple instances. For multi-instance production, back it with the
database or a shared store.

## Zero-downtime redeploys

Deploys are driven by pushing to the connected branch. Rebuild + restart from the
Manager (or your configured auto-deploy). No deployment secrets live in the repository,
so the included GitHub Actions workflow only runs checks/build on pull requests — it
does **not** deploy.
