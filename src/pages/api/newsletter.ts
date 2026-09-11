import type { APIRoute } from 'astro';
import { json, parseBody, BodyError } from '@/lib/api';
import { newsletterSchema } from '@/lib/schemas';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { getDb } from '@/db/client';
import { newsletterSubscriptions } from '@/db/schema';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Basic abuse protection: per-IP fixed window.
  const limit = rateLimit(`nl:${clientIp(request, clientAddress)}`, 5, 60_000);
  if (!limit.allowed) {
    return json(
      { ok: false, error: 'Zu viele Anfragen. Bitte kurz warten.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfterSeconds) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await parseBody(request);
  } catch (e) {
    const status = e instanceof BodyError ? e.status : 400;
    return json({ ok: false, error: 'Ungültige Anfrage.' }, { status });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot triggers a max(0) failure; respond generically without detail.
    if (body.website) return json({ ok: true, persisted: false });
    return json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' },
      { status: 422 },
    );
  }

  const db = getDb();
  if (!db) {
    // Explicit, non-persistent development mode — never masquerades as storage.
    return json({
      ok: true,
      persisted: false,
      mode: 'development',
      message: 'DATABASE_URL not configured; submission not stored.',
    });
  }

  try {
    await db
      .insert(newsletterSubscriptions)
      .values({ id: crypto.randomUUID(), email: parsed.data.email, locale: 'de' })
      .onDuplicateKeyUpdate({ set: { email: parsed.data.email } });
    return json({ ok: true, persisted: true });
  } catch (err) {
    console.error('newsletter insert failed:', err);
    return json({ ok: false, error: 'Speichern fehlgeschlagen.' }, { status: 500 });
  }
};
