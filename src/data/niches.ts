// SEO niche pages (service x niche), e.g. fackt.io/saas-dashboard-design. Design: canvas boards PNiche / PNicheM / PNicheMap.
// One entry = one page. Only real facts: numbers come from case studies or Contra; never invent results.
export type FixArt = 'weight' | 'context' | 'empty';
export interface Niche {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  crumb: { label: string; href: string }[];
  current: string;
  h1: string;
  lede: string;
  hero: { work: string; caption: string };
  logos: string[];
  results: { value: string; label: string; source: string; href: string }[];
  fixTitle: string;
  fixLede: string;
  fixes: { art: FixArt; title: string; text: string }[];
  casesTitle: string;
  cases: { work: string; line: string }[];
  stepsTitle: string;
  steps: { when: string; title: string; text: string }[];
  price: { title: string; text: string };
  faqTitle: string;
  faq: { q: string; a: string }[];
  note: { slug: string; title: string; text: string };
  endTitle: string;
}

export const niches: Niche[] = [
  {
    slug: 'saas-dashboard-design',
    seoTitle: 'SaaS Dashboard Design Agency | Fackt',
    seoDescription: 'SaaS dashboard design and redesign for teams whose dashboard shows data instead of answers. Projects from $5,000, done in 2 to 6 weeks.',
    crumb: [{ label: 'Services', href: '/services' }, { label: 'Product design', href: '/services/product-design' }],
    current: 'SaaS dashboards',
    h1: 'SaaS dashboard design',
    lede: 'For SaaS teams whose dashboard shows data instead of answers. We redesign it so users find the one number they came for, in seconds.',
    hero: { work: 'floxy', caption: 'Floxy, proxy dashboard' },
    logos: ['Algrow', 'FireCut', 'Communi', 'Viewmax', 'ClickUp'],
    results: [
      { value: '68 / 100', label: 'FireCut cancellation reasons traced to design, then redesigned', source: 'FireCut case study', href: '/work/firecut' },
      { value: '12 → 1', label: 'flat grid of tools turned into one clear starting point', source: 'FireCut case study', href: '/work/firecut' },
      { value: '4.96', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    fixTitle: 'Three reasons dashboards lose users',
    fixLede: 'We see the same three in almost every audit.',
    fixes: [
      { art: 'weight', title: 'Everything has the same weight', text: 'Every card is the same size, so nothing stands out. We make the number people came for the biggest thing on the screen.' },
      { art: 'context', title: 'Numbers without context', text: 'Is 2,340 good or bad? We add the change since last week and the limit, so a number becomes an answer.' },
      { art: 'empty', title: 'An empty first screen', text: 'New accounts see a wall of zeros. We design the empty state that explains what appears here and gives one first action.' },
    ],
    casesTitle: 'Recent dashboard work',
    cases: [
      { work: 'floxy', line: 'A proxy dashboard that stays readable at scale' },
      { work: 'communi', line: 'A creator command center, desktop to mobile' },
      { work: 'firecut', line: 'Twelve AI tools turned into one clear flow' },
    ],
    stepsTitle: 'From call to handoff in 2 to 6 weeks',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'We find the one screen that matters most.' },
      { when: 'Week 1', title: 'Audit and flows', text: 'The 12 checks, ranked by impact.' },
      { when: 'Week 2 to 3', title: 'First screens', text: 'Real screens to react to, early.' },
      { when: 'Week 4 to 6', title: 'Full design and handoff', text: 'States, specs and files to build from.' },
    ],
    price: { title: 'Dashboard redesigns from $5,000', text: 'A fixed project. Ongoing design is $6,900 a month, pause any time.' },
    faqTitle: 'SaaS dashboard design, answered',
    faq: [
      { q: 'How much does a SaaS dashboard redesign cost?', a: 'Most dashboard redesigns are a fixed project from $5,000, done in 2 to 6 weeks. Ongoing design is $6,900 a month.' },
      { q: 'Do you work with our existing design system?', a: 'Yes. We extend what you have, or set up a small system as part of the project.' },
      { q: 'Can you start with an audit?', a: 'Yes. Send your product and within 2 days you get a video walkthrough and a written list of fixes, ordered by impact.' },
      { q: 'Will our developers be able to build it?', a: 'You get organised Figma files with specs and states, ready to build from.' },
    ],
    note: { slug: 'saas-dashboard-audit-checklist', title: 'The SaaS dashboard audit: 12 things we check first', text: 'Run it on your own product in an afternoon.' },
    endTitle: "Let's look at your dashboard together.",
  },
];
