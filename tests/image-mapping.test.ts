/**
 * Test that story → image mapping is valid.
 * Fails when:
 * - A story points to an image file that does not exist (BROKEN)
 * - A story has the wrong image when a correctly named image exists (MISMATCHED)
 * - A story's image belongs to a different story (WRONG)
 *
 * Run after adding new stories or images: npm test
 */
import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'
import { describe, it, expect } from 'vitest'
import {
  validateImageMapping,
  formatValidationErrors,
  type StoryRow,
} from '../lib/image-mapping'

const projectRoot = path.resolve(__dirname, '..')
const dbPath = path.join(projectRoot, 'data', 'stories.db')
const imagesDir = path.join(projectRoot, 'public', 'images')
const publicDir = path.join(projectRoot, 'public')

describe('story → image mapping', () => {
  it('every story with an imageUrl points to an existing file that belongs to that story', () => {
    if (!fs.existsSync(dbPath)) {
      expect.fail('Database not found at data/stories.db. Run from project root with DB present.')
    }
    if (!fs.existsSync(imagesDir)) {
      expect.fail('public/images not found. Run from project root.')
    }

    const db = new Database(dbPath)
    const rows = db
      .prepare('SELECT id, title, imageUrl FROM stories ORDER BY createdAt ASC')
      .all() as StoryRow[]
    db.close()

    const imageFiles = fs
      .readdirSync(imagesDir)
      .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))

    const result = validateImageMapping(rows, imageFiles, publicDir)

    const message =
      result.broken.length > 0 ||
      result.mismatched.length > 0 ||
      result.wrong.length > 0
        ? [
            'Story–image mapping has errors. Run: npx tsx scripts/update-image-links.ts',
            'Then: npx tsx scripts/investigate-image-mapping.ts',
            '',
            formatValidationErrors(result),
          ].join('\n')
        : undefined

    expect(result.broken, message).toHaveLength(0)
    expect(result.mismatched, message).toHaveLength(0)
    expect(result.wrong, message).toHaveLength(0)
  })
})
