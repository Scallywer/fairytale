import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StoryReader from '@/components/StoryReader'

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const story = prisma.getStoryById(id)

  if (!story || !story.isApproved) {
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
}
