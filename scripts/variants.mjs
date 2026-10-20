// After `astro build`: makes smaller copies of every image in dist/uploads (dist/uploads/_w/<name>-<width>.webp)
// and adds srcset/sizes to every <img> that points at /uploads, so phones download a phone-sized image.
// Runs on every build, so images added through the CMS get their smaller copies too.
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const DIST = 'dist';
const UP = join(DIST, 'uploads');
const OUT = join(UP, '_w');
const WIDTHS = [160, 480, 640, 960, 1440];
const DEFAULT_SIZES = '(max-width: 720px) 100vw, 50vw';

await mkdir(OUT, { recursive: true });
const info = new Map(); // "/uploads/x.webp" -> { width, set: [[url, w], ...] }
const files = (await readdir(UP)).filter((f) => ['.webp', '.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()));

let made = 0;
await Promise.all(files.map(async (f) => {
  const src = join(UP, f);
  let meta;
  try { meta = await sharp(src).metadata(); } catch { return; }
  if (!meta.width) return;
  const name = basename(f, extname(f));
  const set = [];
  for (const w of WIDTHS) {
    if (w >= meta.width) break;
    const dest = join(OUT, `${name}-${w}.webp`);
    try { await stat(dest); } catch { await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(dest); made++; }
    set.push([`/uploads/_w/${name}-${w}.webp`, w]);
  }
  if (set.length) info.set(`/uploads/${f}`, { width: meta.width, set });
}));

const srcsetOf = (url) => {
  const i = info.get(url);
  return i ? [...i.set.map(([u, w]) => `${u} ${w}w`), `${url} ${i.width}w`].join(', ') : null;
};

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'uploads' && e.name !== 'admin') yield* walk(p); }
    else if (p.endsWith('.html')) yield p;
  }
}

let tagged = 0;
for await (const file of walk(DIST)) {
  const html = await readFile(file, 'utf8');
  const next = html.replace(/<img\b[^>]*>/g, (tag) => {
    // Images without an explicit loading choice wait until they are near the screen.
    if (!/\sloading=/.test(tag) && !/fetchpriority=/.test(tag) && !/\sdata-src=/.test(tag)) tag = tag.replace(/^<img\b/, '<img loading="lazy" decoding="async"');
    if (/\ssrcset=/.test(tag) || /\sdata-srcset=/.test(tag)) return tag;
    const m = tag.match(/\s(data-src|src)="(\/uploads\/[^"?#]+)"/);
    if (!m) return tag;
    const set = srcsetOf(m[2]);
    if (!set) return tag;
    const wAttr = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
    const sizes = wAttr && wAttr <= 200 ? `${wAttr}px` : DEFAULT_SIZES;
    const attr = m[1] === 'data-src' ? 'data-srcset' : 'srcset';
    tagged++;
    return tag.replace(/^<img\b/, `<img ${attr}="${set}" sizes="${sizes}"`);
  });
  // The preloaded hero image gets the same choices, so the browser preloads the size it will actually use.
  const next2 = next.replace(/<link rel="preload" as="image" href="(\/uploads\/[^"?#]+)"/g, (tag, url) => {
    const set = srcsetOf(url);
    return set ? `${tag} imagesrcset="${set}" imagesizes="${DEFAULT_SIZES}"` : tag;
  });
  if (next2 !== html) await writeFile(file, next2);
}
console.log(`image variants: ${made} new files, ${tagged} img tags got srcset`);
