import { z } from 'zod';

/**
 * Server-side environment validation. Parsed once at module load so a
 * misconfigured deployment fails loudly and early rather than at request time.
 * Only non-secret values are ever exposed to the client (PUBLIC_ prefix).
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PUBLIC_SITE_URL: z.string().url().default('http://localhost:4321'),
  // Optional: when absent, form persistence runs in explicit dev-noop mode.
  DATABASE_URL: z.string().min(1).optional(),
});

const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
});

if (!parsed.success) {
  console.error('✖ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. See .env.example.');
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
export const hasDatabase = Boolean(env.DATABASE_URL);
