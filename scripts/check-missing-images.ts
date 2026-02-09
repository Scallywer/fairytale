import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

// Get stories created today
const storiesToday = db.prepare(`
  SELECT title, author, imageUrl, createdAt 
  FROM stories 
  WHERE DATE(createdAt) = DATE(?)
  ORDER BY title
`).all(today) as Array<{
  title: string
  author: string
  imageUrl: string | null
  createdAt: string
}>

console.log(`\n📚 Stories imported today (${storiesToday.length} total):\n`)
console.log('='.repeat(80))

storiesToday.forEach((story, index) => {
  const hasImage = story.imageUrl ? '✅' : '❌'
  console.log(`${index + 1}. ${hasImage} "${story.title}" by ${story.author}`)
  if (!story.imageUrl) {
    console.log(`   ⚠️  Missing image`)
  }
})

// Get stories missing images
const missingImages = storiesToday.filter(s => !s.imageUrl)

console.log('\n' + '='.repeat(80))
console.log(`\n📊 Summary:`)
console.log(`   Total imported today: ${storiesToday.length}`)
console.log(`   Missing images: ${missingImages.length}`)

if (missingImages.length > 0) {
  console.log(`\n❌ Stories missing images:`)
  missingImages.forEach((story, index) => {
    console.log(`   ${index + 1}. "${story.title}" by ${story.author}`)
  })
}

db.close()
