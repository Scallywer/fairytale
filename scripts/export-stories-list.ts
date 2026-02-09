import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Get all stories (both approved and unapproved)
const stories = db.prepare('SELECT title, author FROM stories ORDER BY title').all() as Array<{
  title: string
  author: string
}>

// Create export content in simple list format
let exportContent = `EXISTING STORIES IN DATABASE\n`
exportContent += `Generated: ${new Date().toISOString()}\n`
exportContent += `Total Stories: ${stories.length}\n`
exportContent += `\n${'='.repeat(80)}\n\n`
exportContent += `Use this list to check for duplicates before creating new stories.\n`
exportContent += `Format: Title | Author\n\n`
exportContent += `${'='.repeat(80)}\n\n`

stories.forEach((story, index) => {
  exportContent += `${index + 1}. ${story.title} | ${story.author}\n`
})

// Write to file in import folder
const importDir = path.join(process.cwd(), 'import')
if (!fs.existsSync(importDir)) {
  fs.mkdirSync(importDir, { recursive: true })
}

const outputPath = path.join(importDir, 'existing-stories-list.txt')
fs.writeFileSync(outputPath, exportContent, 'utf-8')

console.log(`✅ Exported ${stories.length} stories to: ${outputPath}`)
console.log(`\nUse this file to check for duplicates before creating new stories.`)

db.close()
