import { describe, it, expect } from 'vitest'
import { POST as postAnalytics } from '@/app/api/analytics/route'
import { GET as getStories } from '@/app/api/stories/route'
import db, { dbHelpers } from '@/lib/db'
import { callRoute, callRouteNoReq } from './helpers'

describe('POST /api/analytics', () => {
  it('returns 204 for a valid page_view event', async () => {
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view', path: '/' }),
    })
    const res = await callRoute(postAnalytics, req)
    expect(res.status).toBe(204)
  })

  it('persists a known event to the database', async () => {
    const storiesRes = await callRouteNoReq(getStories)
    const stories = await storiesRes.json()
    const storyId: string | null = stories[0]?.id ?? null

    const countBefore = (db.prepare('SELECT COUNT(*) as n FROM analytics').get() as { n: number }).n
    dbHelpers.recordAnalytics('story_view', storyId ?? undefined, `/story/${storyId}`)
    const countAfter = (db.prepare('SELECT COUNT(*) as n FROM analytics').get() as { n: number }).n
    expect(countAfter).toBe(countBefore + 1)
  })

  it('returns 204 for an empty body (event drop, no persistence)', async () => {
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    const res = await callRoute(postAnalytics, req)
    expect(res.status).toBe(204)
  })

  it('returns 204 for malformed JSON without crashing', async () => {
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      body: 'not json',
    })
    const res = await callRoute(postAnalytics, req)
    expect(res.status).toBe(204)
  })

  it('drops events with unknown event name (zod enum)', async () => {
    const before = (db.prepare('SELECT COUNT(*) as n FROM analytics').get() as { n: number }).n
    const req = new Request('http://localhost/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'free_form_event_name', path: '/' }),
    })
    const res = await callRoute(postAnalytics, req)
    expect(res.status).toBe(204)
    const after = (db.prepare('SELECT COUNT(*) as n FROM analytics').get() as { n: number }).n
    expect(after).toBe(before)
  })
})
