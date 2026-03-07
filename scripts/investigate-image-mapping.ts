/**
 * Report current story → image mapping and flag mismatches.
 * Run: npx tsx scripts/investigate-image-mapping.ts
 */
import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'
import {
  validateImageMapping,
  getExpectedImage,
  getStoryTitleForImage,
  type StoryRow,
} from '../lib/image-mapping'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)
const imagesDir = path.join(process.cwd(), 'public', 'images')
const publicDir = path.join(process.cwd(), 'public')

function main() {
  const imageFiles = fs.existsSync(imagesDir)
    ? fs.readdirSync(imagesDir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    : []

  const rows = db
    .prepare('SELECT id, title, imageUrl FROM stories ORDER BY createdAt ASC')
    .all() as StoryRow[]

  const result = validateImageMapping(rows, imageFiles, publicDir)

  console.log('=== CURRENT STORY → IMAGE MAPPING ===\n')
  console.log('Stories:', rows.length, '| Image files:', imageFiles.length, '\n')

  // Print full mapping table (story title | current image | status)
  console.log('--- Full mapping (story title | current image | status) ---\n')
  for (const row of rows) {
    const current = row.imageUrl ? path.basename(row.imageUrl) : '(none)'
    const expected = getExpectedImage(row.title, imageFiles)
    const exists =
      row.imageUrl &&
      fs.existsSync(path.join(publicDir, row.imageUrl.replace(/^\//, '')))
    let status = '✓'
    if (!row.imageUrl) status = 'MISSING'
    else if (!exists) status = 'BROKEN (file missing)'
    else if (expected && current !== expected)
      status = `MISMATCH (expected: ${expected})`
    else {
      const belongsTo = getStoryTitleForImage(current, rows)
      if (belongsTo && belongsTo !== row.title)
        status = `WRONG (image is for: ${belongsTo})`
    }
    console.log(`${row.title} | ${current} | ${status}`)
  }

  console.log('\n--- Summary ---')
  console.log('OK (correct or no name match):', result.ok.length)
  console.log('MISSING image:', result.missing.length)
  console.log('BROKEN (file missing):', result.broken.length)
  console.log('MISMATCHED (wrong image for story):', result.mismatched.length)
  console.log('WRONG (image belongs to another story):', result.wrong.length)

  if (result.wrong.length) {
    console.log("\n--- Wrong image (story shows another story's image) ---")
    result.wrong.forEach(({ story, current, imageBelongsTo }) =>
      console.log(
        '  -',
        story.title,
        '\n    current:',
        path.basename(current),
        '→ image is for:',
        imageBelongsTo
      )
    )
  }
  if (result.missing.length) {
    console.log('\n--- Stories with no image ---')
    result.missing.forEach((r) => console.log('  -', r.title))
  }
  if (result.broken.length) {
    console.log('\n--- Stories pointing to missing file ---')
    result.broken.forEach(({ story, current }) =>
      console.log('  -', story.title, '→', current)
    )
  }
  if (result.mismatched.length) {
    console.log('\n--- Mismatched (story has wrong image) ---')
    result.mismatched.forEach(({ story, current, expected }) =>
      console.log(
        '  -',
        story.title,
        '\n    current:',
        path.basename(current),
        '| expected:',
        expected
      )
    )
  }

  db.close()
}

main()
