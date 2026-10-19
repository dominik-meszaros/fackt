// Hero stage: categories (the chips) and the slides inside each one.
// Every slide is a project shown full bleed (2:1 image). The stage loops through all slides,
// a few projects per category. Images live in public/uploads.
export const stageCategories = [
  { label: 'SaaS dashboard', query: 'a SaaS dashboard', slides: [
    { slug: 'communi', image: '/uploads/stage-saas.webp' },
    { slug: 'floxy', image: '/uploads/stage-floxy.webp' },
    { slug: 'promote-app', image: '/uploads/stage-promote-app.webp' },
    { slug: 'glowtify', image: '/uploads/stage-glowtify.webp' },
  ] },
  { label: 'Mobile app', query: 'a mobile app', slides: [
    { slug: 'zums', image: '/uploads/stage-mobile.webp' },
    { slug: 'communi-mobile', image: '/uploads/stage-communi-mobile.webp' },
    { slug: 'kindscore', image: '/uploads/stage-kindscore.webp' },
    { slug: 'deaflingo', image: '/uploads/stage-deaflingo.webp' },
  ] },
  { label: 'Websites', query: 'a website', slides: [
    { slug: 'viewmax', image: '/uploads/stage-web.webp' },
    { slug: 'story-story', image: '/uploads/stage-story.webp' },
    { slug: 'earntask', image: '/uploads/stage-earntask.webp' },
    { slug: 'tradox', image: '/uploads/stage-tradox.webp' },
  ] },
  { label: 'Branding', query: 'a brand identity', slides: [
    { slug: 'promote', image: '/uploads/stage-brand.webp' },
    { slug: 'floxy-brand', image: '/uploads/stage-floxy-brand.webp' },
    { slug: 'promote', image: '/uploads/stage-promote-merch.webp' },
  ] },
];
