import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'getStories') {
      const stories = prisma.getAllStories()
      return NextResponse.json(stories)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in admin GET:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, action, storyId } = body

    if (action === 'login') {
      if (verifyAdminPassword(password)) {
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }

    if (action === 'toggleApproval') {
      if (!verifyAdminPassword(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (!storyId) {
        return NextResponse.json({ error: 'Story ID required' }, { status: 400 })
      }

      const updatedStory = prisma.toggleApproval(storyId)
      return NextResponse.json(updatedStory)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in admin POST:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
