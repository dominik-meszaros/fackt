// Receives the site's forms (free audit, postcard) and emails them to you through Resend.
// Needs RESEND_API_KEY and FORM_TO (your email) in Cloudflare Pages > Settings > Variables and secrets.
// Optional FORM_FROM, e.g. "Fackt site <forms@fackt.io>" once fackt.io is verified in Resend.
const FORMS = {
  audit: { subject: (f) => `Free audit request: ${f.product || f.name || 'new'}`, fields: ['name', 'email', 'product', 'focus', 'stage', 'message'] },
  postcard: { subject: (f) => `Postcard from ${f.name || 'the site'}`, fields: ['name', 'email', 'product', 'note'] },
};
const clean = (v) => String(v ?? '').slice(0, 4000).trim();
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  let data;
  try { data = Object.fromEntries((await request.formData()).entries()); } catch { return json({ ok: false, error: 'Bad form data' }, 400); }
  if (clean(data.company_site)) return json({ ok: true }); // honeypot: quietly ignore bots
  const form = FORMS[clean(data['form-name'])];
  if (!form) return json({ ok: false, error: 'Unknown form' }, 400);
  const f = Object.fromEntries(form.fields.map((k) => [k, clean(data[k])]));
  if (!f.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return json({ ok: false, error: 'Email missing' }, 400);
  if (!env.RESEND_API_KEY || !env.FORM_TO) return json({ ok: false, error: 'Email is not set up yet' }, 500);
  const text = form.fields.map((k) => `${k}: ${f[k] || '-'}`).join('\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.FORM_FROM || 'Fackt site <onboarding@resend.dev>', to: [env.FORM_TO], reply_to: f.email, subject: form.subject(f), text }),
  });
  if (!res.ok) return json({ ok: false, error: 'Could not send' }, 502);
  return json({ ok: true });
}
