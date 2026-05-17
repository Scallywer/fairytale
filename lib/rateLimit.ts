/**
 * In-memory IP-based rate limiters. Per-process — fine for a single-host
 * Docker deployment; not safe for horizontal scaling without a shared store.
 */

const HOUR_MS = 60 * 60 * 1000
const TEN_MIN_MS = 10 * 60 * 1000

const MAX_COMMENTS_PER_IP_PER_HOUR = 10
const MAX_ADMIN_LOGIN_ATTEMPTS_PER_IP_PER_HOUR = 10
const MAX_STORIES_PER_IP_PER_HOUR = 5
const MAX_RATINGS_PER_IP_PER_HOUR = 30
const MAX_ANALYTICS_PER_IP_PER_10MIN = 200

const commentsByIp = new Map<string, number[]>()
const adminLoginsByIp = new Map<string, number[]>()
const storiesByIp = new Map<string, number[]>()
const ratingsByIp = new Map<string, number[]>()
const analyticsByIp = new Map<string, number[]>()

function check(map: Map<string, number[]>, ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const cutoff = now - windowMs
  const pruned = (map.get(ip) ?? []).filter((t) => t > cutoff)
  if (pruned.length >= limit) {
    map.set(ip, pruned)
    return false
  }
  pruned.push(now)
  map.set(ip, pruned)
  return true
}

export function checkCommentRateLimit(ip: string): boolean {
  return check(commentsByIp, ip, MAX_COMMENTS_PER_IP_PER_HOUR, HOUR_MS)
}

export function checkAdminLoginRateLimit(ip: string): boolean {
  return check(adminLoginsByIp, ip, MAX_ADMIN_LOGIN_ATTEMPTS_PER_IP_PER_HOUR, HOUR_MS)
}

export function checkStorySubmitRateLimit(ip: string): boolean {
  return check(storiesByIp, ip, MAX_STORIES_PER_IP_PER_HOUR, HOUR_MS)
}

export function checkRatingRateLimit(ip: string): boolean {
  return check(ratingsByIp, ip, MAX_RATINGS_PER_IP_PER_HOUR, HOUR_MS)
}

export function checkAnalyticsRateLimit(ip: string): boolean {
  return check(analyticsByIp, ip, MAX_ANALYTICS_PER_IP_PER_10MIN, TEN_MIN_MS)
}

/**
 * Resolve the client IP. Trusts X-Forwarded-For / X-Real-IP only when
 * TRUST_PROXY=true (you are behind a known reverse proxy that strips
 * incoming forwarding headers). Otherwise falls back to a header-derived
 * value but treats it as a soft hint — rate limits become per-key buckets
 * that any client can pick, so combine with per-resource caps.
 */
export function getClientIp(request: Request): string {
  const trustProxy = process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1'

  if (trustProxy) {
    const xff = request.headers.get('x-forwarded-for')
    if (xff) {
      const first = xff.split(',')[0].trim()
      if (first) return first
    }
    const xRealIp = request.headers.get('x-real-ip')
    if (xRealIp) return xRealIp.trim()
  }

  // No trusted proxy — but Next.js running on a public socket may still
  // expose the direct connection address. We don't have it from the
  // `Request` type, so fall back to a stable bucket per-process to ensure
  // the global rate-limit budget still applies (every untrusted request
  // shares the bucket).
  return trustProxy ? 'unknown' : 'untrusted'
}

// Test-only: clear all rate-limit state. Not exported via package boundary;
// importable for vitest suites that need a clean slate between tests.
export function __resetRateLimitsForTests(): void {
  commentsByIp.clear()
  adminLoginsByIp.clear()
  storiesByIp.clear()
  ratingsByIp.clear()
  analyticsByIp.clear()
}
