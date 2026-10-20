// Hero behaviour: quote switcher, work stage + chips, and the ask-anything bar.
// The bar suggests questions (from the CMS), answers pricing and process questions inline,
// finds work by keyword and synonym, and turns anything else into a booking with the note filled in.

import { searchSynonyms } from '../data/site';

interface Project { slug: string; name: string; service: string; category: string; summary: string; keywords: string[]; image: string; imageKind: string; tint: string }
interface Ask { question: string; type: 'work' | 'answer'; project?: string; answer?: string; linkLabel?: string; linkHref?: string }
interface Slide { slug: string; cat: number; label: string }
interface Index { projects: Project[]; stage: Slide[]; ask: Ask[]; hints: string[]; booking: string }

const CATEGORY_WORDS: Record<string, string[]> = {
  product: ['product', 'saas', 'dashboard', 'platform', 'web app', 'ux', 'ui'],
  web: ['website', 'web', 'landing', 'marketing', 'site'],
  mobile: ['mobile', 'app', 'ios', 'android'],
  branding: ['branding', 'brand', 'identity', 'logo'],
  motion: ['motion', 'animation', 'rive', '3d'],
};
const STOP = /\b(show|me|a|an|the|you|your|designed|design|for|of|with|and|i|need|want|like|we|our|my|some|that|to|in|do|does|can|how|what|is|are|it|much)\b/g;
const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s$]/g, ' ').replace(/\s+/g, ' ').trim();
const pad = (n: number) => String(n).padStart(2, '0');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

const IC_WORK = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 2.5H6.5V6.5H2.5ZM9.5 2.5H13.5V6.5H9.5ZM2.5 9.5H6.5V13.5H2.5ZM9.5 9.5H13.5V13.5H9.5Z"/></svg>';
const IC_ANS = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 3.5H13.5V10.5H7L4 13V10.5H2.5Z"/></svg>';
const IC_CAL = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10"/><path d="M2.5 6.5H13.5M5.5 2V5M10.5 2V5"/></svg>';
const IC_PLAY = '<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3L13 8L5 13Z" fill="currentColor"/></svg>';

export function initHero() {
  initQuotes();
  const raw = document.getElementById('ask-index')?.textContent;
  if (!raw) return;
  const data: Index = JSON.parse(raw);

  // ---------- stage ----------
  const stage = document.getElementById('stage');
  const shots = Array.from(document.querySelectorAll<HTMLAnchorElement>('#stage .shot'));
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-chip]'));
  const label = document.querySelector<HTMLElement>('[data-stage-label]');
  const idx = document.querySelector<HTMLElement>('[data-stage-idx]');
  let cur = 0;
  // Stage images after the first load only when their slide (or the one before it) is shown.
  const load = (n: number) => {
    const img = shots[(n + shots.length) % shots.length]?.querySelector<HTMLImageElement>('img[data-src]');
    if (img) { if (img.dataset.srcset) img.srcset = img.dataset.srcset; img.src = img.dataset.src!; img.removeAttribute('data-src'); }
  };
  function showSlide(i: number) {
    cur = (i + data.stage.length) % data.stage.length;
    load(cur); load(cur + 1);
    const sl = data.stage[cur];
    const p = data.projects.find((x) => x.slug === sl.slug)!;
    shots.forEach((a) => {
      const on = Number(a.dataset.i) === cur;
      a.classList.toggle('on', on);
      a.tabIndex = on ? 0 : -1;
      if (on) a.removeAttribute('aria-hidden'); else a.setAttribute('aria-hidden', 'true');
    });
    chips.forEach((c) => { const on = Number(c.dataset.chip) === sl.cat; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
    if (label) label.textContent = `${p.name}, ${p.service}`;
    if (idx) { const inCat = data.stage.filter((s) => s.cat === sl.cat); idx.textContent = `${pad(inCat.indexOf(sl) + 1)} / ${pad(inCat.length)}`; }
  }
  function show(slug: string) {
    const i = data.stage.findIndex((s) => s.slug === slug);
    if (i < 0) return false;
    showSlide(i); restart();
    return true;
  }
  // Loop through every slide on its own; pauses while someone hovers the stage or uses the ask bar.
  const chipRow = document.querySelector<HTMLElement>('[data-chips]');
  const MS = 3800;
  let timer = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kick = () => { chipRow?.classList.remove('auto'); void chipRow?.offsetWidth; chipRow?.classList.add('auto'); };
  function restart() {
    clearInterval(timer);
    if (reduce || data.stage.length < 2) return;
    kick();
    timer = window.setInterval(() => { if (!stage?.matches(':hover') && document.activeElement?.id !== 'ask') { showSlide(cur + 1); kick(); } }, MS);
  }
  chipRow?.style.setProperty('--stage-ms', MS + 'ms');
  chips.forEach((c) => c.addEventListener('click', () => { showSlide(data.stage.findIndex((s) => s.cat === Number(c.dataset.chip))); restart(); }));
  restart();
  // Warm the next slide once the page has finished loading, so the first switch is instant.
  if (document.readyState === 'complete') load(1); else window.addEventListener('load', () => load(1), { once: true });

  // ---------- search index ----------
  const synonyms = searchSynonyms;
  const expand = new Map<string, Set<string>>();
  for (const [key, words] of Object.entries(synonyms)) {
    const group = [key, ...words].map(norm);
    for (const w of group) {
      const set = expand.get(w) ?? new Set<string>();
      group.forEach((g) => set.add(g));
      expand.set(w, set);
    }
  }
  const hay = data.projects.map((p) => ({ p, name: norm(p.name), service: norm(p.service), words: [...p.keywords, ...(CATEGORY_WORDS[p.category] ?? [])].map(norm) }));
  function terms(q: string) {
    const base = norm(q).replace(STOP, ' ').split(' ').filter((t) => t.length > 1);
    const pairs = base.slice(1).map((t, i) => `${base[i]} ${t}`);
    const out = new Set<string>();
    for (const t of [...base, ...pairs]) { out.add(t); expand.get(t)?.forEach((s) => out.add(s)); }
    return [...out];
  }
  function workMatches(q: string) {
    const ts = terms(q);
    if (!ts.length) return [];
    return hay.map((h) => {
      let s = 0;
      for (const t of ts) {
        if (h.name === t || h.name.startsWith(t)) s += 8;
        if (h.service.includes(t)) s += 3;
        for (const w of h.words) { if (w === t) s += 4; else if (t.length >= 3 && (w.startsWith(t) || t.startsWith(w))) s += 1.5; }
      }
      return { p: h.p, s };
    }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).map((r) => r.p);
  }
  function askMatches(q: string) {
    const ts = norm(q).replace(STOP, ' ').split(' ').filter((t) => t.length > 1);
    if (!ts.length) return data.ask.map((a, i) => i);
    return data.ask
      .map((a, i) => { const n = norm(a.question + ' ' + (a.answer ?? '')); return { i, s: ts.filter((t) => n.includes(t)).length }; })
      .filter((r) => r.s > 0).sort((a, b) => b.s - a.s).map((r) => r.i);
  }

  // ---------- ask bar ----------
  const wrap = document.querySelector<HTMLElement>('[data-ask]');
  const form = document.querySelector<HTMLFormElement>('[data-ask-form]');
  const input = document.querySelector<HTMLInputElement>('[data-ask-input]');
  const panel = document.querySelector<HTMLElement>('[data-ask-panel]');
  const list = document.querySelector<HTMLUListElement>('[data-ask-list]');
  const ans = document.querySelector<HTMLElement>('[data-ask-answer]');
  const ansText = document.querySelector<HTMLElement>('[data-ask-answer-text]');
  const ansLink = document.querySelector<HTMLAnchorElement>('[data-ask-answer-link]');
  const book = document.querySelector<HTMLAnchorElement>('[data-ask-book]');
  const typ = document.querySelector<HTMLElement>('[data-ask-typ]');
  if (!wrap || !form || !input || !panel || !list || !ans || !ansText || !ansLink) return;

  type Row = { html: string; run: () => void; sel?: boolean };
  let rows: Row[] = [];
  let hl = -1;
  let chosen = -1;
  const isPlay = (q: string) => /^\/?(play|game|games)$/.test(q.trim().toLowerCase());
  const byslug = (slug?: string) => data.projects.find((p) => p.slug === slug);

  function bookingHref(q: string) {
    const url = new URL(data.booking, location.origin);
    if (q.trim()) url.searchParams.set('notes', q.trim());
    return url.toString();
  }
  const KBD = '<kbd>&#8629;</kbd>';
  const thumb = (p?: Project) => p ? `<span class="th"><img src="${esc(p.image)}" alt="" loading="lazy"></span>` : `<span class="th">${IC_WORK}</span>`;
  const workRow = (p: Project, label: string) => `${thumb(p)}<span class="tt">${esc(label)}</span><small>${esc(p.name)} &#183; ${esc(p.service)}</small>${KBD}`;
  const ansRow = (label: string, meta = 'Answer', ic = IC_ANS) => `<span class="th">${ic}</span><span class="tt">${esc(label)}</span><small>${meta}</small>${KBD}`;

  // Showing a project: switch the stage and bring it into view when the bar is floating.
  function goWork(slug: string) {
    if (!show(slug)) { location.href = `/work/${slug}`; return; }
    close();
    if (wrap!.classList.contains('float')) stage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function answer(i: number) {
    const a = data.ask[i];
    chosen = i;
    input!.value = a.question;
    sync();
    if (a.type === 'work' && a.project) { ans!.hidden = true; goWork(a.project); return; }
    ansText!.textContent = a.answer ?? '';
    ansLink!.textContent = `${a.linkLabel ?? 'Learn more'} →`;
    ansLink!.href = a.linkHref ?? '#';
    ans!.hidden = false;
    render(input!.value, true);
  }

  function render(q: string, keepAnswer = false) {
    if (!keepAnswer) ans!.hidden = true;
    rows = [];
    const groups: { title: string; rows: Row[] }[] = [];
    if (isPlay(q)) {
      groups.push({ title: 'Secret found', rows: [{ html: ansRow('Fancy a break? Play Pixel Perfect', 'Game', IC_PLAY), run: () => { close(); document.dispatchEvent(new Event('fackt:play')); } }] });
    } else {
      const typed = !!q.trim() && !keepAnswer;
      const asks = typed ? askMatches(q) : data.ask.map((_, i) => i);
      const askRow = (i: number): Row => {
        const a = data.ask[i];
        const p = a.type === 'work' ? byslug(a.project) : undefined;
        return { html: p ? workRow(p, a.question) : ansRow(a.question), run: () => answer(i), sel: i === chosen && keepAnswer };
      };
      if (typed) {
        const seen = new Set(asks.map((i) => data.ask[i].project).filter(Boolean));
        const work = workMatches(q).filter((p) => !seen.has(p.slug)).slice(0, 3);
        const w: Row[] = [...asks.filter((i) => data.ask[i].type === 'work').map(askRow), ...work.map((p) => ({ html: workRow(p, `${p.name}, ${p.service}`), run: () => goWork(p.slug) }))];
        const t = asks.filter((i) => data.ask[i].type !== 'work').slice(0, 4).map(askRow);
        if (w.length) groups.push({ title: 'Matching work', rows: w.slice(0, 4) });
        if (t.length) groups.push({ title: 'Answers', rows: t });
        groups.push({ title: 'Not covered here', rows: [{ html: ansRow(`Ask Dom on a free call: “${q.trim()}”`, 'Book', IC_CAL), run: () => { location.href = bookingHref(q); } }] });
      } else {
        const w = asks.filter((i) => data.ask[i].type === 'work').map(askRow);
        const t = asks.filter((i) => data.ask[i].type !== 'work').map(askRow);
        if (w.length && !keepAnswer) groups.push({ title: 'Show me work', rows: w });
        if (t.length) groups.push({ title: 'Pricing and process', rows: t });
      }
    }
    let html = '';
    groups.forEach((g, gi) => {
      html += `<li role="presentation" class="smh${gi ? ' sep' : ''}">${esc(g.title)}</li>`;
      g.rows.forEach((r) => { const i = rows.push(r) - 1; html += `<li role="option" id="ask-o${i}" class="ar${r.sel ? ' on' : ''}" aria-selected="${r.sel ? 'true' : 'false'}" data-i="${i}">${r.html}</li>`; });
    });
    hl = -1;
    list!.innerHTML = html;
    if (book) book.href = bookingHref(q);
    open();
  }

  function open() { panel!.hidden = false; input!.setAttribute('aria-expanded', 'true'); }
  function close() { panel!.hidden = true; input!.setAttribute('aria-expanded', 'false'); input!.removeAttribute('aria-activedescendant'); }
  function highlight(n: number) {
    if (!rows.length) return;
    hl = (n + rows.length) % rows.length;
    list!.querySelectorAll('.ar').forEach((el) => el.classList.toggle('hl', Number((el as HTMLElement).dataset.i) === hl));
    input!.setAttribute('aria-activedescendant', `ask-o${hl}`);
    list!.querySelector(`#ask-o${hl}`)?.scrollIntoView({ block: 'nearest' });
  }
  function sync() { wrap!.classList.toggle('typing', !!input!.value); }

  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.ar');
    if (li) rows[Number(li.dataset.i)]?.run();
  });
  input.addEventListener('focus', () => { wrap.classList.add('focus'); input.placeholder = 'Ask about work, pricing or process'; render(input.value); });
  input.addEventListener('blur', () => { wrap.classList.remove('focus'); input.placeholder = ''; });
  input.addEventListener('click', () => { if (panel.hidden) render(input.value); });
  input.addEventListener('input', () => { chosen = -1; sync(); render(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (panel.hidden) render(input.value); highlight(hl + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(hl - 1); }
    else if (e.key === 'Escape') { close(); input.blur(); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (hl >= 0) { rows[hl]?.run(); return; }
    const q = input.value.trim();
    if (!q) { input.focus(); render(''); return; }
    if (isPlay(q)) { rows[0]?.run(); return; }
    const exact = data.ask.findIndex((a) => norm(a.question) === norm(q));
    if (exact >= 0) { answer(exact); return; }
    const w = workMatches(q)[0];
    if (w) { goWork(w.slug); return; }
    location.href = bookingHref(q);
  });
  document.addEventListener('click', (e) => { if (!e.composedPath().includes(wrap)) close(); });
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); input.select(); }
  });

  // Typed example question while the bar is empty and idle: type, hold, erase, next.
  if (typ && data.hints.length) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) typ.textContent = data.hints[0];
    else {
      let h = 0, n = data.hints[0].length, mode: 'type' | 'hold' | 'erase' = 'hold', hold = 40;
      setInterval(() => {
        if (document.activeElement === input || input.value) return;
        const q = data.hints[h % data.hints.length];
        if (mode === 'type') { n++; if (n >= q.length) { n = q.length; mode = 'hold'; hold = 40; } }
        else if (mode === 'hold') { if (--hold <= 0) mode = 'erase'; }
        else { n -= 2; if (n <= 0) { n = 0; h++; mode = 'type'; } }
        typ.textContent = data.hints[h % data.hints.length].slice(0, n);
      }, 45);
    }
  }

  // Follow the visitor: once the stage scrolls out of view, the bar floats at the bottom.
  // It steps aside over the contact postcard and the footer so it never covers a form.
  if (stage && 'IntersectionObserver' in window) {
    let past = false, blocked = false;
    const apply = () => {
      const f = past;
      if (f !== wrap.classList.contains('float')) { close(); wrap.classList.toggle('float', f); }
      wrap.classList.toggle('away', f && blocked && document.activeElement !== input);
    };
    new IntersectionObserver(([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; apply(); }, { threshold: 0 }).observe(stage);
    const quiet = Array.from(document.querySelectorAll<HTMLElement>('[data-ask-quiet], footer'));
    const vis = new Set<Element>();
    const io = new IntersectionObserver((es) => { es.forEach((e) => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); blocked = vis.size > 0; apply(); }, { rootMargin: '0px 0px -10% 0px' });
    quiet.forEach((el) => io.observe(el));
  }
  void stage;
}

function initQuotes() {
  const box = document.querySelector<HTMLElement>('[data-quotes]');
  if (!box) return;
  const btns = Array.from(box.querySelectorAll<HTMLButtonElement>('[data-q]'));
  const text = box.querySelector<HTMLElement>('[data-q-text]');
  const name = box.querySelector<HTMLElement>('[data-q-name]');
  const role = box.querySelector<HTMLElement>('[data-q-role]');
  const idx = box.querySelector<HTMLElement>('[data-q-idx]');
  function pick(i: number) {
    const b = btns[i];
    btns.forEach((x, j) => { x.classList.toggle('on', j === i); x.setAttribute('aria-selected', String(j === i)); });
    if (text) text.textContent = `“${b.dataset.text}”`;
    if (name) name.textContent = b.dataset.name ?? '';
    if (role) role.textContent = b.dataset.role ?? '';
    if (idx) idx.textContent = `${pad(i + 1)} / ${pad(btns.length)}`;
  }
  btns.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  box.addEventListener('keydown', (e) => {
    const i = btns.findIndex((b) => b.classList.contains('on'));
    if (e.key === 'ArrowRight') { const n = (i + 1) % btns.length; pick(n); btns[n].focus(); }
    if (e.key === 'ArrowLeft') { const n = (i - 1 + btns.length) % btns.length; pick(n); btns[n].focus(); }
  });
}
