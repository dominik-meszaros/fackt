// Fackt funnels: powers the "Paid pages and funnels" panel on fackt.io/admin/stats.
// For the picked range it reads visitor journeys (public/journey.js) plus orders and roast submissions, and returns:
//   products: each /p/<slug> page: visitors, read to end, buy clicks, thank you page, orders, revenue, conversion, sources
//   leads:    /audit, /roast, /book: visitors, read to end, submitted, conversion, sources
//   tools:    /tools/*: visitors, read to end, then went on to the audit or a call
// Sessions with the UTC time zone are left out: those are our own headless test runs, not people.
// Auth: x-stats-key header must match journey_config.stats_key (same key as the stats function).
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ALLOWED = ["https://fackt.io", "https://www.fackt.io", "http://localhost:4321", "http://localhost:8787"];

type Page = { p: string; at: number; d?: number; s?: number };
type Ev = { l: string; at: number; p?: string };
type Session = { started?: number; tz?: string; ref?: string | null; utm?: Record<string, string> | null; pages?: Page[]; events?: Ev[] };

const cors = (o: string | null) => ({
  "Access-Control-Allow-Origin": o && ALLOWED.includes(o) ? o : ALLOWED[0],
  "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "x-stats-key", "Vary": "Origin",
});
const out = (status: number, o: string | null, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(o), "Content-Type": "application/json", "Cache-Control": "no-store" } });

const clean = (p: string) => (p || "").split(/[?#]/)[0].replace(/\.html$/, "").replace(/\/$/, "") || "/";
function source(s: Session): string {
  const u = s.utm || {};
  if (u.utm_source) return u.utm_content ? `${u.utm_source} (${u.utm_content})` : u.utm_source;
  if (!s.ref) return "direct";
  try {
    const h = new URL(s.ref).hostname.replace(/^www\./, "");
    if (h === "t.co" || h.endsWith("x.com") || h.endsWith("twitter.com")) return "x";
    if (h.includes("google.")) return "google";
    if (h.includes("bing.")) return "bing";
    if (h.endsWith("fackt.io")) return "direct";
    return h;
  } catch { return "other"; }
}

type Row = { visitors: Set<string>; end: Set<string>; act: Set<string>; done: Set<string>; time: number; views: number; src: Map<string, Set<string>> };
const mk = (): Row => ({ visitors: new Set(), end: new Set(), act: new Set(), done: new Set(), time: 0, views: 0, src: new Map() });
const addSrc = (r: Row, k: string, vid: string) => { if (!r.src.has(k)) r.src.set(k, new Set()); r.src.get(k)!.add(vid); };
const pack = (r: Row) => ({
  visitors: r.visitors.size, end: r.end.size, act: r.act.size, done: r.done.size, avg: r.views ? Math.round(r.time / r.views) : 0,
  sources: [...r.src.entries()].map(([k, v]) => ({ k, v: v.size })).sort((a, b) => b.v - a.v).slice(0, 5),
});

Deno.serve(async (req) => {
  const o = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(o) });
  const { data: cfg } = await db.from("journey_config").select("value").eq("key", "stats_key").single();
  const key = req.headers.get("x-stats-key");
  if (!cfg?.value || !key || key !== cfg.value) return out(403, o, { error: "wrong key" });

  const days = Math.min(365, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 30));
  const since = new Date(Date.now() - days * 864e5).toISOString();

  const [{ data: rows }, { data: orders }, { data: roasts }] = await Promise.all([
    db.from("journey_sessions").select("vid,data").gte("updated_at", since)
      .or("data->>pages.ilike.%/p/%,data->>pages.ilike.%/audit%,data->>pages.ilike.%/roast%,data->>pages.ilike.%/book%,data->>pages.ilike.%/tools/%")
      .limit(10000),
    db.from("shop_orders").select("product_slug,amount_cents,currency,created_at").gte("created_at", since),
    db.from("roast_submissions").select("created_at,source").gte("created_at", since),
  ]);

  const products: Record<string, Row> = {};
  const leads: Record<string, Row> = { "/audit": mk(), "/roast": mk(), "/book": mk() };
  const tools: Record<string, Row> = {};

  for (const r of rows || []) {
    const s = (r as any).data as Session, vid = (r as any).vid as string;
    if (!s || s.tz === "UTC") continue;
    const pages = s.pages || [], evs = s.events || [], src = source(s);
    const visited = new Set(pages.map((p) => clean(p.p)));
    for (const p of pages) {
      const path = clean(p.p);
      let row: Row | undefined;
      const prod = /^\/p\/([a-z0-9-]+)$/.exec(path);
      if (prod) row = products[prod[1]] ||= mk();
      else if (leads[path]) row = leads[path];
      else if (path.startsWith("/tools/")) row = tools[path] ||= mk();
      if (!row) continue;
      row.visitors.add(vid); row.views++; row.time += p.d || 0;
      if ((p.s || 0) >= 90) row.end.add(vid);
      addSrc(row, src, vid);
    }
    // products: buy click, thank you page
    for (const slug of Object.keys(products)) {
      if (!visited.has(`/p/${slug}`)) continue;
      if (evs.some((e) => clean(e.p || "") === `/p/${slug}` && /^(Clicked buy|Opened buy\.polar\.sh)/.test(e.l))) products[slug].act.add(vid);
      if (visited.has(`/p/${slug}/thanks`)) products[slug].done.add(vid);
    }
    // lead pages: submitted the form (audit, roast) or booked (book)
    for (const path of Object.keys(leads)) {
      if (!visited.has(path)) continue;
      if (evs.some((e) => e.l === `Submitted a form on ${path}`)) leads[path].done.add(vid);
      if (path === "/book" && evs.some((e) => /^(Booked|Scheduled|Cal\.com booking)/i.test(e.l))) leads[path].done.add(vid);
    }
    // tools: went on to the audit or a call in the same visit
    for (const path of Object.keys(tools)) {
      if (!visited.has(path)) continue;
      if (visited.has("/audit") || visited.has("/book") || evs.some((e) => /free audit|book call/i.test(e.l))) tools[path].act.add(vid);
    }
  }

  const ord: Record<string, { n: number; cents: number }> = {};
  for (const o2 of orders || []) { const k = (o2 as any).product_slug || "?"; (ord[k] ||= { n: 0, cents: 0 }).n++; ord[k].cents += (o2 as any).amount_cents || 0; }

  return out(200, o, {
    days,
    products: Object.entries(products).map(([slug, r]) => ({ slug, ...pack(r), orders: ord[slug]?.n || 0, revenue: (ord[slug]?.cents || 0) / 100 }))
      .sort((a, b) => b.visitors - a.visitors),
    leads: Object.entries(leads).map(([path, r]) => ({ path, ...pack(r), submissions: path === "/roast" ? (roasts || []).length : undefined })),
    tools: Object.entries(tools).map(([path, r]) => ({ path, ...pack(r) })).sort((a, b) => b.visitors - a.visitors),
  });
});
