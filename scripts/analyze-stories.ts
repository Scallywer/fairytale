import Database from 'better-sqlite3'
import path from 'path'
import { calculateReadingTime } from '../lib/utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

interface Story {
  id: string
  title: string
  author: string
  body: string
  readingTime: number
}

const stories = db.prepare('SELECT id, title, author, body FROM stories WHERE isApproved = 1 ORDER BY title').all() as Story[]

console.log(`\nAnalyzing ${stories.length} stories:\n`)
console.log('='.repeat(80))

const analysis = stories.map(story => {
  const readingTime = calculateReadingTime(story.body)
  const wordCount = story.body.trim().split(/\s+/).filter(w => w.length > 0).length
  return {
    ...story,
    readingTime,
    wordCount
  }
})

// Sort by reading time
analysis.sort((a, b) => a.readingTime - b.readingTime)

analysis.forEach((story, index) => {
  console.log(`${index + 1}. "${story.title}"`)
  console.log(`   Autor: ${story.author}`)
  console.log(`   Vrijeme čitanja: ${story.readingTime} min`)
  console.log(`   Broj riječi: ${story.wordCount}`)
  console.log(`   ID: ${story.id}`)
  if (story.readingTime > 10) {
    console.log(`   ⚠️  PREKO 10 MINUTA!`)
  }
  console.log('-'.repeat(80))
})

const stats = {
  total: analysis.length,
  under5: analysis.filter(s => s.readingTime < 5).length,
  between5and10: analysis.filter(s => s.readingTime >= 5 && s.readingTime <= 10).length,
  over10: analysis.filter(s => s.readingTime > 10).length,
  average: Math.round(analysis.reduce((sum, s) => sum + s.readingTime, 0) / analysis.length),
  min: analysis[0].readingTime,
  max: analysis[analysis.length - 1].readingTime
}

console.log(`\n\nStatistika:`)
console.log(`  Ukupno priča: ${stats.total}`)
console.log(`  Do 5 min: ${stats.under5}`)
console.log(`  5-10 min: ${stats.between5and10}`)
console.log(`  Preko 10 min: ${stats.over10}`)
console.log(`  Prosjek: ${stats.average} min`)
console.log(`  Najkraća: ${stats.min} min`)
console.log(`  Najduža: ${stats.max} min`)

db.close()
