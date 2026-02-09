import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Get all stories
const allStories = db.prepare(`
  SELECT id, title, author, imageUrl, isApproved, createdAt, updatedAt
  FROM stories 
  ORDER BY title
`).all() as Array<{
  id: string
  title: string
  author: string
  imageUrl: string | null
  isApproved: number
  createdAt: string
  updatedAt: string
}>

console.log(`\n📚 Checking all stories in database (${allStories.length} total):\n`)
console.log('='.repeat(100))

// Categorize stories
const storiesWithImages = allStories.filter(s => s.imageUrl && s.imageUrl.trim() !== '')
const storiesWithoutImages = allStories.filter(s => !s.imageUrl || s.imageUrl.trim() === '')
const approvedStories = allStories.filter(s => s.isApproved === 1)
const unapprovedStories = allStories.filter(s => s.isApproved === 0)

// Stories with both image and approval
const completeStories = allStories.filter(s => 
  (s.imageUrl && s.imageUrl.trim() !== '') && s.isApproved === 1
)

// Stories missing something
const incompleteStories = allStories.filter(s => 
  (!s.imageUrl || s.imageUrl.trim() === '') || s.isApproved === 0
)

console.log('\n📊 Summary:')
console.log(`   Total stories: ${allStories.length}`)
console.log(`   ✅ Complete (has image + approved): ${completeStories.length}`)
console.log(`   ⚠️  Incomplete (missing image or not approved): ${incompleteStories.length}`)
console.log(`\n   Images:`)
console.log(`      ✅ With images: ${storiesWithImages.length}`)
console.log(`      ❌ Missing images: ${storiesWithoutImages.length}`)
console.log(`\n   Approval:`)
console.log(`      ✅ Approved: ${approvedStories.length}`)
console.log(`      ❌ Not approved: ${unapprovedStories.length}`)

if (incompleteStories.length > 0) {
  console.log('\n' + '='.repeat(100))
  console.log('\n⚠️  Stories needing attention:\n')
  
  incompleteStories.forEach((story, index) => {
    const hasImage = story.imageUrl && story.imageUrl.trim() !== '' ? '✅' : '❌'
    const isApproved = story.isApproved === 1 ? '✅' : '❌'
    const issues: string[] = []
    
    if (!story.imageUrl || story.imageUrl.trim() === '') {
      issues.push('missing image')
    }
    if (story.isApproved === 0) {
      issues.push('not approved')
    }
    
    console.log(`${index + 1}. ${hasImage} Image | ${isApproved} Approved | "${story.title}" by ${story.author}`)
    console.log(`   Issues: ${issues.join(', ')}`)
    console.log(`   ID: ${story.id}`)
    console.log('')
  })
}

// Detailed breakdown by category
if (storiesWithoutImages.length > 0) {
  console.log('\n' + '='.repeat(100))
  console.log('\n❌ Stories missing images:\n')
  storiesWithoutImages.forEach((story, index) => {
    const approvalStatus = story.isApproved === 1 ? '✅ Approved' : '❌ Not approved'
    console.log(`   ${index + 1}. "${story.title}" by ${story.author} (${approvalStatus})`)
  })
}

if (unapprovedStories.length > 0) {
  console.log('\n' + '='.repeat(100))
  console.log('\n❌ Stories not approved:\n')
  unapprovedStories.forEach((story, index) => {
    const imageStatus = story.imageUrl && story.imageUrl.trim() !== '' ? '✅ Has image' : '❌ Missing image'
    console.log(`   ${index + 1}. "${story.title}" by ${story.author} (${imageStatus})`)
  })
}

console.log('\n' + '='.repeat(100))
console.log('\n✅ Complete stories (ready for publication):\n')
if (completeStories.length === 0) {
  console.log('   None')
} else {
  completeStories.forEach((story, index) => {
    console.log(`   ${index + 1}. "${story.title}" by ${story.author}`)
  })
}

db.close()
