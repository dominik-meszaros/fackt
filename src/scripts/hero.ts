// Hero behaviour: quote switcher, work stage + chips, and the ask-anything bar.
// The bar suggests questions (from the CMS), answers pricing and process questions inline,
// finds work by keyword and synonym, and turns anything else into a booking with the note filled in.

import { searchSynonyms } from '../data/site';

interface Project { slug: string; name: string; service: string; category: string; summary: string; keywords: string[]; image: string; imageKind: string; tint: string }
interface Ask { question: string; type: 'work' | 'answer'; project?: string; answer?: string; linkLabel?: string; linkHref?: string }
interface Index { projects: Project[]; stage: string[]; ask: Ask[]; hints: string[]; booking: string }

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
  let current = data.stage[0];
  function show(slug: string) {
    const i = data.stage.indexOf(slug);
    if (i < 0) return false;
    const p = data.projects.find((x) => x.slug === slug)!;
    current = slug;
    shots.forEach((a) => {
      const on = a.dataset.slug === slug;
      a.classList.toggle('on', on);
      a.tabIndex = on ? 0 : -1;
      if (on) a.removeAttribute('aria-hidden'); else a.setAttribute('aria-hidden', 'true');
    });
    chips.forEach((c) => { const on = c.dataset.chip === slug; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
    if (label) label.textContent = `${p.name}, ${p.service}`;
    if (idx) idx.textContent = `${pad(i + 1)} / ${pad(data.stage.length)}`;
    return true;
  }
  chips.forEach((c) => c.addEventListener('click', () => show(c.dataset.chip!)));

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
  const head = document.querySelector<HTMLElement>('[data-ask-head]');
  const ans = document.querySelector<HTMLElement>('[data-ask-answer]');
  const ansText = document.querySelector<HTMLElement>('[data-ask-answer-text]');
  const ansLink = document.querySelector<HTMLAnchorElement>('[data-ask-answer-link]');
  if (!wrap || !form || !input || !panel || !list || !head || !ans || !ansText || !ansLink) return;

  type Row = { html: string; run: () => void; sel?: boolean };
  let rows: Row[] = [];
  let hl = -1;
  let chosen = -1;
  const isPlay = (q: string) => /^\/?(play|game|games)$/.test(q.trim().toLowerCase());

  function bookingHref(q: string) {
    const url = new URL(data.booking, location.origin);
    if (q.trim()) url.searchParams.set('notes', q.trim());
    return url.toString();
  }

  function answer(i: number) {
    const a = data.ask[i];
    chosen = i;
    input!.value = a.question;
    if (a.type === 'work' && a.project) {
      if (!show(a.project)) location.href = `/work/${a.project}`;
      ans!.hidden = true;
      close();
      return;
    }
    ansText!.textContent = a.answer ?? '';
    ansLink!.textContent = `${a.linkLabel ?? 'Learn more'} →`;
    ansLink!.href = a.linkHref ?? '#';
    ans!.hidden = false;
    render(input!.value, true);
  }

  function render(q: string, keepAnswer = false) {
    if (!keepAnswer) ans!.hidden = true;
    rows = [];
    if (isPlay(q)) {
      rows.push({ html: `${IC_PLAY}<span>Fancy a break? Play Pixel Perfect</span><small>Enter</small>`, run: () => { close(); document.dispatchEvent(new Event('fackt:play')); } });
      head!.textContent = 'Secret found';
    } else {
      const typed = q.trim() && !keepAnswer;
      const asks = typed ? askMatches(q) : data.ask.map((_, i) => i);
      const work = typed ? workMatches(q).slice(0, 3) : [];
      for (const p of work) {
        rows.push({ html: `${IC_WORK}<span>${esc(p.name)}, ${esc(p.service)}</span><small>Shows the work</small>`, run: () => { if (!show(p.slug)) location.href = `/work/${p.slug}`; close(); } });
      }
      for (const i of asks.slice(0, typed ? 4 : 8)) {
        const a = data.ask[i];
        rows.push({ html: `${a.type === 'work' ? IC_WORK : IC_ANS}<span>${esc(a.question)}</span><small>${a.type === 'work' ? 'Shows the work' : 'Answer'}</small>`, run: () => answer(i), sel: i === chosen && keepAnswer });
      }
      if (typed) {
        rows.push({ html: `${IC_CAL}<span>Ask Dom on a free call: “${esc(q.trim())}”</span><small>Book</small>`, run: () => { location.href = bookingHref(q); } });
      }
      head!.textContent = typed ? (work.length ? 'Matching work and answers' : 'Suggestions') : 'Ask about work, pricing or process';
    }
    hl = -1;
    list!.innerHTML = rows.map((r, i) => `<li role="option" id="ask-o${i}" class="ar${r.sel ? ' on' : ''}" aria-selected="${r.sel ? 'true' : 'false'}" data-i="${i}">${r.html}</li>`).join('');
    open();
  }

  function open() { panel!.hidden = false; input!.setAttribute('aria-expanded', 'true'); }
  function close() { panel!.hidden = true; input!.setAttribute('aria-expanded', 'false'); input!.removeAttribute('aria-activedescendant'); }
  function highlight(n: number) {
    hl = (n + rows.length) % rows.length;
    list!.querySelectorAll('.ar').forEach((el, i) => el.classList.toggle('hl', i === hl));
    input!.setAttribute('aria-activedescendant', `ask-o${hl}`);
    list!.querySelector(`#ask-o${hl}`)?.scrollIntoView({ block: 'nearest' });
  }

  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.ar');
    if (li) rows[Number(li.dataset.i)]?.run();
  });
  input.addEventListener('focus', () => render(input.value));
  input.addEventListener('click', () => { if (panel.hidden) render(input.value); });
  input.addEventListener('input', () => { chosen = -1; render(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (panel.hidden) render(input.value); highlight(hl + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(hl - 1); }
    else if (e.key === 'Escape') { close(); }
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
    if (w) { if (!show(w.slug)) location.href = `/work/${w.slug}`; close(); return; }
    location.href = bookingHref(q);
  });
  document.addEventListener('click', (e) => { if (!e.composedPath().includes(wrap)) close(); });
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); input.select(); }
  });

  // Rotating example question while the bar is empty and idle.
  if (data.hints.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let h = 0;
    setInterval(() => {
      if (document.activeElement === input || input.value) return;
      h = (h + 1) % data.hints.length;
      input.placeholder = `Ask anything, e.g. “${data.hints[h]}”`;
    }, 2600);
  }
  void stage; void current;
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
