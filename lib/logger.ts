/**
 * Logger utility with debug flag and optional structured (JSON) logging.
 * Set DEBUG=true or NEXT_PUBLIC_DEBUG=true to enable debug logging.
 * Set LOG_JSON=1 or NODE_ENV=production to output JSON logs for log aggregators.
 */

const DEBUG_ENABLED =
  (typeof process !== 'undefined' && (process.env.DEBUG === 'true' || process.env.DEBUG === '1')) ||
  (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === '1'))

const NODE_ENV =
  (typeof process !== 'undefined' && process.env.NODE_ENV) || 'production'

const USE_JSON =
  typeof process !== 'undefined' &&
  (process.env.LOG_JSON === '1' || process.env.LOG_JSON === 'true' || NODE_ENV === 'production')

function structured(level: string, message: string, meta?: Record<string, unknown>): void {
  if (USE_JSON && typeof process !== 'undefined') {
    const payload = { level, message, timestamp: new Date().toISOString(), ...meta }
    const out = level === 'error' ? console.error : console.log
    out(JSON.stringify(payload))
  }
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (DEBUG_ENABLED) {
      if (USE_JSON && typeof process !== 'undefined') {
        structured('debug', String(args[0]), args.length > 1 ? { extra: args.slice(1) } : undefined)
      } else {
        console.log('[DEBUG]', ...args)
      }
    }
  },

  info: (...args: unknown[]) => {
    const msg = args.length > 0 ? String(args[0]) : ''
    if (USE_JSON && typeof process !== 'undefined') {
      structured('info', msg, args.length > 1 ? { extra: args.slice(1) } : undefined)
    } else {
      console.log(...args)
    }
  },

  warn: (...args: unknown[]) => {
    const msg = args.length > 0 ? String(args[0]) : ''
    if (USE_JSON && typeof process !== 'undefined') {
      structured('warn', msg, args.length > 1 ? { extra: args.slice(1) } : undefined)
    } else {
      console.warn('[WARN]', ...args)
    }
  },

  error: (...args: unknown[]) => {
    const msg = args.length > 0 ? String(args[0]) : ''
    const err = args.length > 1 ? args[1] : undefined
    const meta: Record<string, unknown> =
      err instanceof Error ? { error: err.message, stack: err.stack } : err != null ? { error: String(err) } : {}
    if (USE_JSON && typeof process !== 'undefined') {
      structured('error', msg, Object.keys(meta).length ? meta : undefined)
    } else {
      console.error('[ERROR]', ...args)
    }
  },

  isDebugEnabled: () => DEBUG_ENABLED,
  isDevelopment: () => NODE_ENV === 'development',
}
