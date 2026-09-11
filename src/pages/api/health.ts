import type { APIRoute } from 'astro';
import { json } from '@/lib/api';
import { env, hasDatabase } from '@/lib/env';

export const prerender = false;

/**
 * GET /api/health — liveness + minimal, non-sensitive runtime facts.
 * Never exposes secrets or the connection string.
 */
export const GET: APIRoute = () =>
  json({
    status: 'ok',
    service: 'apercu',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: hasDatabase ? 'configured' : 'not-configured',
    uptimeSeconds: Math.round(process.uptime()),
  });
