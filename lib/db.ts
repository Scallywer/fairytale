import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')

// #region agent log
const dbExists = fs.existsSync(dbPath)
console.log(`[DB] Database path: ${dbPath}`)
console.log(`[DB] Process CWD: ${process.cwd()}`)
console.log(`[DB] Database exists: ${dbExists}`)
fetch('http://127.0.0.1:7242/ingest/69d54419-74ee-4c4b-a6d2-9abaa8d412fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db.ts:6',message:'Database path resolved',data:{dbPath,processCwd:process.cwd(),dbExists},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
// #endregion

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Create database connection
const db = new Database(dbPath)

// #region agent log
fetch('http://127.0.0.1:7242/ingest/69d54419-74ee-4c4b-a6d2-9abaa8d412fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db.ts:16',message:'Database connection created',data:{dbPath,dataDirExists:fs.existsSync(dataDir)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
// #endregion

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    country TEXT NOT NULL,
    imageUrl TEXT,
    isApproved INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id TEXT PRIMARY KEY,
    storyId TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    userId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(storyId, userId),
    FOREIGN KEY (storyId) REFERENCES stories(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_ratings_storyId ON ratings(storyId);
  CREATE INDEX IF NOT EXISTS idx_ratings_userId ON ratings(userId);
`)

export interface Story {
  id: string
  title: string
  author: string
  body: string
  country: string
  imageUrl?: string
  isApproved: boolean
  averageRating?: number
  ratingCount?: number
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  storyId: string
  rating: number
  userId: string
  createdAt: string
}

export const dbHelpers = {
  // Get average rating for a story
  getAverageRating(storyId: string): { averageRating: number; ratingCount: number } | null {
    const result = db.prepare(`
      SELECT 
        AVG(rating) as averageRating,
        COUNT(*) as ratingCount
      FROM ratings
      WHERE storyId = ?
    `).get(storyId) as any
    
    if (!result || result.ratingCount === 0) {
      return null
    }
    
    return {
      averageRating: Math.round((result.averageRating as number) * 10) / 10,
      ratingCount: result.ratingCount
    }
  },

  // Submit a rating (upsert - update if exists, insert if not)
  submitRating(storyId: string, userId: string, rating: number): void {
    const ratingId = randomUUID()
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO ratings (id, storyId, userId, rating, createdAt)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(storyId, userId) DO UPDATE SET
        rating = excluded.rating,
        createdAt = excluded.createdAt
    `).run(ratingId, storyId, userId, rating, now)
  },

  // Get all approved stories with average ratings
  getApprovedStories(): Story[] {
    // #region agent log
    const totalStories = db.prepare('SELECT COUNT(*) as count FROM stories').get() as any
    const approvedCount = db.prepare('SELECT COUNT(*) as count FROM stories WHERE isApproved = 1').get() as any
    const allStoriesSample = db.prepare('SELECT id, title, isApproved FROM stories LIMIT 5').all() as any[]
    console.log(`[DB] getApprovedStories: total=${totalStories?.count || 0}, approved=${approvedCount?.count || 0}`)
    console.log(`[DB] Sample stories:`, allStoriesSample.map(s => `${s.title} (approved: ${s.isApproved})`))
    fetch('http://127.0.0.1:7242/ingest/69d54419-74ee-4c4b-a6d2-9abaa8d412fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db.ts:103',message:'getApprovedStories called',data:{totalStories:totalStories?.count || 0,approvedCount:approvedCount?.count || 0,sampleStories:allStoriesSample},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    
    const stories = db.prepare('SELECT * FROM stories WHERE isApproved = 1 ORDER BY createdAt DESC').all() as any[]
    
    // #region agent log
    console.log(`[DB] Approved stories returned: ${stories.length}`)
    fetch('http://127.0.0.1:7242/ingest/69d54419-74ee-4c4b-a6d2-9abaa8d412fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/db.ts:112',message:'Approved stories query result',data:{approvedStoriesCount:stories.length,stories:stories.map(s=>({id:s.id,title:s.title,isApproved:s.isApproved}))},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    
    return stories.map(story => {
      const ratingInfo = this.getAverageRating(story.id)
      return {
        ...story,
        isApproved: Boolean(story.isApproved),
        averageRating: ratingInfo?.averageRating,
        ratingCount: ratingInfo?.ratingCount || 0
      }
    })
  },

  // Get all stories (for admin)
  getAllStories(): Story[] {
    const stories = db.prepare('SELECT * FROM stories ORDER BY createdAt DESC').all() as any[]
    return stories.map(story => ({
      ...story,
      isApproved: Boolean(story.isApproved)
    }))
  },

  // Get story by ID with average rating
  getStoryById(id: string): Story | null {
    const story = db.prepare('SELECT * FROM stories WHERE id = ?').get(id) as any
    if (!story) return null
    
    const ratingInfo = this.getAverageRating(id)
    return {
      ...story,
      isApproved: Boolean(story.isApproved),
      averageRating: ratingInfo?.averageRating,
      ratingCount: ratingInfo?.ratingCount || 0
    }
  },

  // Create a new story
  createStory(data: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Story {
    const id = randomUUID()
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO stories (id, title, author, body, country, imageUrl, isApproved, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.author,
      data.body,
      data.country,
      data.imageUrl || null,
      data.isApproved ? 1 : 0,
      now,
      now
    )

    return this.getStoryById(id)!
  },

  // Toggle story approval
  toggleApproval(id: string): Story {
    const story = this.getStoryById(id)
    if (!story) throw new Error('Story not found')
    
    const newApproved = !story.isApproved
    db.prepare('UPDATE stories SET isApproved = ?, updatedAt = ? WHERE id = ?').run(
      newApproved ? 1 : 0,
      new Date().toISOString(),
      id
    )

    return this.getStoryById(id)!
  }
}

export default db
