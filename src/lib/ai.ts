// AI-usage vocabulary for projects. Pure module — safe to import from the content
// config, server (.astro) and client (.tsx) islands. Labels live in src/lib/i18n.ts (ui.ai.*).

/** Overall level, ordered from no AI to all AI. The index drives the badge meter. */
export const AI_LEVELS = ["human", "assisted", "directed", "vibecoded"] as const
export type AiLevel = (typeof AI_LEVELS)[number]

/** Parts of a project that can each get their own share. */
export const AI_CATEGORIES = ["architecture", "code", "tests", "docs"] as const
export type AiCategory = (typeof AI_CATEGORIES)[number]

/** Who did the work in one category, ordered from no AI to all AI. */
export const AI_SHARES = ["human", "assisted", "ai"] as const
export type AiShare = (typeof AI_SHARES)[number]

export type AiUsage = {
  level: AiLevel
  usage?: Partial<Record<AiCategory, AiShare>>
  note?: string
}
