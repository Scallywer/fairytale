/**
 * Domain service for comments. Centralizes rate limiting and approval checks.
 */
import type { Comment } from './db'
import { dbHelpers } from './db'
import { sanitizeStrings } from './sanitize'

const MAX_COMMENTS_PER_HOUR = 5

export type { Comment }

export const commentsService = {
  getByStoryId(storyId: string): Comment[] {
    return dbHelpers.getCommentsByStoryId(storyId)
  },

  create(data: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>): Comment {
    const story = dbHelpers.getStoryById(data.storyId)
    if (!story || !story.isApproved) throw new Error('Story not found or not approved')
    const recentCount = dbHelpers.getRecentCommentCount(data.storyId, 60)
    if (recentCount >= MAX_COMMENTS_PER_HOUR) {
      throw new Error('RATE_LIMIT')
    }
    return dbHelpers.createComment(sanitizeStrings(data))
  },

  getRecentCommentCount(storyId: string, timeWindowMinutes: number = 60): number {
    return dbHelpers.getRecentCommentCount(storyId, timeWindowMinutes)
  },
}
