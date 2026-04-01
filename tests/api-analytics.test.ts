import { describe, it, expect } from 'vitest'
import { POST as postAnalytics } from '@/app/api/analytics/route'
import { GET as getStories } from '@/app/api/stories/route'
import db, { dbHelpers } from '@/lib/db'

describe('POST /api/analytics', () => {
  it('returns 204 for a valid page_view event', async () => {
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view', path: '/' }),
    })
    const res = await postAnalytics(req)
    expect(res.status).toBe(204)
  })

  it('persists the event to the database', async () => {
    const storiesRes = await getStories()
    const stories = await storiesRes.json()
    const storyId: string | null = stories[0]?.id ?? null

    const countBefore = (db.prepare('SELECT COUNT(*) as n FROM analytics').get() as { n: number }).n
    // Call dbHelpers directly so any DB error surfaces rather than being swallowed by the route's catch
    dbHelpers.recordAnalytics('story_view', storyId ?? undefined, `/story/${storyId}`)
    const countAfter = (db.prepare('SELECT COUNT(*) as n FROM analytics').get() as { n: number }).n
    expect(countAfter).toBe(countBefore + 1)
  })

  it('returns 204 even with an empty body', async () => {
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    const res = await postAnalytics(req)
    expect(res.status).toBe(204)
  })

  it('returns 204 even with malformed JSON', async () => {
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      body: 'not json',
    })
    const res = await postAnalytics(req)
    expect(res.status).toBe(204)
  })
})
