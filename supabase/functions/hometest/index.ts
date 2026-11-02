// Fackt homepage test: powers the "Homepage test" panel on fackt.io/admin/stats.
// The worker shows each visitor one homepage version (src/data/homeTest.json) and public/journey.js records
// the homepage as "/?hv=<version>". This reads those sessions, all time since the first tagged visit.
// Auth: x-stats-key header must match journey_config.stats_key (same key as the stats function).
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ALLOWED = ["https://fackt.io", "https://www.fackt.io", "http://localhost:4321", "http://localhost:8787"];
const MIN = 100; // visitors per version before a winner is called

type Page = { p: string; at: number; d?: number; s?: number };
type Ev = { l: string; at: number; p?: string };
type Session = { id: string; started: number; last: number; device?: string; pages: Page[]; events?: Ev[] };

const cors = (o: string | null) => ({
  "Access-Control-Allow-Origin": o && ALLOWED.includes(o) ? o : ALLOWED[0],
  "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "x-stats-key", "Vary": "Origin",
});
const out = (status: number, o: string | null, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(o), "Content-Type": "application/json", "Cache-Control": "no-store" } });

const HV = /^\/\?hv=([a-z])\b/;
const isHome = (p: string) => HV.test(p || "");
const variantOf = (s: Session) => { for (const p of s.pages) { const m = HV.exec(p.p || ""); if (m) return m[1]; } return null; };

type G = { v: Set<string>; homeTime: number; homeViews: number; end: Set<string>; step: Set<string>; cs: Set<string>; audit: Set<string>;
  call: Set<string>; next: Set<string>; lead: Set<string>; booked: Set<string>; mobile: Set<string>; live: Set<string> };
const mk = (): G => ({ v: new Set(), homeTime: 0, homeViews: 0, end: new Set(), step: new Set(), cs: new Set(), audit: new Set(),
  call: new Set(), next: new Set(), lead: new Set(), booked: new Set(), mobile: new Set(), live: new Set() });

// two-proportion z-test
function z(s1: number, n1: number, s2: number, n2: number) {
  if (!n1 || !n2) return 0;
  const p = (s1 + s2) / (n1 + n2), se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  return se ? (s1 / n1 - s2 / n2) / se : 0;
}

Deno.serve(async (req) => {
  const o = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(o) });
  const { data: cfg } = await db.from("journey_config").select("value").eq("key", "stats_key").single();
  const key = req.headers.get("x-stats-key");
  if (!cfg?.value || !key || key !== cfg.value) return out(403, o, { error: "wrong key" });

  const { data: rows } = await db.from("journey_sessions").select("vid,data,started_at,updated_at")
    .ilike("data->>pages", "%?hv=%").order("started_at", { ascending: true }).limit(10000);

  const g: Record<string, G> = {};
  const first = new Map<string, { v: string; at: number }>(); // visitor -> the version they saw first
  const liveSince = Date.now() - 2 * 60e3;
  let started = 0;
  const daily = new Map<string, Record<string, Set<string>>>();
  const day = (ts: number) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bratislava", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(ts));

  for (const r of rows || []) {
    const s = (r as any).data as Session, vid = (r as any).vid as string;
    const v = variantOf(s); if (!v) continue;
    if (!first.has(vid)) first.set(vid, { v, at: s.started });
    const fv = first.get(vid)!.v; // keep each visitor in one group, even if they switched later
    const e = g[fv] ||= mk();
    if (!started || s.started < started) started = s.started;
    e.v.add(vid);
    if (s.device === "Mobile") e.mobile.add(vid);
    if (Date.parse((r as any).updated_at) >= liveSince && isHome(s.pages[s.pages.length - 1]?.p)) e.live.add(vid);
    const dk = day(s.started); const dd = daily.get(dk) || daily.set(dk, {}).get(dk)!; (dd[fv] ||= new Set()).add(vid);

    const iHome = s.pages.findIndex((p) => isHome(p.p));
    for (const p of s.pages) if (isHome(p.p)) { e.homeTime += p.d || 0; e.homeViews++; if ((p.s || 0) >= 90) e.end.add(vid); }
    const after = s.pages.slice(iHome + 1);
    if (after.some((p) => !isHome(p.p) && p.p !== "/")) e.next.add(vid);
    const evs = (s.events || []).filter((x) => x.at >= (s.pages[iHome]?.at || 0));
    const cs = after.some((p) => /^\/work\/./.test(p.p)) || evs.some((x) => /opened case study/i.test(x.l));
    const au = after.some((p) => /^\/audit/.test(p.p)) || evs.some((x) => /free audit/i.test(x.l));
    const ca = after.some((p) => /^\/book/.test(p.p)) || evs.some((x) => /book call|Opened the booking page|Booked a call/i.test(x.l));
    if (cs) e.cs.add(vid); if (au) e.audit.add(vid); if (ca) e.call.add(vid);
    if (cs || au || ca) e.step.add(vid);
    if (evs.some((x) => /^Booked a call/.test(x.l))) e.booked.add(vid);
  }

  // leads (forms and bookings) after the visitor first saw a version
  const vids = [...first.keys()];
  for (let i = 0; i < vids.length; i += 200) {
    const { data: conv } = await db.from("journey_conversions").select("vid,source,created_at").in("vid", vids.slice(i, i + 200));
    for (const c of conv || []) {
      const f = first.get((c as any).vid); if (!f || Date.parse((c as any).created_at) < f.at) continue;
      const e = g[f.v]; if (!e) continue;
      e.lead.add((c as any).vid); if ((c as any).source === "booking") e.booked.add((c as any).vid);
    }
  }

  const variants = Object.fromEntries(Object.entries(g).map(([k, e]) => [k, {
    visitors: e.v.size, live: e.live.size, mobile: e.mobile.size,
    avgHomeTime: e.homeViews ? e.homeTime / e.homeViews : 0, readToEnd: e.end.size,
    step: e.step.size, caseStudy: e.cs.size, audit: e.audit.size, call: e.call.size, nextPage: e.next.size,
    leads: e.lead.size, booked: e.booked.size,
  }]));

  // verdict: every version against A on "took a next step"
  const A = variants["a"];
  const compare = Object.entries(variants).filter(([k]) => k !== "a").map(([k, x]) => {
    const zz = A ? z(x.step, x.visitors, A.step, A.visitors) : 0;
    const enough = !!A && Math.min(x.visitors, A.visitors) >= MIN;
    const result = !A ? "no A data yet" : !enough ? "too early" : zz >= 1.96 ? "better than A" : zz <= -1.96 ? "worse than A" : "about the same as A";
    return { v: k, z: Math.round(zz * 100) / 100, result };
  });
  const total = Object.values(variants).reduce((a, x) => a + x.visitors, 0);
  const better = compare.filter((c) => c.result === "better than A");
  let verdict = "Not started yet: no visitors have seen the test homepage.";
  if (total) {
    const small = Object.entries(variants).filter(([, x]) => x.visitors < MIN).length;
    if (better.length) verdict = `${better.map((c) => c.v.toUpperCase()).join(" and ")} ${better.length === 1 ? "beats" : "beat"} the current homepage: more visitors take a next step, and the gap is big enough to trust.`;
    else if (small) verdict = `Too early: ${total} visitors so far. Aim for at least ${MIN} per version before deciding.`;
    else verdict = "No version clearly beats the current homepage yet. Keep it running, or replace the weakest version with a bolder one.";
  }

  return out(200, o, {
    generated: Date.now(), started: started || null, min: MIN, total, variants, compare, verdict,
    daily: [...daily.entries()].sort().slice(-30).map(([d, x]) => ({ d, ...Object.fromEntries(Object.entries(x).map(([k, s]) => [k, s.size])) })),
  });
});
