import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every collection here is editable in the CMS at /admin (see public/admin/config.yml).

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    name: z.string(),
    service: z.string(),
    category: z.enum(['product', 'web', 'mobile', 'branding', 'motion']),
    summary: z.string(),
    // Words people might type in the search bar to find this project.
    keywords: z.array(z.string()).default([]),
    image: z.string(),
    // Optional preview image for cards and the case study hero (full bleed). Falls back to the framed screen in `image`.
    preview: z.string().optional(),
    imageKind: z.enum(['desktop', 'phone']).default('desktop'),
    tint: z.enum(['blue', 'peach', 'mint', 'lilac']).default('blue'),
    year: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    // Hero stage: projects with `stage` get a chip under the hero and show in the stage.
    stage: z.boolean().default(false),
    stageLabel: z.string().optional(),
    stageQuery: z.string().optional(),
    stageOrder: z.number().default(99),
    // Full-bleed image for the hero stage (2:1). Falls back to the framed screen.
    stageImage: z.string().optional(),
    // Case study page (all optional: sections only show when filled in).
    platform: z.string().optional(),
    scope: z.string().optional(),
    challengeTitle: z.string().optional(),
    challenge: z.string().optional(),
    approachTitle: z.string().optional(),
    approach: z.string().optional(),
    resultsTitle: z.string().optional(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).optional().default([]),
    gallery: z.array(z.object({ image: z.string(), caption: z.string().optional().default(''), kind: z.enum(['desktop', 'phone', 'board']).default('desktop') })).optional().default([]),
    quote: z.string().optional(),
    quoteName: z.string().optional(),
    quoteRole: z.string().optional(),
    quotePhoto: z.string().optional(),
  }),
});

const quotes = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/quotes' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    quote: z.string(),
    photo: z.string().optional().default(''),
    order: z.number().default(99),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/videos' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    duration: z.string().optional().default(''),
    thumbnail: z.string(),
    video: z.string().optional().default(''),
    order: z.number().default(99),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/reviews' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    highlight: z.string(),
    text: z.string(),
    order: z.number().default(99),
  }),
});


// Blog posts ("Fackt notes"). Drafts are built at /blog/<slug> for previewing but are not listed, linked or indexed.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    cover: z.string(),
    date: z.coerce.date(),
    readTime: z.string().optional(),
    draft: z.boolean().default(true),
    // Case study this note links to (a work slug), shown inside the post and under that case study.
    related: z.string().optional(),
  }),
});

export const collections = { work, quotes, videos, reviews, blog };
