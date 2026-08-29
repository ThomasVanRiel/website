import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE } from "@consts"
import { fullTitle } from "@lib/utils"

type Context = {
  site: string
}

export async function GET(context: Context) {
	const posts = await getCollection("articles")
  const projects = await getCollection("projects")

  const items = [...posts, ...projects]

  items.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items: items.map((item) => ({
      title: fullTitle(item.data),
      description: item.data.summary,
      pubDate: item.data.date,
      link: item.collection === "articles"
        ? `/articles/${item.id}/`
        : `/projects/${item.id}/`,
    })),
  })
}
