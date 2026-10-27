// llms.txt: a plain-text summary of Fackt for AI assistants (ChatGPT, Claude, Perplexity...), built at deploy time
// from the same data as the site, so it stays current. Spec: https://llmstxt.org
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { servicePages } from '../data/servicePages';
import { publishedPosts } from '../data/blog';
import auditJson from '../content/settings/audit.json';

export async function GET() {
  const u = (p: string) => new URL(p, site.url).toString();
  const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
  const posts = await publishedPosts();
  const pricingFaq = servicePages[0]?.faq.find((f) => /cost|price|pricing/i.test(f.q));
  const body = `# Fackt

> ${site.description}

Fackt is a product design studio founded by Dominik Mészáros (Dom), based in ${site.location} and working with clients worldwide. It designs SaaS products, dashboards, mobile apps and websites for founders and teams, and builds websites in Framer, Webflow or code. Contact: ${site.email}.

## Key facts

- Services: SaaS product design (UX audits, user flows, UI, design systems, prototypes, mobile apps), web design and development (Framer, Webflow, custom code), motion design, visual branding.
- Pricing: ${pricingFaq ? pricingFaq.a : 'See the pricing section on the homepage.'}
- Free product audit: ${auditJson.text}
- Free 30 minute strategy call with Dom: ${u(site.bookPage)}
- Who it is for: early-stage and funded SaaS teams, mobile app startups and agencies. More: ${u('/who-we-work-with')}

## Services

${servicePages.map((s) => `- [${s.seoTitle.split("|")[0].trim()}](${u(`/services/${s.slug}`)}): ${s.seoDescription}`).join('\n')}

## Case studies

${work.map((w) => `- [${w.data.name}: ${w.data.service}](${u(`/work/${w.id}`)}): ${w.data.summary}`).join('\n')}
${posts.length ? `
## Notes (blog)

${posts.map((p) => `- [${p.data.title}](${u(`/blog/${p.id}`)}): ${p.data.description}`).join('\n')}
` : ''}
## Optional

- [Free product audit](${u('/audit')})
- [Book a call](${u(site.bookPage)})
- [Privacy](${u('/privacy')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
