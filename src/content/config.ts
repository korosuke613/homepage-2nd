import { defineCollection, z } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    order: z.number().optional(),
    imgSrc: z.string().optional(),
    imgAlt: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  posts: postCollection,
};
