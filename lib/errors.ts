/**
 * Sentinel error classes so callers can branch on `error instanceof X`
 * instead of string-matching error.message — strings drift, classes don't.
 */

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class UnapprovedError extends Error {
  constructor(message = 'Story is not approved') {
    super(message)
    this.name = 'UnapprovedError'
  }
}

export class RateLimitedError extends Error {
  constructor(message = 'Rate limited') {
    super(message)
    this.name = 'RateLimitedError'
  }
}

export class ValidationError extends Error {
  constructor(message = 'Invalid input') {
    super(message)
    this.name = 'ValidationError'
  }
}
