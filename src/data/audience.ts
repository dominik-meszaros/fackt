// "Who we work with": the teams we fit best and the industries we have shipped for.
// Used by the homepage section (components/home/Audience.astro) and the page (/who-we-work-with).
// Industries only list case studies that exist in src/content/work, by slug.

export const teams = [
  {
    id: 'early-stage',
    pick: 'communi', // closest work when no industry is picked
    title: 'Early-stage SaaS founders',
    short: 'an early-stage SaaS team',
    text: 'You are shaping your first product or MVP and there is no designer on the team yet. We take it from idea to a product people understand, ready for development.',
    does: ['MVP flows and screens', 'Clickable prototype for users and investors', 'Launch landing page', 'Brand basics: logo, colors, type'],
    start: 'One-time project',
  },
  {
    id: 'funded',
    pick: 'floxy', // closest work when no industry is picked
    title: 'Funded SaaS teams',
    short: 'a funded SaaS team',
    text: 'You have users, a roadmap and more design work than your team can handle. We plug in as your design team for new features, redesigns and design systems.',
    does: ['New features and redesigns', 'Design system', 'UX audit of the current product', 'Marketing site and motion'],
    start: 'Monthly retainer',
  },
  {
    id: 'mobile',
    pick: 'zums', // closest work when no industry is picked
    title: 'Mobile app startups',
    short: 'a mobile app startup',
    text: 'You are building an iOS or Android app that has to feel clear, fun and worth opening every day. We design the whole app, from onboarding to rewards.',
    does: ['iOS and Android app design', 'Onboarding and gamification', 'Mascots and illustration', 'Interactive Rive animations'],
    start: 'One-time project',
  },
  {
    id: 'agencies',
    pick: 'story-story', // closest work when no industry is picked
    title: 'Agencies',
    short: 'an agency',
    text: 'You have more client work than designers. We design under your brand for your clients, so the relationship stays yours.',
    does: ['Product and web design for your clients', 'Framer and Webflow builds', 'Work inside your Figma and process', 'Extra capacity month to month'],
    start: 'Monthly retainer',
  },
];

// `mobile` = the case study shown instead when a mobile app startup picks this industry.
export const industries: { id: string; short: string; title: string; work: string[]; mobile?: string }[] = [
  { id: 'creator', short: 'a creator or marketing tool', title: 'Creator economy and marketing', work: ['communi', 'promote-app', 'story-story'], mobile: 'communi-mobile' },
  { id: 'ai', short: 'an AI product', title: 'AI and video', work: ['glowtify', 'viewmax'] },
  { id: 'infra', short: 'infrastructure or dev tools', title: 'Infrastructure and developer tools', work: ['floxy', 'tradox'] },
  { id: 'rewards', short: 'a rewards or fintech app', title: 'Rewards, earning and fintech', work: ['zums', 'earntask'], mobile: 'zums' },
  { id: 'education', short: 'an education app', title: 'Education and learning', work: ['kindscore', 'deaflingo'], mobile: 'kindscore' },
];
