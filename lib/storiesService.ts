/**
 * Domain service for stories. Single entry point for story reads/writes.
 * Delegates to dbHelpers and enforces business rules (e.g. approved-only for public).
 */
import type { Story } from './db'
import { dbHelpers } from './db'

export type { Story }

export const storiesService = {
  /** Approved story IDs (for generateStaticParams, sitemaps). */
  getApprovedStoryIds(): string[] {
    return dbHelpers.getApprovedStoryIds()
  },

  /** Approved stories for public listing (home, API, sitemap). */
  getApprovedStories(): Story[] {
    return dbHelpers.getApprovedStories()
  },

  /** Paginated approved stories (for API ?limit=&offset=). */
  getApprovedStoriesPage(limit?: number, offset?: number): Story[] {
    return dbHelpers.getApprovedStoriesPage(limit, offset)
  },

  /** All stories for admin. */
  getAllStories(): Story[] {
    return dbHelpers.getAllStories()
  },

  getById(id: string): Story | null {
    return dbHelpers.getStoryById(id)
  },

  /** Returns story only if approved (for public story page). */
  getApprovedById(id: string): Story | null {
    const story = dbHelpers.getStoryById(id)
    return story?.isApproved ? story : null
  },

  create(data: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Story {
    return dbHelpers.createStory(data)
  },

  toggleApproval(id: string): Story {
    return dbHelpers.toggleApproval(id)
  },

  delete(id: string): void {
    return dbHelpers.deleteStory(id)
  },
}
