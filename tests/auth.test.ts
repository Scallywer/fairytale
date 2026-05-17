import { describe, it, expect, beforeEach } from 'vitest'
import crypto from 'crypto'
import {
  verifyAdminPassword,
  createAdminSessionCookie,
  verifyAdminCookie,
  getOrCreateRaterId,
} from '../lib/auth'

const PASSWORD = 'test-admin-password-stable-123'
const SESSION_SECRET = 'b'.repeat(32)

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD
  process.env.ADMIN_SESSION_SECRET = SESSION_SECRET
})

describe('verifyAdminPassword', () => {
  it('accepts the correct password', () => {
    expect(verifyAdminPassword(PASSWORD)).toBe(true)
  })

  it('rejects a wrong password', () => {
    expect(verifyAdminPassword('nope')).toBe(false)
  })

  it('rejects a password of different length', () => {
    expect(verifyAdminPassword('x')).toBe(false)
  })
})

describe('admin session cookie', () => {
  it('verifies a cookie it just minted', () => {
    const c = createAdminSessionCookie()
    expect(verifyAdminCookie(`${c.name}=${c.value}`)).toBe(true)
  })

  it('rejects a tampered cookie', () => {
    const c = createAdminSessionCookie()
    const tampered = c.value.slice(0, -1) + (c.value.slice(-1) === 'a' ? 'b' : 'a')
    expect(verifyAdminCookie(`${c.name}=${tampered}`)).toBe(false)
  })

  it('rejects malformed cookie payload', () => {
    expect(verifyAdminCookie('admin_session=garbage')).toBe(false)
    expect(verifyAdminCookie('admin_session=a.b.c')).toBe(false)
    expect(verifyAdminCookie(null)).toBe(false)
    expect(verifyAdminCookie('')).toBe(false)
  })

  it('does not match suffix cookies (boundary anchoring)', () => {
    const c = createAdminSessionCookie()
    expect(verifyAdminCookie(`xadmin_session=${c.value}`)).toBe(false)
  })

  it('rejects an expired cookie', () => {
    const sessionId = crypto.randomUUID()
    const past = Math.floor(Date.now() / 1000) - 10
    const issued = past - 100
    const payload = `${sessionId}.${issued}.${past}`
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
    expect(verifyAdminCookie(`admin_session=${payload}.${sig}`)).toBe(false)
  })

  it('survives admin password rotation when session secret is stable', () => {
    const c = createAdminSessionCookie()
    process.env.ADMIN_PASSWORD = 'rotated-password-456'
    // session secret unchanged → cookie still valid
    expect(verifyAdminCookie(`${c.name}=${c.value}`)).toBe(true)
  })
})

describe('rater_id cookie', () => {
  it('mints a signed cookie when none is present', async () => {
    const req = new Request('http://localhost/x', { method: 'POST' })
    const { raterId, setCookie } = await getOrCreateRaterId(req)
    expect(raterId).toMatch(/^[0-9a-f-]{36}$/)
    expect(setCookie).toMatch(/rater_id=/)
    expect(setCookie).toMatch(/HttpOnly/)
    expect(setCookie).toMatch(/SameSite=Lax/)
  })

  it('round-trips and reuses a valid cookie', async () => {
    const req1 = new Request('http://localhost/x', { method: 'POST' })
    const first = await getOrCreateRaterId(req1)
    const cookieValue = first.setCookie!.match(/rater_id=([^;]+)/)![1]
    const req2 = new Request('http://localhost/x', {
      method: 'POST',
      headers: { cookie: `rater_id=${cookieValue}` },
    })
    const second = await getOrCreateRaterId(req2)
    expect(second.raterId).toBe(first.raterId)
    expect(second.setCookie).toBeUndefined()
  })

  it('replaces a tampered cookie with a fresh one', async () => {
    const req = new Request('http://localhost/x', {
      method: 'POST',
      headers: { cookie: 'rater_id=abcdefghij.bad-signature' },
    })
    const { setCookie, raterId } = await getOrCreateRaterId(req)
    expect(setCookie).toBeDefined()
    expect(raterId).not.toBe('abcdefghij')
  })

  it('replaces a structurally invalid cookie', async () => {
    const req = new Request('http://localhost/x', {
      method: 'POST',
      headers: { cookie: 'rater_id=onlyonepart' },
    })
    const { setCookie } = await getOrCreateRaterId(req)
    expect(setCookie).toBeDefined()
  })
})
