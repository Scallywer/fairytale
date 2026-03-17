import { NextResponse } from 'next/server'
import { storiesService } from '@/lib/storiesService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    storiesService.getApprovedStoryIds()
    return NextResponse.json(
      { status: 'ok', db: 'ok', timestamp: new Date().toISOString() },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', db: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
