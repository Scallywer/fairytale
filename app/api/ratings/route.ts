import { NextRequest, NextResponse } from 'next/server'
import { ratingsService } from '@/lib/ratingsService'
import { submitRatingSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = submitRatingSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.storyId?.[0]
        ?? parsed.error.flatten().fieldErrors.rating?.[0]
        ?? 'Nevažeći ID priče ili ocjena'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { storyId, rating, userId } = parsed.data
    const finalUserId = userId ?? 'anonymous'
    const { averageRating, ratingCount } = ratingsService.submitRating(storyId, finalUserId, rating)

    return new NextResponse(JSON.stringify({
      success: true,
      averageRating,
      ratingCount
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Rating responses should not be cached
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : ''
    if (msg === 'Story not found' || msg === 'Cannot rate an unapproved story') {
      return NextResponse.json({ error: msg }, { status: 404 })
    }
    logger.error('Error submitting rating:', error)
    return NextResponse.json({ error: 'Greška pri slanju ocjene' }, { status: 500 })
  }
}
