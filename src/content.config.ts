import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import { glob } from "astro/loaders"
import { AI_LEVELS, AI_SHARES } from "./lib/ai"

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/work" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
})

const articles = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    lang: z.enum(["en", "nl"]).default("en"),
    translationKey: z.string().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    // One short line shown on the card, e.g. where the project is in use.
    highlight: z.string().optional(),
    ai: z.object({
      level: z.enum(AI_LEVELS),
      usage: z.object({
        architecture: z.enum(AI_SHARES).optional(),
        code: z.enum(AI_SHARES).optional(),
        tests: z.enum(AI_SHARES).optional(),
        docs: z.enum(AI_SHARES).optional(),
      }).optional(),
      note: z.string().optional(),
    }).optional(),
    lang: z.enum(["en", "nl"]).default("en"),
    translationKey: z.string().optional(),
  }),
})

const photography = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/photography" }),
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
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(["en", "nl"]).default("en"),
    translationKey: z.string().optional(),
  }),
})

export const collections = { work, articles, projects, photography, legal }
