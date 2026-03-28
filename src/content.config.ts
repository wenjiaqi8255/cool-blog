import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.date(),
    tags: z.array(z.enum(['ML', 'Systems', 'Tutorial', 'Project', 'Notes'])),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { articles };