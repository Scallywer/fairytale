/**
 * Migrate legacy image filenames to canonical slugs for every story that has an imageUrl.
 * Unlike canonicalize-story-images.ts, this trusts the DB row: whatever file the story points
 * at is renamed to canonicalImageFileName(title), even when normalizedBaseName(file) ≠ title slug.
 *
 * - Evacuates orphan files blocking the target name to `._orphan_{timestamp}_{name}`.
 * - Use --dry-run to preview.
 */
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { canonicalImageFileName } from '../lib/image-mapping'

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

function fileHash(fp: string): string {
  const buf = fs.readFileSync(fp)
  return crypto.createHash('sha256').update(buf).digest('hex')
}

function sameBytes(a: string, b: string): boolean {
  if (!fs.existsSync(a) || !fs.existsSync(b)) return false
  if (fs.statSync(a).size !== fs.statSync(b).size) return false
  return fileHash(a) === fileHash(b)
}

function main() {
  const dryRun = process.argv.includes('--dry-run')

  const stories = db
    .prepare(
      `SELECT id, title, imageUrl FROM stories WHERE imageUrl IS NOT NULL AND trim(imageUrl) != '' ORDER BY title`
    )
    .all() as Array<{ id: string; title: string; imageUrl: string }>

  const now = new Date().toISOString()
  const updateStmt = db.prepare(
    'UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?'
  )

  const ownersByUrl = new Map<string, string[]>()
  for (const s of stories) {
    const u = s.imageUrl.replace(/\/+/g, '/')
    const list = ownersByUrl.get(u) ?? []
    list.push(s.id)
    ownersByUrl.set(u, list)
  }

  let renamed = 0
  let dbOnly = 0
  let evacuated = 0
  let skipped = 0
  const errors: string[] = []

  for (const story of stories) {
    const rel = story.imageUrl.replace(/^\//, '').replace(/\/+/g, '/')
    if (!rel.startsWith('images/')) {
      skipped++
      continue
    }

    const currentFile = path.basename(rel)
    const fromPath = path.join(publicDir, ...rel.split('/'))

    if (!fs.existsSync(fromPath)) {
      errors.push(`Missing file for "${story.title}": ${story.imageUrl}`)
      skipped++
      continue
    }

    const ext = path.extname(currentFile).toLowerCase() || '.png'
    const allowed = ['.png', '.jpg', '.jpeg']
    const useExt = allowed.includes(ext) ? ext : '.png'

    const targetFile = canonicalImageFileName(story.title, useExt)
    const newUrl = `/images/${targetFile}`
    const toPath = path.join(imagesDir, targetFile)

    const urlOwners = ownersByUrl.get(story.imageUrl) ?? []
    if (urlOwners.length > 1) {
      errors.push(
        `Duplicate imageUrl (${urlOwners.length} stories): ${story.imageUrl}`
      )
      skipped++
      continue
    }

    // Already correct path and filename
    if (currentFile === targetFile && story.imageUrl === newUrl) {
      continue
    }

    // URL wrong casing only
    if (currentFile === targetFile && story.imageUrl !== newUrl) {
      if (!dryRun) {
        updateStmt.run(newUrl, now, story.id)
        dbOnly++
      }
      console.log(`↻ URL fix: "${story.title}" → ${newUrl}`)
      continue
    }

    // Target path blocked by a different file on disk
    if (fs.existsSync(toPath) && !sameBytes(fromPath, toPath)) {
      const canonicalUrl = `/images/${targetFile}`
      const owner = db
        .prepare('SELECT id, title FROM stories WHERE imageUrl = ?')
        .get(canonicalUrl) as { id: string; title: string } | undefined

      if (owner && owner.id !== story.id) {
        errors.push(
          `Target ${targetFile} already claimed by "${owner.title}"; cannot migrate "${story.title}"`
        )
        skipped++
        continue
      }

      // No DB row points at canonical URL — file on disk is orphan / stale
      const evacName = `._orphan_${Date.now()}_${targetFile.replace(/[^a-z0-9._-]/gi, '_')}`
      const evacPath = path.join(imagesDir, evacName)
      if (dryRun) {
        console.log(
          `[dry-run] Evacuate orphan blocking ${targetFile} → ${evacName}`
        )
      } else {
        safeRenameSync(toPath, evacPath)
        evacuated++
        console.log(`⏏ Evacuated orphan: ${targetFile} → ${evacName}`)
      }
    }

    // Identical content already at target (e.g. duplicate file)
    if (fs.existsSync(toPath) && sameBytes(fromPath, toPath)) {
      if (fromPath !== toPath) {
        if (dryRun) {
          console.log(
            `[dry-run] Remove duplicate "${story.title}": delete ${currentFile} (same as ${targetFile})`
          )
        } else {
          fs.unlinkSync(fromPath)
          renamed++
        }
      }
      if (!dryRun) {
        updateStmt.run(newUrl, now, story.id)
        dbOnly++
      }
      console.log(`↻ Dedup + URL: "${story.title}" → ${newUrl}`)
      continue
    }

    try {
      if (dryRun) {
        console.log(
          `[dry-run] "${story.title}": ${currentFile} → ${targetFile}`
        )
      } else {
        safeRenameSync(fromPath, toPath)
        renamed++
        updateStmt.run(newUrl, now, story.id)
        dbOnly++
        console.log(`✓ "${story.title}": ${currentFile} → ${targetFile}`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`"${story.title}": ${msg}`)
    }
  }

  console.log(`\nSummary${dryRun ? ' (dry-run)' : ''}:`)
  console.log(`  Files renamed / removed: ${dryRun ? 0 : renamed}`)
  console.log(`  DB rows updated:         ${dryRun ? 0 : dbOnly}`)
  console.log(`  Orphans evacuated:       ${dryRun ? 0 : evacuated}`)
  console.log(`  Skipped:                 ${skipped}`)
  if (errors.length) {
    console.log(`\nIssues (${errors.length}):`)
    errors.forEach((e) => console.log(`  - ${e}`))
    process.exitCode = 1
  }
}

main()
db.close()
