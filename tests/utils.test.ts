import { describe, it, expect } from 'vitest'
import { safeJsonLd, calculateReadingTime, splitIntoParagraphs } from '@/lib/utils'

describe('safeJsonLd', () => {
  it('escapes </script> so JSON-LD cannot break out', () => {
    const out = safeJsonLd({ title: 'My story</script><img src=x onerror=alert(1)>' })
    expect(out).not.toContain('</script>')
    expect(out).not.toContain('<img')
    expect(out).toContain('\\u003c')
  })

  it('escapes HTML comment delimiters', () => {
    const out = safeJsonLd({ x: '<!--' })
    expect(out).not.toContain('<!--')
    expect(out).toContain('\\u003c!')
  })

  it('escapes ampersand', () => {
    const out = safeJsonLd({ x: '&' })
    expect(out).toContain('\\u0026')
  })

  it('escapes U+2028 / U+2029 line separators', () => {
    const sep28 = String.fromCharCode(0x2028)
    const sep29 = String.fromCharCode(0x2029)
    const out = safeJsonLd({ x: 'a' + sep28 + 'b' + sep29 + 'c' })
    expect(out).toContain('\\u2028')
    expect(out).toContain('\\u2029')
  })

  it('produces valid JSON that round-trips', () => {
    const value = { title: 'Hello "world"', body: 'line1\nline2' }
    // The output is intended to be embedded raw inside <script>, but it must
    // still parse as JSON if the unicode escapes are decoded by a parser.
    const out = safeJsonLd(value)
    const parsed = JSON.parse(out)
    expect(parsed).toEqual(value)
  })
})

describe('calculateReadingTime', () => {
  it('returns minimum 1 minute', () => {
    expect(calculateReadingTime('')).toBe(1)
    expect(calculateReadingTime('a')).toBe(1)
  })
  it('rounds up at default 120 wpm', () => {
    const words = Array(241).fill('a').join(' ')
    expect(calculateReadingTime(words)).toBe(3)
  })
})

describe('splitIntoParagraphs', () => {
  it('splits on blank lines', () => {
    expect(splitIntoParagraphs('a\n\nb\n\nc')).toEqual(['a', 'b', 'c'])
  })
  it('normalizes CRLF', () => {
    expect(splitIntoParagraphs('a\r\n\r\nb')).toEqual(['a', 'b'])
  })
  it('handles empty input', () => {
    expect(splitIntoParagraphs('')).toEqual([])
    expect(splitIntoParagraphs('   ')).toEqual([])
  })
})
