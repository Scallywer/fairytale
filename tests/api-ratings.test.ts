import { describe, it, expect, beforeEach } from 'vitest'
import { POST as postRating } from '@/app/api/ratings/route'
import { GET as getStories } from '@/app/api/stories/route'
import { __resetRateLimitsForTests } from '@/lib/rateLimit'
import { callRoute, callRouteNoReq } from './helpers'

async function firstApprovedStoryId(): Promise<string> {
  const res = await callRouteNoReq(getStories)
  const stories = await res.json()
  return stories[0].id
}

function ratingRequest(storyId: string, rating: number, cookie?: string): Request {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'content-length': '128',
  }
  if (cookie) headers['cookie'] = cookie
  return new Request('http://localhost/api/ratings', {
    method: 'POST',
    headers,
    body: JSON.stringify({ storyId, rating }),
  })
}

describe('POST /api/ratings', () => {
  beforeEach(() => {
    __resetRateLimitsForTests()
  })

  it('mints a rater_id cookie when missing', async () => {
    const id = await firstApprovedStoryId()
    const res = await callRoute(postRating, ratingRequest(id, 4))
    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toMatch(/rater_id=/)
    expect(setCookie).toMatch(/HttpOnly/)
    expect(setCookie).toMatch(/SameSite=Lax/)
  })

  it('reuses an existing rater_id cookie (no Set-Cookie)', async () => {
    const id = await firstApprovedStoryId()
    const first = await callRoute(postRating, ratingRequest(id, 5))
    const cookieValue = first.headers.get('set-cookie')!.match(/rater_id=([^;]+)/)![1]
    const second = await callRoute(postRating, ratingRequest(id, 5, `rater_id=${cookieValue}`))
    expect(second.status).toBe(200)
    expect(second.headers.get('set-cookie')).toBeNull()
  })

  it('rejects malformed body', async () => {
    const req = new Request('http://localhost/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'content-length': '5' },
      body: 'oops',
    })
    const res = await callRoute(postRating, req)
    expect(res.status).toBe(400)
  })

  it('rejects ratings out of range', async () => {
    const id = await firstApprovedStoryId()
    const res = await callRoute(postRating, ratingRequest(id, 99))
    expect(res.status).toBe(400)
  })

  it('rate-limits after many submissions', async () => {
    const id = await firstApprovedStoryId()
    // Burn through the per-IP budget (30/hour). All untrusted requests
    // share a single bucket because TRUST_PROXY is unset.
    let last = 0
    for (let i = 0; i < 35; i++) {
      const cookie = 'rater_id=u-' + i + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      const r = await callRoute(postRating, ratingRequest(id, 3, cookie))
      last = r.status
      if (last === 429) break
    }
    expect(last).toBe(429)
  })

  it('rejects oversize body via content-length', async () => {
    const req = new Request('http://localhost/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'content-length': String(10_000) },
      body: JSON.stringify({ storyId: 'x', rating: 5 }),
    })
    const res = await callRoute(postRating, req)
    expect(res.status).toBe(413)
  })
})
