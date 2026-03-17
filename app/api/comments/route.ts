import { NextRequest, NextResponse } from 'next/server'
import { commentsService } from '@/lib/commentsService'
import { getClientIp, checkCommentRateLimit } from '@/lib/rateLimit'
import { createCommentSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

// Generate a simple math question
function generateMathQuestion(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return {
    question: `Koliko je ${num1} + ${num2}?`,
    answer: num1 + num2
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const storyId = searchParams.get('storyId')

    if (!storyId) {
      return NextResponse.json({ error: 'Potreban ID priče' }, { status: 400 })
    }

    const comments = commentsService.getByStoryId(storyId)
    return new NextResponse(JSON.stringify(comments), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Comments can be cached briefly
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    logger.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Greška pri dohvaćanju komentara' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (!checkCommentRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Previše komentara s ove adrese. Pokušajte ponovno za sat vremena.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = createCommentSchema.safeParse(body)
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors
      const msg = first.content?.[0] ?? first.mathAnswer?.[0] ?? first.storyId?.[0] ?? 'Nevaljani podaci'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { storyId, authorName, content } = parsed.data

    const comment = commentsService.create({
      storyId,
      authorName: (authorName ?? '').trim() || 'Anonimno',
      content: content.trim()
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : ''
    if (msg === 'RATE_LIMIT') {
      return NextResponse.json({
        error: 'Previše komentara u kratkom vremenu. Molimo pokušajte kasnije.'
      }, { status: 429 })
    }
    if (msg === 'Story not found or not approved') {
      return NextResponse.json({ error: 'Priča nije pronađena' }, { status: 404 })
    }
    logger.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju komentara' }, { status: 500 })
  }
}
