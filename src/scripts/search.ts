// Glass search: finds work by keyword and synonym, previews the best match
// in the hero stage, and turns a search with no match into a booking.

interface Project {
  slug: string; name: string; service: string; category: string; summary: string;
  keywords: string[]; image: string; imageKind: string; tint: string;
}
interface Index { projects: Project[]; synonyms: Record<string, string[]>; booking: string }

const CATEGORY_WORDS: Record<string, string[]> = {
  product: ['product', 'saas', 'dashboard', 'platform', 'web app', 'ux', 'ui'],
  web: ['website', 'web', 'landing', 'marketing', 'site'],
  mobile: ['mobile', 'app', 'ios', 'android'],
  branding: ['branding', 'brand', 'identity', 'logo'],
  motion: ['motion', 'animation', 'rive', '3d'],
};


const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

export function initSearch() {
  const raw = document.getElementById('search-index')?.textContent;
  const form = document.getElementById('search-form') as HTMLFormElement | null;
  const input = document.getElementById('q') as HTMLInputElement | null;
  const list = document.getElementById('results') as HTMLUListElement | null;
  const stage = document.getElementById('stage');
  const label = document.getElementById('stage-label');
  if (!raw || !form || !input || !list || !stage || !label) return;

  const data: Index = JSON.parse(raw);
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('.chip'));
  const shots = Array.from(stage.querySelectorAll<HTMLAnchorElement>('.shot'));

  // Expand every synonym group both ways: "admin" finds "dashboard" and the reverse.
  const expand = new Map<string, Set<string>>();
  for (const [key, words] of Object.entries(data.synonyms)) {
    const group = [key, ...words].map(norm);
    for (const w of group) {
      const set = expand.get(w) ?? new Set<string>();
      group.forEach((g) => set.add(g));
      expand.set(w, set);
    }
  }

  const haystack = data.projects.map((p) => ({
    p,
    name: norm(p.name),
    service: norm(p.service),
    words: [...p.keywords, ...(CATEGORY_WORDS[p.category] ?? [])].map(norm),
  }));

  function terms(q: string): string[] {
    const n = norm(q).replace(/\b(show|me|a|an|the|you|designed|for|of|with|and|i|need|want|like|we|our|my|some|that|to|in)\b/g, ' ');
    const base = n.split(' ').filter((t) => t.length > 1);
    // Also try two-word phrases like "landing page" or "app store".
    const pairs = base.slice(1).map((t, i) => `${base[i]} ${t}`);
    const out = new Set<string>();
    for (const t of [...base, ...pairs]) {
      out.add(t);
      expand.get(t)?.forEach((s) => out.add(s));
    }
    return [...out];
  }

  function score(q: string) {
    const ts = terms(q);
    if (!ts.length) return [];
    return haystack
      .map((h) => {
        let s = 0;
        for (const t of ts) {
          if (h.name === t || h.name.startsWith(t)) s += 8;
          if (h.service.includes(t)) s += 3;
          for (const w of h.words) {
            if (w === t) s += 4;
            else if (t.length >= 3 && (w.startsWith(t) || t.startsWith(w))) s += 1.5;
          }
        }
        return { p: h.p, s };
      })
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s);
  }

  let current = data.projects[0]?.slug;
  function show(slug: string) {
    if (slug === current) return;
    const p = data.projects.find((x) => x.slug === slug);
    if (!p || !stage || !label) return;
    current = slug;
    shots.forEach((a) => {
      const on = a.dataset.slug === slug;
      a.classList.toggle('active', on);
      a.tabIndex = on ? 0 : -1;
      if (on) a.removeAttribute('aria-hidden'); else a.setAttribute('aria-hidden', 'true');
    });
    stage.className = stage.className.replace(/tint-\w+/, `tint-${p.tint}`);
    label.textContent = `${p.name} / ${p.service}`;
  }

  let items: { href: string; play?: boolean }[] = [];
  const isPlay = (q: string) => /^\/?(play|game|games)$/.test(q.trim().toLowerCase());
  let active = -1;

  function bookingHref(q: string) {
    const url = new URL(data.booking, window.location.origin);
    if (q.trim()) url.searchParams.set('notes', `Looking for: ${q.trim()}`);
    return url.toString();
  }

  function render(q: string) {
    if (isPlay(q)) {
      items = [{ href: '#', play: true }];
      list!.innerHTML = `<li role="option" id="opt-0" class="r-cta r-play" aria-selected="false" data-i="0">
        <span class="r-icon">&#9654;</span>
        <span><span class="r-name">Fancy a break?</span> <span class="r-meta">Play Pixel Perfect</span></span>
        <span class="r-go">ENTER</span></li>`;
      active = 0; highlight(); open(true);
      return;
    }
    const results = score(q).slice(0, 4);
    if (results[0]) show(results[0].p.slug);
    items = [];
    const rows: string[] = [];
    results.forEach((r, i) => {
      items.push({ href: `/work/${r.p.slug}` });
      rows.push(`<li role="option" id="opt-${i}" aria-selected="false" data-i="${i}">
        <img class="r-thumb" src="${r.p.image}" alt="" loading="lazy">
        <span><span class="r-name">${r.p.name}</span> <span class="r-meta">${r.p.service}</span></span>
        <span class="r-go">${i === 0 ? 'ENTER' : ''}</span></li>`);
    });
    const qEsc = q.trim().replace(/[<>&"]/g, '');
    const i = items.length;
    items.push({ href: bookingHref(q) });
    rows.push(`<li role="option" id="opt-${i}" class="r-cta" aria-selected="false" data-i="${i}">
      <span class="r-icon">&rarr;</span>
      <span><span class="r-name">${results.length ? 'Talk to us about' : 'Not public yet. Talk to us about'}</span> <span class="r-meta">"${qEsc}"</span></span>
      <span class="r-go">${results.length ? '' : 'ENTER'}</span></li>`);
    list!.innerHTML = rows.join('');
    active = 0;
    highlight();
    open(true);
  }

  function highlight() {
    list!.querySelectorAll('li').forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
    input!.setAttribute('aria-activedescendant', active >= 0 ? `opt-${active}` : '');
  }
  function open(on: boolean) {
    list!.hidden = !on;
    input!.setAttribute('aria-expanded', String(on));
  }
  function go(i: number) {
    const it = items[i];
    if (!it) return;
    if (it.play) {
      open(false); input!.blur();
      if (docked) undock(false);
      document.dispatchEvent(new Event('fackt:play'));
      return;
    }
    window.location.href = it.href;
  }

  input.addEventListener('input', () => {
    const q = input.value;
    chips.forEach((c) => c.classList.remove('on'));
    if (q.trim().length < 2) { open(false); return; }
    render(q);
  });
  input.addEventListener('keydown', (e) => {
    if (list.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % items.length; highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + items.length) % items.length; highlight(); }
    else if (e.key === 'Escape') { e.preventDefault(); open(false); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { input.focus(); return; }
    if (list.hidden) render(q);
    go(active < 0 ? 0 : active);
  });
  list.addEventListener('mousedown', (e) => {
    const li = (e.target as HTMLElement).closest('li');
    if (li) { e.preventDefault(); go(Number(li.dataset.i)); }
  });
  list.addEventListener('mousemove', (e) => {
    const li = (e.target as HTMLElement).closest('li');
    if (li && Number(li.dataset.i) !== active) { active = Number(li.dataset.i); highlight(); }
  });
  input.addEventListener('blur', () => setTimeout(() => open(false), 120));
  input.addEventListener('focus', () => { if (input.value.trim().length >= 2) render(input.value); });

  // Chips: shortcuts that switch the stage without opening the dropdown.
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('on', c === chip));
    const best = score(chip.dataset.q ?? '')[0];
    if (best) show(best.p.slug);
    input.placeholder = `Show me a ${chip.textContent?.trim().toLowerCase()} you designed`;
  }));

  // Sticky search: once the hero search scrolls away it hides behind a small pill.
  // Opening it (pill, nav button, Cmd/Ctrl + K or "/") docks the full bar to the
  // bottom of the screen, where it stays while scrolling until closed.
  const slot = document.getElementById('search-slot');
  const box = document.getElementById('search');
  const pill = document.getElementById('search-pill') as HTMLButtonElement | null;
  const closeBtn = document.getElementById('dock-close');
  let inView = true;
  let docked = false;

  function sync() {
    if (inView && docked) undock(false);
    const showPill = !inView && !docked;
    pill?.classList.toggle('show', showPill);
    if (pill) pill.tabIndex = showPill ? 0 : -1;
  }
  function dock() {
    docked = true;
    box?.classList.add('docked');
    sync();
    input!.focus({ preventScroll: true });
    if (input!.value.trim().length >= 2) render(input!.value);
  }
  function undock(focusPill = true) {
    docked = false;
    box?.classList.remove('docked');
    open(false);
    sync();
    if (focusPill && !inView) pill?.focus({ preventScroll: true });
  }
  if (slot && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { inView = e.isIntersecting || e.boundingClientRect.top > 0; sync(); }, { rootMargin: '-64px 0px 0px 0px' }).observe(slot);
  }
  pill?.addEventListener('click', dock);
  closeBtn?.addEventListener('click', () => undock());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && docked && !e.defaultPrevented) undock();
  });

  const focusSearch = () => {
    if (!inView) { dock(); return; }
    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => input.focus({ preventScroll: true }), 250);
  };
  document.addEventListener('keydown', (e) => {
    const typing = (e.target as HTMLElement)?.closest('input, textarea, [contenteditable]');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); focusSearch(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); focusSearch(); }
  });
  document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', focusSearch));

  // Until someone interacts, cycle through the chips so the hero demos itself.
  let touched = false;
  const stop = () => { touched = true; };
  input.addEventListener('focus', stop);
  chips.forEach((c) => c.addEventListener('pointerdown', stop));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && chips.length) {
    let k = 0;
    const timer = setInterval(() => {
      if (touched) { clearInterval(timer); return; }
      if (document.hidden) return;
      k = (k + 1) % chips.length;
      chips[k].click();
    }, 4200);
  }
}
