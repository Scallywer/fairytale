import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Normalize text for matching (remove accents, convert to lowercase, replace spaces/underscores)
function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/[š]/g, 's')
    .replace(/[ž]/g, 'z')
    .replace(/[đ]/g, 'd')
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
}

// Get all stories missing images
function getStoriesMissingImages() {
  const stories = db.prepare(`
    SELECT id, title, author 
    FROM stories 
    WHERE imageUrl IS NULL OR imageUrl = ''
    ORDER BY title
  `).all() as Array<{
    id: string
    title: string
    author: string
  }>
  return stories
}

// Get all images from import directory
function getImportImages() {
  const importDir = path.join(process.cwd(), 'import')
  if (!fs.existsSync(importDir)) {
    return []
  }
  
  return fs.readdirSync(importDir)
    .filter(file => file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
    .map(file => ({
      filename: file,
      normalized: normalizeForMatching(file.replace(/\.(png|jpg|jpeg)$/i, ''))
    }))
}

// Match images to stories
function matchImagesToStories(stories: Array<{id: string, title: string, author: string}>, images: Array<{filename: string, normalized: string}>) {
  const matches: Array<{story: {id: string, title: string, author: string}, image: string}> = []
  const unmatchedStories: Array<{id: string, title: string, author: string}> = []
  const usedImages = new Set<string>()
  
  for (const story of stories) {
    const storyNormalized = normalizeForMatching(story.title)
    let bestMatch: {filename: string, normalized: string} | null = null
    let bestScore = 0
    
    for (const image of images) {
      if (usedImages.has(image.filename)) continue
      
      // Check if image normalized name contains story normalized name or vice versa
      if (image.normalized.includes(storyNormalized) || storyNormalized.includes(image.normalized)) {
        const score = Math.min(image.normalized.length, storyNormalized.length)
        if (score > bestScore) {
          bestMatch = image
          bestScore = score
        }
      }
    }
    
    if (bestMatch) {
      matches.push({ story, image: bestMatch.filename })
      usedImages.add(bestMatch.filename)
    } else {
      unmatchedStories.push(story)
    }
  }
  
  return { matches, unmatchedStories }
}

function assignImages() {
  const importDir = path.join(process.cwd(), 'import')
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  
  // Ensure images directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  
  console.log('🔍 Finding stories missing images and matching with available images...\n')
  
  const stories = getStoriesMissingImages()
  const images = getImportImages()
  
  console.log(`Found ${stories.length} stories missing images`)
  console.log(`Found ${images.length} images in import directory\n`)
  
  if (stories.length === 0) {
    console.log('✅ All stories have images!')
    db.close()
    return
  }
  
  if (images.length === 0) {
    console.log('⚠️  No images found in import directory')
    db.close()
    return
  }
  
  const { matches, unmatchedStories } = matchImagesToStories(stories, images)
  
  console.log(`\n📊 Matching Results:`)
  console.log(`   ${matches.length} matches found`)
  console.log(`   ${unmatchedStories.length} stories without matching images\n`)
  
  if (matches.length === 0) {
    console.log('⚠️  No matches found. Please check image filenames match story titles.')
    console.log('\nStories missing images:')
    stories.forEach((story, i) => {
      console.log(`   ${i + 1}. "${story.title}" by ${story.author}`)
    })
    db.close()
    return
  }
  
  const now = new Date().toISOString()
  const updateStmt = db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?')
  
  let copied = 0
  let updated = 0
  let errors = 0
  
  console.log('📦 Copying images and updating database...\n')
  console.log('='.repeat(80))
  
  for (const { story, image } of matches) {
    const sourcePath = path.join(importDir, image)
    const destPath = path.join(imagesDir, image)
    const imageUrl = `/images/${image}`
    
    try {
      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  Image not found: ${image}`)
        errors++
        continue
      }
      
      // Copy file to public/images
      if (fs.existsSync(destPath)) {
        console.log(`⚠️  Image already exists, overwriting: ${image}`)
      }
      fs.copyFileSync(sourcePath, destPath)
      copied++
      
      // Update database
      const result = updateStmt.run(imageUrl, now, story.id)
      if (result.changes > 0) {
        console.log(`✓ "${story.title}" -> ${imageUrl}`)
        updated++
      } else {
        console.log(`⚠️  Failed to update story: "${story.title}"`)
        errors++
      }
    } catch (error) {
      console.error(`❌ Error processing ${image} for "${story.title}":`, error)
      errors++
    }
  }
  
  console.log('='.repeat(80))
  console.log(`\n✅ Summary:`)
  console.log(`   ${copied} images copied to public/images/`)
  console.log(`   ${updated} stories updated with image URLs`)
  if (errors > 0) {
    console.log(`   ${errors} errors encountered`)
  }
  
  if (unmatchedStories.length > 0) {
    console.log(`\n❌ Stories still missing images (${unmatchedStories.length}):`)
    unmatchedStories.forEach((story, i) => {
      console.log(`   ${i + 1}. "${story.title}" by ${story.author}`)
    })
  } else {
    console.log(`\n✅ All stories now have images!`)
  }
}

assignImages()
db.close()
