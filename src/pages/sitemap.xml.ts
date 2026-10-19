// sitemap.xml: every public page, built at deploy time. Linked from robots.txt.
import { getCollection } from 'astro:content';
import { servicePages } from '../data/servicePages';
import { site } from '../data/site';

export async function GET() {
  const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
  const today = new Date().toISOString().slice(0, 10);
  const pages: [string, string][] = [
    ['/', '1.0'], ['/work', '0.9'], ['/services', '0.9'], ['/audit', '0.8'], ['/book', '0.8'],
    ...servicePages.map((s) => [`/services/${s.slug}`, '0.8'] as [string, string]),
    ...work.map((w) => [`/work/${w.id}`, '0.7'] as [string, string]),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, pr]) => `  <url><loc>${new URL(p, site.url).toString().replace(/\/$/, p === '/' ? '/' : '')}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
