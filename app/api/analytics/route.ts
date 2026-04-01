import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { dbHelpers } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const event = typeof body?.event === 'string' ? body.event : 'unknown'
    const storyId = typeof body?.storyId === 'string' ? body.storyId : undefined
    const path = typeof body?.path === 'string' ? body.path : undefined
    logger.info('Analytics event', { event, storyId, path })
    dbHelpers.recordAnalytics(event, storyId, path)
    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
