import { getCollection } from 'astro:content';

// Published notes, newest first. Drafts stay out of every list, link and the sitemap.
export async function publishedPosts() {
  return (await getCollection('blog')).filter((p) => !p.data.draft).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export const readTime = (body = '', given?: string) => given || `${Math.max(2, Math.round(body.split(/\s+/).length / 220))} min`;
