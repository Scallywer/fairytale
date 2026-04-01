import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl?.href ?? request.url)
  const q = url.searchParams.get('q') ?? ''
  if (!q.trim()) {
    return NextResponse.json({ ids: [] })
  }
  try {
    const ids = dbHelpers.searchStories(q)
    return NextResponse.json({ ids })
  } catch {
    return NextResponse.json({ ids: [] })
  }
}
