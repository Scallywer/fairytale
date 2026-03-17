import { NextRequest, NextResponse } from 'next/server'
import { commentsService } from '@/lib/commentsService'
import { getClientIp, checkCommentRateLimit } from '@/lib/rateLimit'
import { createCommentSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl?.href ?? request.url ?? 'http://localhost/'
    const searchParams = new URL(url).searchParams
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

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Nevaljani JSON u zahtjevu' }, { status: 400 })
    }

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
    const code = (error as { code?: string })?.code
    if (msg === 'RATE_LIMIT') {
      return NextResponse.json({
        error: 'Previše komentara u kratkom vremenu. Molimo pokušajte kasnije.'
      }, { status: 429 })
    }
    if (msg === 'Story not found or not approved') {
      return NextResponse.json({ error: 'Priča nije pronađena' }, { status: 404 })
    }
    if (code === 'SQLITE_ERROR' && typeof msg === 'string' && msg.includes('foreign key')) {
      return NextResponse.json({ error: 'Priča nije pronađena ili nije odobrena' }, { status: 404 })
    }
    logger.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju komentara' }, { status: 500 })
  }
}
