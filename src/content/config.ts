import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
    description: z.string().default(''),
    isPublish: z.boolean(),
    isDraft: z.boolean().default(false),
    minutesRead: z.string().default(''),
  }),
});

export const collections = { posts: postsCollection };
