import Database from 'better-sqlite3'
import path from 'path'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface StoryUpdate {
  id: string
  body: string
}

function updateStories(updates: StoryUpdate[]) {
  const now = new Date().toISOString()
  const stmt = db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?')
  
  const transaction = db.transaction((updates: StoryUpdate[]) => {
    for (const update of updates) {
      stmt.run(update.body, now, update.id)
      const readingTime = calculateReadingTime(update.body)
      const wordCount = update.body.trim().split(/\s+/).filter(w => w.length > 0).length
      console.log(`✓ Updated ${update.id}: ${readingTime} min (${wordCount} words)`)
      
      if (readingTime > 10) {
        console.log(`  ⚠️  WARNING: Reading time exceeds 10 minutes!`)
      }
    }
  })
  
  transaction(updates)
  console.log(`\nUpdated ${updates.length} stories successfully.`)
}

// Get all stories
const stories = db.prepare('SELECT id, title, author, body FROM stories WHERE isApproved = 1 ORDER BY title').all() as Array<{id: string, title: string, author: string, body: string}>

console.log(`Found ${stories.length} stories to process.\n`)

// This will be populated with rewritten stories
const updates: StoryUpdate[] = []

// Example: You would add your rewritten stories here
// updates.push({
//   id: 'story-id',
//   body: 'rewritten story text...'
// })

if (updates.length > 0) {
  updateStories(updates)
} else {
  console.log('No updates to apply. Add story updates to the updates array.')
}

db.close()
