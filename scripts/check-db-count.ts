import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

const totalCount = db.prepare('SELECT COUNT(*) as count FROM stories').get() as any
const approvedCount = db.prepare('SELECT COUNT(*) as count FROM stories WHERE isApproved = 1').get() as any

console.log(`Total stories in database: ${totalCount.count}`)
console.log(`Approved stories in database: ${approvedCount.count}`)

const last5Stories = db.prepare('SELECT id, title, isApproved FROM stories ORDER BY createdAt DESC LIMIT 5').all() as any[]
console.log('\nLast 5 stories (by createdAt):')
last5Stories.forEach((story, index) => {
  console.log(`${index + 1}. ID: ${story.id}, Title: ${story.title}, Approved: ${story.isApproved}`)
})

db.close()
