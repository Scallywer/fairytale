import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

if (!process.env.ADMIN_SESSION_SECRET) {
  process.env.ADMIN_SESSION_SECRET = 'test-session-secret-' + 'a'.repeat(32)
}
if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = 'test-admin-password'
}

// Reset shared in-memory rate-limit state before every test so file order
// can't cause one suite to exhaust another's budget.
beforeEach(async () => {
  const mod = await import('./lib/rateLimit')
  mod.__resetRateLimitsForTests()
})
