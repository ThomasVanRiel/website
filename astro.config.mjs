import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import solidJs from "@astrojs/solid-js"
import remarkMath from "remark-math"
import rehypeKatex  from "rehype-katex"

// https://astro.build/config
export default defineConfig({
  site: "https://thomasvanriel.com",
  // English is the default locale and lives under /en. Bare paths redirect to /en.
  // Routing itself is handled by the manual src/pages/[lang]/ tree; this block only
  // provides locale metadata (helpers + sitemap), not routing/redirect behavior.
  i18n: {
    locales: ["en", "nl"],
    defaultLocale: "en",
  },
  // Static (non-parameterized) redirects only. Dynamic [...slug] legacy redirects can't be
  // statically enumerated in SSG, so they live as thin redirect pages under src/pages/
  // (articles/[...slug].astro, projects/[...slug].astro, legal/[...slug].astro, blog/[...slug].astro).
  redirects: {
    "/": "/en/",
    "/articles": "/en/articles",
    "/projects": "/en/projects",
    "/photography": "/en/photography",
    "/work": "/en/work",
    "/search": "/en/search",
    "/blog": "/en/articles",
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: 'html' }]],
  },
  integrations: [mdx(), sitemap({
      filter: (page) => {
        // Filter out known draft posts
        const draftPaths = [
        ]
        
        return !draftPaths.some(path => page.includes(path))
      }
    }), solidJs()],
})