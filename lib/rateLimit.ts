/**
 * In-memory rate limiters. Use for IP-based limits (comments, admin login).
 */

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_COMMENTS_PER_IP_PER_HOUR = 10
const MAX_ADMIN_LOGIN_ATTEMPTS_PER_IP_PER_HOUR = 10

const commentTimestampsByIp = new Map<string, number[]>()
const adminLoginAttemptsByIp = new Map<string, number[]>()

function pruneOld(timestamps: number[], windowMs: number): number[] {
  const cutoff = Date.now() - windowMs
  return timestamps.filter((t) => t > cutoff)
}

export function checkCommentRateLimit(ip: string): boolean {
  const now = Date.now()
  const existing = commentTimestampsByIp.get(ip) ?? []
  const pruned = pruneOld(existing, WINDOW_MS)
  if (pruned.length >= MAX_COMMENTS_PER_IP_PER_HOUR) return false
  pruned.push(now)
  commentTimestampsByIp.set(ip, pruned)
  return true
}

export function checkAdminLoginRateLimit(ip: string): boolean {
  const now = Date.now()
  const existing = adminLoginAttemptsByIp.get(ip) ?? []
  const pruned = pruneOld(existing, WINDOW_MS)
  if (pruned.length >= MAX_ADMIN_LOGIN_ATTEMPTS_PER_IP_PER_HOUR) return false
  pruned.push(now)
  adminLoginAttemptsByIp.set(ip, pruned)
  return true
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp) return xRealIp.trim()
  return 'unknown'
}
