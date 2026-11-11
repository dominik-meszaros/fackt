// SEO niche pages (service x niche), e.g. fackt.io/saas-dashboard-design. Design: canvas boards PNiche / PNicheM / PNicheMap.
import type { IconKey } from './icons';
// One entry = one page. Only real facts: numbers come from case studies or Contra; never invent results.
export type FixArt = 'weight' | 'context' | 'empty' | 'paywall' | 'firstrun' | 'store' | 'nudge' | 'fold' | 'proof' | 'cta' | 'cms' | 'speed';
export interface Niche {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  crumb: { label: string; href: string }[];
  current: string;
  h1: string;
  lede: string;
  hero: { work: string; caption: string; image?: string };
  logos: string[];
  results: { value: string; label: string; source: string; href: string }[];
  fixTitle?: string;
  fixLede?: string;
  fixes?: { art: FixArt; title: string; text: string }[];
  // optional, for city pages: a day ruler (their hours above ours) and reasons with icons
  local?: {
    title: string; sub: string; city: string; home: string; diff: number;
    bands: { from: number; to: number; label: string; kind: 'call' | 'work' }[];
    reasonsTitle: string; reasonsSub: string; reasons: { icon: IconKey; title: string; text: string }[];
  };
  casesTitle: string;
  cases: { work: string; line: string }[];
  stepsTitle: string;
  steps: { when: string; title: string; text: string; icon?: IconKey }[];
  // optional: a real screen with pencil rings (positions in % of the image), shown instead of the fix cards
  teardown?: { title: string; sub: string; image: string; alt: string; href: string; marks: { x: number; y: number; w: number; h: number; rot?: number }[]; notes: { title: string; text: string }[] };
  // optional: before and after slider
  compare?: { title: string; sub: string; before: string; after: string; beforeAlt: string; afterAlt: string; beforeCap: string; afterCap: string };
  // optional, strategy pages: a staged launch path (shown instead of steps), a contrast table, things to skip, a client spotlight
  path?: { title: string; sub: string; stages: { weeks: string; icon: IconKey; title: string; why: string; decide: string; ship: string; proof?: { label: string; href: string } }[] };
  contrast?: { title: string; sub: string; left: string; right: string; rows: { them: string; us: string }[] };
  skip?: { title: string; sub: string; items: { icon: IconKey; title: string; text: string }[] };
  spotlight?: { name: string; meta: string; title: string; text: string; image?: string; href?: string };
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
    hero: { work: 'communi', caption: 'Communi, creator command center', image: '/uploads/communi-desktop.webp' },
    logos: ['Algrow', 'FireCut', 'Communi', 'Viewmax', 'ClickUp'],
    results: [
      { value: '68 / 100', label: 'FireCut cancellation reasons traced to design, then redesigned', source: 'FireCut case study', href: '/work/firecut' },
      { value: '12 → 1', label: 'flat grid of tools turned into one clear starting point', source: 'FireCut case study', href: '/work/firecut' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    fixTitle: 'Three reasons dashboards lose users',
    fixLede: 'We see the same three in almost every audit.',
    fixes: [
      { art: 'weight', title: 'Everything has the same weight', text: 'Every card is the same size, so nothing stands out. We make the number people came for the biggest thing on the screen.' },
      { art: 'context', title: 'Numbers without context', text: 'Is 2,340 good or bad? We add the change since last week and the limit, so a number becomes an answer.' },
      { art: 'empty', title: 'An empty first screen', text: 'New accounts see a wall of zeros. We design the empty state that explains what appears here and gives one first action.' },
    ],
    teardown: {
      title: 'Three reasons dashboards lose users',
      sub: "We see the same three in almost every audit. Here is how they look fixed, on Floxy's proxy dashboard.",
      image: '/uploads/floxy-screen.webp', alt: 'Floxy proxy dashboard designed by Fackt, with the balance, data left and one action per card circled', href: '/work/floxy',
      marks: [{ x: 20.5, y: 18.5, w: 11, h: 10.5, rot: -3 }, { x: 60, y: 17, w: 18.5, h: 18, rot: 2 }, { x: 20.8, y: 29.2, w: 78.6, h: 6.4, rot: -.5 }],
      notes: [
        { title: 'One number, biggest on the screen', text: 'Balance is what people check on every visit, so it leads. Everything else steps back.' },
        { title: 'Context next to every number', text: '14.35GB left, of 20GB, with a bar and a percentage. A number becomes an answer.' },
        { title: 'One clear action per card', text: 'Add balance, purchase a plan, generate a proxy. No hunting through menus.' },
      ],
    },
    compare: {
      title: 'Twelve tools, one clear starting point', sub: "Drag to compare FireCut's tool grid with the redesign.",
      before: '/uploads/firecut-tools-before.webp', after: '/uploads/firecut-tools-after.webp',
      beforeAlt: 'FireCut before: twelve AI tools in one flat grid', afterAlt: 'FireCut after the redesign: saved tools first, then a workflow',
      beforeCap: '12 tools in one flat grid, nothing stands out.', afterCap: 'Saved tools first, then a workflow.',
    },
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
  {
    slug: 'ios-app-design',
    seoTitle: 'iOS App Design and Development for Startups | Fackt',
    seoDescription: 'iOS app design and SwiftUI development for startups: brand, product design, paywalls, widgets and App Store launch. We ship our own apps too. Projects from $5,000.',
    crumb: [{ label: 'Services', href: '/services' }, { label: 'Product design', href: '/services/product-design' }],
    current: 'iOS apps',
    h1: 'iOS app design and development',
    lede: 'For founders who want an app people open every day and pay for. We design it, build it in SwiftUI and launch it, the same way we ship our own apps.',
    hero: { work: 'dozy', caption: 'Dozy, our own sleep app', image: '/uploads/dozy-hero-43.webp' },
    logos: ['Shredder', 'Communi', 'Quittr', 'Flashloop', 'FireCut'],
    results: [
      { value: '28k', label: 'lines of SwiftUI in Dozy, designed and built by us', source: 'Dozy case study', href: '/work/dozy' },
      { value: '4', label: 'Ritual releases in about a week after a native rebuild', source: 'Ritual case study', href: '/work/ritual' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    fixTitle: 'Three places apps lose people',
    fixLede: 'Most apps do not fail on features. They fail in the first minute, on the paywall and on the App Store page.',
    fixes: [
      { art: 'firstrun', title: 'Too many steps before any value', text: 'Long setup before anything happens. We cut onboarding to what earns the first win, then ask for the rest later.' },
      { art: 'paywall', title: 'A paywall that lists features', text: 'Nobody pays for a feature list. We show people their own result and a clear trial timeline, then test layouts remotely.' },
      { art: 'store', title: 'Screenshots that show screens', text: 'App Store screenshots that are just UI do not sell. One promise per frame, written for every language you ship in.' },
    ],
    casesTitle: 'Apps we designed and built',
    cases: [
      { work: 'dozy', line: 'Our own sleep app: brand, SwiftUI, paywall tests, 20 languages' },
      { work: 'ritual', line: 'Our own habit app, rebuilt native and shipped four times in a week' },
      { work: 'shredder', line: 'A social app for skiers, 142 screens across two eras' },
    ],
    stepsTitle: 'From idea to the App Store',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'What the app must do on day one, and what can wait.' },
      { when: 'Week 1', title: 'Flows and brand', text: 'Name, icon and the core flows, in Figma first.', icon: 'flows' },
      { when: 'Week 2 onward', title: 'Design and build', text: 'Screens, then SwiftUI, with TestFlight builds as we go.', icon: 'apps' },
      { when: 'Launch', title: 'App Store ready', text: 'Paywall, analytics, screenshots and listing.', icon: 'launch' },
    ],
    price: { title: 'App projects from $5,000', text: 'Design, or design and SwiftUI build, as a fixed project. Ongoing design is $6,900 a month, pause any time.' },
    faqTitle: 'iOS app design, answered',
    faq: [
      { q: 'Do you design and build, or only design?', a: 'Both. We design in Figma first and can build the app natively in SwiftUI, including subscriptions, widgets, notifications and the App Store launch. Our own apps Dozy and Ritual are built this way.' },
      { q: 'How much does it cost to design an iOS app?', a: 'App projects start at $5,000 as a fixed project. The price depends on how many flows and whether we also build it. Ongoing design is $6,900 a month.' },
      { q: 'Can you set up subscriptions and paywall tests?', a: 'Yes. We use RevenueCat, with paywall layouts and rules you can change remotely, so you can test pricing without an App Store update.' },
      { q: 'Can you rebuild an existing app?', a: 'Yes. We rebuilt Ritual natively in SwiftUI on the same bundle ID, so every existing user got it as a normal update.' },
      { q: 'Can you start with an audit?', a: 'Yes. Send your app and within 2 days you get a video walkthrough and a written list of fixes, ordered by impact.' },
    ],
    note: { slug: 'revenuecat-paywall-ab-tests', title: 'Paywall A/B tests without App Store updates', text: 'How we test paywalls in Dozy with RevenueCat.' },
    endTitle: "Let's talk about your app.",
  },
  {
    slug: 'saas-onboarding-design',
    seoTitle: 'SaaS Onboarding Design Agency | Fackt',
    seoDescription: 'SaaS onboarding design that gets new users to their first win faster: signup, first run, empty states and follow up. Projects from $5,000, done in 2 to 6 weeks.',
    crumb: [{ label: 'Services', href: '/services' }, { label: 'Product design', href: '/services/product-design' }],
    current: 'SaaS onboarding',
    h1: 'SaaS onboarding design',
    lede: 'For SaaS teams who get signups but not active users. We redesign the first minutes so people reach their first win before they leave.',
    hero: { work: 'firecut', caption: 'FireCut, AI editing plugin' },
    logos: ['FireCut', 'Communi', 'Algrow', 'Viewmax', 'ClickUp'],
    results: [
      { value: '68 / 100', label: 'FireCut cancellation reasons traced to design, then redesigned', source: 'FireCut case study', href: '/work/firecut' },
      { value: '13', label: 'onboarding steps in Ritual, every one tracked in analytics', source: 'Ritual case study', href: '/work/ritual' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    fixTitle: 'Three reasons new users leave',
    fixLede: 'We find at least one of these in almost every onboarding we audit.',
    fixes: [
      { art: 'firstrun', title: 'Setup before value', text: 'Fourteen fields before anything happens. We move people to the first result, then ask for details when they need them.' },
      { art: 'empty', title: 'An empty first screen', text: 'New accounts see a wall of zeros. We design the empty state that explains what appears here and gives one first action.' },
      { art: 'nudge', title: 'Silence after signup', text: 'People who stall never hear from you. We design the in-app and email nudges that bring them back to the next step.' },
    ],
    casesTitle: 'Recent onboarding work',
    cases: [
      { work: 'firecut', line: 'Twelve AI tools turned into one clear first flow' },
      { work: 'ritual', line: 'Thirteen steps that end with a signed commitment' },
      { work: 'shredder', line: 'A 14 step dating onboarding, explored and shipped' },
    ],
    stepsTitle: 'From call to handoff in 2 to 6 weeks',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'We agree on what the first win is for your users.' },
      { when: 'Week 1', title: 'Audit and funnel', text: 'Every step from signup to first win, ranked by drop.' },
      { when: 'Week 2 to 3', title: 'New first run', text: 'Screens, empty states and nudges to react to.' },
      { when: 'Week 4 to 6', title: 'Full design and handoff', text: 'States, events to track and files to build from.' },
    ],
    price: { title: 'Onboarding redesigns from $5,000', text: 'A fixed project. Ongoing design is $6,900 a month, pause any time.' },
    faqTitle: 'SaaS onboarding design, answered',
    faq: [
      { q: 'How much does an onboarding redesign cost?', a: 'Most onboarding redesigns are a fixed project from $5,000, done in 2 to 6 weeks. Ongoing design is $6,900 a month.' },
      { q: 'Do you look at our analytics?', a: 'Yes, if you have them. If you do not, we design the onboarding with the events to track, so you can measure every step after launch.' },
      { q: 'Do you design the emails too?', a: 'We design the moments that bring people back, in app and by email, and write the copy for them.' },
      { q: 'Can you start with an audit?', a: 'Yes. Send your product and within 2 days you get a video walkthrough and a written list of fixes, ordered by impact.' },
    ],
    note: { slug: 'saas-onboarding-first-win', title: 'Designing onboarding that gets users to the first win', text: 'The method we use, step by step.' },
    endTitle: "Let's look at your onboarding together.",
  },
  {
    slug: 'saas-landing-page-design',
    seoTitle: 'SaaS Landing Page Design Agency | Fackt',
    seoDescription: 'SaaS landing page design and build in Framer or Webflow: a clear promise above the fold, real proof and one next step. Projects from $5,000.',
    crumb: [{ label: 'Services', href: '/services' }, { label: 'Web design and development', href: '/services/web-design-development' }],
    current: 'SaaS landing pages',
    h1: 'SaaS landing page design',
    lede: 'For SaaS teams whose site gets visits but not signups. We design and build a page that says what you do in one line and gives one next step.',
    hero: { work: 'earntask', caption: 'EarnTask, landing page' },
    logos: ['Algrow', 'Polar', 'FalconFirst', 'DevSignal', 'Engain'],
    results: [
      { value: '2 weeks', label: 'EarnTask landing page, from brief to design', source: 'EarnTask case study', href: '/work/earntask' },
      { value: '12', label: 'Polar ad variants built on one grid to test message angles', source: 'Polar case study', href: '/work/polar' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    fixTitle: 'Three reasons visitors leave',
    fixLede: 'Most landing pages lose people in the first screen.',
    fixes: [
      { art: 'fold', title: 'A headline that says nothing', text: 'Revolutionize your workflow could be anyone. We write one line that says who it is for and what changes, next to the product.' },
      { art: 'proof', title: 'A button with nothing behind it', text: 'People do not click a button they have no reason to trust. We put logos, numbers and a real quote right next to it.' },
      { art: 'cta', title: 'A vague next step', text: 'Learn more is not a step. We make the button say what happens and how long it takes.' },
    ],
    casesTitle: 'Recent landing pages',
    cases: [
      { work: 'earntask', line: 'Paid social tasks made approachable, designed in two weeks' },
      { work: 'tradox', line: 'Custom 3D hardware and Lottie for a trading VPS' },
      { work: 'story-story', line: 'A color coded page for an influencer platform' },
    ],
    stepsTitle: 'From call to live page in 2 to 6 weeks',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'Who the page is for and what they should do.' },
      { when: 'Week 1', title: 'Message and wireframe', text: 'The headline, the proof and the order of sections.', icon: 'structure' },
      { when: 'Week 2 to 3', title: 'Design', text: 'The full page on desktop and mobile.' },
      { when: 'Week 4 to 6', title: 'Build and launch', text: 'In Framer or Webflow, ready for your team to edit.', icon: 'launch' },
    ],
    price: { title: 'Landing pages from $5,000', text: 'Design and build as a fixed project. Ongoing design is $6,900 a month, pause any time.' },
    faqTitle: 'SaaS landing page design, answered',
    faq: [
      { q: 'How much does a SaaS landing page cost?', a: 'Landing pages are a fixed project from $5,000 for design and build, done in 2 to 6 weeks. Ongoing design is $6,900 a month.' },
      { q: 'Do you build in Framer or Webflow?', a: 'Both. We pick the one that fits your team, then hand over a site your marketing team can edit without a developer.' },
      { q: 'Do you write the copy?', a: 'Yes. The headline and the structure come first, so we write them with you before any design.' },
      { q: 'Can you start with an audit?', a: 'Yes. Send your site and within 2 days you get a video walkthrough and a written list of fixes, ordered by impact.' },
    ],
    note: { slug: 'saas-landing-page-above-the-fold', title: 'What a SaaS landing page needs above the fold', text: 'Check your own page in five minutes.' },
    endTitle: "Let's look at your landing page together.",
  },
  {
    slug: 'framer-agency-for-saas',
    seoTitle: 'Framer Agency for SaaS Websites | Fackt',
    seoDescription: 'Framer website design and build for SaaS teams: a fast site your marketing team can update without a developer. Projects from $5,000.',
    crumb: [{ label: 'Services', href: '/services' }, { label: 'Web design and development', href: '/services/web-design-development' }],
    current: 'Framer for SaaS',
    h1: 'Framer agency for SaaS',
    lede: 'For SaaS teams who wait on a developer to change a headline. We design and build your site in Framer, fast, and hand it over ready to edit.',
    hero: { work: 'nation', caption: 'Nation, identity and landing page' },
    logos: ['Algrow', 'Polar', 'FalconFirst', 'DevSignal', 'Engain'],
    results: [
      { value: '2 weeks', label: 'EarnTask landing page, from brief to design', source: 'EarnTask case study', href: '/work/earntask' },
      { value: '3D', label: 'custom hardware illustrations and Lottie animations on the Tradox site', source: 'Tradox case study', href: '/work/tradox' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    fixTitle: 'Why SaaS teams move to Framer',
    fixLede: 'The site should move as fast as the product does.',
    fixes: [
      { art: 'cms', title: 'Every change waits on a developer', text: 'A pricing tweak sits in a ticket for a week. In Framer, marketing publishes it in minutes, with the CMS set up for them.' },
      { art: 'speed', title: 'A slow, heavy site', text: 'We keep pages light: compressed media, few fonts and no plugins you do not need, so the site loads fast on a phone.' },
      { art: 'fold', title: 'A template that looks like everyone', text: 'We design your site from your product and brand, then build it in Framer, not the other way round.' },
    ],
    casesTitle: 'Recent websites',
    cases: [
      { work: 'nation', line: 'A screenprint identity and landing page for an AI store builder' },
      { work: 'earntask', line: 'Paid social tasks made approachable, designed in two weeks' },
      { work: 'viewmax', line: 'A video editor and the website that sells it' },
    ],
    stepsTitle: 'From call to live site in 2 to 6 weeks',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'What the site must say and what your team will edit.' },
      { when: 'Week 1', title: 'Structure and message', text: 'Pages, sections and the headline, before visuals.', icon: 'structure' },
      { when: 'Week 2 to 3', title: 'Design', text: 'Desktop and mobile, in Figma first.' },
      { when: 'Week 4 to 6', title: 'Framer build and handoff', text: 'CMS, SEO settings and a short video on editing.', icon: 'cms' },
    ],
    price: { title: 'Framer sites from $5,000', text: 'Design and build as a fixed project. Ongoing design is $6,900 a month, pause any time.' },
    faqTitle: 'Framer for SaaS, answered',
    faq: [
      { q: 'Framer or Webflow for a SaaS website?', a: 'Framer is faster to design and edit for most marketing sites. Webflow is stronger for large, complex CMS setups. We build in both and pick with you.' },
      { q: 'How much does a Framer website cost?', a: 'Framer sites are a fixed project from $5,000 for design and build, done in 2 to 6 weeks. Ongoing design is $6,900 a month.' },
      { q: 'Can our team edit the site after launch?', a: 'Yes. We set up the CMS and components for your team and record a short walkthrough on how to edit.' },
      { q: 'Can you move our existing site to Framer?', a: 'Yes. We redesign or rebuild it in Framer and keep your URLs, so you do not lose search traffic.' },
    ],
    note: { slug: 'framer-vs-webflow-saas-landing-page', title: 'Framer vs Webflow for a SaaS website: how to pick', text: 'The honest comparison, from building in both.' },
    endTitle: "Let's talk about your website.",
  },
  {
    slug: 'design-agency-san-francisco',
    seoTitle: 'SaaS Design Agency for San Francisco Startups | Fackt',
    seoDescription: 'Product and web design for San Francisco SaaS startups. Calls in your morning, design while you sleep, USD invoices from our US company. From $5,000.',
    crumb: [{ label: 'Services', href: '/services' }],
    current: 'San Francisco',
    h1: 'SaaS design for San Francisco startups',
    lede: 'For SF founders who need to ship design faster than a local hire allows. We talk in your morning, design while you sleep, and bill in USD through our US company.',
    hero: { work: 'floxy', caption: 'Floxy, proxy dashboard' },
    logos: ['Algrow', 'FireCut', 'Communi', 'Viewmax', 'ClickUp'],
    results: [
      { value: '68 / 100', label: 'FireCut cancellation reasons traced to design, then redesigned', source: 'FireCut case study', href: '/work/firecut' },
      { value: '12 → 1', label: 'flat grid of tools turned into one clear starting point', source: 'FireCut case study', href: '/work/firecut' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    local: {
      title: 'Nine hours apart, on purpose',
      sub: 'We are a studio in Slovakia, 9 hours ahead of San Francisco. Your morning is our late afternoon, so we talk then and design while you sleep.',
      city: 'San Francisco', home: 'Slovakia', diff: 9,
      bands: [
        { from: 0, to: 8, label: 'We design while you sleep', kind: 'work' },
        { from: 8, to: 10, label: 'Call window', kind: 'call' },
      ],
      reasonsTitle: 'Why SF founders work with us',
      reasonsSub: 'The parts of working with a studio abroad that founders ask about first.',
      reasons: [
        { icon: 'call', title: 'Calls in your morning', text: 'Reviews happen between 8 and 10 AM your time. You leave feedback by evening and wake up to the next version.' },
        { icon: 'handoff', title: 'USD invoices from a US company', text: 'You contract and pay Fackt Labs LLC, our US company. No foreign invoices or currency surprises.' },
        { icon: 'apps', title: 'One team for product, web and motion', text: 'Dashboard, onboarding, marketing site and launch video from the same people, in one style.' },
      ],
    },
    compare: {
      title: 'What a few weeks of design changes', sub: "Drag to compare FireCut's tool grid with the redesign.",
      before: '/uploads/firecut-tools-before.webp', after: '/uploads/firecut-tools-after.webp',
      beforeAlt: 'FireCut before: twelve AI tools in one flat grid', afterAlt: 'FireCut after the redesign: saved tools first, then a workflow',
      beforeCap: '12 tools in one flat grid, nothing stands out.', afterCap: 'Saved tools first, then a workflow.',
    },
    casesTitle: 'Recent SaaS work',
    cases: [
      { work: 'communi', line: 'A creator command center, desktop to mobile' },
      { work: 'floxy', line: 'A proxy dashboard that stays readable at scale' },
      { work: 'firecut', line: 'Twelve AI tools turned into one clear flow' },
    ],
    stepsTitle: 'From call to handoff in 2 to 6 weeks',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'In your morning. We find the screen that matters most.' },
      { when: 'Week 1', title: 'Audit and flows', text: 'What to fix first, ranked by impact on your users.' },
      { when: 'Week 2 to 3', title: 'First screens', text: 'New versions land overnight, ready for your morning.' },
      { when: 'Week 4 to 6', title: 'Full design and handoff', text: 'States, specs and Figma files your engineers build from.' },
    ],
    price: { title: 'Projects from $5,000', text: 'A fixed project, invoiced in USD. Ongoing design is $6,900 a month, pause any time.' },
    faqTitle: 'Working with us from San Francisco, answered',
    faq: [
      { q: 'Do you have an office in San Francisco?', a: 'No. We are a design studio in Slovakia that works with US teams remotely. Contracts and invoices come from Fackt Labs LLC, our US company.' },
      { q: 'How do the time zones work?', a: 'We are 9 hours ahead of San Francisco. Calls happen in your morning, which is our late afternoon, and we design during your night, so new screens are waiting when you start your day.' },
      { q: 'How much does it cost?', a: 'Most projects are a fixed price from $5,000, done in 2 to 6 weeks. Ongoing design is $6,900 a month and you can pause any time.' },
      { q: 'Why not hire a designer in San Francisco?', a: 'Hiring takes months and a single designer covers one skill. With us you start this week and get product, web and motion design from one team. Many founders start with us and hire later.' },
      { q: 'Can you start with an audit?', a: 'Yes. Send your product and within 2 days you get a video walkthrough and a written list of fixes, ordered by impact.' },
    ],
    note: { slug: 'design-agency-vs-freelancer-vs-in-house', title: 'Design agency vs freelancer vs in-house', text: 'How to choose, and what each one costs you in time.' },
    endTitle: "Let's talk in your morning.",
  },
  {
    slug: 'design-for-seed-stage-startups',
    seoTitle: 'Design for Seed-Stage Startups: The Launch Path | Fackt',
    seoDescription: 'At seed, design is about order, not polish: story, launch video, landing page, onboarding, product, paywall. The path we run with founders, from $5,000.',
    crumb: [{ label: 'Services', href: '/services' }],
    current: 'Seed-stage startups',
    h1: 'Design for seed-stage startups',
    lede: 'At seed, design is not about polished screens. It is about doing things in the right order: the story first, then the launch video, the landing page, onboarding, and only then the product polish.',
    hero: { work: 'glowtify', caption: 'Glowtify, AI marketing platform, now seed funded', image: '/uploads/glowtify-preview.webp' },
    logos: ['Algrow', 'FireCut', 'Communi', 'Viewmax', 'ClickUp'],
    results: [
      { value: '7 weeks', label: 'from discovery to developer handoff for Communi', source: 'Communi case study', href: '/work/communi' },
      { value: '68 / 100', label: 'FireCut cancellation reasons traced to design, then redesigned', source: 'FireCut case study', href: '/work/firecut' },
      { value: '4.96/5', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
    ],
    path: {
      title: 'The seed-stage launch path',
      sub: 'Six moves, in this order. Each one makes the next one cheaper. Most founders do them backwards.',
      stages: [
        { weeks: 'Week 0 to 1', icon: 'refine', title: 'Story', why: 'If you cannot say who it is for in one sentence, no screen will fix it.', decide: 'Who the first users are, the one promise, and what proves it.', ship: 'The headline, the pitch narrative and the words every later page reuses.' },
        { weeks: 'Week 1 to 3', icon: 'play', title: 'Launch video', why: 'People believe what they see working. A 60 to 90 second video sells before anyone signs up.', decide: 'The three flows that show the product best, and the order to show them in.', ship: 'A product video with animated flows, cut for your site, X and LinkedIn.', proof: { label: 'CaseWize', href: '#spotlight' } },
        { weeks: 'Week 2 to 4', icon: 'landing', title: 'Landing page', why: 'One promise, one proof, one action. Everything else waits until people ask for it.', decide: 'Waitlist, demo or self serve signup, and the proof above the fold.', ship: 'A Framer or Webflow page your team can edit, with the video built in.', proof: { label: 'Viewmax', href: '/work/viewmax' } },
        { weeks: 'Week 4 to 6', icon: 'proto', title: 'Onboarding', why: 'Signups are not users. The first minutes decide who stays.', decide: 'What the first win is, and the shortest way to reach it.', ship: 'First run, empty states, nudges and the events to track every step.', proof: { label: 'Ritual', href: '/work/ritual' } },
        { weeks: 'Week 6 to 10', icon: 'apps', title: 'Core product', why: 'Now polish pays off, because you know what people actually use.', decide: 'The one screen people come back for, and what it must answer.', ship: 'Core screens, states and a small design system your engineers build from.', proof: { label: 'Floxy', href: '/work/floxy' } },
        { weeks: 'Week 8 to 12', icon: 'seo', title: 'Paywall and growth', why: 'Pricing is a guess until you test it. Make testing cheap from day one.', decide: 'Free versus paid, the paywall moment and the loops that bring people back.', ship: 'Paywall layouts you can switch remotely, share moments and recap emails.', proof: { label: 'Dozy', href: '/work/dozy' } },
      ],
    },
    contrast: {
      title: 'The order matters more than the pixels',
      sub: 'What we see most often at seed, and what we do instead.',
      left: 'What most seed teams do', right: 'What we do instead',
      rows: [
        { them: 'Polish the dashboard before anyone uses it', us: 'Write the story first, then design what proves it' },
        { them: 'Launch with a feature list', us: 'Launch with a 60 second video of the product working' },
        { them: 'Ask for 14 fields before anything happens', us: 'Get people to their first win, then ask' },
        { them: 'Guess one price and hard code it', us: 'Ship paywalls you can switch without an update' },
        { them: 'Add analytics after users start leaving', us: 'Track every onboarding step from the first build' },
      ],
    },
    skip: {
      title: 'What to skip at seed',
      sub: 'Things that feel productive and are not, yet.',
      items: [
        { icon: 'book', title: 'A 60 page brand book', text: 'A logo, two colors, one typeface and a voice is enough until people know your name.' },
        { icon: 'system', title: 'A full design system', text: 'Build the 12 components you use. The rest can wait until a second designer joins.' },
        { icon: 'redesign', title: 'A 20 page website', text: 'One landing page that converts beats a site map nobody reads. Add pages when people ask.' },
      ],
    },
    spotlight: {
      name: 'CaseWize', meta: 'AI litigation intelligence, San Francisco',
      title: 'A launch video that shows the product working',
      text: 'CaseWize helps plaintiff-side law firms make sense of their cases. We made a launch video with three animated product flows, so firms see what it does before they ever log in.',
    },
    casesTitle: 'Early-stage products we designed',
    cases: [
      { work: 'glowtify', line: 'An AI marketing platform, before its seed round' },
      { work: 'communi', line: 'A creator platform, from discovery to handoff in 7 weeks' },
      { work: 'shredder', line: 'A ski and snowboard app, from a logo sketch to a relaunch' },
    ],
    stepsTitle: 'From call to launch',
    steps: [
      { when: 'Week 0', title: 'A 30 minute call', text: 'We find where you are on the path.' },
      { when: 'Week 1', title: 'Story and plan', text: 'The order of moves for your product.' },
      { when: 'Week 2 to 6', title: 'First moves shipped', text: 'Video, landing page and onboarding.' },
      { when: 'Week 6 and on', title: 'Product and growth', text: 'Core screens, paywall and loops.' },
    ],
    price: { title: 'Launch projects from $5,000', text: 'Start with one move, or run the whole path on a retainer at $6,900 a month, pause any time.' },
    faqTitle: 'Design at seed stage, answered',
    faq: [
      { q: 'We are pre-launch. Where do we start?', a: 'With the story and the launch video. They are the cheapest to change and they shape everything after them: the landing page, the onboarding and the pitch.' },
      { q: 'Do we need a designer before product market fit?', a: 'You need design decisions, not a full time designer. A studio covers the whole path in a few months, and many founders hire in house later.' },
      { q: 'How much does it cost?', a: 'Single moves are fixed projects from $5,000. The whole path runs best on a retainer at $6,900 a month, which you can pause any time.' },
      { q: 'Can you work with our engineers?', a: 'Yes. We hand off Figma files, states and specs your team builds from, and stay on for questions while they build.' },
      { q: 'Can you start with an audit?', a: 'Yes. Send your product or prototype and within 2 days you get a video walkthrough and a written list of fixes, ordered by impact.' },
    ],
    note: { slug: 'design-agency-vs-freelancer-vs-in-house', title: 'Design agency vs freelancer vs in-house', text: 'How to choose at seed, and what each one costs you in time.' },
    endTitle: 'Where are you on the path?',
  },
];
