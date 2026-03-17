import { NextRequest, NextResponse } from 'next/server'
import { storiesService } from '@/lib/storiesService'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return new NextResponse(null, { status: 400 })
    }
    storiesService.recordRead(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : ''
    if (msg === 'Story not found or not approved') {
      return new NextResponse(null, { status: 404 })
    }
    logger.error('Error recording read:', error)
    return new NextResponse(null, { status: 500 })
  }
}
