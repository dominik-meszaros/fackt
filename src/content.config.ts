import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every collection here is editable in the CMS at /admin (see public/admin/config.yml).

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    name: z.string(),
    service: z.string(),
    category: z.enum(['product', 'web', 'mobile', 'branding', 'motion']),
    summary: z.string(),
    // Words people might type in the search bar to find this project.
    keywords: z.array(z.string()).default([]),
    image: z.string(),
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

export const collections = { work, quotes, videos, reviews };
