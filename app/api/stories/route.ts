import { NextRequest, NextResponse } from 'next/server'
import { storiesService } from '@/lib/storiesService'
import { createStorySchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const url = request?.url ?? 'http://localhost/'
    const { searchParams } = new URL(url)
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const limit = limitParam != null ? parseInt(limitParam, 10) : undefined
    const offset = offsetParam != null ? parseInt(offsetParam, 10) : undefined
    const usePagination =
      limit != null &&
      offset != null &&
      Number.isInteger(limit) &&
      Number.isInteger(offset) &&
      limit > 0 &&
      limit <= 100 &&
      offset >= 0
    const stories = usePagination
      ? storiesService.getApprovedStoriesPage(limit, offset)
      : storiesService.getApprovedStories()
    return new NextResponse(JSON.stringify(stories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Stories change rarely – allow caching with revalidation
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    logger.error('Error fetching stories:', error)
    return NextResponse.json({ error: 'Greška pri dohvaćanju priča' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createStorySchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.title?.[0]
        ?? parsed.error.flatten().fieldErrors.author?.[0]
        ?? parsed.error.flatten().fieldErrors.body?.[0]
        ?? 'Nevaljani podaci'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const story = storiesService.create({
      ...parsed.data,
      isApproved: false,
    })

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    logger.error('Error creating story:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju priče' }, { status: 500 })
  }
}
