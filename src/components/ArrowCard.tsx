import { formatDate } from "@lib/utils"
import { DEFAULT_LANG, type Lang, useTranslations, localizePath } from "@lib/i18n"
import type { CollectionEntry } from "astro:content"

type Props = {
  entry: CollectionEntry<"articles"> | CollectionEntry<"projects"> | CollectionEntry<"photography">
  pill?: boolean
  lang?: Lang
}

export default function ArrowCard({entry, pill, lang = DEFAULT_LANG}: Props) {
    const t = useTranslations(lang)
    return (
      <a href={localizePath(`/${entry.collection}/${entry.slug}`, lang)} class="button group p-4 gap-3 flex items-center border rounded-lg border-black/15 dark:border-white/20 transition-colors duration-100 ease-in-out">
      <div class="w-full group-hover:text-brand-dk group-hover:dark:text-brand-lt blend ">
        <div class="flex flex-wrap items-center gap-2">
          {pill &&
            <div class="text-sm capitalize px-2 py-0.5 rounded-full border border-black/15 dark:border-white/25">
              {t.pill[entry.collection]}
            </div>
          }
          <div class="text-sm uppercase">
            {formatDate(entry.data.date, lang)}
          </div>
        </div>
        <div class="font-semibold mt-3 text-brand-dk dark:text-brand-lt">
          {entry.data.title}
        </div>

        <div class="text-sm line-clamp-2">
          {entry.data.summary}
        </div>
        <ul class="flex flex-wrap mt-2 gap-1">
          {entry.data.tags.map((tag:string) => (
            <li class="text-xs uppercase py-0.5 px-1 rounded text-brand-dk/75 dark:text-brand-lt/75">
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="stroke-current group-hover:stroke-black group-hover:dark:stroke-white">
        <line x1="5" y1="12" x2="19" y2="12" class="scale-x-0 group-hover:scale-x-100 translate-x-4 group-hover:translate-x-1 transition-all duration-100 ease-in-out" />
        <polyline points="12 5 19 12 12 19" class="translate-x-0 group-hover:translate-x-1 transition-all duration-100 ease-in-out" />
      </svg>
    </a>
   )
}
