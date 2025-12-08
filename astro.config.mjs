import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://thomasvanriel.com",
  integrations: [mdx(), sitemap({
      filter: (page) => {
        // Filter out known draft posts
        const draftPaths = [
        ]
        
        return !draftPaths.some(path => page.includes(path))
      }
    }), solidJs(), tailwind({ applyBaseStyles: false })],
})