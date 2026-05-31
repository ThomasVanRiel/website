import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal, For } from "solid-js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"
import { DEFAULT_LANG, type Lang, useTranslations } from "@lib/i18n"

type Props = {
  tags: string[]
  data: CollectionEntry<"photography">[]
  lang?: Lang
}

export default function Photography({ data, tags, lang = DEFAULT_LANG }: Props) {
  const t = useTranslations(lang)
  const [filter, setFilter] = createSignal(new Set<string>())
  const [photos, setPhotos] = createSignal<CollectionEntry<"photography">[]>([])

  createEffect(() => {
    setPhotos(data.filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some((tag:string) =>
          tag.toLowerCase() === String(value).toLowerCase()
        )
      )
    ))
  })

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(prev.has(tag)
        ? [...prev].filter((t) => t !== tag)
        : [...prev, tag]
      )
    )
  }

  return (
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="col-span-3 sm:col-span-1">
        <div class="sticky top-24">
          <div class="text-sm font-semibold uppercase mb-2 text-black dark:text-white">{t.filter}</div>
          <ul class="flex flex-wrap sm:flex-col gap-1.5">
            <For each={tags}>
              {(tag) => (
                <li class="bg-brand-lt dark:bg-brand-dk">
                  <button onClick={() => toggleTag(tag)} class={cn("w-full px-2 py-1 rounded", "whitespace-nowrap overflow-hidden overflow-ellipsis", "flex gap-2 items-center", "bg-black/5 dark:bg-white/10", "hover:bg-black/10 hover:dark:bg-white/15", "transition-colors duration-100 ease-in-out", filter().has(tag) && "text-black dark:text-white")}>
                    <svg class={cn("size-5 fill-black/50 dark:fill-white/50", "transition-colors duration-100 ease-in-out", filter().has(tag) && "fill-black dark:fill-white")}>
                      <use href={`/ui.svg#square`} class={cn(!filter().has(tag) ? "block" : "hidden")} />
                      <use href={`/ui.svg#square-check`} class={cn(filter().has(tag) ? "block" : "hidden")} />
                    </svg>
                    {tag}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class="col-span-3 sm:col-span-2">
        <div class="flex flex-col">
          <div class="text-sm uppercase mb-2">
            {t.showingPhotographs(photos().length, data.length)}
          </div>
          <ul class="flex flex-col gap-3">
            {photos().map((photo) => (
              <li>
                <ArrowCard entry={photo} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
