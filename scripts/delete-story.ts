import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Get story title from command line argument
const searchTitle = process.argv[2]

if (!searchTitle) {
  console.error('❌ Please provide a story title to delete')
  console.log('\nUsage: npx tsx scripts/delete-story.ts "Story Title"')
  process.exit(1)
}

// Search for story by title (case-insensitive, partial match)
const stories = db.prepare(`
  SELECT id, title, author 
  FROM stories 
  WHERE LOWER(title) LIKE LOWER(?)
  ORDER BY title
`).all(`%${searchTitle}%`) as Array<{
  id: string
  title: string
  author: string
}>

if (stories.length === 0) {
  console.log(`❌ No story found matching "${searchTitle}"`)
  process.exit(1)
}

if (stories.length > 1) {
  console.log(`⚠️  Found ${stories.length} stories matching "${searchTitle}":\n`)
  stories.forEach((story, index) => {
    console.log(`${index + 1}. "${story.title}" by ${story.author} (ID: ${story.id})`)
  })
  console.log('\n❌ Please be more specific with the title')
  process.exit(1)
}

const story = stories[0]
console.log(`\n📖 Found story:`)
console.log(`   Title: "${story.title}"`)
console.log(`   Author: ${story.author}`)
console.log(`   ID: ${story.id}`)

// Delete the story
db.pragma('foreign_keys = OFF')

try {
  // Manually delete related records first
  const ratingsDeleted = db.prepare('DELETE FROM ratings WHERE storyId = ?').run(story.id).changes
  const commentsDeleted = db.prepare('DELETE FROM comments WHERE storyId = ?').run(story.id).changes
  const storyDeleted = db.prepare('DELETE FROM stories WHERE id = ?').run(story.id).changes
  
  console.log(`\n✅ Story deleted successfully!`)
  console.log(`   - Story record deleted`)
  console.log(`   - ${ratingsDeleted} rating(s) deleted`)
  console.log(`   - ${commentsDeleted} comment(s) deleted`)
} finally {
  db.pragma('foreign_keys = ON')
}

db.close()
