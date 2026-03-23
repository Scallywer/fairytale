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

// Set busy timeout first to handle concurrent access during build/test (multiple workers)
db.pragma('busy_timeout = 5000')

// Enable foreign keys (required for CASCADE deletes)
db.pragma('foreign_keys = ON')

// Enable WAL mode for better concurrent read performance
try {
  db.pragma('journal_mode = WAL')
} catch {
  // WAL may fail if another process holds a lock; fall back to default journal mode
}

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    imageUrl TEXT,
    isApproved INTEGER NOT NULL DEFAULT 0,
    readCount INTEGER NOT NULL DEFAULT 0,
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
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_comments_storyId ON comments(storyId);
  CREATE INDEX IF NOT EXISTS idx_comments_createdAt ON comments(createdAt);

  CREATE INDEX IF NOT EXISTS idx_stories_approved_created ON stories(isApproved, createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_comments_story_approved ON comments(storyId, isApproved);
`)

try {
  db.exec('ALTER TABLE stories ADD COLUMN readCount INTEGER NOT NULL DEFAULT 0')
} catch {
  // Column already exists
}

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
  readCount?: number
  /** Approved comments only; set when loaded from list/detail helpers */
  commentCount?: number
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

type RatingAggregate = { averageRating: number; ratingCount: number }
type StoryRow = Omit<Story, 'isApproved' | 'averageRating' | 'ratingCount' | 'readingTime'> & { isApproved: number }
type CommentRow = Omit<Comment, 'isApproved'> & { isApproved: number }

export const dbHelpers = {
  // Get average rating for a story
  getAverageRating(storyId: string): { averageRating: number; ratingCount: number } | null {
    const result = db.prepare(`
      SELECT 
        AVG(rating) as averageRating,
        COUNT(*) as ratingCount
      FROM ratings
      WHERE storyId = ?
    `).get(storyId) as RatingAggregate | undefined

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
    
    // Verify story exists first
    const story = this.getStoryById(storyId)
    if (!story) {
      throw new Error('Story not found')
    }
    
    // Temporarily disable foreign keys to avoid mismatch errors
    db.pragma('foreign_keys = OFF')
    
    try {
      db.prepare(`
        INSERT INTO ratings (id, storyId, userId, rating, createdAt)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(storyId, userId) DO UPDATE SET
          rating = excluded.rating,
          createdAt = excluded.createdAt
      `).run(ratingId, storyId, userId, rating, now)
    } finally {
      // Re-enable foreign keys
      db.pragma('foreign_keys = ON')
    }
  },

  getApprovedStoryIds(): string[] {
    const rows = db.prepare('SELECT id FROM stories WHERE isApproved = 1 ORDER BY createdAt DESC').all() as { id: string }[]
    return rows.map(r => r.id)
  },

  // Get all approved stories with average ratings
  getApprovedStories(): Story[] {
    return this.getApprovedStoriesPage(undefined, undefined)
  },

  getApprovedStoriesPage(limit?: number, offset?: number): Story[] {
    const sql = `
      SELECT
        stories.*,
        COALESCE(comment_stats.cnt, 0) AS commentCount,
        COALESCE(rating_stats.avg_rating, 0) AS avgRating,
        COALESCE(rating_stats.rating_count, 0) AS ratingCount
      FROM stories
      LEFT JOIN (
        SELECT storyId, COUNT(*) AS cnt
        FROM comments
        WHERE isApproved = 1
        GROUP BY storyId
      ) AS comment_stats ON comment_stats.storyId = stories.id
      LEFT JOIN (
        SELECT storyId, AVG(rating) AS avg_rating, COUNT(*) AS rating_count
        FROM ratings
        GROUP BY storyId
      ) AS rating_stats ON rating_stats.storyId = stories.id
      WHERE stories.isApproved = 1
      ORDER BY stories.createdAt DESC
    `
    const stmt =
      limit != null && offset != null
        ? db.prepare(`${sql} LIMIT ? OFFSET ?`)
        : db.prepare(sql)
    const stories = (
      limit != null && offset != null
        ? stmt.all(limit, offset)
        : stmt.all()
    ) as (StoryRow & { commentCount: number; avgRating: number; ratingCount: number })[]
    return stories.map((story) => {
      const { commentCount: approvedCommentCount, avgRating, ratingCount, ...rest } = story
      return {
        ...rest,
        isApproved: Boolean(story.isApproved),
        commentCount: Number(approvedCommentCount) || 0,
        averageRating: avgRating ? Math.round(avgRating * 10) / 10 : undefined,
        ratingCount: Number(ratingCount) || 0,
        readingTime: calculateReadingTime(story.body),
      }
    })
  },

  // Get all stories (for admin)
  getAllStories(): Story[] {
    const stories = db.prepare('SELECT * FROM stories ORDER BY createdAt DESC').all() as StoryRow[]
    return stories.map(story => ({
      ...story,
      isApproved: Boolean(story.isApproved)
    }))
  },

  // Get story by ID with average rating, comment count in a single query
  getStoryById(id: string): Story | null {
    const row = db.prepare(`
      SELECT
        stories.*,
        COALESCE(rs.avg_rating, 0) AS avgRating,
        COALESCE(rs.rating_count, 0) AS ratingCount,
        COALESCE(cs.cnt, 0) AS commentCount
      FROM stories
      LEFT JOIN (
        SELECT storyId, AVG(rating) AS avg_rating, COUNT(*) AS rating_count
        FROM ratings WHERE storyId = ?
      ) AS rs ON rs.storyId = stories.id
      LEFT JOIN (
        SELECT storyId, COUNT(*) AS cnt
        FROM comments WHERE storyId = ? AND isApproved = 1
      ) AS cs ON cs.storyId = stories.id
      WHERE stories.id = ?
    `).get(id, id, id) as (StoryRow & { avgRating: number; ratingCount: number; commentCount: number }) | undefined
    if (!row) {
      return null
    }

    const { avgRating, ratingCount, commentCount, ...rest } = row
    return {
      ...rest,
      isApproved: Boolean(row.isApproved),
      averageRating: avgRating ? Math.round(avgRating * 10) / 10 : undefined,
      ratingCount: Number(ratingCount) || 0,
      readingTime: calculateReadingTime(row.body),
      commentCount: Number(commentCount) || 0,
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
    `).all(storyId) as CommentRow[]
    
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
      VALUES (?, ?, ?, ?, 0, ?)
    `).run(
      id,
      data.storyId,
      data.authorName || 'Anonimno',
      data.content,
      now
    )

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as CommentRow | undefined
    if (!comment) throw new Error('Comment not found after insert')
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
    `).get(storyId, cutoffTime) as { count: number } | undefined

    return result?.count ?? 0
  },

  incrementReadCount(storyId: string): void {
    db.prepare('UPDATE stories SET readCount = readCount + 1 WHERE id = ?').run(storyId)
  },

  // Get all pending (unapproved) comments for admin moderation
  getPendingComments(): Comment[] {
    const comments = db.prepare(`
      SELECT comments.*, stories.title AS storyTitle
      FROM comments
      LEFT JOIN stories ON stories.id = comments.storyId
      WHERE comments.isApproved = 0
      ORDER BY comments.createdAt DESC
    `).all() as (CommentRow & { storyTitle?: string })[]
    return comments.map(c => ({
      ...c,
      isApproved: Boolean(c.isApproved),
    }))
  },

  // Approve a comment
  approveComment(id: string): void {
    const result = db.prepare('UPDATE comments SET isApproved = 1 WHERE id = ?').run(id)
    if (result.changes === 0) throw new Error('Comment not found')
  },

  // Delete a comment
  deleteComment(id: string): void {
    const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id)
    if (result.changes === 0) throw new Error('Comment not found')
  },

  // Get related stories efficiently (avoids loading all stories)
  getRelatedStories(storyId: string, author: string, limit: number = 3): { id: string; title: string; author: string; readingTime: number }[] {
    const rows = db.prepare(`
      SELECT id, title, author, body FROM stories
      WHERE isApproved = 1 AND id != ?
      ORDER BY CASE WHEN author = ? THEN 0 ELSE 1 END, RANDOM()
      LIMIT ?
    `).all(storyId, author, limit) as { id: string; title: string; author: string; body: string }[]
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      author: r.author,
      readingTime: calculateReadingTime(r.body),
    }))
  },

  // Get the most recent updatedAt timestamp across all approved stories
  getLatestUpdatedAt(): string | null {
    const row = db.prepare('SELECT MAX(updatedAt) AS latest FROM stories WHERE isApproved = 1').get() as { latest: string | null } | undefined
    return row?.latest ?? null
  },
}

// Graceful shutdown: close the database connection
export function closeDb(): void {
  db.close()
}

process.on('SIGTERM', () => {
  closeDb()
  process.exit(0)
})

process.on('SIGINT', () => {
  closeDb()
  process.exit(0)
})

export default db
