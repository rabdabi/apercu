# Phase 2 — Community, accounts & the agentic Aperçu (design note)

This document records the **planned** next phase. None of it ships in v1. The point of
writing it now is that v1's data model and routing are shaped so these features slot in
without a rewrite — and so that authentication, which is security-critical, is built
deliberately rather than rushed.

> **Why not in v1?** Real accounts mean password/session handling, CSRF, account
> recovery, and abuse protection — a subsystem that must be security-reviewed before it
> touches real users. Shipping the editorial platform first keeps v1 real and live while
> auth is done properly.

## 1. Accounts & authentication

**Recommended approach:** session-based auth with a vetted library rather than a
hand-rolled one.

- **Library:** [Lucia](https://lucia-auth.com/)-style sessions, or Auth.js, backed by
  the existing MariaDB via Drizzle.
- **Credentials:** email + password with Argon2id hashing; optionally OAuth
  (Google/GitHub) to avoid storing passwords at all. OAuth client IDs/secrets would be
  Infomaniak env vars, never committed.
- **Sessions:** opaque session id in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie;
  server-side session records with sliding expiry.
- **CSRF:** double-submit token or `SameSite` + origin checks on state-changing routes.
- **Abuse:** move the in-memory rate limiter to a DB/shared-store backing; add login
  throttling and generic auth error messages.

### Schema additions (sketch)

```ts
users            { id, email (unique), display_name, password_hash?, created_at, role }
sessions         { id, user_id, expires_at, created_at }
oauth_accounts   { id, user_id, provider, provider_user_id (unique per provider) }
```

Newsletter/contact tables stay as-is; a subscription can later be linked to a `user_id`.

### Route/middleware additions

- `/api/auth/*` (register, login, logout, callback) — all `prerender = false`.
- Extend `src/middleware.ts` to resolve the session and attach `locals.user`.
- Gate community routes on `locals.user`; keep all editorial pages public and
  prerendered.

## 2. Community layer

Once accounts exist:

- **Discussion** attached to a story (`story_id` references the MDX `id`).
- **Moderation** roles via `users.role`.
- Keep editorial content in Git/MDX; community content in the database. The two never
  merge — stories remain reproducible from the repo.

## 3. The "agentic Aperçu"

A reader-facing research assistant is envisaged as a **later** capability, not v1:

- Server-side LLM proxy (never expose an API key to the client) with strict
  cost/rate controls and prompt/response logging.
- Grounded in published Aperçu stories (retrieval over the MDX corpus) so answers cite
  real articles.
- Gated behind an account and usage quotas.

Because the API layer already isolates server-only logic and the content corpus is
structured MDX, this can be added as a new `/api/*` surface plus an island, without
touching the editorial rendering path.

## Sequencing

1. Accounts + sessions (auth), security review, then enable login.
2. Community discussion on stories + moderation.
3. Agentic research assistant (grounded, quota-limited).
