import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stories = prisma.getApprovedStories()
    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, body: storyBody, country } = body

    if (!title || !author || !storyBody || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const story = prisma.createStory({
      title,
      author,
      body: storyBody,
      country,
      isApproved: false,
    })

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  }
}
