import { getCollection, type CollectionEntry } from 'astro:content';
import { isProduction } from './env';

export type Story = CollectionEntry<'stories'>;

/** Words-per-minute for reading-time estimates (German long-form ≈ 200 wpm). */
const WPM = 200;

export function estimateReadingMinutes(body: string | undefined, override?: number): number {
  if (override) return override;
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

/** Draft stories are visible in dev, hidden in production. */
export async function getPublishedStories(): Promise<Story[]> {
  const stories = await getCollection('stories', ({ data }) =>
    isProduction ? data.draft === false : true,
  );
  return stories.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export async function getFeaturedStory(): Promise<Story | undefined> {
  const stories = await getPublishedStories();
  return stories.find((s) => s.data.featured) ?? stories[0];
}

/** All distinct topics with counts, most frequent first. */
export async function getTopics(): Promise<{ topic: string; count: number }[]> {
  const stories = await getPublishedStories();
  const counts = new Map<string, number>();
  for (const s of stories) {
    for (const topic of s.data.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}
