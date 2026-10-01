# thomasvanriel.com

Personal website built with Astro, Solid.js, and Tailwind. Auto-deploys from `main` via Netlify.

## Development

```bash
npm install
npm run dev          # local dev server (auto-runs npm run thumbs first)
npm run build        # type check + production build
npm run preview      # serve the production build locally
npm run lint         # ESLint
```

Requires Node 22+. No external binaries — Sharp (a dep) handles image processing.

## Content

Each content type lives under `src/content/` and is validated by `src/content/config.ts`.

| Type        | Path                           | Frontmatter                                            |
| ----------- | ------------------------------ | ------------------------------------------------------ |
| Article     | `src/content/articles/<slug>/` | `title`, `summary`, `date`, `tags`, `draft?`          |
| Project     | `src/content/projects/<slug>/` | …above + `demoUrl?`, `repoUrl?`, `highlight?`, `ai?` |
| Photography | `src/content/photography/<slug>/index.md` | …above + `license?` (default `CC BY 4.0`), `photos[]` |
| Work        | `src/content/work/<slug>.md`   | `company`, `role`, `dateStart`, `dateEnd`             |
| Legal       | `src/content/legal/<slug>.md`  | `title`, `date`                                       |

Set `draft: true` to hide an entry from the sitemap and listings.

## Projects

The order of the projects page is the `PROJECT_ORDER` list in `src/consts.ts`, top to bottom by folder name. A project that is not in the list is left out of the projects page, the previous/next buttons and the search; its own URL keeps working. `highlight` is one short line shown on the card. `ai` drives the AI-usage badge and the panel on the project page:

```yaml
highlight: "Used in …"   # optional
ai:
  level: directed        # human | assisted | directed | vibecoded
  usage:                 # optional, every category is optional
    architecture: human  # human | assisted | ai
    code: ai
    tests: ai
    docs: assisted
  note: "Free text shown under the breakdown."   # optional
```

The vocabulary lives in `src/lib/ai.ts`, the labels and descriptions in `src/lib/i18n.ts` (`ai.*`).

## Photography

Originals (unwatermarked, downloadable) and an entry definition live in two places:

```
public/photography/<slug>/
  *.jpg                  # full-res originals — served as-is for download
  thumbs/<width>/*.webp  # generated (gitignored)

src/content/photography/<slug>/index.md   # frontmatter only
```

### Add a new album

1. **Drop originals** into `public/photography/<slug>/`. Filenames are free-form (e.g. `651A9462.jpg`).
2. **Create `src/content/photography/<slug>/index.md`**:
   ```yaml
   ---
   title: "Album title"
   summary: "Short description"
   date: 2026-05-12
   tags: ["nature"]
   license: "CC BY 4.0"   # optional; defaults to CC BY 4.0
   photos:
     - src: 651A9462.jpg
       alt: A clear description (required, helps a11y and SEO)
     - src: 651A9470.jpg
       alt: Another description
   ---
   ```
3. **Run `npm run dev`** (or `npm run thumbs` directly). The build script uses Sharp to generate WebP thumbnails at 480/720/1080/1440/1800 px under `public/photography/<slug>/thumbs/`, applying EXIF orientation so portraits stay portrait. mtime-based skip avoids re-encoding files that are up to date.

The frontmatter order = display order in the mosaic. The lightbox shows the 1800 px variant; the "Original" pill downloads the original from `public/photography/<slug>/<file>`. The licence line (e.g. CC BY 4.0) is the asks-nicely contract — viewers are expected to respect it.

### Netlify build cache

`public/photography/**/thumbs/` is gitignored, and Netlify starts each build from a clean git checkout — so every deploy currently regenerates every thumbnail. Fine while the collection is small (a few seconds). When it grows, persist thumbs across builds with [`netlify-plugin-cache`](https://github.com/munter/netlify-plugin-cache) in a `netlify.toml`:

```toml
[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs]
    paths = ["public/photography"]
```

The script's mtime-based skip will then only rebuild new/changed photos.

### SEO / licensing

Each entry page emits a JSON-LD `ImageGallery` block with per-image `ImageObject` entries that carry `license`, `acquireLicensePage`, `creditText`, and copyright metadata — verifiable in [Google's Rich Results Test](https://search.google.com/test/rich-results).

## Project structure

See [CLAUDE.md](CLAUDE.md) for a full file-tree breakdown and conventions.
