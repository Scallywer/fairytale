import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StoryReader from '@/components/StoryReader'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const runtime = 'nodejs'

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    console.log(`[StoryPage] Fetching story with id: ${id}`)
    const story = prisma.getStoryById(id)
    console.log(`[StoryPage] Story found:`, story ? { id: story.id, title: story.title, isApproved: story.isApproved } : 'null')

    if (!story) {
      console.log(`[StoryPage] Story not found for id: ${id}`)
      notFound()
    }

    if (!story.isApproved) {
      console.log(`[StoryPage] Story ${id} is not approved`)
      notFound()
    }

    return (
      <StoryReader
        storyId={story.id}
        title={story.title}
        author={story.author}
        body={story.body}
        imageUrl={story.imageUrl}
        averageRating={story.averageRating}
        ratingCount={story.ratingCount}
        readingTime={story.readingTime}
      />
    )
  } catch (error) {
    console.error('Error loading story:', error)
    notFound()
  }
}
