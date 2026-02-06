import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// List of stories that were updated (from the import)
const updatedStoryTitles = [
  'Šuma Striborova',
  'Regoč',
  'Kako je Potjeh tražio istinu',
  'Ribar Palunko i njegova žena',
  'Bratac Jaglenac i sestrica Rutvica',
  'Jagor',
  'Sunce djever i Neva Nevičica'
]

function approveAllStories() {
  const now = new Date().toISOString()
  
  // Get all stories
  const allStories = db.prepare('SELECT id, title, isApproved FROM stories').all() as Array<{
    id: string
    title: string
    isApproved: number
  }>
  
  console.log(`Found ${allStories.length} stories in database.\n`)
  
  let approvedCount = 0
  let updatedCount = 0
  
  const updateStmt = db.prepare('UPDATE stories SET isApproved = ?, updatedAt = ? WHERE id = ?')
  const updateTitleStmt = db.prepare('UPDATE stories SET title = ?, updatedAt = ? WHERE id = ?')
  
  for (const story of allStories) {
    const wasApproved = Boolean(story.isApproved)
    const isUpdated = updatedStoryTitles.includes(story.title)
    
    // Mark as approved
    if (!wasApproved) {
      updateStmt.run(1, now, story.id)
      approvedCount++
      console.log(`✓ Approved: "${story.title}"`)
    }
    
    // Add "(ažurirano)" to updated stories if not already present
    if (isUpdated && !story.title.includes('(ažurirano)')) {
      const newTitle = `${story.title} (ažurirano)`
      updateTitleStmt.run(newTitle, now, story.id)
      updatedCount++
      console.log(`🔄 Marked as updated: "${story.title}" → "${newTitle}"`)
    }
  }
  
  console.log(`\n✅ Summary:`)
  console.log(`   ${approvedCount} story/stories approved`)
  console.log(`   ${updatedCount} story/stories marked as updated`)
}

approveAllStories()
db.close()
