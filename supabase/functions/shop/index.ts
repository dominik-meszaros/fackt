// Paid Figma files sold through Polar (fackt.io/p/<slug>).
//   POST /shop   Polar webhook, event order.paid. Verifies the signature (Standard Webhooks),
//                records the order once, emails the buyer the Figma link and tells Dom about the sale.
// Products and their Figma links live in public.shop_products; orders in public.shop_orders.
// Orders for Polar products that are not in shop_products (e.g. the Framer plugin) are recorded
// with product_slug null and nothing is sent.
// Secrets: POLAR_WEBHOOK_SECRET (Polar > Settings > Webhooks), RESEND_API_KEY (already set for /list).
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const FROM = Deno.env.get("LIST_FROM") || "Dom from Fackt <notes@fackt.io>";
const DOM = "dominik@fackt.io";
const enc = new TextEncoder();

const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function eq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function sign(key: Uint8Array, content: string) {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(await crypto.subtle.sign("HMAC", k, enc.encode(content)));
}

// Polar signs with the secret's raw bytes (its SDK base64-encodes the secret before handing it to
// Standard Webhooks, which decodes it again). A "whsec_" secret is base64 already, so try both.
async function verified(req: Request, body: string) {
  const secret = Deno.env.get("POLAR_WEBHOOK_SECRET") || "";
  const id = req.headers.get("webhook-id"), ts = req.headers.get("webhook-timestamp"), sig = req.headers.get("webhook-signature");
  if (!secret || !id || !ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const content = `${id}.${ts}.${body}`;
  const keys = [enc.encode(secret)];
  if (secret.startsWith("whsec_")) { try { keys.push(unb64(secret.slice(6))); } catch { /* not base64 */ } }
  const given = sig.split(" ").map((s) => s.split(",")[1]).filter(Boolean);
  for (const k of keys) {
    const expected = await sign(k, content);
    if (given.some((g) => eq(g, expected))) return true;
  }
  return false;
}

async function send(to: string, subject: string, html: string, text: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: DOM, subject, html, text }),
  });
  if (!r.ok) console.error("resend", r.status, await r.text());
  return r.ok;
}

function buyerEmail(title: string, url: string) {
  const p = (t: string) => `<p style="margin:0 0 16px;">${t}</p>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111;font-size:16px;line-height:1.6;">
<tr><td style="padding-bottom:22px;"><img src="https://fackt.io/icon-512.png" width="28" height="28" alt="Fackt" style="display:block;border-radius:4px;"></td></tr>
<tr><td>${p("Hey,")}${p(`Thanks for buying ${esc(title)}. Here is your file.`)}
<p style="margin:24px 0 24px;"><a href="${esc(url)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 20px;border-radius:4px;">Open the Figma file</a></p>
${p("In Figma, click <b>Duplicate</b> to save your own copy. Keep this email, the link works any time.")}
${p("If anything is unclear or you get stuck adapting it to your product, just reply. It comes straight to me.")}
${p("Dom")}</td></tr>
<tr><td style="padding-top:28px;border-top:1px solid #ececec;font-size:12.5px;line-height:1.6;color:#8a8a8a;">You bought ${esc(title)} on fackt.io. Your receipt comes separately from Polar. <a href="https://fackt.io/privacy" style="color:#8a8a8a;">Privacy</a> &middot; Fackt Labs LLC</td></tr>
</table></td></tr></table></body></html>`;
  const text = `Hey,\n\nThanks for buying ${title}. Here is your file:\n${url}\n\nIn Figma, click Duplicate to save your own copy. Keep this email, the link works any time.\n\nIf you get stuck, just reply. It comes straight to me.\n\nDom`;
  return { subject: `Your ${title} file`, html, text };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Not found", { status: 404 });
  const body = await req.text();
  if (!(await verified(req, body))) return new Response("invalid signature", { status: 403 });

  let ev: any;
  try { ev = JSON.parse(body); } catch { return new Response("bad json", { status: 400 }); }
  if (ev?.type !== "order.paid") return new Response("ignored"); // everything else: acknowledge and skip

  const o = ev.data || {};
  const email = String(o.customer?.email || o.customer_email || o.user?.email || "").trim().toLowerCase();
  const productId = String(o.product_id || o.product?.id || "");
  const { data: prod } = await db.from("shop_products").select("*").eq("polar_product_id", productId).maybeSingle();

  // Record once. A retried webhook finds the row and only delivers if the first try did not.
  const ins = await db.from("shop_orders").insert({
    polar_order_id: String(o.id), product_slug: prod?.slug || null, email,
    amount_cents: o.total_amount ?? o.amount ?? null, currency: o.currency || null, raw: ev,
  }).select("*").maybeSingle();
  let order = ins.data;
  if (ins.error) {
    const { data } = await db.from("shop_orders").select("*").eq("polar_order_id", String(o.id)).maybeSingle();
    order = data;
  }
  if (!order) { console.error("order insert", ins.error); return new Response("db error", { status: 500 }); }
  if (!prod || !prod.active || order.delivered_at) return new Response("ok");
  if (!email) { console.error("order without email", o.id); return new Response("ok"); }
  if (!prod.figma_url) { console.error("no figma_url for", prod.slug); return new Response("missing file", { status: 500 }); } // Polar retries

  const mail = buyerEmail(prod.title, prod.figma_url);
  if (!(await send(email, mail.subject, mail.html, mail.text))) return new Response("send failed", { status: 502 }); // Polar retries
  await db.from("shop_orders").update({ delivered_at: new Date().toISOString() }).eq("id", order.id);

  const amount = order.amount_cents != null ? `${(order.amount_cents / 100).toFixed(2)} ${(order.currency || "").toUpperCase()}` : "";
  await send(DOM, `New sale: ${prod.title} ${amount}`.trim(),
    `<p>${esc(email)} bought <b>${esc(prod.title)}</b> ${esc(amount)}. The file email went out.</p>`,
    `${email} bought ${prod.title} ${amount}. The file email went out.`);
  return new Response("ok");
});
