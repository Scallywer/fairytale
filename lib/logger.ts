/**
 * Logger utility with debug flag support
 * Set DEBUG=true or NEXT_PUBLIC_DEBUG=true in environment variables to enable debug logging
 */

// Support both server-side (DEBUG) and client-side (NEXT_PUBLIC_DEBUG) debug flags
const DEBUG_ENABLED = 
  (typeof process !== 'undefined' && (process.env.DEBUG === 'true' || process.env.DEBUG === '1')) ||
  (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === '1'))

const NODE_ENV = 
  (typeof process !== 'undefined' && process.env.NODE_ENV) || 
  'production'

export const logger = {
  /**
   * Debug logs - only shown when DEBUG=true
   */
  debug: (...args: unknown[]) => {
    if (DEBUG_ENABLED) {
      console.log('[DEBUG]', ...args)
    }
  },

  /**
   * Info logs - always shown
   */
  info: (...args: unknown[]) => {
    console.log(...args)
  },

  /**
   * Warning logs - always shown
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args)
  },

  /**
   * Error logs - always shown (errors should always be logged)
   */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args)
  },

  /**
   * Check if debug is enabled
   */
  isDebugEnabled: () => DEBUG_ENABLED,

  /**
   * Check if in development mode
   */
  isDevelopment: () => NODE_ENV === 'development',
}
