import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { ratingsService } from '@/lib/ratingsService'
import { submitRatingSchema } from '@/lib/schemas'
import { getClientIp, checkRatingRateLimit } from '@/lib/rateLimit'
import { getOrCreateRaterId } from '@/lib/auth'
import { NotFoundError, UnapprovedError } from '@/lib/errors'
import { logger } from '@/lib/logger'

const MAX_BODY_BYTES = 2_000

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (!checkRatingRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Previše ocjena. Pokušajte za sat vremena.' },
        { status: 429 }
      )
    }

    const contentLength = Number(request.headers.get('content-length') ?? '0')
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Zahtjev je prevelik' }, { status: 413 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Nevaljani JSON' }, { status: 400 })
    }

    const parsed = submitRatingSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.storyId?.[0]
        ?? parsed.error.flatten().fieldErrors.rating?.[0]
        ?? 'Nevažeći ID priče ili ocjena'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { storyId, rating } = parsed.data

    const { raterId, setCookie } = await getOrCreateRaterId(request, () => randomUUID())

    const { averageRating, ratingCount } = ratingsService.submitRating(storyId, raterId, rating)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    }
    if (setCookie) headers['Set-Cookie'] = setCookie

    return new NextResponse(
      JSON.stringify({ success: true, averageRating, ratingCount }),
      { status: 200, headers }
    )
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Priča nije pronađena' }, { status: 404 })
    }
    if (error instanceof UnapprovedError) {
      return NextResponse.json({ error: 'Priča nije odobrena' }, { status: 404 })
    }
    logger.error('Error submitting rating:', error)
    return NextResponse.json({ error: 'Greška pri slanju ocjene' }, { status: 500 })
  }
}
