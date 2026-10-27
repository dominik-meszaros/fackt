// Everything on the homepage that is not a case study lives here.
// Edit text, prices and links in this file; the components read from it.

export const site = {
  name: 'Fackt',
  url: 'https://fackt.io',
  title: 'Fackt: SaaS product design and UI/UX studio',
  description:
    'Independent SaaS product design studio. We design products, dashboards and mobile apps, and build Framer, Webflow and code websites. Start with a free audit.',
  email: 'dominik@fackt.io',
  booking: 'https://cal.com/fackt/30min',
  // Expert badges in the footer. Add each profile link once you have it (empty = badge shows without a link).
  badges: [
    { label: 'Framer Expert', href: '' },
    { label: 'Rive Expert', href: '' },
  ],
  // The integrated booking page. Every "Book a call" button points here.
  bookPage: '/book',
  calLink: 'fackt/30min',
  location: 'Slovakia',
  socials: [
    { label: 'X', href: 'https://x.com/kcinimoDM' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dominik-meszaros/' },
    { label: 'Behance', href: 'https://www.behance.net/dominikmeszaros' },
    { label: 'YouTube', href: 'https://www.youtube.com/@kcinimoDM' },
    { label: 'Contra', href: 'https://contra.com/dominik_meszaros_bpbjfgt0?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=dominik_meszaros_bpbjfgt0' },
  ],
};

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Testimonials', href: '/#testimonials' },
];

export const clients = [
  'ClickUp', 'Viewmax', 'BlackBox AI', 'Communi', 'DevSignal', 'Shredder',
  'Earntask', 'Engain', 'Flashloop', 'Raena', 'Livis', 'Quittr',
];

export const services = [
  {
    title: 'Product Design',
    slug: 'product-design',
    shape: 'a',
    text: 'We turn complex problems into simple, beautiful interfaces. From early concept to a product your users love.',
    tags: ['UI/UX Design', 'Mobile Apps', 'Desktop Apps', 'Prototypes'],
  },
  {
    title: 'Web Design & Development',
    slug: 'web-design-development',
    shape: 'b',
    text: 'From pre-launch landing pages to complete website redesigns, we create experiences that capture attention and inspire action, built in Framer, Webflow or custom code.',
    tags: ['UI/UX Design', 'Visual Identity', 'No-Code Development', 'Code Development'],
  },
  {
    title: 'Motion Design',
    slug: 'motion-design',
    shape: 'c',
    text: 'We use animation and interaction to guide attention, communicate state, and make every action feel satisfying.',
    tags: ['Interaction Design', '3D Design', 'Web Animation'],
  },
  {
    title: 'Visual Branding',
    slug: 'visual-branding',
    shape: 'd',
    text: 'We build the visual language, voice, and feeling that makes you immediately, unmistakably you.',
    tags: ['Visual Identity', 'Brand Systems'],
  },
] as const;

export const industries = ['SaaS', 'Tech', 'AI', 'Web3', 'Education'];

// `video` is optional: add a URL (mp4 or a Mux/Cloudflare Stream file) and the tile opens a player.
export const testimonials = [
  { id: 'sam', name: 'Sam B.', role: 'Founder', company: 'Communi', duration: '0:42', wide: true, video: '' },
  { id: 'joosep', name: 'Joosep S.', role: 'Founder', company: 'SocialPlug', duration: '0:24', video: '' },
  { id: 'joel', name: 'Joel D.', role: 'Co-Founder', company: 'GrowthEdge', duration: '1:39', video: '' },
  { id: 'mark', name: 'Mark V.', role: 'Co-Founder', company: 'Uproas', duration: '0:16', video: '' },
  { id: 'non', name: 'Non S.', role: 'Co-Founder', company: 'Aura', duration: '0:24', video: '' },
  { id: 'igor', name: 'Igor W.', role: 'Co-Founder', company: 'eCom Space', duration: '0:50', video: '' },
  { id: 'stanley', name: 'Stanley S.', role: 'Owner', company: 'Classweep', duration: '0:35', video: '' },
  { id: 'chris', name: 'Chris R.', role: 'Founder', company: 'AcmeStudio', duration: '1:25', wide: true, video: '' },
  { id: 'david', name: 'David S.', role: 'Founder', company: 'Kindscore', duration: '0:20', video: '' },
  { id: 'nick', name: 'Nick M.', role: 'Founder', company: 'WineBuddy', duration: '1:06', video: '' },
];

// TODO before launch: confirm the current Contra rating.
export const rating = { value: '4.96', source: 'Contra', href: 'https://contra.com/dominik_meszaros_bpbjfgt0?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=dominik_meszaros_bpbjfgt0' };

export const reviews = [
  {
    name: 'Jasper',
    role: 'Founder, promote.fun',
    text: 'Dom has been great to work with. He moves very quickly through revisions, listens carefully to instructions, and consistently delivers high quality frontend work. Communication is smooth, feedback is implemented accurately, and the final output always matches what we have in mind. Super reliable and easy to work with.',
  },
  {
    name: 'Eldar Tuvey',
    role: 'Founder, Vertice',
    text: 'Dominik delivered several animations for us. He was fast and effective throughout, kept us updated on progress, and turned the work around quickly. His output matched our brief and he was easy to work with. He took feedback on board without friction and worked swiftly to make whatever updates required.',
  },
  {
    name: 'Evgeny Mishin',
    role: 'Founder, Wicked Genius',
    text: 'It was a great experience working with Dominik. He is very responsive and easy to communicate with. He delivered everything on time. He is great at receiving and implementing feedback. Hope to work with him in the future.',
  },
  {
    name: 'John Fennessy',
    role: 'Founder, Sway Labs',
    text: 'Great experience, talented and great communicator.',
  },
];

export const pricing = {
  retainer: {
    name: 'Retainer',
    price: '$6,900',
    period: '/ month',
    badge: 'Pause or cancel any time',
    text: 'For teams needing fast, reliable design support.',
    items: ['Senior designer', 'Weekly check-ins', 'One active request', 'Unlimited design requests', '24h turnaround', 'Dedicated Slack channel'],
    cta: 'Start today',
  },
  project: {
    name: 'One-time project',
    price: '$5,000',
    prefix: 'from',
    text: 'Fixed-scope, milestone-driven delivery.',
    items: ['Daily design support', 'Milestones, 2 to 6 weeks', 'Clearly defined scope', 'End-to-end project support', 'Scale as you grow', 'AI, SaaS and tech expertise'],
    cta: 'Book a strategy call',
  },
};

// Search: shortcuts under the bar, and synonyms so people find work with their own words.
export const searchChips = [
  { label: 'SaaS dashboard', query: 'saas dashboard' },
  { label: 'Video platform', query: 'video platform' },
  { label: 'Mobile app', query: 'mobile app' },
  { label: 'Landing page', query: 'landing page' },
  { label: 'Branding', query: 'branding' },
];

export const searchSynonyms: Record<string, string[]> = {
  dashboard: ['admin', 'analytics', 'panel', 'console', 'reporting', 'metrics', 'b2b', 'portal', 'internal tool'],
  saas: ['software', 'platform', 'web app', 'webapp', 'startup', 'product'],
  mobile: ['app', 'ios', 'android', 'iphone', 'react native', 'flutter'],
  website: ['site', 'landing', 'landing page', 'marketing', 'homepage', 'webflow', 'framer', 'web', 'code', 'developer', 'development'],
  branding: ['brand', 'identity', 'logo', 'rebrand', 'visual identity'],
  video: ['media', 'streaming', 'player', 'content'],
  ai: ['llm', 'gpt', 'machine learning', 'agent', 'copilot'],
  fintech: ['finance', 'payments', 'wallet', 'banking', 'money'],
  'app store': ['aso', 'screenshots', 'store listing'],
};
