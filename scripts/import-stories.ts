import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface StoryImport {
  title: string
  author: string
  body: string
  imageUrl?: string
  isApproved: boolean
}

function parseImportFile(filePath: string): StoryImport[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const stories: StoryImport[] = []
  
  // Split by delimiter
  const storySections = content.split(/={80,}/).filter(section => section.trim())
  
  for (const section of storySections) {
    // Skip header/template instructions
    if (section.includes('FAIRYTALE STORIES IMPORT') || 
        section.includes('Instructions:') ||
        section.trim().length === 0) {
      continue
    }
    
    const lines = section.split('\n')
    let currentStory: Partial<StoryImport> = {
      isApproved: false // default
    }
    let bodyStartIndex = -1
    let inBody = false
    
    // Find where body starts
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase().startsWith('body:')) {
        bodyStartIndex = i + 1
        inBody = true
        break
      }
    }
    
    // Parse metadata (lines before body)
    for (let i = 0; i < (bodyStartIndex > 0 ? bodyStartIndex - 1 : lines.length); i++) {
      const line = lines[i].trim()
      if (!line || line.startsWith('STORY')) continue
      
      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) continue
      
      const key = line.substring(0, colonIndex).trim().toLowerCase()
      const value = line.substring(colonIndex + 1).trim()
      
      switch (key) {
        case 'title':
          currentStory.title = value
          break
        case 'author':
          currentStory.author = value
          break
        case 'image':
          currentStory.imageUrl = value || undefined
          break
        case 'isapproved':
          currentStory.isApproved = value.toLowerCase() === 'true'
          break
      }
    }
    
    // Parse body (everything after "Body:")
    if (bodyStartIndex > 0) {
      const bodyLines = lines.slice(bodyStartIndex)
      currentStory.body = bodyLines.join('\n').trim()
    }
    
    // Validate required fields
    if (!currentStory.title || !currentStory.author || !currentStory.body) {
      console.warn(`⚠️  Skipping incomplete story: ${currentStory.title || 'Untitled'}`)
      continue
    }
    
    stories.push({
      title: currentStory.title,
      author: currentStory.author,
      body: currentStory.body,
      imageUrl: currentStory.imageUrl,
      isApproved: currentStory.isApproved ?? false
    })
  }
  
  return stories
}

function importStories(stories: StoryImport[]) {
  if (stories.length === 0) {
    console.log('❌ No stories found to import.')
    return
  }
  
  const now = new Date().toISOString()
  const stmt = db.prepare(`
    INSERT INTO stories (id, title, author, body, imageUrl, isApproved, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  const transaction = db.transaction((stories: StoryImport[]) => {
    for (const story of stories) {
      const id = randomUUID()
      stmt.run(
        id,
        story.title,
        story.author,
        story.body,
        story.imageUrl || null,
        story.isApproved ? 1 : 0,
        now,
        now
      )
      const readingTime = calculateReadingTime(story.body)
      const wordCount = story.body.trim().split(/\s+/).filter(w => w.length > 0).length
      const status = story.isApproved ? '✓' : '○'
      console.log(`${status} "${story.title}" by ${story.author}: ${readingTime} min (${wordCount} words)`)
      
      if (readingTime > 10) {
        console.log(`  ⚠️  WARNING: Reading time exceeds 10 minutes!`)
      }
    }
  })
  
  transaction(stories)
  console.log(`\n✅ Imported ${stories.length} story/stories successfully.`)
}

// Main execution
const importFilePath = process.argv[2] || path.join(process.cwd(), 'stories-import.txt')

if (!fs.existsSync(importFilePath)) {
  console.error(`❌ Import file not found: ${importFilePath}`)
  console.log(`\nUsage: npx tsx scripts/import-stories.ts [path-to-import-file]`)
  console.log(`\nIf no file is specified, it will look for 'stories-import.txt' in the project root.`)
  console.log(`\nSee 'stories-import-template.txt' for the expected format.`)
  process.exit(1)
}

console.log(`📖 Reading import file: ${importFilePath}\n`)

try {
  const stories = parseImportFile(importFilePath)
  console.log(`Found ${stories.length} story/stories to import.\n`)
  
  if (stories.length > 0) {
    importStories(stories)
  } else {
    console.log('❌ No valid stories found in the import file.')
  }
} catch (error) {
  console.error('❌ Error importing stories:', error)
  process.exit(1)
} finally {
  db.close()
}
