// Custom dropdowns for every <select> on the site (except [data-native] and multiple selects).
// The real <select> stays in the page as the source of truth: forms, validation, change events and
// the no-JS fallback all keep working. Only its popup is replaced:
//   desktop / mouse: a small menu under the field
//   phones (coarse pointer, narrow screen): a bottom sheet with large tap targets
// Keyboard: Enter, Space or the arrow keys open it; arrows move, Enter picks, Escape closes, letters jump.
// Styles: src/styles/global.css (.dd-*).

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const sheetMode = () => matchMedia('(pointer: coarse) and (max-width: 640px)').matches;

let menu: HTMLElement | null = null;
let backdrop: HTMLElement | null = null;
let owner: HTMLSelectElement | null = null;

function labelOf(sel: HTMLSelectElement) {
  const l = sel.closest('label');
  const t = l?.querySelector('span, .sr-only')?.textContent?.trim();
  return sel.getAttribute('aria-label') || t || 'Choose an option';
}

function close(focus = true) {
  if (!menu) return;
  const m = menu, b = backdrop;
  menu = null; backdrop = null;
  m.classList.add('dd-out'); b?.classList.add('dd-out');
  setTimeout(() => { m.remove(); b?.remove(); }, 140);
  document.documentElement.classList.remove('dd-lock');
  if (owner) { owner.setAttribute('aria-expanded', 'false'); if (focus) owner.focus({ preventScroll: true }); }
  owner = null;
}

function pick(sel: HTMLSelectElement, i: number) {
  if (sel.selectedIndex !== i) {
    sel.selectedIndex = i;
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
  close();
}

function open(sel: HTMLSelectElement) {
  close(false);
  owner = sel;
  sel.setAttribute('aria-expanded', 'true');
  const sheet = sheetMode();
  menu = document.createElement('div');
  menu.className = 'dd-menu' + (sheet ? ' dd-sheet' : '');
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-label', labelOf(sel));
  menu.innerHTML = (sheet ? `<div class="dd-head"><span>${esc(labelOf(sel))}</span><button type="button" class="dd-x" aria-label="Close">&#10005;</button></div>` : '') + '<div class="dd-list"></div>';
  const list = menu.querySelector<HTMLElement>('.dd-list')!;
  [...sel.options].forEach((o, i) => {
    if (o.disabled || o.hidden) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dd-opt';
    b.setAttribute('role', 'option');
    b.setAttribute('aria-selected', String(i === sel.selectedIndex));
    b.dataset.i = String(i);
    b.innerHTML = `<span>${esc(o.text)}</span><i aria-hidden="true"></i>`;
    b.addEventListener('click', () => pick(sel, i));
    list.appendChild(b);
  });
  menu.querySelector('.dd-x')?.addEventListener('click', () => close());
  if (sheet) {
    backdrop = document.createElement('div');
    backdrop.className = 'dd-back';
    backdrop.addEventListener('click', () => close());
    document.body.appendChild(backdrop);
    document.documentElement.classList.add('dd-lock');
  }
  document.body.appendChild(menu);
  if (!sheet) {
    const r = sel.getBoundingClientRect();
    menu.style.minWidth = `${Math.max(200, Math.min(r.width, 420))}px`;
    const w = menu.offsetWidth, h = menu.offsetHeight;
    const below = innerHeight - r.bottom > h + 16 || r.top < h + 16;
    menu.style.left = `${Math.max(12, Math.min(r.left, innerWidth - w - 12)) + scrollX}px`;
    menu.style.top = `${(below ? r.bottom + 8 : r.top - h - 8) + scrollY}px`;
    menu.classList.toggle('dd-up', !below);
  }
  (list.querySelector<HTMLElement>('[aria-selected="true"]') || list.querySelector<HTMLElement>('.dd-opt'))?.focus({ preventScroll: true });
}

function enhance(sel: HTMLSelectElement) {
  if (sel.dataset.dd || sel.multiple || sel.hasAttribute('data-native')) return;
  sel.dataset.dd = '1';
  sel.setAttribute('aria-haspopup', 'listbox');
  sel.setAttribute('aria-expanded', 'false');
  sel.classList.add('dd-field');
  // The select ignores the pointer, so taps never open the native picker; its label (or parent) opens ours.
  const host = sel.closest('label') || sel.parentElement!;
  host.addEventListener('click', (e) => {
    if ((e.target as Element).closest('input, textarea, a, button')) return;
    e.preventDefault();
    if (owner === sel) close(); else { sel.focus({ preventScroll: true }); open(sel); }
  });
  sel.addEventListener('keydown', (e) => {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); open(sel); }
  });
}

document.addEventListener('keydown', (e) => {
  if (!menu || !owner) return;
  const opts = [...menu.querySelectorAll<HTMLElement>('.dd-opt')];
  const i = opts.indexOf(document.activeElement as HTMLElement);
  if (e.key === 'Escape') { e.preventDefault(); close(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); opts.at(Math.min(opts.length - 1, i + 1))?.focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); opts.at(Math.max(0, i - 1))?.focus(); }
  else if (e.key === 'Home') { e.preventDefault(); opts.at(0)?.focus(); }
  else if (e.key === 'End') { e.preventDefault(); opts.at(-1)?.focus(); }
  else if (e.key === 'Tab') close(false);
  else if (e.key.length === 1 && /\S/.test(e.key)) {
    const k = e.key.toLowerCase();
    const after = [...opts.slice(i + 1), ...opts.slice(0, i + 1)];
    after.find((o) => o.textContent!.trim().toLowerCase().startsWith(k))?.focus();
  }
});
document.addEventListener('pointerdown', (e) => {
  if (!menu || !owner) return;
  const t = e.target as Node;
  if (menu.contains(t) || backdrop?.contains(t) || (owner.closest('label') || owner.parentElement)!.contains(t)) return;
  close(false);
});
addEventListener('resize', () => { if (menu && !menu.classList.contains('dd-sheet')) close(false); });

const run = () => document.querySelectorAll<HTMLSelectElement>('select').forEach(enhance);
run();
let queued = false;
new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; run(); }); }).observe(document.body, { childList: true, subtree: true });
