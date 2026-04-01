import { describe, it, expect } from 'vitest'
import { GET as getSearch } from '@/app/api/search/route'
import { GET as getStories } from '@/app/api/stories/route'

describe('GET /api/search', () => {
  it('returns empty ids when q is missing', async () => {
    const req = new Request('http://localhost/api/search')
    const res = await getSearch(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('ids')
    expect(data.ids).toEqual([])
  })

  it('returns empty ids for a blank query', async () => {
    const req = new Request('http://localhost/api/search?q=')
    const res = await getSearch(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ids).toEqual([])
  })

  it('returns an array of ids for a real search term', async () => {
    // Grab a title word from an actual story to guarantee a match
    const storiesRes = await getStories()
    const stories = await storiesRes.json()
    if (!stories.length) return

    const firstWord = stories[0].title.split(' ')[0]
    const req = new Request(`http://localhost/api/search?q=${encodeURIComponent(firstWord)}`)
    const res = await getSearch(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.ids)).toBe(true)
    expect(data.ids.length).toBeGreaterThan(0)
    // The story whose title we searched must be in the results
    expect(data.ids).toContain(stories[0].id)
  })

  it('returns empty ids for a query that matches nothing', async () => {
    const req = new Request('http://localhost/api/search?q=xyzzy_no_match_12345')
    const res = await getSearch(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ids).toEqual([])
  })
})
