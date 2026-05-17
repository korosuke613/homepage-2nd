import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
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
