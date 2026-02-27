import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface ImportedStory {
  title: string
  body: string
}

function parsePriceZaLakuNocFile(filePath: string): ImportedStory[] {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Split by lines of '=' (the file uses a row of '=' as a separator)
  const sections = content
    .split(/=+\s*\n/g)
    .map(section => section.trim())
    .filter(section => section.length > 0)

  const stories: ImportedStory[] = []

  for (const section of sections) {
    const lines = section.split('\n')
    let title = ''
    let bodyLines: string[] = []
    let inBody = false

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!inBody) {
        if (line.toLowerCase().startsWith('title:')) {
          title = line.substring('title:'.length).trim()
        } else if (line.toLowerCase().startsWith('body:')) {
          // Start of body: include everything after "Body:" and the following lines
          const afterBody = rawLine.substring(rawLine.toLowerCase().indexOf('body:') + 'body:'.length)
          bodyLines.push(afterBody.trimStart())
          inBody = true
        }
      } else {
        bodyLines.push(rawLine)
      }
    }

    const rawBody = bodyLines.join('\n').trim()

    if (!title || !rawBody) {
      continue
    }

    // Strip wrapping quotes if the whole body is enclosed in double quotes
    let body = rawBody
    if (body.startsWith('"') && body.endsWith('"')) {
      body = body.slice(1, -1)
    }

    stories.push({ title, body })
  }

  return stories
}

function updateStoryBodyByTitle(title: string, body: string) {
  const story = db
    .prepare('SELECT id, title FROM stories WHERE title = ?')
    .get(title) as { id: string; title: string } | undefined

  if (!story) {
    console.warn(`⚠️  No story found in DB with title: "${title}" – skipping`)
    return
  }

  const now = new Date().toISOString()
  db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?').run(body, now, story.id)

  const readingTime = calculateReadingTime(body)
  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length

  console.log(`✅ Updated "${title}" (id: ${story.id})`)
  console.log(`   Reading time: ${readingTime} min`)
  console.log(`   Word count:   ${wordCount}`)
}

// Main execution
if (require.main === module) {
  const importFilePath =
    process.argv[2] || path.join(process.cwd(), 'import', 'price_za_laku_noc.txt')

  if (!fs.existsSync(importFilePath)) {
    console.error(`❌ Import file not found: ${importFilePath}`)
    process.exit(1)
  }

  console.log(`📖 Reading rewritten stories from: ${importFilePath}\n`)

  try {
    const stories = parsePriceZaLakuNocFile(importFilePath)

    if (stories.length === 0) {
      console.log('❌ No stories parsed from the import file.')
      process.exit(1)
    }

    console.log(`Found ${stories.length} story/stories to update.\n`)

    for (const story of stories) {
      updateStoryBodyByTitle(story.title, story.body)
    }

    console.log('\n✅ Finished updating stories in the database.')
  } catch (error) {
    console.error('❌ Error updating stories from import file:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

