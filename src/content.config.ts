import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['pt', 'en']),
    tags: z.array(z.string()),
    readingTime: z.string(),
    featured: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    lang: z.enum(['pt', 'en']),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['pt', 'en']),
    role: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    techs: z.array(z.string()),
    metrics: z.array(z.string()).optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
  }),
});

export const collections = { articles, notes, projects };
