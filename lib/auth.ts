import crypto from 'crypto'

const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_SESSION_MAX_AGE_SEC = 24 * 60 * 60 // 24 hours
const RATER_COOKIE_NAME = 'rater_id'
const RATER_MAX_AGE_SEC = 60 * 60 * 24 * 365 // 1 year

function getAdminPassword(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD environment variable is not set')
  return secret
}

/**
 * Session/cookie signing key. Falls back to ADMIN_PASSWORD-derived material
 * for backward compatibility, but production deployments should set a
 * dedicated 32+ byte secret so cookie keys are decoupled from credentials.
 */
function getSessionSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET
  if (explicit && explicit.length >= 16) return explicit
  // Derive a deterministic key from the admin password so behavior is
  // stable across restarts without the explicit secret being set.
  return crypto.createHash('sha256').update('fairytale:session:' + getAdminPassword()).digest('hex')
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminPassword()
  const passwordHash = crypto.createHash('sha256').update(password).digest()
  const secretHash = crypto.createHash('sha256').update(secret).digest()
  return crypto.timingSafeEqual(passwordHash, secretHash)
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a, 'base64url')
    const bb = Buffer.from(b, 'base64url')
    if (ab.length !== bb.length) return false
    return crypto.timingSafeEqual(ab, bb)
  } catch {
    return false
  }
}

export function createAdminSessionCookie(): { name: string; value: string; options: { httpOnly: boolean; secure: boolean; sameSite: 'strict'; maxAge: number; path: string } } {
  const sessionId = crypto.randomUUID()
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiry = issuedAt + ADMIN_SESSION_MAX_AGE_SEC
  const payload = `${sessionId}.${issuedAt}.${expiry}`
  const signature = sign(payload)
  return {
    name: ADMIN_COOKIE_NAME,
    value: `${payload}.${signature}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ADMIN_SESSION_MAX_AGE_SEC,
      path: '/',
    },
  }
}

export function verifyAdminCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`))
  const raw = match?.[1]
  if (!raw) return false
  const decoded = decodeURIComponent(raw)
  const parts = decoded.split('.')
  if (parts.length !== 4) return false
  const [sessionId, issuedAtStr, expiryStr, signature] = parts
  if (!sessionId || !issuedAtStr || !expiryStr || !signature) return false
  const expiry = Number(expiryStr)
  if (Number.isNaN(expiry) || expiry <= Date.now() / 1000) return false
  const expected = sign(`${sessionId}.${issuedAtStr}.${expiryStr}`)
  return safeEqual(signature, expected)
}

/**
 * Resolve the rater_id from request cookies, or mint a fresh one. The id
 * is signed so a tampered cookie is rejected; HMAC uses ADMIN_SESSION_SECRET.
 *
 * Returns the canonical id plus an optional Set-Cookie header when a new id
 * was issued (or an existing cookie failed signature verification).
 */
export async function getOrCreateRaterId(
  request: Request,
  newId: () => string = () => crypto.randomUUID()
): Promise<{ raterId: string; setCookie?: string }> {
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${RATER_COOKIE_NAME}=([^;]+)`))
    if (match?.[1]) {
      const decoded = decodeURIComponent(match[1])
      const parts = decoded.split('.')
      if (parts.length === 2) {
        const [id, sig] = parts
        if (/^[A-Za-z0-9_-]{8,128}$/.test(id) && safeEqual(sig, sign(`rater:${id}`))) {
          return { raterId: id }
        }
      }
    }
  }
  const id = newId()
  const sig = sign(`rater:${id}`)
  const value = `${id}.${sig}`
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const setCookie = `${RATER_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${RATER_MAX_AGE_SEC}${secure}`
  return { raterId: id, setCookie }
}
