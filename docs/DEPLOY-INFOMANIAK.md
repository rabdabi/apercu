# Deploying Aperçu to Infomaniak (managed Node.js)

Aperçu runs on **Infomaniak's managed Node.js hosting**, imported from GitHub
(`rabdabi/apercu`) as a **pull-based** site — Infomaniak's `origin` remote *is* GitHub,
and updates are pulled into the site's folder, not pushed to an Infomaniak-issued remote.
The Manager has **no dedicated environment-variables section** on this hosting tier
(confirmed against Infomaniak's own docs) — only `PORT` is auto-injected — so any other
env var is set by prefixing the Launch Command.

## Repository access (git pull deploy)

The site folder on the server (`~/sites/apercu`, i.e.
`/home/clients/<client-id>/sites/apercu`) is a git checkout whose `origin` is
`https://github.com/rabdabi/apercu.git`, branch `main`. There is no `infomaniak` git
remote to push to locally.

Deploy flow:

1. Push to GitHub as usual: `git push origin main`.
2. In the Manager, click **Build** on the Node.js site — its Build Command runs
   `git pull` before rebuilding (see below), so this is what actually fetches your
   latest commit onto the server.
3. Click **Restart** to make the new build live.

This only works unattended because the repo pull already succeeds without a credential
prompt on that server (verified via SSH: `cd ~/sites/apercu && git pull`). If that ever
starts prompting for a username/password (e.g. after credentials expire), either make
the repo public or switch that `origin` URL on the server to
`https://<user>:<token>@github.com/rabdabi/apercu.git`.

## What the app expects (Manager → site → Manage advanced settings → Node.js tab)

| Setting             | Value                                                    |
| -------------------- | -------------------------------------------------------- |
| Node.js version      | **22 LTS** (matches `.nvmrc` and `engines`)               |
| Execution Folder      | `./` (repo root — `package.json` lives at the top level) |
| Build Command        | `git pull && npm ci && npm run build`                     |
| Launch Command        | `NODE_ENV=production npm start` → `node ./dist/server/entry.mjs` |
| Listening Port        | **Injected by Infomaniak via `PORT`** — do not hard-code  |

The standalone server reads `process.env.PORT` (and `HOST`) automatically. Locally it
defaults to `4321`; in production it binds whatever port Infomaniak provides.

`PUBLIC_SITE_URL` does **not** need to be set — `astro.config.mjs` already defaults to
`https://apercu.org` when the env var is absent. Only set it explicitly (via the Launch
Command prefix, same pattern as `NODE_ENV`) if the production domain ever changes again
and you don't want to edit code for it.

## Step-by-step (already done once; repeat only if rebuilding from scratch)

1. **Create the Node.js site** in the Infomaniak Manager for the domain/subdomain.
2. **Choose custom installation** (not a one-click template) so you control build/launch
   commands.
3. **Import source from Git**: give it the GitHub repo URL (public repo, or
   `https://<user>:<token>@github.com/...` for a private one via HTTP Basic auth).
4. **Select Node.js 22 LTS.**
5. **Set Build Command:** `git pull && npm ci && npm run build`
   (`npm ci` requires the committed `package-lock.json`, which is present).
6. **Set Launch Command:** `NODE_ENV=production npm start`.
7. **Leave the port** to whatever Infomaniak injects via `PORT` — never hard-code it.
8. **Configure `DATABASE_URL`** _only if_ you enable MariaDB — since there's no env-var
   UI, prefix it the same way: `DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
   NODE_ENV=production npm start`. Create the database in the Manager first, then run
   migrations (see below). Without it, the site runs fine but form submissions are not
   persisted (they return an explicit non-persistent response).
9. **Attach the domains** `apercu.org` and `www.apercu.org` to the application (one
   redirects to the other — pick apex or `www` as canonical).
10. **Enable the HTTPS certificate** (Let's Encrypt) for both `apercu.org` and
    `www.apercu.org`.
11. **Build** the application from the Manager (pulls + installs + builds).
12. **Restart** the application.
13. **Verify `/api/health`** returns `{"status":"ok", ...}`, `"environment":"production"`,
    and shows `"database":"configured"` once `DATABASE_URL` is set.
14. **Verify the homepage and the demo story** (`/` and
    `/stories/achtzehn-milliarden`) render correctly.
15. **Check the execution logs** in the Manager for build/runtime errors.

## Database migrations on Infomaniak

Migrations are committed under `./drizzle`. With `DATABASE_URL` configured, apply them
once via SSH:

```bash
cd ~/sites/apercu
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

## Redeploys

Deploys are driven by `git push origin main` (from your machine) followed by clicking
**Build** then **Restart** in the Manager — there is no push-to-deploy webhook on this
hosting tier, so the Build/Restart click is a required manual step after each push. No
deployment secrets live in the repository; the included GitHub Actions workflow only
runs checks/build on pull requests against GitHub — it does **not** deploy.
