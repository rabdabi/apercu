// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The canonical production origin. Overridable at deploy time via PUBLIC_SITE_URL,
// but baked here as the default so the build (sitemap, canonical, OG) is correct
// even before env vars are set.
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://apercu.tech';

// Dev server port. In production the @astrojs/node standalone entry reads
// process.env.PORT itself (see docs/DEPLOY-INFOMANIAK.md), so we never hard-code
// a production port; this only affects `astro dev`.
const DEV_PORT = Number(process.env.PORT) || 4321;

export default defineConfig({
  site: SITE,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // Journalism moved from /stories to /perspectives; keep old URLs working.
  redirects: {
    '/stories': '/perspectives',
    '/stories/[...slug]': '/perspectives/[...slug]',
  },
  // German today; English wired in for a later phase without a refactor.
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), mdx(), sitemap()],
  prefetch: { defaultStrategy: 'hover' },
  server: { port: DEV_PORT, host: true },
  vite: {
    plugins: [tailwindcss()],
  },
});
