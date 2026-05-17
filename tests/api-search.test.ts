import { describe, it, expect } from 'vitest'
import { GET as getSearch } from '@/app/api/search/route'
import { GET as getStories } from '@/app/api/stories/route'
import { callRoute, callRouteNoReq } from './helpers'

describe('GET /api/search', () => {
  it('returns empty ids when q is missing', async () => {
    const res = await callRoute(getSearch, new Request('http://localhost/api/search'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('ids')
    expect(data.ids).toEqual([])
  })

  it('returns empty ids for a blank query', async () => {
    const res = await callRoute(getSearch, new Request('http://localhost/api/search?q='))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ids).toEqual([])
  })

  it('returns an array of ids for a real search term', async () => {
    const storiesRes = await callRouteNoReq(getStories)
    const stories = await storiesRes.json()
    if (!stories.length) return

    const firstWord = stories[0].title.split(' ')[0]
    const res = await callRoute(
      getSearch,
      new Request(`http://localhost/api/search?q=${encodeURIComponent(firstWord)}`)
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.ids)).toBe(true)
    expect(data.ids.length).toBeGreaterThan(0)
    expect(data.ids).toContain(stories[0].id)
  })

  it('returns empty ids for a query that matches nothing', async () => {
    const res = await callRoute(getSearch, new Request('http://localhost/api/search?q=xyzzy_no_match_12345'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ids).toEqual([])
  })
})
