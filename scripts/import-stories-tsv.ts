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

function parseTSV(filePath: string): StoryImport[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const allLines = content.split('\n')
  
  if (allLines.length < 2) {
    throw new Error('TSV file must have at least a header and one data row')
  }
  
  // Parse header
  const header = allLines[0].split('\t').map(h => h.trim())
  const titleIdx = header.indexOf('title')
  const authorIdx = header.indexOf('author')
  const bodyIdx = header.indexOf('body')
  const imageIdx = header.indexOf('imageUrl')
  const approvedIdx = header.indexOf('isApproved')
  
  if (titleIdx === -1 || authorIdx === -1 || bodyIdx === -1) {
    throw new Error('TSV file must have title, author, and body columns')
  }
  
  const stories: StoryImport[] = []
  let i = 1 // Start after header
  
  while (i < allLines.length) {
    const line = allLines[i]
    if (!line.trim()) {
      i++
      continue
    }
    
    // Check if this line starts a new story (has at least 2 tabs, indicating title, author, and body start)
    const tabCount = (line.match(/\t/g) || []).length
    if (tabCount >= 2) {
      // Split by tabs, but be careful with quoted body
      const parts: string[] = []
      let currentPart = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        const nextChar = line[j + 1]
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            currentPart += '"'
            j++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === '\t' && !inQuotes) {
          parts.push(currentPart)
          currentPart = ''
        } else {
          currentPart += char
        }
      }
      parts.push(currentPart) // Add last part
      
      if (parts.length >= 3) {
        const title = parts[titleIdx]?.trim() || ''
        const author = parts[authorIdx]?.trim() || ''
        let body = parts[bodyIdx] || ''
        
        // Remove quotes from body start
        if (body.startsWith('"')) {
          body = body.substring(1)
        }
        
        // Continue reading body lines until we find the closing quote or next story
        i++
        while (i < allLines.length) {
          const nextLine = allLines[i]
          
          // Check if next line starts a new story (has tabs and doesn't start with quote/whitespace)
          if (nextLine.includes('\t') && nextLine.trim() && 
              (nextLine.split('\t').length >= 3) &&
              !nextLine.trim().startsWith('"') &&
              !nextLine.match(/^\s/)) {
            // This is next story, close current body
            if (body.endsWith('"')) {
              body = body.substring(0, body.length - 1).trim()
            }
            break
          }
          
          // Check if this line ends the body (ends with quote)
          if (nextLine.trim().endsWith('"')) {
            body += '\n' + nextLine
            // Remove closing quote
            if (body.endsWith('"')) {
              body = body.substring(0, body.length - 1).trim()
            }
            i++
            break
          }
          
          // This is continuation of body
          body += '\n' + nextLine
          i++
        }
        
        body = body.trim()
        
        // Extract optional fields from first line
        const imageUrl = imageIdx >= 0 && parts[imageIdx] ? 
          parts[imageIdx].replace(/^"|"$/g, '').trim() || undefined : undefined
        const isApproved = approvedIdx >= 0 && parts[approvedIdx] ? 
          parts[approvedIdx].toLowerCase() === 'true' : false
        
        if (title && author && body) {
          stories.push({
            title,
            author,
            body,
            imageUrl,
            isApproved
          })
        }
      } else {
        i++
      }
    } else {
      i++
    }
  }
  
  return stories
}

function findStoryByTitle(title: string): { id: string; title: string; author: string } | null {
  const story = db.prepare('SELECT id, title, author FROM stories WHERE title = ?').get(title) as any
  return story || null
}

function updateStoryBody(id: string, body: string) {
  const now = new Date().toISOString()
  db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?').run(body, now, id)
}

function insertStory(story: StoryImport) {
  const id = randomUUID()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO stories (id, title, author, body, imageUrl, isApproved, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    story.title,
    story.author,
    story.body,
    story.imageUrl || null,
    story.isApproved ? 1 : 0,
    now,
    now
  )
  return id
}

function importStories(stories: StoryImport[], dryRun: boolean = false) {
  if (stories.length === 0) {
    console.log('❌ No stories found to import.')
    return { updated: 0, inserted: 0, newStories: [] as string[] }
  }
  
  const results = {
    updated: 0,
    inserted: 0,
    newStories: [] as string[]
  }
  
  console.log(`\n${dryRun ? '🔍 DRY RUN - ' : ''}Processing ${stories.length} story/stories:\n`)
  console.log('='.repeat(80))
  
  for (const story of stories) {
    const existing = findStoryByTitle(story.title)
    const readingTime = calculateReadingTime(story.body)
    const wordCount = story.body.trim().split(/\s+/).filter(w => w.length > 0).length
    
    if (existing) {
      if (dryRun) {
        console.log(`🔄 [UPDATE] "${story.title}" by ${story.author}`)
        console.log(`   Existing ID: ${existing.id}`)
        console.log(`   Body will be replaced (${readingTime} min, ${wordCount} words)`)
      } else {
        updateStoryBody(existing.id, story.body)
        console.log(`🔄 Updated "${story.title}" by ${story.author}: ${readingTime} min (${wordCount} words)`)
      }
      results.updated++
    } else {
      if (dryRun) {
        console.log(`➕ [NEW] "${story.title}" by ${story.author}`)
        console.log(`   Will be inserted (${readingTime} min, ${wordCount} words)`)
        if (!story.imageUrl) {
          console.log(`   ⚠️  No image URL - will need image generation`)
        }
      } else {
        insertStory(story)
        const status = story.isApproved ? '✓' : '○'
        console.log(`${status} Inserted "${story.title}" by ${story.author}: ${readingTime} min (${wordCount} words)`)
      }
      results.inserted++
      results.newStories.push(story.title)
    }
    
    if (readingTime > 10) {
      console.log(`  ⚠️  WARNING: Reading time exceeds 10 minutes!`)
    }
    console.log('')
  }
  
  if (dryRun) {
    console.log('='.repeat(80))
    console.log(`\n📊 Summary:`)
    console.log(`   ${results.updated} story/stories will be UPDATED`)
    console.log(`   ${results.inserted} story/stories will be INSERTED (new)`)
  } else {
    console.log('='.repeat(80))
    console.log(`\n✅ Import complete:`)
    console.log(`   ${results.updated} story/stories updated`)
    console.log(`   ${results.inserted} story/stories inserted`)
  }
  
  return results
}

// Main execution
const importFilePath = process.argv[2] || path.join(process.cwd(), 'stories-import (2).tsv')
const dryRun = process.argv.includes('--dry-run') || process.argv.includes('-d')

if (!fs.existsSync(importFilePath)) {
  console.error(`❌ Import file not found: ${importFilePath}`)
  console.log(`\nUsage: npx tsx scripts/import-stories-tsv.ts [path-to-tsv-file] [--dry-run]`)
  process.exit(1)
}

console.log(`📖 Reading TSV file: ${importFilePath}`)

try {
  const stories = parseTSV(importFilePath)
  console.log(`Found ${stories.length} story/stories in TSV file.`)
  
  const results = importStories(stories, dryRun)
  
  if (results.newStories.length > 0) {
    console.log(`\n📝 New stories that need images:`)
    results.newStories.forEach((title, index) => {
      console.log(`   ${index + 1}. ${title}`)
    })
  }
  
  if (dryRun) {
    console.log(`\n💡 To actually import, run without --dry-run flag`)
  }
} catch (error) {
  console.error('❌ Error importing stories:', error)
  process.exit(1)
} finally {
  db.close()
}
