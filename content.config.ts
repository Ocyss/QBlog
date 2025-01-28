import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    article: defineCollection({
      type: 'page',
      source: 'article/**',
      schema: z.object({
        published: z.boolean().default(false),
        createdAt: z.string(),
        updatedAt: z.string().optional(),
        image: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    singles: defineCollection({
      type: 'page',
      source: 'singles/**',
    }),
  },
})
