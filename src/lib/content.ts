// Server-only helpers (imports astro:content). Do NOT import from client islands.
import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content"
import { DEFAULT_LANG, type Lang } from "@lib/i18n"
import { PROJECT_ORDER } from "@consts"

type Localizable = { lang?: Lang; translationKey?: string; draft?: boolean }

export type LocalizedEntry<C extends CollectionKey> = {
  entry: CollectionEntry<C>
  /** Stable, locale-independent slug used for the URL param and cross-locale lookups. */
  baseSlug: string
  lang: Lang
  /** True when no entry exists in `lang` and we fell back to the default locale. */
  isFallback: boolean
}

function dataOf<C extends CollectionKey>(entry: CollectionEntry<C>): Localizable {
  return entry.data as Localizable
}

/**
 * Returns one entry per base key for the requested language, falling back to the
 * default-locale entry when no localized version exists. `baseSlug` is shared across
 * locales (the default-locale slug, or an explicit `translationKey`) and is what should
 * be used as the URL param so /en/... and /nl/... line up.
 */
export async function getLocalizedEntries<C extends CollectionKey>(
  collection: C,
  lang: Lang,
): Promise<LocalizedEntry<C>[]> {
  const all = await getCollection(collection)
  const byKey = new Map<string, Partial<Record<Lang, CollectionEntry<C>>>>()

  for (const entry of all) {
    const d = dataOf(entry)
    const entryLang = d.lang ?? DEFAULT_LANG
    const key = d.translationKey ?? entry.id
    const group = byKey.get(key) ?? {}
    group[entryLang] = entry
    byKey.set(key, group)
  }

  const result: LocalizedEntry<C>[] = []
  for (const [baseSlug, group] of byKey) {
    const localized = group[lang]
    const chosen = localized ?? group[DEFAULT_LANG]
    if (!chosen) continue
    result.push({ entry: chosen, baseSlug, lang, isFallback: !localized })
  }
  return result
}

type Listed = { entry: { collection: string; data: { date: Date } }; baseSlug: string }

/** Whether an entry shows up in listings: a project only when it is in PROJECT_ORDER. */
export function isListed(item: Listed): boolean {
  return item.entry.collection !== "projects" || PROJECT_ORDER.includes(item.baseSlug)
}

/** Listing order: projects follow PROJECT_ORDER, every other collection is newest first. */
export function byListOrder(a: Listed, b: Listed): number {
  if (a.entry.collection === "projects") return PROJECT_ORDER.indexOf(a.baseSlug) - PROJECT_ORDER.indexOf(b.baseSlug)
  return b.entry.data.date.getTime() - a.entry.data.date.getTime()
}

/** Look up a single localized entry by its base slug. */
export async function getLocalizedEntry<C extends CollectionKey>(
  collection: C,
  lang: Lang,
  baseSlug: string,
): Promise<LocalizedEntry<C> | undefined> {
  const entries = await getLocalizedEntries(collection, lang)
  return entries.find((e) => e.baseSlug === baseSlug)
}

/**
 * Flattens a localized entry into a plain object suitable for passing to a client
 * island (`id` is replaced by the locale-independent `baseSlug`).
 */
export function toCardEntry<C extends CollectionKey>({ entry, baseSlug }: LocalizedEntry<C>): CollectionEntry<C> {
  return { ...entry, id: baseSlug }
}
