// AI SEO check, run after every build. Reads the built pages in ./dist and writes dist/admin/aiseo.json,
// which fackt.io/admin/stats shows as "AI SEO": a score per page, what to fix, and which questions people ask
// AI assistants the site already answers. No network calls; it only reads the built files.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SKIP = /^(admin|who-a\d|who-b|who-c|404|privacy)(\/|\.html$)|^free\/.*\/thanks/;
// List pages link out to the content; they are not meant to carry 300 words of their own.
const LIST_PAGES = new Set(['/blog', '/work']);

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;/g, ' ').replace(/&nbsp;/g, ' ');
const attr = (tag, name) => { const m = new RegExp(`${name}=("([^"]*)"|'([^']*)')`, 'i').exec(tag); return m ? decode(m[2] ?? m[3] ?? '') : null; };
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const pages = [];
for (const file of walk(DIST)) {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  if (SKIP.test(rel)) continue;
  const html = readFileSync(file, 'utf8');
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;
  const path = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  // The page content: everything in <body> except the site header, nav and footer.
  const body = (/<body[\s\S]*?<\/body>/i.exec(html) || [html])[0];
  const main = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<header[^>]*data-nav[\s\S]*?<\/header>/gi, '').replace(/<(nav|footer)\b[\s\S]*?<\/\1>/gi, '');
  const title = decode((/<title>([\s\S]*?)<\/title>/i.exec(html) || [, ''])[1]).trim();
  const descTag = /<meta[^>]+name="description"[^>]*>/i.exec(html)?.[0];
  const desc = descTag ? attr(descTag, 'content') || '' : '';
  const h1s = (main.match(/<h1[\s>]/gi) || []).length;
  const headings = [...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => text(m[1]));
  const questions = headings.filter((h) => /\?\s*$/.test(h)).length + (main.match(/<summary[\s>]/gi) || []).length;
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => { try { const j = JSON.parse(m[1]); return Array.isArray(j) ? j : [j]; } catch { return []; } });
  const types = [...new Set(ld.map((x) => x['@type']).flat().filter(Boolean))];
  const rich = types.filter((t) => !['Organization', 'WebSite', 'ProfessionalService', 'LocalBusiness'].includes(t));
  const faqLd = types.includes('FAQPage') ? 1 : 0;
  const words = text(main).split(' ').filter((w) => /\w/.test(w)).length;
  const links = new Set([...main.matchAll(/<a[^>]+href="(\/[^"#?]*)/gi)].map((m) => m[1]).filter((h) => h !== path)).size;
  const imgs = [...main.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
  // alt="" marks a decorative image (an avatar next to a name, a thumbnail next to its title), which is correct. Only a missing alt counts.
  const noAlt = imgs.filter((t) => attr(t, 'alt') === null).length;
  const canonical = /<link[^>]+rel="canonical"/i.test(html);
  const og = /<meta[^>]+property="og:image"/i.test(html);

  const checks = [
    ['Title between 20 and 65 characters', title.length >= 20 && title.length <= 65, 10, `Title is ${title.length} characters.`],
    ['Description between 70 and 170 characters', desc.length >= 70 && desc.length <= 170, 10, desc ? `Description is ${desc.length} characters.` : 'No meta description.'],
    ['One H1', h1s === 1, 10, `${h1s} H1 headings.`],
    ['Structured data beyond the basics', rich.length > 0, 15, rich.length ? `Has ${rich.join(', ')}.` : 'Only site-wide schema. Add Article, Service, FAQPage or CreativeWork.'],
    ['Enough text for an AI to quote (300+ words)', words >= 300 || LIST_PAGES.has(path), 15, `${words} words in the main content.`],
    ['Answers questions (FAQ or question headings)', questions + faqLd > 0 || LIST_PAGES.has(path), 15, questions ? `${questions} questions answered.` : 'No question headings or FAQ. AI assistants quote direct answers to questions.'],
    ['Links to 3+ other pages', links >= 3, 10, `${links} internal links.`],
    ['Every image has alt text', noAlt === 0, 5, noAlt ? `${noAlt} images without alt text.` : 'All images described.'],
    ['Canonical URL and share image', canonical && og, 10, `${canonical ? 'Canonical set' : 'No canonical'}, ${og ? 'share image set' : 'no share image'}.`],
  ];
  const score = checks.reduce((a, [, ok, w]) => a + (ok ? w : 0), 0);
  pages.push({ path, title, score, words, text: text(main).toLowerCase(),
    fixes: checks.filter(([, ok]) => !ok).map(([name, , w, why]) => ({ name, why, weight: w })).sort((a, b) => b.weight - a.weight) });
}

// Questions people ask AI assistants before hiring a studio like Fackt. A page "answers" one when it contains all the key terms.
const QUESTIONS = [
  ['How much does SaaS product design cost?', ['$', 'retainer', 'project']],
  ['How long does a SaaS product design project take?', ['weeks', 'project']],
  ['Who is a good UI/UX design agency for SaaS startups?', ['saas', 'product design', 'startup']],
  ['Framer or Webflow for a SaaS landing page?', ['framer', 'webflow', 'landing page']],
  ['What does a UX audit include?', ['audit', 'video', 'written']],
  ['How do I improve SaaS onboarding?', ['onboarding', 'first win']],
  ['What should a SaaS landing page have above the fold?', ['above the fold', 'landing page']],
  ['Can a design agency build the website in code?', ['code', 'framer', 'webflow']],
  ['Does Fackt design mobile apps?', ['mobile app', 'ios']],
  ['How does a design retainer work?', ['retainer', 'unlimited', 'pause']],
  ['Do I need a brand identity before Series A?', ['brand', 'series a']],
  ['What is included in a SaaS dashboard redesign?', ['dashboard', 'redesign']],
];
const answered = QUESTIONS.map(([q, terms]) => {
  const n = (p) => terms.reduce((a, t) => a + p.text.split(t).length - 1, 0);
  const hits = pages.filter((p) => terms.every((t) => p.text.includes(t))).sort((a, b) => n(b) - n(a) || b.score - a.score);
  return { q, page: hits[0]?.path || null, title: hits[0]?.title || null };
});

const site = {
  llms: existsSync(join(DIST, 'llms.txt')),
  sitemap: existsSync(join(DIST, 'sitemap.xml')),
  robotsAllowsAI: existsSync(join(DIST, 'robots.txt')) && !/User-agent:\s*(GPTBot|ClaudeBot|PerplexityBot)[\s\S]*?Disallow:\s*\/\s*$/im.test(readFileSync(join(DIST, 'robots.txt'), 'utf8')),
};
const avg = pages.length ? Math.round(pages.reduce((a, p) => a + p.score, 0) / pages.length) : 0;
const out = {
  generated: Date.now(), average: avg, site,
  pages: pages.sort((a, b) => a.score - b.score).map(({ text: _t, ...p }) => p),
  questions: answered,
};
mkdirSync(join(DIST, 'admin'), { recursive: true });
writeFileSync(join(DIST, 'admin', 'aiseo.json'), JSON.stringify(out));
console.log(`AI SEO: ${pages.length} pages, average ${avg}/100, ${answered.filter((a) => a.page).length}/${answered.length} questions answered`);
