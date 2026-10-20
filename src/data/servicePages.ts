// Long-form content for each service page at /services/<slug>.
// The short card text on the homepage lives in site.ts → services.

export interface ServicePage {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  lede: string;
  tint: 'blue' | 'peach' | 'mint' | 'lilac';
  // Case studies to show, by file name in src/content/work (first two also appear in the hero).
  // Leave empty to hide the work section; the hero then shows an animated glass composition.
  work: string[];
  deliverables: { title: string; text: string }[];
  process: { title: string; text: string }[];
  tools: string[];
  // Index into site.ts → reviews.
  review: number;
  faq: { q: string; a: string }[];
}

const pricingAnswer =
  'Two ways: a monthly retainer at $6,900 with unlimited requests, one active at a time, which you can pause or cancel any time, or a one-time project from $5,000 with a fixed scope and milestones. The strategy call is free.';

export const servicePages: ServicePage[] = [
  {
    slug: 'product-design',
    seoTitle: 'SaaS Product Design Agency | UI/UX for dashboards and apps | Fackt',
    seoDescription:
      'Product design for SaaS and tech companies: UX audits, user flows, high fidelity UI, design systems, prototypes and mobile apps, handed off ready for development.',
    headline: 'SaaS product design that users understand and pay for.',
    lede: 'We design SaaS platforms, dashboards and mobile apps, from the first user flow to dev-ready UI, so your product is easier to adopt and easier to sell.',
    tint: 'blue',
    work: ['communi', 'floxy', 'glowtify', 'promote-app', 'viewmax', 'earntask'],
    deliverables: [
      { title: 'UX audit', text: 'A clear review of where users get stuck, with prioritised fixes.' },
      { title: 'User flows and structure', text: 'Onboarding, core workflows and navigation mapped before any pixels.' },
      { title: 'High fidelity UI', text: 'Every screen and every state: empty, loading, error and success.' },
      { title: 'Design systems', text: 'Components, tokens and documentation your team can build on.' },
      { title: 'Interactive prototypes', text: 'Clickable flows to test with users, investors or your team.' },
      { title: 'Mobile and desktop apps', text: 'Native feeling iOS, Android and desktop interfaces.' },
    ],
    process: [
      { title: 'Strategy call', text: 'We map your users, goals and the screens that matter most.' },
      { title: 'Audit and flows', text: 'We review what exists and agree on structure and flows.' },
      { title: 'Design and prototype', text: 'High fidelity UI, reviewed with you in short cycles.' },
      { title: 'Handoff and support', text: 'Dev-ready files, specs and support while your team builds.' },
    ],
    tools: ['Figma', 'Rive', 'Framer'],
    review: 0,
    faq: [
      { q: 'Can you work inside our existing Figma files and design system?', a: 'Yes. We can extend the system you already have, or build one with you if it does not exist yet.' },
      { q: 'How long does a product design project take?', a: 'Most projects take 2 to 6 weeks. A landing page or a focused redesign is usually 1 to 2 weeks, a full product or MVP 3 to 6. On a retainer, requests have a 24 hour turnaround.' },
      { q: 'Do you build the product too?', a: 'For products we hand off dev-ready designs to your engineers and stay available while they build. Websites we can design and build ourselves.' },
      { q: 'How does pricing work?', a: pricingAnswer },
    ],
  },
  {
    slug: 'web-design-development',
    seoTitle: 'SaaS Website Design and Development | Framer and Webflow | Fackt',
    seoDescription:
      'Website design and development for SaaS and tech: landing pages, marketing sites and redesigns that turn visitors into signups, built in Framer and Webflow.',
    headline: 'Websites for SaaS and tech that turn visitors into signups.',
    lede: 'From pre-launch landing pages to complete marketing site redesigns, we design and build sites that explain your product fast and make the next step obvious.',
    tint: 'peach',
    work: ['viewmax', 'story-story', 'tradox', 'earntask'],
    deliverables: [
      { title: 'Landing pages', text: 'Focused pages for launches, campaigns and paid traffic.' },
      { title: 'Marketing site redesigns', text: 'Structure, messaging hierarchy and visuals rebuilt around your product.' },
      { title: 'Framer and Webflow builds', text: 'Fast, responsive sites your team can edit without a developer.' },
      { title: 'CMS setup', text: 'Blog, changelog, case studies and careers you can update yourself.' },
      { title: 'Interactions and animation', text: 'Motion that guides attention instead of distracting from it.' },
      { title: 'SEO-ready structure', text: 'Clean headings, metadata and performance from day one.' },
    ],
    process: [
      { title: 'Strategy call', text: 'Goals, audience and what the site needs to convert.' },
      { title: 'Structure', text: 'Sitemap and page wireframes agreed before visual design.' },
      { title: 'Design', text: 'High fidelity pages for desktop, tablet and mobile.' },
      { title: 'Build and launch', text: 'Built in Framer or Webflow, tested and launched with you.' },
    ],
    tools: ['Figma', 'Framer', 'Webflow', 'Rive'],
    review: 0,
    faq: [
      { q: 'Framer or Webflow?', a: 'Both work well. We recommend one after the strategy call based on your team, content needs and how often the site changes.' },
      { q: 'Can we edit the site ourselves after launch?', a: 'Yes. We set up the CMS and components so your team can update pages and publish without us.' },
      { q: 'Can you redesign only part of our site?', a: 'Yes. Many projects start with the homepage or a single landing page and grow from there.' },
      { q: 'How does pricing work?', a: pricingAnswer },
    ],
  },
  {
    slug: 'motion-design',
    seoTitle: 'Motion Design for SaaS | Product animation and Rive | Fackt',
    seoDescription:
      'Motion design for SaaS and tech products: product animations, interaction design, interactive Rive assets, web animation and 3D.',
    headline: 'Motion that explains your product and makes it feel alive.',
    lede: 'We use animation and interaction to guide attention, communicate state, and make every action in your product and on your site feel satisfying.',
    tint: 'lilac',
    work: ['tradox'],
    deliverables: [
      { title: 'Product animations', text: 'Short loops that show what your product does at a glance.' },
      { title: 'Interaction design', text: 'Micro-interactions and transitions specified for your developers.' },
      { title: 'Interactive Rive assets', text: 'Lightweight, state-driven animations that run in product and on the web.' },
      { title: 'Web animation', text: 'Scroll and hover moments for landing pages and marketing sites.' },
      { title: '3D design', text: 'Objects and scenes for hero sections, launches and social.' },
      { title: 'Motion guidelines', text: 'Timing, easing and rules so motion stays consistent as you grow.' },
    ],
    process: [
      { title: 'Strategy call', text: 'Where motion helps and where it should stay out of the way.' },
      { title: 'Storyboard', text: 'Key frames and timing agreed before production.' },
      { title: 'Animate', text: 'Production with review rounds along the way.' },
      { title: 'Deliver', text: 'Files ready for your product, site or social channels.' },
    ],
    tools: ['Rive', 'Figma', 'Framer'],
    review: 1,
    faq: [
      { q: 'What is Rive and why use it?', a: 'Rive makes interactive, state-based animations that are much lighter than video and react to the user, so they work inside apps and websites.' },
      { q: 'Can you animate an interface we already designed?', a: 'Yes. Send us the Figma file and we animate the screens and interactions you want to show.' },
      { q: 'How fast is the turnaround?', a: 'On a retainer, requests have a 24 hour turnaround. Larger pieces are planned as a project with milestones.' },
      { q: 'How does pricing work?', a: pricingAnswer },
    ],
  },
  {
    slug: 'visual-branding',
    seoTitle: 'Brand Identity Design for Tech Startups | Fackt',
    seoDescription:
      'Visual branding for SaaS, AI and tech startups: logo and wordmark, visual identity, brand systems and guidelines that carry into your product and website.',
    headline: 'Brand identities for tech products and startups.',
    lede: 'We build the visual language, voice and feeling that makes you immediately recognisable, and make sure it works inside your product, not just on a logo sheet.',
    tint: 'mint',
    work: ['promote', 'floxy-brand'],
    deliverables: [
      { title: 'Logo and wordmark', text: 'A mark that works from app icon to billboard.' },
      { title: 'Visual identity', text: 'Color, typography, imagery and graphic elements.' },
      { title: 'Brand system', text: 'Rules and components that scale across teams and channels.' },
      { title: 'Brand guidelines', text: 'A clear reference your team and partners can follow.' },
      { title: 'Product and web application', text: 'The brand applied to your UI and website, not only to slides.' },
      { title: 'Launch assets', text: 'Social, pitch deck and announcement visuals.' },
    ],
    process: [
      { title: 'Strategy call', text: 'Positioning, audience and where the brand needs to show up.' },
      { title: 'Directions', text: 'Distinct creative directions to choose from.' },
      { title: 'Refine', text: 'One direction developed into a full identity.' },
      { title: 'System and handoff', text: 'Guidelines, source files and assets ready to use.' },
    ],
    tools: ['Figma', 'Rive', 'Framer'],
    review: 2,
    faq: [
      { q: 'Can you refresh our brand instead of starting over?', a: 'Yes. We often evolve an existing identity so you keep recognition while fixing what does not work.' },
      { q: 'Will the brand work in our product?', a: 'That is the point. We design the identity with your UI and website in mind and can apply it to both.' },
      { q: 'What do we receive at the end?', a: 'Logo files, color and type specs, brand guidelines and the source files.' },
      { q: 'How does pricing work?', a: pricingAnswer },
    ],
  },
];
