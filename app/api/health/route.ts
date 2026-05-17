import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Cheap DB round-trip that exercises the connection and a real read.
    const row = db.prepare('SELECT 1 AS ok').get() as { ok: number } | undefined
    if (!row || row.ok !== 1) throw new Error('unexpected db response')

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
