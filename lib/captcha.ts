import crypto from 'crypto'

const CAPTCHA_TTL_SEC = 10 * 60 // 10 minutes to fill out a comment

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (s && s.length >= 16) return s
  // Same fallback as lib/auth.ts: derive from ADMIN_PASSWORD so a single
  // missing env var doesn't break either subsystem.
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) throw new Error('ADMIN_PASSWORD or ADMIN_SESSION_SECRET must be set')
  return crypto.createHash('sha256').update('fairytale:captcha:' + pw).digest('hex')
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export interface CaptchaChallenge {
  question: string
  token: string
}

/**
 * Build a signed math captcha: server picks the numbers, computes the
 * answer, and HMACs (answer + nonce + expiry). The token returned to the
 * client doesn't contain the answer in clear, so the client cannot derive it.
 */
export function createCaptchaChallenge(): CaptchaChallenge {
  const a = 1 + Math.floor(Math.random() * 9)
  const b = 1 + Math.floor(Math.random() * 9)
  const op = Math.random() < 0.5 ? '+' : '−'
  // Always keep results non-negative for "−"
  const [x, y, answer] = op === '+' ? [a, b, a + b] : a >= b ? [a, b, a - b] : [b, a, b - a]
  const nonce = crypto.randomBytes(8).toString('base64url')
  const expiry = Math.floor(Date.now() / 1000) + CAPTCHA_TTL_SEC
  const payload = `${answer}.${nonce}.${expiry}`
  const sig = sign(payload)
  return {
    question: `Koliko je ${x} ${op} ${y}?`,
    token: `${payload}.${sig}`,
  }
}

/**
 * Verify a client-submitted answer against the signed token. Returns true
 * only when the signature, expiry, and answer all match.
 */
export function verifyCaptcha(token: string | undefined, answer: number | undefined): boolean {
  if (!token || typeof answer !== 'number' || !Number.isInteger(answer)) return false
  const parts = token.split('.')
  if (parts.length !== 4) return false
  const [answerStr, nonce, expiryStr, sig] = parts
  if (!answerStr || !nonce || !expiryStr || !sig) return false
  const expected = sign(`${answerStr}.${nonce}.${expiryStr}`)
  let sigOk = false
  try {
    const a = Buffer.from(sig, 'base64url')
    const b = Buffer.from(expected, 'base64url')
    if (a.length === b.length) sigOk = crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
  if (!sigOk) return false
  const expiry = Number(expiryStr)
  if (Number.isNaN(expiry) || expiry < Date.now() / 1000) return false
  return Number(answerStr) === answer
}
