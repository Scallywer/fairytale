import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Map of story titles to image filenames
const imageMappings: Record<string, string> = {
  'Baš-Čelik': '/images/43_Bas-Celik.png',
  'Vila Planinka': '/images/44_VilaPlaninka.png',
  'Aždaha i selo': '/images/45_AzdahaISelo.png',
  'Vila i pastir': '/images/46_VilaIPastir.png',
  'Čarobna voda': '/images/47_CarobnaVoda.png'
}

function updateStoryImages() {
  const now = new Date().toISOString()
  const stmt = db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE title = ?')
  
  let updated = 0
  for (const [title, imageUrl] of Object.entries(imageMappings)) {
    const result = stmt.run(imageUrl, now, title)
    if (result.changes > 0) {
      console.log(`✓ Updated "${title}" with image: ${imageUrl}`)
      updated++
    } else {
      console.log(`⚠ Story not found: "${title}"`)
    }
  }
  
  console.log(`\n✅ Updated ${updated} story images.`)
}

console.log('Updating story images...\n')
updateStoryImages()

db.close()
