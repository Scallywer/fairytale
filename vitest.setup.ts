import '@testing-library/jest-dom/vitest'

// Ensure auth secrets are present for tests that exercise routes which
// derive cookies or signatures. Individual test files can override.
if (!process.env.ADMIN_SESSION_SECRET) {
  process.env.ADMIN_SESSION_SECRET = 'test-session-secret-' + 'a'.repeat(32)
}
if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = 'test-admin-password'
}
