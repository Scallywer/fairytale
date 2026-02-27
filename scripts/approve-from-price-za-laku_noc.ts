import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface StoryRef {
  title: string
  author: string
}

function parseTitlesAndAuthors(filePath: string): StoryRef[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const stories: StoryRef[] = []

  let currentTitle = ''
  let currentAuthor = ''

  function flushCurrent() {
    if (!currentTitle || !currentAuthor) return
    stories.push({ title: currentTitle, author: currentAuthor })
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const lower = line.toLowerCase()

    if (lower.startsWith('title:')) {
      flushCurrent()
      currentTitle = line.substring('title:'.length).trim()
      currentAuthor = ''
      continue
    }

    if (lower.startsWith('author:')) {
      currentAuthor = line.substring('author:'.length).trim()
      continue
    }
  }

  flushCurrent()

  return stories
}

// Main execution
if (require.main === module) {
  const importFilePath =
    process.argv[2] || path.join(process.cwd(), 'import', 'price_za_laku_noc.txt')

  if (!fs.existsSync(importFilePath)) {
    console.error(`❌ Import file not found: ${importFilePath}`)
    process.exit(1)
  }

  console.log(`✅ Approving stories from: ${importFilePath}\n`)

  try {
    const refs = parseTitlesAndAuthors(importFilePath)
    if (refs.length === 0) {
      console.error('❌ No stories found in import file.')
      process.exit(1)
    }

    let approved = 0
    let missing = 0

    refs.forEach(ref => {
      const row = db
        .prepare('SELECT id, isApproved FROM stories WHERE title = ? AND author = ?')
        .get(ref.title, ref.author) as { id: string; isApproved: number } | undefined

      if (!row) {
        console.warn(`⚠️  Not found in DB, cannot approve: "${ref.title}" (${ref.author})`)
        missing++
        return
      }

      if (row.isApproved) {
        console.log(`ℹ️  Already approved: "${ref.title}" (${ref.author})`)
        return
      }

      db.prepare('UPDATE stories SET isApproved = 1, updatedAt = ? WHERE id = ?').run(
        new Date().toISOString(),
        row.id
      )
      approved++
      console.log(`✅ Approved: "${ref.title}" (${ref.author})`)
    })

    console.log('\nSummary:')
    console.log(`  Approved stories: ${approved}`)
    console.log(`  Missing in DB:    ${missing}`)
  } catch (error) {
    console.error('❌ Error approving stories:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

