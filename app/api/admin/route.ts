import { NextRequest, NextResponse } from 'next/server'
import { storiesService } from '@/lib/storiesService'
import { dbHelpers } from '@/lib/db'
import { verifyAdminPassword, verifyAdminCookie, createAdminSessionCookie } from '@/lib/auth'
import { getClientIp, checkAdminLoginRateLimit } from '@/lib/rateLimit'
import {
  adminLoginSchema,
  adminToggleApprovalSchema,
  adminDeleteStorySchema,
  adminApproveCommentSchema,
  adminDeleteCommentSchema,
} from '@/lib/schemas'
import { logger } from '@/lib/logger'

function requireAdmin(request: NextRequest): NextResponse | null {
  const cookieHeader = request.headers.get('cookie')
  if (!verifyAdminCookie(cookieHeader)) {
    return NextResponse.json({ error: 'Neovlašteno' }, { status: 401 })
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'getStories') {
      const err = requireAdmin(request)
      if (err) return err
      const stories = storiesService.getAllStories()
      return NextResponse.json(stories)
    }

    if (action === 'getPendingComments') {
      const err = requireAdmin(request)
      if (err) return err
      const comments = dbHelpers.getPendingComments()
      return NextResponse.json(comments)
    }

    return NextResponse.json({ error: 'Nevažeća akcija' }, { status: 400 })
  } catch (error) {
    logger.error('Error in admin GET:', error)
    return NextResponse.json({ error: 'Greška pri obradi zahtjeva' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const body = await request.json()
    const action = body?.action

    if (action === 'login') {
      const parsed = adminLoginSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Nevaljani podaci' }, { status: 400 })
      }
      if (!checkAdminLoginRateLimit(ip)) {
        return NextResponse.json(
          { error: 'Previše pokušaja. Pokušajte ponovno za sat vremena.' },
          { status: 429 }
        )
      }
      if (!verifyAdminPassword(parsed.data.password)) {
        return NextResponse.json({ error: 'Netočna lozinka' }, { status: 401 })
      }
      const cookie = createAdminSessionCookie()
      const res = NextResponse.json({ success: true })
      res.cookies.set(cookie.name, cookie.value, cookie.options)
      return res
    }

    if (action === 'toggleApproval') {
      const err = requireAdmin(request)
      if (err) return err
      const parsed = adminToggleApprovalSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Potreban ID priče' }, { status: 400 })
      }
      const updatedStory = storiesService.toggleApproval(parsed.data.storyId)
      return NextResponse.json(updatedStory)
    }

    if (action === 'deleteStory') {
      const err = requireAdmin(request)
      if (err) return err
      const parsed = adminDeleteStorySchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Potreban ID priče' }, { status: 400 })
      }
      storiesService.delete(parsed.data.storyId)
      return NextResponse.json({ success: true })
    }

    if (action === 'approveComment') {
      const err = requireAdmin(request)
      if (err) return err
      const parsed = adminApproveCommentSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Potreban ID komentara' }, { status: 400 })
      }
      dbHelpers.approveComment(parsed.data.commentId)
      return NextResponse.json({ success: true })
    }

    if (action === 'deleteComment') {
      const err = requireAdmin(request)
      if (err) return err
      const parsed = adminDeleteCommentSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Potreban ID komentara' }, { status: 400 })
      }
      dbHelpers.deleteComment(parsed.data.commentId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Nevažeća akcija' }, { status: 400 })
  } catch (error) {
    logger.error('Error in admin POST:', error)
    return NextResponse.json({ error: 'Greška pri obradi zahtjeva' }, { status: 500 })
  }
}
