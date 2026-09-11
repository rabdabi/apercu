import { MAX_BODY_BYTES } from './schemas';

/** JSON response with no-store caching (form + health endpoints). */
export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...init.headers,
    },
  });
}

/**
 * Parse a request body as either JSON or url-encoded form data, enforcing a
 * hard size cap. Returns a record of string values (forms are always strings).
 * Throws {@link BodyError} on oversize or malformed input.
 */
export class BodyError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const lengthHeader = request.headers.get('content-length');
  if (lengthHeader && Number(lengthHeader) > MAX_BODY_BYTES) {
    throw new BodyError('Payload too large', 413);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) throw new BodyError('Payload too large', 413);

  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
      throw new BodyError('Invalid JSON body');
    } catch {
      throw new BodyError('Invalid JSON body');
    }
  }

  // Fallback: url-encoded form (native form submit without JS).
  return Object.fromEntries(new URLSearchParams(raw));
}
