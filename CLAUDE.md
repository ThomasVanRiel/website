# CLAUDE.md

## Project Overview

Personal portfolio website for Thomas Van Riel (thomasvanriel.com). Built with Astro as a static site generator, Solid.js for interactive components, and Tailwind CSS for styling. Auto-deployed from `main` branch via Netlify.

## Tech Stack

- **Framework**: Astro v5.14.1 (SSG)
- **Interactive UI**: Solid.js
- **Styling**: Tailwind CSS v3 (class-based dark mode)
- **Language**: TypeScript (strict mode)
- **Math**: KaTeX via remark-math + rehype-katex
- **Visualization**: D3, Three.js, Rough.js, anime.js
- **Search**: Fuse.js (fuzzy search)
- **Images**: Sharp for optimization

## Commands

```bash
npm run dev              # Dev server with hot reload
npm run dev:network      # Dev server on network
npm run build            # Type check (astro check) + production build to dist/
npm run preview          # Preview production build
npm run lint             # ESLint
npm run lint:fix         # ESLint auto-fix
```

## Project Structure

```
src/
├── components/                     # Astro (.astro) + Solid.js (.tsx) components
│   ├── BaseHead.astro              # <head> meta, OG tags, global scripts/styles
│   ├── Header.astro                # Site header with nav, search, theme toggle, drawer button
│   ├── Footer.astro                # Footer with social links, back-to-top
│   ├── Drawer.astro                # Mobile slide-down nav menu
│   ├── Container.astro             # Responsive width wrapper (sm/md/lg/xl/2xl)
│   ├── Articles.tsx                # Filterable article list (Solid.js)
│   ├── Projects.tsx                # Filterable project list (Solid.js)
│   ├── Search.tsx                  # Fuse.js fuzzy search (Solid.js)
│   ├── ArrowCard.tsx               # Card link with hover arrow (Solid.js)
│   ├── Counter.tsx                 # Demo counter (unused)
│   ├── Figure.astro                # Image/video with dark mode source switching
│   ├── TableOfContents.astro       # Sticky TOC with scroll highlighting
│   ├── StackCard.astro             # Tech stack icon card
│   ├── Definition.astro            # Dictionary-style definition block
│   ├── RoadGrid.astro              # Isotope grid for ring-roads article
│   └── RoadLabel.astro             # Colored road type badge
├── content/                        # Content collections (Markdown/MDX)
│   ├── articles/                   # Blog posts (title, summary, date, tags, draft?)
│   ├── projects/                   # Project showcase (+ demoUrl?, repoUrl?)
│   ├── work/                       # Work history (company, role, dateStart, dateEnd)
│   ├── legal/                      # Legal pages (title, date)
│   └── config.ts                   # Zod schemas for all collections
├── layouts/                        # Page layouts
│   ├── PageLayout.astro            # Main wrapper (Header + Drawer + Footer)
│   ├── TopLayout.astro             # Top section (pt-36 pb-5)
│   ├── BottomLayout.astro          # Bottom section (flex-1 py-5)
│   ├── ArticleTopLayout.astro      # Article header (back link, date, tags, demo/repo URLs)
│   └── ArticleBottomLayout.astro   # Article content + prev/next navigation
├── pages/                          # File-based routing
│   ├── index.astro                 # Homepage (hero, recent articles, socials)
│   ├── articles/                   # /articles index + /articles/[slug]
│   ├── projects/                   # /projects index + /projects/[slug]
│   ├── work/                       # /work timeline page
│   ├── legal/                      # /legal/[slug] (privacy, terms, AI manifesto)
│   ├── search/                     # /search page
│   ├── blog/                       # Legacy redirects → /articles
│   ├── robots.txt.ts               # Generated robots.txt
│   └── rss.xml.ts                  # Generated RSS feed
├── styles/global.css               # Tailwind imports, custom classes (.blend, .animate, prose overrides)
├── lib/utils.ts                    # Helpers (cn, formatDate, readingTime)
├── types/                          # Type declarations (isotope-layout.d.ts, third-party.d.ts)
├── types.ts                        # Shared types (Links, Socials, etc.)
├── consts.ts                       # Site metadata, nav links, social links
└── env.d.ts                        # Astro environment types
public/                             # 
├── fonts/                          # Source Sans 3, Source Serif 4 font files
├── images/                         # Static images
├── js/                             # Global scripts (theme.js, scroll.js, animate.js, copy.js)
├── ring-roads/                     # PNG assets for ring-roads article
├── styles/                         # Additional CSS
├── *.svg                           # SVG sprites (social.svg, ui.svg, brand.svg, stack.svg, etc.)
└── open-graph.png                  # Default OG image
```

## Key Conventions

- **Path aliases**: `@components`, `@layouts`, `@lib`, `@consts`, `@types` all map to `src/*`
- **Content**: Articles and projects use MDX with YAML frontmatter; draft items are filtered from sitemap
- **Components**: Astro for static/server-rendered, Solid.js (.tsx) for client-side interactivity
- **Styling**: Tailwind utility classes; custom brand colors (brand-dk, brand-lt + hover variants); custom fonts (Source Sans 3, Source Serif 4)
- **Animations**: `.animate` class for fade-in-up; anime.js for SVG morphing; astro:after-swap lifecycle for SPA transitions
- **No test framework**: Code quality enforced via TypeScript strict mode + ESLint

## Content Authoring

New articles go in `src/content/articles/<slug>/index.md` (or .mdx) with frontmatter:
```yaml
---
title: "Article Title"
summary: "Short description"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
draft: true  # optional, hides from sitemap
---
```

Projects follow the same pattern in `src/content/projects/` with optional `demoUrl` and `repoUrl` fields.

## Possible Improvements

### Bugs

- **Typo in function name**: `inintializeBackToTop` should be `initializeBackToTop` in [Footer.astro](src/components/Footer.astro) (lines 74, 79, 80)
- **Event listener memory leaks**: `Header.astro` (lines 92-107) and `Footer.astro` (lines 65-81) add new event listeners on every `astro:after-swap` without removing old ones. Same issue in [TableOfContents.astro](src/components/TableOfContents.astro) where the IntersectionObserver is never disconnected
- **RoadGrid controls break after navigation**: `controlsBound` flag in [RoadGrid.astro:152](src/components/RoadGrid.astro#L152) is never reset, so controls stop working after Astro page transitions
- **RoadGrid SVG hardcodes `stroke="black"`**: CSS `dark:stroke-white` class is overridden by the attribute in [RoadGrid.astro:126-134](src/components/RoadGrid.astro#L126-L134), breaking dark mode
- **Hardcoded copyright year** `2025` in [Footer.astro:36](src/components/Footer.astro#L36) — should use `new Date().getFullYear()`
- **Type casting error**: [search/index.astro:15](src/pages/search/index.astro#L15) casts projects as `CollectionEntry<"articles">[]`

### Code Quality

- **Duplicate components**: [Articles.tsx](src/components/Articles.tsx) and [Projects.tsx](src/components/Projects.tsx) are nearly identical (72 lines each) — extract a generic `FilterableList` component
- **Unused component**: [Counter.tsx](src/components/Counter.tsx) is never imported anywhere
- **Unused dependency**: `baseline-browser-mapping` in package.json has zero imports
- **Commented-out code**: Navigation links (Work, Projects) in [consts.ts:40-51](src/consts.ts#L40-L51), projects section on [index.astro:88-110](src/pages/index.astro#L88-L110), font preloads in BaseHead.astro, language toggle in Header.astro — remove or restore
- **Duplicate SVG arrow pattern**: Same animated arrow SVG repeated in Footer.astro, ArticleTopLayout.astro, and ArticleBottomLayout.astro — extract to `ArrowIcon.astro`
- **Duplicate social links rendering**: Same social links map in both [Footer.astro](src/components/Footer.astro) and [index.astro](src/pages/index.astro) — extract to a shared component
- **Inconsistent transition durations**: Articles.tsx uses `duration-300`, Projects.tsx uses `duration-100`
- **Tag extraction logic repeated**: `[...new Set(items.flatMap(i => i.data.tags))].sort(...)` appears in multiple page files — extract to utility
- **Redundant layouts**: TopLayout.astro and BottomLayout.astro differ only in padding classes — could merge with a variant prop

### Accessibility

- **Missing `rel="noopener noreferrer"`** on all `target="_blank"` links (Footer.astro, index.astro, ArticleTopLayout.astro, StackCard.astro)
- **No skip-to-content link** in PageLayout.astro
- **Missing `aria-current="page"`** on active navigation links in Header.astro and Drawer.astro
- **Missing `aria-expanded`** on the drawer toggle button in [Header.astro:61](src/components/Header.astro#L61)
- **Missing `aria-hidden="true"`** on decorative SVG icons inside labeled buttons/links
- **Missing `aria-pressed`** on tag filter toggle buttons in Articles.tsx and Projects.tsx
- **No `prefers-reduced-motion` support**: Animations in global.css and animate.js run regardless of user preference
- **Search input** in [Search.tsx:37](src/components/Search.tsx#L37) has no visible `<label>` or `aria-label`
- **Search results not announced**: No `aria-live` region for screen readers when results update
- **Figure component** uses `<div>` + `<p>` instead of semantic `<figure>` + `<figcaption>` in [Figure.astro](src/components/Figure.astro)
- **Copy-to-clipboard button** in `public/js/copy.js` has no `aria-label`
- **Drawer focus management**: Focus doesn't move into drawer on open or return to button on close

### Performance

- **KaTeX CSS loaded on all pages**: [BaseHead.astro:59](src/components/BaseHead.astro#L59) loads KaTeX stylesheet globally — should only load on article pages that use math
- **Unthrottled scroll listener**: `public/js/scroll.js` fires on every pixel — add `requestAnimationFrame` throttle or `{ passive: true }`
- **Cascade animations cause reflows**: `public/js/animate.js` triggers `setTimeout` per element — use IntersectionObserver instead
- **Missing `loading="lazy"` and `decoding="async"`** on images in [Figure.astro](src/components/Figure.astro)
- **Ring-roads PNGs not optimized**: 53 PNGs in `public/ring-roads/` with no WebP variants or srcset
- **Theme button listeners wait for `window.onload`**: [theme.js:53](public/js/theme.js#L53) should use `DOMContentLoaded` so buttons respond sooner

### SEO

- **No JSON-LD structured data**: Missing schema.org `Person` and `BlogPosting` markup
- **Missing OG image dimensions**: No `og:image:width`/`og:image:height` meta tags in BaseHead.astro
- **No 404 page**: Missing `src/pages/404.astro`
- **Empty sitemap draft filter**: [astro.config.mjs](astro.config.mjs) filter has an empty `draftPaths` array — dead code

### Security & Configuration

- **Analytics tracking ID hardcoded** in [BaseHead.astro:66](src/components/BaseHead.astro#L66) — move to `.env` variable
- **Counter.dev script missing `integrity` hash**: KaTeX CSS has one, but the analytics script does not
- **URL fields not validated**: `demoUrl` and `repoUrl` in [config.ts](src/content/config.ts) use `z.string()` instead of `z.string().url()`
- **`dateEnd` accepts any string**: Work collection schema should restrict to dates or `"present"`
- **ESLint CSS parsing errors**: `@eslint/css` can't parse Tailwind's `@apply` directives in global.css — consider excluding CSS files or using a Tailwind-aware linter
- **Mixed module syntax** in tailwind.config.mjs: uses `import` and `require()` together
- **No testing framework**: No unit or E2E tests configured

### UX

- **No "no results" message in search**: When a query has zero matches, nothing is shown — user gets no feedback
- **Search has no debouncing**: Every keystroke triggers Fuse.js search
- **Empty collection pages show nothing**: If all articles are drafted, the page is blank with no explanation
- **Work/Projects navigation hidden**: Routes exist and are accessible by URL but commented out of the nav in consts.ts
