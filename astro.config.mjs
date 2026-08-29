import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import solidJs from "@astrojs/solid-js"
import remarkMath from "remark-math"
import rehypeKatex  from "rehype-katex"

// https://astro.build/config
export default defineConfig({
  site: "https://thomasvanriel.com",
  // English is the default locale and is served unprefixed at the root; other locales
  // are prefixed (/nl/...). Routing is handled by the src/pages/[...lang]/ tree, whose
  // lang param is `undefined` for English so the segment collapses away. This block only
  // provides locale metadata (helpers + sitemap), not routing/redirect behavior.
  i18n: {
    locales: ["en", "nl"],
    defaultLocale: "en",
  },
  // Redirects for the previous URL scheme, where English lived under /en/. SSG can only
  // emit these as meta-refresh pages, so public/_redirects mirrors them (plus the
  // wildcards that can't be enumerated here) as real HTTP redirects on Netlify.
  redirects: {
    "/en": "/",
    "/en/articles": "/articles",
    "/en/projects": "/projects",
    "/en/photography": "/photography",
    "/en/work": "/work",
    "/en/search": "/search",
    "/blog": "/articles",
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