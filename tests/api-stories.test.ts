import { NextRequest } from 'next/server'
import { describe, it, expect } from 'vitest'
import { GET as getStories } from '@/app/api/stories/route'

describe('GET /api/stories', () => {
  it('returns approved stories with 200 status', async () => {
    const res = await getStories()
    expect(res.status).toBe(200)

    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    if (json.length > 0) {
      const story = json[0]
      expect(story).toHaveProperty('id')
      expect(story).toHaveProperty('title')
      expect(story).toHaveProperty('author')
    }
  })
})

