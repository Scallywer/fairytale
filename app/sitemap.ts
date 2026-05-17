import type { MetadataRoute } from 'next'
import { storiesService } from '@/lib/storiesService'
import { dbHelpers } from '@/lib/db'
import { getBaseUrl } from '@/lib/constants'

export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  const stories = storiesService.getApprovedStories()
  const latestUpdatedAt = dbHelpers.getLatestUpdatedAt()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: latestUpdatedAt ? new Date(latestUpdatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${baseUrl}/story/${story.id}`,
    lastModified: new Date(story.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...storyRoutes]
}

