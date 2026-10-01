import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal, For } from "solid-js"
import AiBadge from "@components/AiBadge"
import { cn } from "@lib/utils"
import { AI_LEVELS, type AiLevel } from "@lib/ai"
import { DEFAULT_LANG, type Lang, useTranslations, localizePath } from "@lib/i18n"

type Props = {
  tags: string[]
  data: CollectionEntry<"projects">[]
  lang?: Lang
}

export default function Projects({ data, tags, lang = DEFAULT_LANG }: Props) {
  const t = useTranslations(lang)
  const [filter, setFilter] = createSignal(new Set<string>())
  const [aiFilter, setAiFilter] = createSignal(new Set<AiLevel>())
  const [projects, setProjects] = createSignal<CollectionEntry<"projects">[]>([])
  const levels = AI_LEVELS.filter((level) => data.some((entry) => entry.data.ai?.level === level))

  // Tags narrow the list (all must match); AI levels widen it (any may match).
  createEffect(() => {
    setProjects(data.filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some((tag:string) =>
          tag.toLowerCase() === String(value).toLowerCase()
        )
      ) && (aiFilter().size === 0 || (!!entry.data.ai && aiFilter().has(entry.data.ai.level)))
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

  function toggleLevel(level: AiLevel) {
    setAiFilter((prev) =>
      new Set(prev.has(level)
        ? [...prev].filter((l) => l !== level)
        : [...prev, level]
      )
    )
  }

  const checkbox = (active: () => boolean, label: string, onClick: () => void) => (
    <li class="bg-brand-lt dark:bg-brand-dk">
      <button onClick={onClick} aria-pressed={active()} class={cn("w-full px-2 py-1 rounded", "whitespace-nowrap overflow-hidden overflow-ellipsis", "flex gap-2 items-center", "bg-black/5 dark:bg-white/10", "hover:bg-black/10 hover:dark:bg-white/15", "transition-colors duration-100 ease-in-out", active() && "text-black dark:text-white")}>
        <svg class={cn("size-5 shrink-0 fill-black/50 dark:fill-white/50", "transition-colors duration-100 ease-in-out", active() && "fill-black dark:fill-white")}>
          <use href={`/ui.svg#square`} class={cn(!active() ? "block" : "hidden")} />
          <use href={`/ui.svg#square-check`} class={cn(active() ? "block" : "hidden")} />
        </svg>
        {label}
      </button>
    </li>
  )

  return (
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="col-span-3 sm:col-span-1">
        <div class="sticky top-24">
          {levels.length > 0 && (
            <>
              <div class="text-sm font-semibold uppercase mb-2 text-black dark:text-white">{t.ai.heading}</div>
              <ul class="flex flex-wrap sm:flex-col gap-1.5 mb-6">
                <For each={levels}>
                  {(level) => checkbox(() => aiFilter().has(level), t.ai.level[level].label, () => toggleLevel(level))}
                </For>
              </ul>
            </>
          )}
          <div class="text-sm font-semibold uppercase mb-2 text-black dark:text-white">{t.filter}</div>
          <ul class="flex flex-wrap sm:flex-col gap-1.5">
            <For each={tags}>
              {(tag) => checkbox(() => filter().has(tag), tag, () => toggleTag(tag))}
            </For>
          </ul>
        </div>
      </div>
      <div class="col-span-3 sm:col-span-2">
        <div class="flex flex-col">
          <div class="text-sm uppercase mb-2">
            {t.showingProjects(projects().length, data.length)}
          </div>
          <ul class="flex flex-col gap-3">
            {projects().map((project) => (
              <li>
                <ProjectCard entry={project} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// The whole card opens the project page (stretched title link); the demo and repository
// links sit above it so they stay clickable.
function ProjectCard({ entry, lang }: { entry: CollectionEntry<"projects">; lang: Lang }) {
  const t = useTranslations(lang)
  const { title, summary, tags, highlight, ai, demoUrl, repoUrl } = entry.data
  const external = "relative z-10 flex gap-1.5 items-center px-2 py-1 rounded text-xs border border-black/25 dark:border-white/25 bg-brand-lt dark:bg-brand-dk hover:text-black hover:dark:text-white hover:border-black/50 hover:dark:border-white/50 blend"
  return (
    <div class="button group relative p-4 rounded-lg transition-colors duration-100 ease-in-out">
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <a href={localizePath(`/projects/${entry.id}`, lang)} class="font-semibold text-brand-dk dark:text-brand-lt after:absolute after:inset-0">
          {title}
        </a>
        {ai && <AiBadge level={ai.level} lang={lang} />}
      </div>
      <div class="text-sm mt-1">
        {summary}
      </div>
      {highlight && (
        <div class="text-sm mt-2 font-semibold text-black dark:text-white">
          {highlight}
        </div>
      )}
      <ul class="flex flex-wrap mt-2 gap-1">
        {tags.map((tag:string) => (
          <li class="text-xs uppercase py-0.5 px-1 rounded text-brand-dk/75 dark:text-brand-lt/75">
            {tag}
          </li>
        ))}
      </ul>
      {(demoUrl || repoUrl) && (
        <div class="flex flex-wrap mt-3 gap-2">
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer" class={external}>
              <svg class="size-3.5 fill-current">
                <use href="/ui.svg#globe" />
              </svg>
              {t.seeDemo}
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" class={external}>
              <svg class="size-3.5 fill-current">
                <use href="/ui.svg#link" />
              </svg>
              {t.seeRepository}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
