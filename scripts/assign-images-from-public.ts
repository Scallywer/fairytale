/**
 * Assign imageUrl for stories that have no image, using files already in public/images/.
 * Matching uses lib/image-mapping (normalized title === normalized basename).
 */
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import {
  fileSlugMatchesStory,
  getExpectedImage,
  normalizeStoryTitle,
  normalizedBaseName,
} from '../lib/image-mapping'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

const imagesDir = path.join(process.cwd(), 'public', 'images')

function listImageFiles(): string[] {
  if (!fs.existsSync(imagesDir)) return []
  return fs.readdirSync(imagesDir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
}

function findFileForTitle(title: string, files: string[]): string | null {
  const expected = getExpectedImage(title, files)
  if (expected) return expected

  const normTitle = normalizeStoryTitle(title)
  for (const f of files) {
    if (fileSlugMatchesStory(f, title)) return f
    if (normalizedBaseName(f) === normTitle) return f
  }
  return null
}

function assignFromPublic() {
  const files = listImageFiles()
  const stories = db
    .prepare(
      `SELECT id, title FROM stories WHERE imageUrl IS NULL OR trim(imageUrl) = '' ORDER BY title`
    )
    .all() as Array<{ id: string; title: string }>

  console.log(`Found ${files.length} images in public/images`)
  console.log(`Found ${stories.length} stories without imageUrl\n`)

  const now = new Date().toISOString()
  const update = db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?')

  let updated = 0
  const missing: string[] = []

  for (const story of stories) {
    const file = findFileForTitle(story.title, files)
    if (!file) {
      missing.push(story.title)
      continue
    }
    const imageUrl = `/images/${file}`
    const full = path.join(imagesDir, file)
    if (!fs.existsSync(full)) {
      console.warn(`⚠️  File missing on disk: ${file}`)
      missing.push(story.title)
      continue
    }
    update.run(imageUrl, now, story.id)
    console.log(`✓ "${story.title}" → ${imageUrl}`)
    updated++
  }

  console.log(`\n✅ Updated ${updated} stories`)
  if (missing.length) {
    console.log(`\n⚠️  No matching image in public/images (${missing.length}):`)
    missing.forEach((t) => console.log(`   - ${t}`))
  }
}

assignFromPublic()
db.close()
