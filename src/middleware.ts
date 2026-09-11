import { defineMiddleware } from 'astro:middleware';

/**
 * Baseline security headers applied to every response. The CSP is intentionally
 * pragmatic for v1 (self-hosted assets, no third-party origins) and permits
 * inline styles/scripts that Astro's island hydration and view transitions
 * emit. Tightening to nonces is noted as a follow-up in docs.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), interest-cohort=()',
  );

  return response;
});
