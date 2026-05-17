import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { dbHelpers } from '@/lib/db'
import { analyticsEventSchema } from '@/lib/schemas'
import { getClientIp, checkAnalyticsRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 1_000

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkAnalyticsRateLimit(ip)) {
    return new NextResponse(null, { status: 429 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 })
  }

  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return new NextResponse(null, { status: 204 })
    }
    const parsed = analyticsEventSchema.safeParse(body)
    if (!parsed.success) {
      return new NextResponse(null, { status: 204 })
    }
    const { event, storyId, path } = parsed.data
    logger.info('Analytics event', { event, storyId, path })
    dbHelpers.recordAnalytics(event, storyId, path)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    logger.error('Analytics error', err)
    return new NextResponse(null, { status: 204 })
  }
}
