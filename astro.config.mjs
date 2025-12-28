import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"
import remarkMath from "remark-math"
import rehypeKatex  from "rehype-katex"

// https://astro.build/config
export default defineConfig({
  site: "https://thomasvanriel.com",
  integrations: [mdx({
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: 'html' }]],
  }), sitemap({
      filter: (page) => {
        // Filter out known draft posts
        const draftPaths = [
        ]
        
        return !draftPaths.some(path => page.includes(path))
      }
    }), solidJs(), tailwind({ applyBaseStyles: false })],
})