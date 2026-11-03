// Footer pixel field. One canvas, drawn every frame while it is on screen.
// - Arrival: the field steps on in a diagonal wave and the FACKT pixels spring up into place.
// - Tide: a slow, never repeating ripple runs through the field.
// - Pointer: pixels lean away and spring back, the cursor leaves a fading pixel trail.
// - Click or tap: a square, stepped ripple that flips the letters as it passes.
// - Idle: the 70 wordmark pixels swarm along curved paths into the F mark, then back.
// Reduced motion: one static frame, nothing moves.

const FONT: Record<string, string[]> = {
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
};
const ROWS = 9;
const INK = [17, 17, 17], DUST = [200, 200, 196];

type P = { hx: number; hy: number; fx: number; fy: number; x: number; y: number; vx: number; vy: number;
  s: number; vs: number; a: number; va: number; ta: number; born: number; ord: number;
  from: [number, number]; to: [number, number]; mt: number; bend: number; hit: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = (p: number) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
const rnd = (i: number) => { const x = Math.sin(i * 91.17 + 7.3) * 43758.5453; return x - Math.floor(x); };

function word(cols: number) {
  const out: [number, number][] = [];
  const x0 = Math.round((cols - 29) / 2);
  let x = x0;
  for (const ch of 'FACKT') { FONT[ch].forEach((l, r) => [...l].forEach((v, c) => { if (v === '1') out.push([x + c, 1 + r]); })); x += 6; }
  return out;
}
function mark(cols: number) { // the F mark as three stepped bands, 11 / 8 / 4 wide, 3 rows each
  const out: [number, number][] = [];
  const x0 = Math.round((cols - 11) / 2);
  [11, 8, 4].forEach((w, b) => { for (let r = 0; r < 3; r++) for (let c = 0; c < w; c++) out.push([x0 + c, b * 3 + r]); });
  return out;
}

export function initFooterPixels(cv: HTMLCanvasElement) {
  const ctx = cv.getContext('2d')!;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cols = 40, cell = 24, W = 0, H = 0, dpr = 1;
  let ps: P[] = [];
  let heat = new Float32Array(0);
  let started = -1, raf = 0, visible = false, last = 0, now = 0;
  let px = -99, py = -99, pres = 0, presT = 0, lastMove = -99;
  const rip: { x: number; y: number; t: number }[] = [];
  let mode: 'word' | 'mark' = 'word', nextMorph = 7, swapAt = -1, markRip = false;

  function build() {
    const w = cv.clientWidth; cols = w < 560 ? 31 : 40; cell = w / cols;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = w; H = cell * ROWS; cv.style.height = H + 'px';
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    heat = new Float32Array(cols * ROWS);
    const wd = word(cols), mk = mark(cols);
    // pair word pixels with mark pixels in reading order so the swarm flows left to right
    const ws = wd.map((p, i) => ({ p, i })).sort((a, b) => a.p[0] - b.p[0] || a.p[1] - b.p[1]);
    const ms = [...mk].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const old = ps;
    ps = wd.map(([hx, hy], i) => {
      const k = ws.findIndex((q) => q.i === i);
      const m = ms[Math.min(ms.length - 1, Math.round(k * (ms.length - 1) / (wd.length - 1)))];
      const o = old[i];
      return { hx, hy, fx: m[0], fy: m[1], x: o ? o.x : hx, y: o ? o.y : hy + 2.2 + rnd(i) * 2, vx: 0, vy: 0,
        s: o ? o.s : 0, vs: 0, a: o ? o.a : 0, va: 0, ta: o ? o.ta : 0, born: 0.25 + (hx - wd[0][0]) * 0.026 + rnd(i + 3) * 0.08,
        ord: k, from: [hx, hy], to: [hx, hy], mt: -99, bend: (rnd(i + 11) - .5) * 2, hit: -1 };
    });
    if (mode === 'mark') ps.forEach((p) => { p.from = p.to = [p.fx, p.fy]; });
  }

  function morph(to: 'word' | 'mark') {
    mode = to;
    ps.forEach((p) => {
      p.from = [p.to[0], p.to[1]];
      p.to = to === 'mark' ? [p.fx, p.fy] : [p.hx, p.hy];
      p.mt = now + p.ord * 0.009;
    });
  }

  function target(p: P): [number, number] {
    const q = clamp((now - p.mt) / 0.95); const e = io(q);
    const [ax, ay] = p.from, [bx, by] = p.to;
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    const lift = Math.sin(Math.PI * e) * Math.min(4, len * 0.32) * p.bend;
    return [ax + dx * e - (dy / len) * lift, ay + dy * e + (dx / len) * lift];
  }

  function step(dt: number) {
    const t = now - started;
    // pointer presence eases in and out
    pres += (presT - pres) * (1 - Math.exp(-dt * 8));
    for (let i = 0; i < heat.length; i++) heat[i] *= Math.exp(-dt * 2.6);
    // idle choreography: morph to the F, hold, morph back, then a ripple from the mark
    const idle = now - lastMove > 3.5;
    if (t > nextMorph && idle && swapAt < 0) { morph('mark'); swapAt = now + 2.9; }
    if (swapAt > 0 && now > swapAt) { morph('word'); swapAt = -1; nextMorph = t + 9; rip.push({ x: cols / 2, y: 4, t: now + 0.2 }); }
    if (swapAt > 0 && now > swapAt - 1.6 && !markRip) { markRip = true; rip.push({ x: cols / 2 - 1, y: 4, t: now }); }
    if (swapAt < 0) markRip = false;

    for (const p of ps) {
      const alive = t > p.born;
      let [tx, ty] = target(p);
      // lean away from the pointer
      const dx = p.x + .5 - px, dy = p.y + .5 - py, d = Math.hypot(dx, dy);
      const f = pres * Math.pow(clamp(1 - d / 4.2), 2);
      if (d > 0.001) { tx += (dx / d) * f * 0.9; ty += (dy / d) * f * 0.9; }
      // ripple pass flips the pixel a quarter turn
      for (const r of rip) {
        const rr = (now - r.t) * 22, dc = Math.max(Math.abs(p.x - r.x), Math.abs(p.y - r.y));
        if (rr > dc && p.hit < r.t) { p.hit = r.t; p.ta += 90; p.vs -= 9; }
      }
      const k = 210, c = 2 * Math.sqrt(k) * 0.62;
      if (alive) {
        p.vx += (k * (tx - p.x) - c * p.vx) * dt; p.vy += (k * (ty - p.y) - c * p.vy) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        const ts = 1 - f * 0.28;
        const ks = 260, cs = 2 * Math.sqrt(ks) * 0.45;
        p.vs += (ks * (ts - p.s) - cs * p.vs) * dt; p.s += p.vs * dt;
      }
      const ka = 120, ca = 2 * Math.sqrt(ka) * 0.55;
      const ta = p.ta + f * 28;
      p.va += (ka * (ta - p.a) - ca * p.va) * dt; p.a += p.va * dt;
    }
    while (rip.length && now - rip[0].t > 3) rip.shift();
  }

  function draw() {
    const t = started < 0 ? 0 : now - started;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // field
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < cols; c++) {
      const on = clamp((t - (c + r * 1.6) * 0.022) / 0.35);
      if (on <= 0) continue;
      const tide = 0.5 + 0.5 * Math.sin(c * 0.33 + now * 0.9 + Math.sin(r * 0.7 + now * 0.45) * 1.6) * Math.cos(r * 0.42 - now * 0.6 + c * 0.05);
      let s = 0.12 + tide * 0.1;
      let ink = 0;
      const dx = c + .5 - px, dy = r + .5 - py, d = Math.hypot(dx, dy);
      const near = pres * Math.pow(clamp(1 - d / 4.2), 2);
      s += near * 0.38; ink += near * 0.55;
      const h = heat[r * cols + c]; s += h * 0.5; ink += h * 0.9;
      for (const rp of rip) {
        const age = now - rp.t; if (age < 0) continue;
        const dc = Math.max(Math.abs(c - rp.x), Math.abs(r - rp.y));
        const band = clamp(1 - Math.abs(dc - age * 22) / 1.6) * clamp(1 - age / 1.6);
        s += band * 0.55; ink += band;
      }
      s *= io(on); ink = clamp(ink);
      const side = Math.min(0.9, s) * cell * 0.92;
      if (side < 0.4) continue;
      const rad = side / 2 * (1 - clamp((s - 0.25) / 0.35)) + Math.min(1.5, side / 2) * clamp((s - 0.25) / 0.35);
      ctx.fillStyle = mix(DUST, INK, ink);
      ctx.beginPath(); ctx.roundRect((c + .5) * cell - side / 2, (r + .5) * cell - side / 2, side, side, rad); ctx.fill();
    }
    // wordmark pixels
    ctx.fillStyle = mix(INK, INK, 0);
    for (const p of ps) {
      if (p.s <= 0.01) continue;
      const side = cell * 0.86 * p.s;
      ctx.save();
      ctx.translate((p.x + .5) * cell, (p.y + .5) * cell);
      ctx.rotate(p.a * Math.PI / 180);
      ctx.beginPath(); ctx.roundRect(-side / 2, -side / 2, side, side, Math.min(2, side / 6)); ctx.fill();
      ctx.restore();
    }
  }

  function frame(ts: number) {
    now = ts / 1000;
    if (started < 0) started = now;
    const dt = Math.min(1 / 30, last ? now - last : 1 / 60); last = now;
    step(dt); draw();
    raf = visible ? requestAnimationFrame(frame) : 0;
  }
  function run() { if (!raf && !still) { last = 0; raf = requestAnimationFrame(frame); } }

  function staticFrame() { // reduced motion: the finished wordmark, no field motion
    started = -1e9; now = 0;
    ps.forEach((p) => { p.x = p.hx; p.y = p.hy; p.s = 1; p.a = 0; });
    draw();
  }

  build();
  new ResizeObserver(() => { const w = cv.clientWidth; if (Math.abs(w - W) > 1) { build(); if (still) staticFrame(); } }).observe(cv);
  if (still) { staticFrame(); return; }

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    // left before the build finished (or seen during a layout jump): play the arrival again next time
    if (!visible && started > 0 && now - started < 1.8) {
      started = -1;
      ps.forEach((p, i) => { p.x = p.hx; p.y = p.hy + 2.2 + rnd(i) * 2; p.vx = p.vy = 0; p.s = 0; p.vs = 0; });
    }
    if (visible) run();
  }, { threshold: 0.15 }).observe(cv);

  const toCell = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) / cell, (e.clientY - b.top) / cell]; };
  cv.addEventListener('pointermove', (e) => {
    const [x, y] = toCell(e);
    // trail: light up every cell between the last and current pointer position
    if (pres > 0.2 && px > -50) {
      const n = Math.ceil(Math.hypot(x - px, y - py) * 2);
      for (let i = 0; i <= n; i++) {
        const cx = Math.floor(px + (x - px) * i / n), cy = Math.floor(py + (y - py) * i / n);
        if (cx >= 0 && cx < cols && cy >= 0 && cy < ROWS) heat[cy * cols + cx] = Math.max(heat[cy * cols + cx], 0.85);
      }
    }
    px = x; py = y; presT = 1; lastMove = now;
  });
  cv.addEventListener('pointerleave', () => { presT = 0; });
  cv.addEventListener('pointerdown', (e) => {
    const [x, y] = toCell(e);
    rip.push({ x: Math.floor(x), y: Math.floor(y), t: now });
    lastMove = now;
    if (swapAt > 0) { morph('word'); swapAt = -1; nextMorph = now - started + 9; }
  });
}
