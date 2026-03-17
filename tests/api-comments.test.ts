import { describe, it, expect } from 'vitest'
import { GET as getComments } from '@/app/api/comments/route'
import { POST as createComment } from '@/app/api/comments/route'
import { GET as getStories } from '@/app/api/stories/route'

describe('GET /api/comments', () => {
  it('returns 400 when storyId is missing', async () => {
    const req = new Request('http://localhost/api/comments')
    const res = await getComments(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 and array when storyId provided', async () => {
    const storiesRes = await getStories()
    const stories = await storiesRes.json()
    const storyId = stories[0]?.id
    if (!storyId) {
      return
    }
    const req = new Request(`http://localhost/api/comments?storyId=${storyId}`)
    const res = await getComments(req)
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
    const res = await createComment(req)
    expect(res.status).toBe(400)
  })

  it('returns 201 and comment when valid, or 404 when story not found', async () => {
    const storiesRes = await getStories()
    const stories = await storiesRes.json()
    const storyId = stories[0]?.id
    if (!storyId) {
      return
    }
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId,
        authorName: 'Test',
        content: 'Valid comment text here',
        mathAnswer: 5,
        honeypot: '',
      }),
    })
    const res = await createComment(req)
    const data = await res.json()
    expect([201, 404]).toContain(res.status)
    if (res.status === 201) {
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('content', 'Valid comment text here')
      expect(data).toHaveProperty('authorName', 'Test')
      expect(data).toHaveProperty('storyId', storyId)
    } else {
      expect(data).toHaveProperty('error')
    }
  })
})
