// CMS login, step 2: GitHub sends the editor back here; we swap the code for a token
// and hand it to the CMS window. Needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.
function page(origin, status, payload) {
  const msg = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return new Response(`<!doctype html><html><body><p>${status === 'success' ? 'Logged in, you can close this window.' : 'Login failed.'}</p><script>
(function () {
  var origin = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(${JSON.stringify(msg)}, origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Set-Cookie': 'cms_state=; Path=/api; Max-Age=0' } });
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)cms_state=([^;]+)/);
  if (!code || !state || !cookie || cookie[1] !== state) return page(origin, 'error', { message: 'Login expired, try again.' });
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return page(origin, 'error', { message: 'GitHub keys are not set in Cloudflare.' });
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'fackt-cms' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${origin}/api/callback` }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) return page(origin, 'error', { message: data.error_description || 'GitHub did not return a token.' });
  return page(origin, 'success', { token: data.access_token, provider: 'github' });
}
