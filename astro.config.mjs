import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"
import remarkMath from "remark-math"
import rehypeMathjax from "rehype-mathjax"

// https://astro.build/config
export default defineConfig({
  site: "https://thomasvanriel.com",
  integrations: [mdx({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  }), sitemap({
      filter: (page) => {
        // Filter out known draft posts
        const draftPaths = [
        ]
        
        return !draftPaths.some(path => page.includes(path))
      }
    }), solidJs(), tailwind({ applyBaseStyles: false })],
})