// Cloudflare Worker entry: serves the built site from ./dist and handles the three API routes.
// The route handlers live in functions/api (they also work on Cloudflare Pages).
// It also logs AI and search crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot...) to Supabase,
// so fackt.io/admin/stats can show which pages AI assistants are reading. Visitors are not affected.
import * as auth from '../functions/api/auth.js';
import * as callback from '../functions/api/callback.js';
import * as form from '../functions/api/form.js';

// [user-agent pattern, name, kind]. kind: ai_training (builds models), ai_search (AI answer engines),
// ai_user (an assistant fetching a page because a person asked it), search (classic search engines).
const BOTS = [
  [/GPTBot/i, 'GPTBot (OpenAI)', 'ai_training'],
  [/OAI-SearchBot/i, 'OAI-SearchBot (ChatGPT search)', 'ai_search'],
  [/ChatGPT-User/i, 'ChatGPT-User', 'ai_user'],
  [/ClaudeBot/i, 'ClaudeBot (Anthropic)', 'ai_training'],
  [/Claude-SearchBot/i, 'Claude-SearchBot', 'ai_search'],
  [/Claude-User/i, 'Claude-User', 'ai_user'],
  [/anthropic-ai/i, 'anthropic-ai', 'ai_training'],
  [/PerplexityBot/i, 'PerplexityBot', 'ai_search'],
  [/Perplexity-User/i, 'Perplexity-User', 'ai_user'],
  [/Google-CloudVertexBot|Google-Extended/i, 'Google AI', 'ai_training'],
  [/Applebot-Extended/i, 'Applebot-Extended', 'ai_training'],
  [/Applebot/i, 'Applebot', 'search'],
  [/meta-externalagent|meta-externalfetcher|FacebookBot/i, 'Meta AI', 'ai_training'],
  [/Amazonbot/i, 'Amazonbot', 'ai_training'],
  [/Bytespider/i, 'Bytespider (ByteDance)', 'ai_training'],
  [/CCBot/i, 'CCBot (Common Crawl)', 'ai_training'],
  [/cohere-ai|cohere-training/i, 'Cohere', 'ai_training'],
  [/MistralAI-User/i, 'MistralAI-User', 'ai_user'],
  [/DuckAssistBot/i, 'DuckAssistBot', 'ai_search'],
  [/YouBot/i, 'YouBot', 'ai_search'],
  [/Googlebot/i, 'Googlebot', 'search'],
  [/bingbot/i, 'Bingbot', 'search'],
  [/DuckDuckBot/i, 'DuckDuckBot', 'search'],
  [/YandexBot/i, 'YandexBot', 'search'],
  [/SeznamBot/i, 'SeznamBot', 'search'],
];
const CRAWL_URL = 'https://iasgepbkdqyhjoxjfkrh.supabase.co/functions/v1/crawl';
// Only pages and the files AI tools read, not images, fonts or scripts.
const isPage = (p) => !/\.(webp|png|jpe?g|gif|svg|ico|mp4|webm|woff2?|css|js|json|map|xml\.gz)$/i.test(p) && !p.startsWith('/_') && !p.startsWith('/uploads/');

function detect(ua) {
  for (const [re, name, kind] of BOTS) if (re.test(ua)) return { name, kind };
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const ctxApi = { request, env };
    if (pathname === '/api/auth') return auth.onRequest(ctxApi);
    if (pathname === '/api/callback') return callback.onRequest(ctxApi);
    if (pathname === '/api/form') {
      return request.method === 'POST' ? form.onRequestPost(ctxApi) : new Response('Method not allowed', { status: 405 });
    }
    const res = await env.ASSETS.fetch(request);
    const bot = request.method === 'GET' && isPage(pathname) ? detect(request.headers.get('user-agent') || '') : null;
    if (bot && env.CRAWL_KEY) {
      ctx.waitUntil(fetch(CRAWL_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-crawl-key': env.CRAWL_KEY },
        body: JSON.stringify({ bot: bot.name, kind: bot.kind, path: pathname, status: res.status }),
      }).catch(() => {}));
    }
    return res;
  },
};
