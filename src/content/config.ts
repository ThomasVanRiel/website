import { defineCollection, z } from "astro:content"

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
})

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    lang: z.enum(["en", "nl"]).default("en"),
    translationKey: z.string().optional(),
  }),
})

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    lang: z.enum(["en", "nl"]).default("en"),
    translationKey: z.string().optional(),
  }),
})

const photography = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    license: z.string().default("CC BY 4.0"),
    photos: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
      })
    ),
  }),
})

const legal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(["en", "nl"]).default("en"),
    translationKey: z.string().optional(),
  }),
})

export const collections = { work, articles, projects, photography, legal }
