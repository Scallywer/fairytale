import { describe, it, expect } from 'vitest'
import { GET as getComments, POST as createComment } from '@/app/api/comments/route'
import { GET as getStories } from '@/app/api/stories/route'
import { createCaptchaChallenge } from '@/lib/captcha'
import { callRoute, callRouteNoReq } from './helpers'

describe('GET /api/comments', () => {
  it('returns 400 when storyId is missing', async () => {
    const res = await callRoute(getComments, new Request('http://localhost/api/comments'))
    expect(res.status).toBe(400)
  })

  it('returns 200 and array when storyId provided', async () => {
    const storiesRes = await callRouteNoReq(getStories)
    const stories = await storiesRes.json()
    const storyId = stories[0]?.id
    if (!storyId) return
    const res = await callRoute(getComments, new Request(`http://localhost/api/comments?storyId=${storyId}`))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })
})

describe('POST /api/comments', () => {
  it('returns 400 when body is invalid', async () => {
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId: 'x', content: 'ab' }),
    })
    const res = await callRoute(createComment, req)
    expect(res.status).toBe(400)
  })

  it('rejects valid body with wrong captcha answer', async () => {
    const storiesRes = await callRouteNoReq(getStories)
    const stories = await storiesRes.json()
    const storyId = stories[0]?.id
    if (!storyId) return
    const ch = createCaptchaChallenge()
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId,
        authorName: 'Test',
        content: 'Valid comment text here',
        mathAnswer: 999,
        mathToken: ch.token,
      }),
    })
    const res = await callRoute(createComment, req)
    expect(res.status).toBe(400)
  })

  it('rejects missing mathToken', async () => {
    const storiesRes = await callRouteNoReq(getStories)
    const stories = await storiesRes.json()
    const storyId = stories[0]?.id
    if (!storyId) return
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId,
        authorName: 'Test',
        content: 'Valid comment text here',
        mathAnswer: 5,
      }),
    })
    const res = await callRoute(createComment, req)
    expect(res.status).toBe(400)
  })

  it('accepts a comment with a valid signed captcha', async () => {
    const storiesRes = await callRouteNoReq(getStories)
    const stories = await storiesRes.json()
    const storyId = stories[0]?.id
    if (!storyId) return
    const ch = createCaptchaChallenge()
    const answer = Number(ch.token.split('.')[0])
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId,
        authorName: 'Test',
        content: 'Captcha-gated comment',
        mathAnswer: answer,
        mathToken: ch.token,
      }),
    })
    const res = await callRoute(createComment, req)
    const data = await res.json()
    expect([201, 429]).toContain(res.status)
    if (res.status === 201) {
      expect(data).toHaveProperty('content', 'Captcha-gated comment')
    }
  })
})
