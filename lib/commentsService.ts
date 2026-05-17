/**
 * Domain service for comments. Centralizes per-story rate limit and approval checks.
 */
import type { Comment } from './db'
import { dbHelpers } from './db'
import { sanitizeStrings } from './sanitize'
import { NotFoundError, RateLimitedError } from './errors'

const MAX_COMMENTS_PER_HOUR_PER_STORY = 5

export type { Comment }

export const commentsService = {
  getByStoryId(storyId: string): Comment[] {
    return dbHelpers.getCommentsByStoryId(storyId)
  },

  create(data: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>): Comment {
    const story = dbHelpers.getStoryById(data.storyId)
    if (!story || !story.isApproved) throw new NotFoundError('Story not found or not approved')
    const recentCount = dbHelpers.getRecentCommentCount(data.storyId, 60)
    if (recentCount >= MAX_COMMENTS_PER_HOUR_PER_STORY) {
      throw new RateLimitedError('Per-story comment limit exceeded')
    }
    return dbHelpers.createComment(sanitizeStrings(data))
  },

  getRecentCommentCount(storyId: string, timeWindowMinutes: number = 60): number {
    return dbHelpers.getRecentCommentCount(storyId, timeWindowMinutes)
  },
}
