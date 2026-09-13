import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublishedStories } from '@/lib/stories';

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const stories = await getPublishedStories();
  const site = context.site ?? new URL('https://apercu.org');

  return rss({
    title: 'Aperçu',
    description:
      'Langform-Journalismus über Technologie, Gesellschaft und die Systeme dazwischen.',
    site,
    items: stories.map((s) => ({
      title: s.data.title,
      description: s.data.description,
      pubDate: s.data.publishedAt,
      link: `/perspectives/${s.id.replace(/\/index$/, '')}`,
      categories: s.data.topics,
    })),
    customData: '<language>de-CH</language>',
  });
};
