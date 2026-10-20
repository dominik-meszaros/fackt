// FAQ accordion: answers slide open and closed instead of snapping, and opening one closes the others.
const EASE = 'cubic-bezier(.2, .7, .2, 1)';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('.faq').forEach((list) => {
  const items = Array.from(list.querySelectorAll<HTMLDetailsElement>('details'));
  items.forEach((d) => {
    const summary = d.querySelector('summary')!;
    // Wrap the answer so its height can be animated.
    const ans = document.createElement('div');
    ans.className = 'ans';
    while (summary.nextSibling) ans.appendChild(summary.nextSibling);
    d.appendChild(ans);
    let anim: Animation | null = null;

    const close = () => {
      if (!d.open) return;
      if (still) { d.open = false; return; }
      anim?.cancel();
      const h = ans.offsetHeight;
      d.classList.add('closing');
      anim = ans.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: EASE });
      anim.onfinish = () => { d.open = false; d.classList.remove('closing'); anim = null; };
    };
    const open = () => {
      d.open = true;
      if (still) return;
      anim?.cancel();
      const h = ans.offsetHeight;
      anim = ans.animate([{ height: '0px', opacity: 0, transform: 'translateY(-4px)' }, { height: `${h}px`, opacity: 1, transform: 'none' }], { duration: 380, easing: EASE });
      anim.onfinish = () => { anim = null; };
    };
    (d as any)._close = close;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open && !d.classList.contains('closing')) { close(); return; }
      items.forEach((o) => { if (o !== d) (o as any)._close?.(); });
      open();
    });
  });
});
