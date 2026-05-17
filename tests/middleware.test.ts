import { describe, it, expect } from 'vitest'
import { middleware } from '../middleware'
import { NextRequest } from 'next/server'

function makeRequest(method: string, opts: { origin?: string | null; host?: string } = {}): NextRequest {
  const url = 'http://localhost:3000/api/test'
  const headers = new Headers()
  if (opts.origin !== null && opts.origin !== undefined) headers.set('origin', opts.origin)
  headers.set('host', opts.host ?? 'localhost:3000')
  return new NextRequest(url, { method, headers })
}

describe('middleware (security headers + CSRF)', () => {
  it('sets security headers on GET responses', () => {
    const res = middleware(makeRequest('GET'))
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(res.headers.get('X-Frame-Options')).toBe('DENY')
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(res.headers.get('Content-Security-Policy')).toMatch(/default-src 'self'/)
    expect(res.headers.get('Content-Security-Policy')).toMatch(/frame-ancestors 'none'/)
  })

  it('allows same-origin POST', () => {
    const res = middleware(makeRequest('POST', { origin: 'http://localhost:3000', host: 'localhost:3000' }))
    expect(res.status).toBe(200)
  })

  it('blocks cross-origin POST', () => {
    const res = middleware(makeRequest('POST', { origin: 'https://evil.example', host: 'localhost:3000' }))
    expect(res.status).toBe(403)
  })

  it('blocks cross-origin DELETE', () => {
    const res = middleware(makeRequest('DELETE', { origin: 'https://attacker.test', host: 'localhost:3000' }))
    expect(res.status).toBe(403)
  })

  it('rejects malformed Origin header on state-changing methods', () => {
    const res = middleware(makeRequest('POST', { origin: 'not-a-url', host: 'localhost:3000' }))
    expect(res.status).toBe(403)
  })

  it('allows POST with no Origin (same-origin form, server-side)', () => {
    const headers = new Headers()
    headers.set('host', 'localhost:3000')
    const req = new NextRequest('http://localhost:3000/api/test', { method: 'POST', headers })
    const res = middleware(req)
    expect(res.status).toBe(200)
  })

  it('does not enforce origin on GET', () => {
    const res = middleware(makeRequest('GET', { origin: 'https://evil.example' }))
    expect(res.status).toBe(200)
  })
})
