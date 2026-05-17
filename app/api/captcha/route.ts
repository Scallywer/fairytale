import { NextResponse } from 'next/server'
import { createCaptchaChallenge } from '@/lib/captcha'

export const dynamic = 'force-dynamic'

export async function GET() {
  const challenge = createCaptchaChallenge()
  return new NextResponse(JSON.stringify(challenge), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
