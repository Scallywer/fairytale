import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

const stories = db.prepare('SELECT id, title, author FROM stories WHERE isApproved = 1 ORDER BY title').all() as Array<{id: string, title: string, author: string}>

console.log('All stories (ID, Title, Author):\n')
stories.forEach((story, index) => {
  console.log(`${index + 1}. ${story.id} | "${story.title}" | ${story.author}`)
})

db.close()
