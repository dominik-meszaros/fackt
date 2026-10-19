// Cloudflare Worker entry: serves the built site from ./dist and handles the three API routes.
// The route handlers live in functions/api (they also work on Cloudflare Pages).
import * as auth from '../functions/api/auth.js';
import * as callback from '../functions/api/callback.js';
import * as form from '../functions/api/form.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const ctx = { request, env };
    if (pathname === '/api/auth') return auth.onRequest(ctx);
    if (pathname === '/api/callback') return callback.onRequest(ctx);
    if (pathname === '/api/form') {
      return request.method === 'POST' ? form.onRequestPost(ctx) : new Response('Method not allowed', { status: 405 });
    }
    return env.ASSETS.fetch(request);
  },
};
