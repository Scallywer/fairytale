import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { splitIntoParagraphs } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface ImportedStoryRef {
  title: string
  author: string
}

function parseTitlesAndAuthors(filePath: string): ImportedStoryRef[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const stories: ImportedStoryRef[] = []

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

  console.log(`🔍 Validating stories from: ${importFilePath}\n`)

  try {
    const refs = parseTitlesAndAuthors(importFilePath)
    if (refs.length === 0) {
      console.log('❌ No Title/Author pairs parsed from the import file.')
      process.exit(1)
    }

    console.log(`Found ${refs.length} Title/Author pairs in import file.\n`)

    let missingCount = 0
    let badlyFormattedCount = 0

    refs.forEach(ref => {
      const row = db
        .prepare('SELECT id, body, imageUrl, isApproved FROM stories WHERE title = ? AND author = ?')
        .get(ref.title, ref.author) as
        | { id: string; body: string; imageUrl: string | null; isApproved: number }
        | undefined

      if (!row) {
        console.log(`❌ MISSING in DB: "${ref.title}" (${ref.author})`)
        missingCount++
        return
      }

      const paragraphs = splitIntoParagraphs(row.body || '')

      const okParagraphs = paragraphs.length > 0
      const hasImage = Boolean(row.imageUrl)

      console.log(`✅ "${ref.title}" (${ref.author})`)
      console.log(`   id:          ${row.id}`)
      console.log(`   approved:    ${row.isApproved ? 'YES' : 'NO'}`)
      console.log(`   paragraphs:  ${paragraphs.length}`)
      console.log(`   has image:   ${hasImage ? 'YES' : 'NO'}`)

      if (!okParagraphs) {
        badlyFormattedCount++
        console.log('   ⚠️  WARNING: No paragraphs detected by splitIntoParagraphs')
      }

      if (paragraphs.length > 0) {
        const preview =
          paragraphs[0].length > 80 ? paragraphs[0].slice(0, 77) + '...' : paragraphs[0]
        console.log(`   first para:  "${preview}"`)
      }

      console.log('')
    })

    console.log('Summary:')
    console.log(`  Missing stories in DB:  ${missingCount}`)
    console.log(`  With 0 paragraphs:      ${badlyFormattedCount}`)
  } catch (error) {
    console.error('❌ Error validating stories:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

