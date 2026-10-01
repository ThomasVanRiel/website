import { cn } from "@lib/utils"
import { AI_LEVELS, type AiLevel } from "@lib/ai"
import { DEFAULT_LANG, type Lang, useTranslations } from "@lib/i18n"

type Props = {
  level: AiLevel
  lang?: Lang
}

// Pill with a three-dot meter: no dots filled for human-written, all three for vibecoded.
export default function AiBadge({ level, lang = DEFAULT_LANG }: Props) {
  const t = useTranslations(lang)
  const filled = AI_LEVELS.indexOf(level)
  return (
    <span title={t.ai.level[level].description} class="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full whitespace-nowrap border border-black/15 dark:border-white/25">
      <span class="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((dot) => (
          <span class={cn("size-1.5 rounded-full bg-current", dot > filled && "opacity-25")} />
        ))}
      </span>
      {t.ai.level[level].label}
    </span>
  )
}
