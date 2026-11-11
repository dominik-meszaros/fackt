// Small sketch icons for service and niche pages, drawn in the same grammar as the homepage set
// (src/generated/sketch.json): grey pencil strokes, hatched fills, a faint offset copy and the #pz rough filter
// (defs come from <SketchDefs />). One part of each icon moves on hover: put the icon inside an element with
// class "ih" and import '../styles/icons.css'.
type Anim = 'bob' | 'swing' | 'spin' | 'pop' | 'slide' | 'march' | 'draw' | 'blink' | 'tilt';
interface Part { d: string; fill?: 'hatch' | 'white' | 'ink'; o?: number; w?: number; light?: boolean; dash?: string; a?: Anim }

const K = '#3f3f3f', L = '#7a7a7a';
const R = (x: number, y: number, w: number, h: number, r = 3) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
const C = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
const spark = (x: number, y: number, a?: Anim): Part[] => [
  { d: `M${x} ${y - 6}Q${x} ${y} ${x + 6} ${y}Q${x} ${y} ${x} ${y + 6}Q${x} ${y} ${x - 6} ${y}Q${x} ${y} ${x} ${y - 6}Z`, w: 1.5, a: a ?? 'blink' },
  { d: `M${x + 14} ${y - 10}h6M${x + 17} ${y - 13}v6`, w: 1.4 },
];

function paint(p: Part) {
  const out: string[] = [];
  if (p.fill === 'hatch') out.push(`<path d="${p.d}" fill="#ececea"/><path d="${p.d}" fill="url(#ph)" opacity="${p.o ?? 0.6}"/>`);
  if (p.fill === 'white') out.push(`<path d="${p.d}" fill="#fff"/>`);
  if (p.fill === 'ink') out.push(`<path d="${p.d}" fill="${K}"/>`);
  out.push(`<path d="${p.d}" fill="none" stroke="${p.light ? L : K}" stroke-width="${p.w ?? 1.8}" stroke-linecap="round" stroke-linejoin="round"${p.dash ? ` stroke-dasharray="${p.dash}"` : ''}${p.a === 'draw' ? ' pathLength="1"' : ''}/>`);
  return p.a ? `<g class="a-${p.a}">${out.join('')}</g>` : out.join('');
}
function sk(label: string, parts: Part[]) {
  const body = parts.map(paint).join('');
  return `<svg class="ico" viewBox="0 0 96 96" role="img" aria-label="${label}"><g filter="url(#pz)"><g transform="translate(.9 .6)" opacity=".35">${body}</g>${body}</g></svg>`;
}

export const icons = {
  // steps
  call: sk('Phone call', [{ d: R(32, 14, 30, 62, 5), fill: 'hatch', o: .35, w: 2.1 }, { d: R(36, 22, 22, 44, 1), fill: 'white', w: 0 }, { d: 'M42 18H52', w: 1.6 }, { d: C(47, 40, 8), fill: 'hatch' }, { d: 'M40 56H54M42 61H52', light: true, w: 1.2 }, { d: 'M68 30Q76 38 68 46M74 24Q86 38 74 52', w: 1.6, a: 'blink' }, ...spark(20, 26, 'spin')]),
  audit: sk('Checklist under a magnifier', [{ d: R(18, 12, 46, 66), fill: 'white', w: 2 }, { d: 'M26 26l3 3 6-6M26 42l3 3 6-6', w: 1.6, a: 'draw' }, { d: 'M40 26H56M40 42H54M26 58H50M26 66H44', light: true, w: 1.2 }, { d: `${C(64, 62, 13)}M73 71L84 82`, fill: 'hatch', o: .5, w: 2.2, a: 'slide' }, ...spark(78, 22)]),
  screens: sk('Two screens', [{ d: R(12, 22, 48, 36), fill: 'hatch', o: .35 }, { d: R(34, 38, 52, 40), fill: 'white', w: 2.1, a: 'bob' }, { d: 'M34 47H86', w: 1.4, a: 'bob' }, { d: R(40, 53, 16, 18, 1), fill: 'hatch', w: 1.4, a: 'bob' }, { d: 'M61 56H79M61 62H74M61 68H70', light: true, w: 1.2, a: 'bob' }, ...spark(78, 18)]),
  handoff: sk('File handed off', [{ d: 'M18 20H50L60 30V76H18Z', fill: 'white', w: 2 }, { d: 'M50 20V30H60', w: 1.6 }, { d: 'M26 42H50M26 50H46M26 58H40', light: true, w: 1.2 }, { d: R(46, 50, 36, 28), fill: 'hatch', a: 'slide' }, { d: 'M58 64l6 6 12-12', w: 2, a: 'draw' }, ...spark(78, 22)]),
  structure: sk('Sitemap', [{ d: R(34, 10, 28, 18), fill: 'hatch' }, { d: 'M48 28V40M20 40H76M20 40V50M48 40V50M76 40V50', w: 1.6, a: 'draw' }, { d: R(8, 50, 24, 18), fill: 'white', w: 1.6 }, { d: R(36, 50, 24, 18), fill: 'white', w: 1.6 }, { d: R(64, 50, 24, 18), fill: 'white', w: 1.6 }, { d: 'M14 78H26M42 78H54M70 78H82', light: true, w: 1.2 }]),
  launch: sk('Rocket', [{ d: 'M48 10Q66 26 62 58H34Q30 26 48 10Z', fill: 'white', w: 2, a: 'bob' }, { d: C(48, 36, 6), fill: 'hatch', a: 'bob' }, { d: 'M34 50L24 64L36 60M62 50L72 64L60 60', w: 1.8, a: 'bob' }, { d: 'M42 66Q48 82 54 66', fill: 'hatch', a: 'blink' }, ...spark(78, 22)]),
  storyboard: sk('Storyboard frames', [{ d: R(8, 18, 36, 26), fill: 'white' }, { d: R(52, 18, 36, 26), fill: 'white' }, { d: R(8, 54, 36, 26), fill: 'white' }, { d: R(52, 54, 36, 26), fill: 'hatch', o: .45, a: 'pop' }, { d: `${C(22, 31, 5)}M60 36Q70 24 80 36M18 70H34`, w: 1.5 }]),
  animate: sk('Ball bouncing along an arc', [{ d: 'M10 78H86', w: 1.6 }, { d: 'M18 76Q30 22 48 60Q60 34 74 66', w: 1.6, dash: '1 5', a: 'march' }, { d: C(74, 66, 8), fill: 'hatch', a: 'bob' }, ...spark(26, 22)]),
  deliver: sk('Package', [{ d: 'M16 34L48 20L80 34V70L48 84L16 70Z', fill: 'white', w: 2 }, { d: 'M16 34L48 48L80 34M48 48V84', w: 1.6 }, { d: 'M32 27L64 41V52', w: 1.6 }, { d: 'M56 62l6 6 12-14', w: 2, a: 'draw' }]),
  directions: sk('Three directions', [{ d: R(8, 26, 24, 34), fill: 'white', a: 'tilt' }, { d: R(36, 18, 24, 42), fill: 'hatch', o: .45, a: 'bob' }, { d: R(64, 26, 24, 34), fill: 'white', a: 'tilt' }, { d: 'M20 70V80M48 66V80M76 70V80', w: 1.4, light: true }, { d: 'M42 84l6 6 6-6', w: 1.6 }]),
  refine: sk('Pencil on a curve', [{ d: 'M10 70Q30 40 48 58T84 40', w: 1.8, a: 'draw' }, { d: 'M58 14L74 30L44 60L32 62L34 50Z', fill: 'hatch', w: 1.8, a: 'swing' }, { d: 'M54 18L70 34', w: 1.4, a: 'swing' }]),
  // product design
  ui: sk('Screens in four states', [{ d: R(10, 22, 20, 38), fill: 'white', w: 1.6 }, { d: R(14, 32, 12, 9, 1), fill: 'hatch', w: 1.2 }, { d: R(36, 30, 20, 38), fill: 'white', w: 1.6 }, { d: C(46, 48, 5), dash: '2 3', w: 1.4, a: 'spin' }, { d: R(62, 22, 20, 38), fill: 'white', w: 1.6 }, { d: 'M72 34l6 10H66Z', w: 1.4, a: 'blink' }, { d: R(36, 72, 50, 14), fill: 'hatch', w: 1.6 }, { d: 'M42 79l3 3 6-6', w: 1.6, a: 'draw' }]),
  flows: sk('Flow of boxes', [{ d: R(8, 40, 22, 16, 2), fill: 'hatch', w: 1.6 }, { d: R(44, 20, 22, 16, 2), fill: 'white', w: 1.6 }, { d: R(44, 60, 22, 16, 2), fill: 'white', w: 1.6 }, { d: R(74, 40, 16, 16, 2), fill: 'ink', w: 1.6, a: 'pop' }, { d: 'M30 46Q38 46 44 30M30 50Q38 50 44 66M66 28Q72 30 76 40M66 68Q72 66 76 56', w: 1.4, dash: '1 4', a: 'march' }, ...spark(22, 20)]),
  system: sk('Components', [{ d: R(10, 18, 34, 13, 6.5), fill: 'ink', w: 1.4, a: 'slide' }, { d: R(10, 38, 34, 13, 6.5), fill: 'white', w: 1.6 }, { d: R(10, 58, 34, 13, 6.5), fill: 'hatch', w: 1.6 }, { d: R(52, 18, 34, 54), fill: 'white' }, { d: 'M58 28H80M58 34H72', light: true, w: 1.2 }, { d: R(58, 42, 22, 20, 2), fill: 'hatch', w: 1.4, a: 'pop' }, { d: C(20, 84, 4), w: 1.4 }, { d: C(34, 84, 4), fill: 'hatch', w: 1.4 }]),
  proto: sk('Tap between two screens', [{ d: R(10, 16, 28, 56, 5), fill: 'white' }, { d: R(15, 30, 18, 10, 1), fill: 'hatch', w: 1.3 }, { d: R(58, 16, 28, 56, 5), fill: 'white' }, { d: R(63, 28, 18, 26, 1), fill: 'hatch', w: 1.3, a: 'pop' }, { d: 'M36 34Q48 18 58 30', w: 1.6, dash: '1 4', a: 'march' }, { d: 'M26 46L32 64L35 57L42 56Z', fill: 'white', a: 'tilt' }]),
  apps: sk('Laptop and phone', [{ d: R(12, 22, 56, 38, 2), fill: 'white', w: 2 }, { d: 'M6 66H74L70 72H10Z', fill: 'hatch' }, { d: R(18, 28, 18, 26, 1), fill: 'hatch', o: .45, w: 1.3 }, { d: 'M42 32H60M42 38H54', light: true, w: 1.2 }, { d: R(62, 36, 24, 46, 5), fill: 'white', w: 2, a: 'bob' }, { d: 'M70 41H78', w: 1.4, a: 'bob' }, { d: R(66, 48, 16, 14, 1), fill: 'hatch', w: 1.2, a: 'bob' }]),
  // web
  landing: sk('Landing page', [{ d: R(10, 14, 76, 68), fill: 'white', w: 2 }, { d: 'M10 26H86', w: 1.6 }, { d: 'M16 20h2M22 20h2M28 20h2', w: 1.8 }, { d: 'M20 38H58M20 46H48', w: 1.8 }, { d: R(20, 56, 22, 10, 5), fill: 'ink', w: 1.4, a: 'pop' }, { d: R(60, 34, 18, 34, 2), fill: 'hatch', w: 1.4 }]),
  redesign: sk('Old page to new page', [{ d: R(8, 20, 34, 44), fill: 'hatch', o: .35, w: 1.6 }, { d: 'M14 30H34M14 38H30', light: true, w: 1.2 }, { d: R(54, 20, 34, 44), fill: 'white', w: 2 }, { d: 'M60 30H82M60 38H74', w: 1.6 }, { d: R(60, 46, 14, 10, 2), fill: 'hatch', w: 1.3 }, { d: 'M38 74Q48 84 60 74M56 70l4 4-5 3', w: 1.6, a: 'slide' }]),
  build: sk('Code brackets in a window', [{ d: R(10, 16, 76, 60), fill: 'white', w: 2 }, { d: 'M10 28H86', w: 1.6 }, { d: 'M34 42L24 52L34 62M62 42L72 52L62 62', w: 2, a: 'pop' }, { d: 'M52 38L44 66', w: 1.8, a: 'swing' }]),
  cms: sk('Content cards', [{ d: R(14, 14, 56, 16), fill: 'white', a: 'slide' }, { d: R(20, 38, 56, 16), fill: 'hatch', o: .45 }, { d: R(26, 62, 56, 16), fill: 'white' }, { d: 'M20 22H44M26 46H52M32 70H58', light: true, w: 1.2 }, ...spark(84, 20)]),
  interactions: sk('Cursor making a spark', [{ d: R(12, 18, 50, 34, 6), fill: 'white', w: 2 }, { d: 'M24 35H50', w: 1.8 }, { d: 'M48 44L56 70L60 60L70 58Z', fill: 'white', w: 1.8, a: 'tilt' }, { d: 'M70 30l6-6M74 40h8M64 22l2-8', w: 1.6, a: 'blink' }]),
  seo: sk('Rising bars under a magnifier', [{ d: 'M14 80H82', w: 1.6 }, { d: R(18, 60, 12, 20, 1), fill: 'hatch' }, { d: R(36, 48, 12, 32, 1), fill: 'hatch' }, { d: R(54, 34, 12, 46, 1), fill: 'ink', w: 1.4, a: 'pop' }, { d: `${C(66, 26, 11)}M74 34L84 44`, fill: 'white', w: 2, a: 'slide' }]),
  // motion
  play: sk('Screen with a play button', [{ d: R(10, 16, 76, 54), fill: 'white', w: 2 }, { d: C(48, 43, 14), fill: 'hatch', a: 'pop' }, { d: 'M44 36L56 43L44 50Z', fill: 'ink', w: 1.4, a: 'pop' }, { d: 'M10 80H86', w: 1.6 }, { d: C(36, 80, 3), fill: 'ink', w: 1.4, a: 'slide' }]),
  toggle: sk('Switch and a finger tap', [{ d: R(14, 30, 52, 26, 13), fill: 'hatch', w: 2 }, { d: C(53, 43, 9), fill: 'white', w: 2, a: 'slide' }, { d: 'M66 62L72 84L76 76L84 74Z', fill: 'white', w: 1.8 }, { d: 'M70 24l4-6M78 30h7', w: 1.5, a: 'blink' }]),
  rive: sk('Character waving', [{ d: C(46, 30, 14), fill: 'white', w: 2 }, { d: 'M41 28v2M51 28v2M42 36Q46 39 50 36', w: 1.6 }, { d: 'M32 80Q32 52 46 50Q60 52 60 80Z', fill: 'hatch' }, { d: 'M60 58Q70 50 74 38', w: 2, a: 'swing' }, ...spark(80, 24)]),
  scroll: sk('Page with scroll motion', [{ d: R(22, 10, 44, 76), fill: 'white', w: 2 }, { d: R(28, 20, 32, 16, 2), fill: 'hatch', a: 'bob' }, { d: 'M28 44H56M28 50H50', light: true, w: 1.2, a: 'bob' }, { d: 'M76 30V64M71 58l5 6 5-6', w: 1.8, a: 'bob' }]),
  cube: sk('3D cube', [{ d: 'M48 12L80 28V64L48 80L16 64V28Z', fill: 'white', w: 2, a: 'tilt' }, { d: 'M16 28L48 44L80 28M48 44V80', w: 1.8, a: 'tilt' }, { d: 'M48 44L80 28V64L48 80Z', fill: 'hatch', o: .45, w: 0, a: 'tilt' }]),
  easing: sk('Easing curve', [{ d: 'M14 80H84M14 80V14', w: 1.6 }, { d: 'M14 80C50 80 46 16 84 16', w: 2, a: 'draw' }, { d: C(84, 16, 4), fill: 'ink', w: 1.4, a: 'pop' }, { d: 'M14 52H24M14 36H24', light: true, w: 1.2 }]),
  // branding
  logo: sk('A mark on a card', [{ d: R(16, 16, 64, 64, 6), fill: 'white', w: 2 }, { d: 'M34 30H62V40H44V48H58V58H44V68H34Z', fill: 'ink', w: 1.4, a: 'pop' }, ...spark(82, 16)]),
  swatches: sk('Brand swatches', [{ d: R(14, 22, 22, 56, 3), fill: 'ink', w: 1.6, a: 'swing' }, { d: R(38, 16, 22, 56, 3), fill: 'hatch', w: 1.6, a: 'swing' }, { d: R(62, 22, 22, 56, 3), fill: 'white', w: 1.6, a: 'swing' }]),
  book: sk('Guidelines book', [{ d: 'M14 20Q30 14 48 22V80Q30 72 14 78Z', fill: 'white', w: 2 }, { d: 'M48 22Q66 14 82 20V78Q66 72 48 80', fill: 'hatch', o: .4, w: 2, a: 'tilt' }, { d: 'M22 34H40M22 42H36M22 50H40', light: true, w: 1.2 }]),
  brandscreen: sk('Brand on a screen', [{ d: R(10, 16, 60, 42, 2), fill: 'white', w: 2 }, { d: 'M4 64H76L72 70H8Z', fill: 'hatch' }, { d: 'M28 28H42V34H34V38H40V44H34V50H28Z', fill: 'ink', w: 1.2 }, { d: R(56, 36, 30, 50, 5), fill: 'white', w: 2, a: 'bob' }, { d: 'M64 50H78M64 56H74', w: 1.4, a: 'bob' }]),
  megaphone: sk('Megaphone', [{ d: 'M18 40V58H30L62 74V24L30 40Z', fill: 'white', w: 2, a: 'tilt' }, { d: 'M30 58L36 76H44L40 60', fill: 'hatch' }, { d: 'M70 34l10-6M72 48h12M70 62l10 6', w: 1.6, a: 'blink' }]),
};
export type IconKey = keyof typeof icons;
export const stepIcons: IconKey[] = ['call', 'audit', 'screens', 'handoff'];
