/**
 * Domain service for ratings. Ensures ratings are only submitted for approved stories.
 */
import { dbHelpers } from './db'

export const ratingsService = {
  submitRating(storyId: string, userId: string, rating: number): { averageRating: number; ratingCount: number } {
    const story = dbHelpers.getStoryById(storyId)
    if (!story) throw new Error('Story not found')
    if (!story.isApproved) throw new Error('Cannot rate an unapproved story')
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5')
    dbHelpers.submitRating(storyId, userId, rating)
    const info = dbHelpers.getAverageRating(storyId)
    return {
      averageRating: info?.averageRating ?? 0,
      ratingCount: info?.ratingCount ?? 0,
    }
  },

  getAverageRating(storyId: string): { averageRating: number; ratingCount: number } | null {
    return dbHelpers.getAverageRating(storyId)
  },
}
