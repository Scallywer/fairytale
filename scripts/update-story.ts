import Database from 'better-sqlite3'
import path from 'path'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface UpdateStoryParams {
  id: string
  body: string
}

function updateStory({ id, body }: UpdateStoryParams) {
  const now = new Date().toISOString()
  db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?').run(body, now, id)
  
  const readingTime = calculateReadingTime(body)
  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length
  
  console.log(`Updated story ${id}`)
  console.log(`  Reading time: ${readingTime} min`)
  console.log(`  Word count: ${wordCount}`)
  
  if (readingTime > 10) {
    console.log(`  ⚠️  WARNING: Reading time exceeds 10 minutes!`)
  }
}

// Export for use in other scripts
if (require.main === module) {
  const storyId = process.argv[2]
  const newBody = process.argv[3]
  
  if (!storyId || !newBody) {
    console.log('Usage: npx tsx scripts/update-story.ts <storyId> "<newBody>"')
    process.exit(1)
  }
  
  updateStory({ id: storyId, body: newBody })
  db.close()
}

export { updateStory }
