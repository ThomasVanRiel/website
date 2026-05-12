#!/usr/bin/env node
import { existsSync, mkdirSync, statSync } from "node:fs"
import { readdir } from "node:fs/promises"
import { basename, dirname, extname, join } from "node:path"
import sharp from "sharp"

const ROOT = process.cwd()
const ALBUMS_ROOT = join(ROOT, "public", "photography")
const WIDTHS = [480, 720, 1080, 1440, 1800]
const QUALITY = 85
const SOURCE_EXT = /\.(jpe?g|png|tif?f)$/i

async function processAlbum(albumName) {
  const dir = join(ALBUMS_ROOT, albumName)
  const entries = await readdir(dir, { withFileTypes: true })
  let made = 0
  for (const entry of entries) {
    if (!entry.isFile() || !SOURCE_EXT.test(entry.name)) continue
    const src = join(dir, entry.name)
    const srcStat = statSync(src)
    const stem = basename(entry.name, extname(entry.name))

    for (const w of WIDTHS) {
      const out = join(dir, "thumbs", String(w), `${stem}.webp`)
      if (existsSync(out) && statSync(out).mtimeMs >= srcStat.mtimeMs) continue
      mkdirSync(dirname(out), { recursive: true })

      await sharp(src)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out)

      console.log(`[thumbs] ${albumName}/${entry.name} → ${w}px`)
      made++
    }
  }
  return made
}

async function main() {
  if (!existsSync(ALBUMS_ROOT)) {
    console.log("[thumbs] no albums directory:", ALBUMS_ROOT)
    return
  }
  const albums = await readdir(ALBUMS_ROOT, { withFileTypes: true })
  let total = 0
  for (const a of albums) {
    if (a.isDirectory()) total += await processAlbum(a.name)
  }
  if (total === 0) console.log("[thumbs] up to date")
  else console.log(`[thumbs] generated ${total} variants`)
}

main().catch((err) => {
  console.error("[thumbs] failed:", err)
  process.exit(1)
})
