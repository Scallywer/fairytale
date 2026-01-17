import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

const storyId = process.argv[2] || '1d33844f-252c-43ab-ade2-a4c3003f6b7c' // Kralj Lavova as default

const story = db.prepare('SELECT id, title, author, body FROM stories WHERE id = ?').get(storyId) as any

if (story) {
  console.log(`\nTitle: ${story.title}`)
  console.log(`Author: ${story.author}`)
  console.log(`\nBody:\n${story.body}`)
  console.log(`\nWord count: ${story.body.trim().split(/\s+/).filter((w: string) => w.length > 0).length}`)
} else {
  console.log('Story not found')
}

db.close()
