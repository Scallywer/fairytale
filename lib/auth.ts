import crypto from 'crypto'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE_SEC = 24 * 60 * 60 // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD environment variable is not set')
  return secret
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getSecret()
  const passwordHash = crypto.createHash('sha256').update(password).digest()
  const secretHash = crypto.createHash('sha256').update(secret).digest()
  return crypto.timingSafeEqual(passwordHash, secretHash)
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url')
}

export function createAdminSessionCookie(): { name: string; value: string; options: { httpOnly: boolean; secure: boolean; sameSite: 'lax'; maxAge: number; path: string } } {
  const expiry = (Date.now() / 1000 + SESSION_MAX_AGE_SEC).toFixed(0)
  const signature = sign(expiry)
  const value = `${expiry}.${signature}`
  return {
    name: COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SEC,
      path: '/',
    },
  }
}

export function verifyAdminCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  const raw = match?.[1]
  if (!raw) return false
  const decoded = decodeURIComponent(raw)
  const [expiryStr, signature] = decoded.split('.')
  if (!expiryStr || !signature) return false
  const expiry = Number(expiryStr)
  if (Number.isNaN(expiry) || expiry <= Date.now() / 1000) return false
  const expected = sign(expiryStr)
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'base64url'), Buffer.from(expected, 'base64url'))
  } catch {
    return false
  }
}

const RATER_COOKIE_NAME = 'rater_id'
const RATER_MAX_AGE_SEC = 60 * 60 * 24 * 365 // 1 year

/**
 * Resolve the rater_id from request cookies, or mint a fresh one. Returns
 * the id plus an optional Set-Cookie header value when a new id was issued.
 *
 * The id is opaque to the client and serves only to dedupe ratings per
 * device. Phase 3 (auth hardening) will switch this to a signed payload
 * using a session secret separate from ADMIN_PASSWORD.
 */
export async function getOrCreateRaterId(
  request: Request,
  newId: () => string
): Promise<{ raterId: string; setCookie?: string }> {
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${RATER_COOKIE_NAME}=([^;]+)`))
    if (match?.[1]) {
      const decoded = decodeURIComponent(match[1])
      // Only accept reasonable-looking values; otherwise mint anew
      if (/^[A-Za-z0-9_-]{8,128}$/.test(decoded)) {
        return { raterId: decoded }
      }
    }
  }
  const raterId = newId()
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const setCookie = `${RATER_COOKIE_NAME}=${encodeURIComponent(raterId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${RATER_MAX_AGE_SEC}${secure}`
  return { raterId, setCookie }
}
