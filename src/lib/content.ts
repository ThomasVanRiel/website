// Server-only helpers (imports astro:content). Do NOT import from client islands.
import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content"
import { DEFAULT_LANG, type Lang } from "@lib/i18n"

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
