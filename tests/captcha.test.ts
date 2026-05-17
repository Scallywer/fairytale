import { describe, it, expect } from 'vitest'
import { createCaptchaChallenge, verifyCaptcha } from '../lib/captcha'

describe('captcha', () => {
  it('mints a token and accepts its own answer', () => {
    const ch = createCaptchaChallenge()
    const answer = Number(ch.token.split('.')[0])
    expect(verifyCaptcha(ch.token, answer)).toBe(true)
  })

  it('rejects a wrong answer', () => {
    const ch = createCaptchaChallenge()
    const answer = Number(ch.token.split('.')[0])
    expect(verifyCaptcha(ch.token, answer + 1)).toBe(false)
  })

  it('rejects a tampered signature', () => {
    const ch = createCaptchaChallenge()
    const answer = Number(ch.token.split('.')[0])
    const tampered = ch.token.slice(0, -1) + (ch.token.slice(-1) === 'a' ? 'b' : 'a')
    expect(verifyCaptcha(tampered, answer)).toBe(false)
  })

  it('rejects a tampered answer slot', () => {
    const ch = createCaptchaChallenge()
    const parts = ch.token.split('.')
    parts[0] = '999' // change the claimed answer
    expect(verifyCaptcha(parts.join('.'), 999)).toBe(false)
  })

  it('rejects empty / malformed tokens', () => {
    expect(verifyCaptcha(undefined, 1)).toBe(false)
    expect(verifyCaptcha('', 1)).toBe(false)
    expect(verifyCaptcha('a.b', 1)).toBe(false)
    expect(verifyCaptcha('a.b.c.d.e', 1)).toBe(false)
  })

  it('produces a Croatian question string with two single-digit operands', () => {
    const ch = createCaptchaChallenge()
    expect(ch.question).toMatch(/^Koliko je \d [+−] \d\?$/)
  })

  it('answer is always non-negative', () => {
    for (let i = 0; i < 100; i++) {
      const ch = createCaptchaChallenge()
      const answer = Number(ch.token.split('.')[0])
      expect(answer).toBeGreaterThanOrEqual(0)
    }
  })
})
