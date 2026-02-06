import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Get all approved stories
const stories = db.prepare('SELECT * FROM stories WHERE isApproved = 1 ORDER BY title').all() as Array<{
  id: string
  title: string
  author: string
  body: string
  imageUrl: string | null
  isApproved: number
  createdAt: string
  updatedAt: string
}>

// Create export content
let exportContent = `FAIRYTALE STORIES EXPORT\n`
exportContent += `Generated: ${new Date().toISOString()}\n`
exportContent += `Total Stories: ${stories.length}\n`
exportContent += `\n${'='.repeat(80)}\n\n`

stories.forEach((story, index) => {
  exportContent += `STORY ${index + 1}\n`
  exportContent += `${'='.repeat(80)}\n`
  exportContent += `ID: ${story.id}\n`
  exportContent += `Title: ${story.title}\n`
  exportContent += `Author: ${story.author}\n`
  exportContent += `Created: ${story.createdAt}\n`
  exportContent += `Updated: ${story.updatedAt}\n`
  if (story.imageUrl) {
    exportContent += `Image: ${story.imageUrl}\n`
  }
  exportContent += `\n${story.body}\n`
  exportContent += `\n${'='.repeat(80)}\n\n`
})

// Write to file
const outputPath = path.join(process.cwd(), 'stories-export.txt')
fs.writeFileSync(outputPath, exportContent, 'utf-8')

console.log(`✅ Exported ${stories.length} stories to: ${outputPath}`)

db.close()
