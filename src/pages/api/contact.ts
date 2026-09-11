import type { APIRoute } from 'astro';
import { json, parseBody, BodyError } from '@/lib/api';
import { contactSchema } from '@/lib/schemas';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { getDb } from '@/db/client';
import { contactSubmissions } from '@/db/schema';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const limit = rateLimit(`ct:${clientIp(request, clientAddress)}`, 3, 60_000);
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    if (body.website) return json({ ok: true, persisted: false });
    return json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Bitte Eingaben prüfen.' },
      { status: 422 },
    );
  }

  const db = getDb();
  if (!db) {
    return json({
      ok: true,
      persisted: false,
      mode: 'development',
      message: 'DATABASE_URL not configured; submission not stored.',
    });
  }

  try {
    await db.insert(contactSubmissions).values({
      id: crypto.randomUUID(),
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return json({ ok: true, persisted: true });
  } catch (err) {
    console.error('contact insert failed:', err);
    return json({ ok: false, error: 'Senden fehlgeschlagen.' }, { status: 500 });
  }
};
