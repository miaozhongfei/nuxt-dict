import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const commonSchema = z.object({})

export default defineContentConfig({
  collections: {
    content_zh: defineCollection({
      type: 'page',
      source: {
        include: 'zh/**',
        prefix: '',
      },
      schema: commonSchema,
      search: true,
    }),
    content_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/**',
        prefix: '',
      },
      schema: commonSchema,
      search: true,
    }),
    content_fa: defineCollection({
      type: 'page',
      source: {
        include: 'fa/**',
        prefix: '',
      },
      schema: commonSchema,
      search: true,
    }),
  },
})
