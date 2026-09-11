import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Editorial content lives in Git as MDX — no database required to render a
 * story. A new story is a new folder with an index.mdx; files/folders prefixed
 * with `_` (e.g. _template.mdx) are ignored by the loader.
 */
const stories = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().max(200),
    lang: z.enum(['de', 'en']).default('de'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    authors: z.array(z.string()).default(['Apercu association']),
    topics: z.array(z.string()).default([]),
    // Hero visual is generated CSS/SVG by default; a real image can be added later.
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Optional override; otherwise reading time is estimated from body length.
    readingMinutes: z.number().int().positive().optional(),
    // Per-story accent (CSS color). Falls back to the global signal lime.
    accent: z.string().optional(),
    // Editorial disclaimer flag — set true for demo/illustrative content.
    illustrative: z.boolean().default(false),
  }),
});

export const collections = { stories };
