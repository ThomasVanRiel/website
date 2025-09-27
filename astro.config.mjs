import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://thomasvanriel.com",
  integrations: [mdx(), sitemap({
      filter: (page) =>
        page !== 'https://thomasvanriel.com/blog/04-sunk-cost-fallacy/' &&
        page !== 'https://thomasvanriel.com/blog/05-failing/' &&
        page !== 'https://thomasvanriel.com/blog/07-mdx-test/' &&
        page !== 'https://thomasvanriel.com/blog/08-machining-window/',
    }), solidJs(), tailwind({ applyBaseStyles: false })],
})