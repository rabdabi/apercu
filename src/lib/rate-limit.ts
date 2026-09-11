/**
 * Minimal in-memory fixed-window rate limiter for form endpoints.
 *
 * Deliberately simple: this is baseline abuse protection, not a distributed
 * quota system. It resets on restart and is per-instance only — documented as
 * such in docs/DEPLOY-INFOMANIAK.md. For multi-instance production, back this
 * with the database or a shared store.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: allowed ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** Best-effort client IP from proxy headers, falling back to the socket address. */
export function clientIp(request: Request, fallback?: string): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? fallback ?? 'unknown';
}

// Opportunistic cleanup so the map cannot grow unbounded.
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, 300_000);
  // Do not keep the process alive solely for cleanup.
  timer.unref?.();
}
