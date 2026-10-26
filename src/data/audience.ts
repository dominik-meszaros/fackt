// "Who we work with": the teams we fit best and the industries we have shipped for.
// Used by the homepage section (components/home/Audience.astro) and the page (/who-we-work-with).
// Industries only list case studies that exist in src/content/work, by slug.

export const teams = [
  {
    id: 'early-stage',
    title: 'Early-stage SaaS founders',
    text: 'You are shaping your first product or MVP and there is no designer on the team yet. We take it from idea to a product people understand, ready for development.',
    does: ['MVP flows and screens', 'Clickable prototype for users and investors', 'Launch landing page', 'Brand basics: logo, colors, type'],
    start: 'One-time project',
  },
  {
    id: 'funded',
    title: 'Funded SaaS teams',
    text: 'You have users, a roadmap and more design work than your team can handle. We plug in as your design team for new features, redesigns and design systems.',
    does: ['New features and redesigns', 'Design system', 'UX audit of the current product', 'Marketing site and motion'],
    start: 'Monthly retainer',
  },
  {
    id: 'mobile',
    title: 'Mobile app startups',
    text: 'You are building an iOS or Android app that has to feel clear, fun and worth opening every day. We design the whole app, from onboarding to rewards.',
    does: ['iOS and Android app design', 'Onboarding and gamification', 'Mascots and illustration', 'Interactive Rive animations'],
    start: 'One-time project',
  },
  {
    id: 'agencies',
    title: 'Agencies',
    text: 'You have more client work than designers. We design under your brand for your clients, so the relationship stays yours.',
    does: ['Product and web design for your clients', 'Framer and Webflow builds', 'Work inside your Figma and process', 'Extra capacity month to month'],
    start: 'Monthly retainer',
  },
];

export const industries = [
  { id: 'creator', title: 'Creator economy and marketing', work: ['communi', 'promote-app', 'story-story'] },
  { id: 'ai', title: 'AI and video', work: ['glowtify', 'viewmax'] },
  { id: 'infra', title: 'Infrastructure and developer tools', work: ['floxy', 'tradox'] },
  { id: 'rewards', title: 'Rewards, earning and fintech', work: ['zums', 'earntask'] },
  { id: 'education', title: 'Education and learning', work: ['kindscore', 'deaflingo'] },
];
