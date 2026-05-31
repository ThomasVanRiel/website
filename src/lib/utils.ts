import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DEFAULT_LANG, type Lang, LOCALE_TAG, useTranslations } from "@lib/i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, lang: Lang = DEFAULT_LANG) {
  return Intl.DateTimeFormat(LOCALE_TAG[lang], {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date)
}

export function readingTime(html: string | undefined, lang: Lang = DEFAULT_LANG) {
  const textOnly = (html ?? "").replace(/<[^>]+>/g, "")
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
  return useTranslations(lang).minRead(readingTimeMinutes)
}
