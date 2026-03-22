/**
 * Rename story images under public/images/ to the canonical slug filename and fix imageUrl in the DB.
 *
 * Canonical name: `{normalizeStoryTitle(title)}{ext}` (see lib/image-mapping.ts)
 * Example: "Razbojnik sa žutom pjegom" → razbojnik_sa_zutom_pjegom.png
 *
 * Only renames when the current file's normalized basename matches the story title
 * (same rule as exactMatch). Skips broken paths or wrong mappings.
 */
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import {
  canonicalImageFileName,
  fileSlugMatchesStory,
} from '../lib/image-mapping'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

const publicDir = path.join(process.cwd(), 'public')
const imagesDir = path.join(publicDir, 'images')

function safeRenameSync(from: string, to: string) {
  if (from === to) return
  if (!fs.existsSync(from)) {
    throw new Error(`Rename source missing: ${from}`)
  }
  const sameCaseInsensitive =
    from.toLowerCase() === to.toLowerCase() && from !== to
  if (sameCaseInsensitive) {
    const dir = path.dirname(to)
    const tmp = path.join(
      dir,
      `._tmp_rename_${process.pid}_${Date.now()}${path.extname(to)}`
    )
    fs.renameSync(from, tmp)
    fs.renameSync(tmp, to)
    return
  }
  if (fs.existsSync(to)) {
    const sFrom = fs.statSync(from)
    const sTo = fs.statSync(to)
    if (sFrom.ino === sTo.ino && sFrom.dev === sTo.dev) return
    throw new Error(`Target exists (different file): ${to}`)
  }
  fs.renameSync(from, to)
}

function main() {
  const dryRun = process.argv.includes('--dry-run')

  const stories = db
    .prepare(
      `SELECT id, title, imageUrl FROM stories WHERE imageUrl IS NOT NULL AND trim(imageUrl) != ''`
    )
    .all() as Array<{ id: string; title: string; imageUrl: string }>

  const now = new Date().toISOString()
  const updateStmt = db.prepare(
    'UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?'
  )

  let renamed = 0
  let updated = 0
  let skipped = 0
  const errors: string[] = []

  for (const story of stories) {
    const rel = story.imageUrl.replace(/^\//, '')
    if (!rel.startsWith('images/')) {
      skipped++
      continue
    }
    const currentFile = path.basename(rel)
    const fromPath = path.join(publicDir, rel.split('/').join(path.sep))

    if (!fs.existsSync(fromPath)) {
      errors.push(`Missing file for "${story.title}": ${story.imageUrl}`)
      skipped++
      continue
    }

    const ext = path.extname(currentFile).toLowerCase() || '.png'
    const allowed = ['.png', '.jpg', '.jpeg']
    const useExt = allowed.includes(ext) ? ext : '.png'

    if (!fileSlugMatchesStory(currentFile, story.title)) {
      console.log(
        `⊘ Skip (basename does not match title slug): "${story.title}" → ${currentFile}`
      )
      skipped++
      continue
    }

    const targetFile = canonicalImageFileName(story.title, useExt)
    if (currentFile === targetFile) {
      const url = `/images/${targetFile}`
      if (story.imageUrl !== url) {
        if (!dryRun) {
          updateStmt.run(url, now, story.id)
          updated++
        }
        console.log(`↻ DB only: "${story.title}" → ${url}`)
      }
      continue
    }

    const toPath = path.join(imagesDir, targetFile)
    try {
      if (dryRun) {
        console.log(
          `[dry-run] "${story.title}": ${currentFile} → ${targetFile}`
        )
      } else {
        safeRenameSync(fromPath, toPath)
        renamed++
        const newUrl = `/images/${targetFile}`
        updateStmt.run(newUrl, now, story.id)
        updated++
        console.log(`✓ "${story.title}": ${currentFile} → ${targetFile}`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`"${story.title}": ${msg}`)
    }
  }

  console.log(`\nSummary${dryRun ? ' (dry-run)' : ''}:`)
  console.log(`  Renamed files: ${dryRun ? 0 : renamed}`)
  console.log(`  DB rows updated: ${dryRun ? 0 : updated}`)
  console.log(`  Skipped:       ${skipped}`)
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`)
    errors.forEach((e) => console.log(`  - ${e}`))
    process.exitCode = 1
  }
}

main()
db.close()
