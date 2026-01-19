import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { calculateReadingTime } from './utils'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Create database connection
const db = new Database(dbPath)

// Enable foreign keys (required for CASCADE deletes)
db.pragma('foreign_keys = ON')

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
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

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    storyId TEXT NOT NULL,
    authorName TEXT NOT NULL,
    content TEXT NOT NULL,
    isApproved INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (storyId) REFERENCES stories(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_comments_storyId ON comments(storyId);
  CREATE INDEX IF NOT EXISTS idx_comments_createdAt ON comments(createdAt);
`)

export interface Story {
  id: string
  title: string
  author: string
  body: string
  imageUrl?: string
  isApproved: boolean
  averageRating?: number
  ratingCount?: number
  readingTime?: number
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

export interface Comment {
  id: string
  storyId: string
  authorName: string
  content: string
  isApproved: boolean
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
    const stories = db.prepare('SELECT * FROM stories WHERE isApproved = 1 ORDER BY createdAt DESC').all() as any[]
    
    return stories.map(story => {
      const ratingInfo = this.getAverageRating(story.id)
      return {
        ...story,
        isApproved: Boolean(story.isApproved),
        averageRating: ratingInfo?.averageRating,
        ratingCount: ratingInfo?.ratingCount || 0,
        readingTime: calculateReadingTime(story.body)
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
    if (!story) {
      return null
    }
    
    const ratingInfo = this.getAverageRating(id)
    return {
      ...story,
      isApproved: Boolean(story.isApproved),
      averageRating: ratingInfo?.averageRating,
      ratingCount: ratingInfo?.ratingCount || 0,
      readingTime: calculateReadingTime(story.body)
    }
  },

  // Create a new story
  createStory(data: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Story {
    const id = randomUUID()
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO stories (id, title, author, body, imageUrl, isApproved, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.author,
      data.body,
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
  },

  // Delete a story (ratings and comments will be cascade deleted)
  deleteStory(id: string): void {
    const story = this.getStoryById(id)
    if (!story) throw new Error('Story not found')
    
    // Temporarily disable foreign key checks to handle any mismatch issues
    db.pragma('foreign_keys = OFF')
    
    try {
      // Manually delete related records first
      db.prepare('DELETE FROM ratings WHERE storyId = ?').run(id)
      db.prepare('DELETE FROM comments WHERE storyId = ?').run(id)
      db.prepare('DELETE FROM stories WHERE id = ?').run(id)
    } finally {
      // Re-enable foreign keys
      db.pragma('foreign_keys = ON')
    }
  },

  // Get comments for a story
  getCommentsByStoryId(storyId: string): Comment[] {
    const comments = db.prepare(`
      SELECT * FROM comments 
      WHERE storyId = ? AND isApproved = 1 
      ORDER BY createdAt DESC
    `).all(storyId) as any[]
    
    return comments.map(comment => ({
      ...comment,
      isApproved: Boolean(comment.isApproved)
    }))
  },

  // Create a new comment
  createComment(data: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>): Comment {
    const id = randomUUID()
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO comments (id, storyId, authorName, content, isApproved, createdAt)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run(
      id,
      data.storyId,
      data.authorName || 'Anonimno',
      data.content,
      now
    )

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as any
    return {
      ...comment,
      isApproved: Boolean(comment.isApproved)
    }
  },

  // Get comment count for rate limiting (comments in last hour from same IP/story)
  getRecentCommentCount(storyId: string, timeWindowMinutes: number = 60): number {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000).toISOString()
    const result = db.prepare(`
      SELECT COUNT(*) as count 
      FROM comments 
      WHERE storyId = ? AND createdAt > ?
    `).get(storyId, cutoffTime) as any
    
    return result?.count || 0
  }
}

export default db
