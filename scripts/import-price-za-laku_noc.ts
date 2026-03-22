import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface ImportedStory {
  title: string
  author: string
  body: string
}

function parsePriceZaLakuNocFile(filePath: string): ImportedStory[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const stories: ImportedStory[] = []

  let currentTitle = ''
  let currentAuthor = ''
  let bodyLines: string[] = []
  let inBody = false

  function flushCurrent() {
    const rawBody = bodyLines.join('\n').trim()
    if (!currentTitle || !currentAuthor || !rawBody) {
      return
    }

    let body = rawBody
    // Strip wrapping quotes if the whole body is enclosed in double quotes
    if (body.startsWith('"') && body.endsWith('"')) {
      body = body.slice(1, -1)
    }

    stories.push({
      title: currentTitle,
      author: currentAuthor,
      body
    })
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const lower = line.toLowerCase()

    if (lower.startsWith('title:')) {
      // Starting a new story, flush the previous one
      flushCurrent()
      currentTitle = line.substring('title:'.length).trim()
      currentAuthor = ''
      bodyLines = []
      inBody = false
      continue
    }

    // While inside a body, every line (until the next Title) is story text — do not treat
    // Author:/Body: at line start as metadata (dialogue or wraps could otherwise break the parse).
    if (inBody) {
      bodyLines.push(rawLine)
      continue
    }

    if (lower.startsWith('author:')) {
      currentAuthor = line.substring('author:'.length).trim()
      continue
    }

    if (lower.startsWith('body:')) {
      inBody = true
      const idx = rawLine.toLowerCase().indexOf('body:')
      const afterBody = rawLine.substring(idx + 'body:'.length)
      bodyLines.push(afterBody.trimStart())
      continue
    }
  }

  // Flush last story
  flushCurrent()

  return stories
}

function upsertStoryByTitleAndAuthor({ title, author, body }: ImportedStory) {
  const existing = db
    .prepare('SELECT id FROM stories WHERE title = ? AND author = ?')
    .get(title, author) as { id: string } | undefined

  const now = new Date().toISOString()
  let id: string
  let action: 'inserted' | 'updated'

  if (existing) {
    id = existing.id
    db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?').run(body, now, id)
    action = 'updated'
  } else {
    id = randomUUID()
    db.prepare(
      'INSERT INTO stories (id, title, author, body, imageUrl, isApproved, createdAt, updatedAt) VALUES (?, ?, ?, ?, NULL, 0, ?, ?)'
    ).run(id, title, author, body, now, now)
    action = 'inserted'
  }

  const readingTime = calculateReadingTime(body)
  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length

  const actionLabel = action === 'updated' ? 'Updated' : 'Inserted'
  console.log(`✅ ${actionLabel} "${title}" (id: ${id})`)
  console.log(`   Author:       ${author}`)
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

  console.log(`📖 Reading stories from: ${importFilePath}\n`)

  try {
    const stories = parsePriceZaLakuNocFile(importFilePath)

    if (stories.length === 0) {
      console.log('❌ No stories parsed from the import file.')
      process.exit(1)
    }

    console.log(`Found ${stories.length} story/stories in import file.\n`)

    for (const story of stories) {
      upsertStoryByTitleAndAuthor(story)
    }

    console.log('\n✅ Finished applying import to the database.')
  } catch (error) {
    console.error('❌ Error importing stories from file:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

