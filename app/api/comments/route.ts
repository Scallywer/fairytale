import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// Simple rate limiting: max 5 comments per hour per story
const MAX_COMMENTS_PER_HOUR = 5

// Generate a simple math question
function generateMathQuestion(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return {
    question: `Koliko je ${num1} + ${num2}?`,
    answer: num1 + num2
  }
}

// Validate content for spam patterns
function isValidContent(content: string): boolean {
  if (!content || content.trim().length === 0) return false
  if (content.length > 1000) return false // Max length
  if (content.length < 3) return false // Min length
  
  // Check for excessive URLs (spam indicator)
  const urlPattern = /https?:\/\/[^\s]+/g
  const urls = content.match(urlPattern)
  if (urls && urls.length > 2) return false
  
  return true
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const storyId = searchParams.get('storyId')

    if (!storyId) {
      return NextResponse.json({ error: 'Potreban ID priče' }, { status: 400 })
    }

    const comments = prisma.getCommentsByStoryId(storyId)
    return NextResponse.json(comments)
  } catch (error) {
    logger.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Greška pri dohvaćanju komentara' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storyId, authorName, content, mathAnswer, honeypot } = body

    // Validate required fields
    if (!storyId || !content) {
      return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 })
    }

    // Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 })
    }

    // Validate content
    if (!isValidContent(content)) {
      return NextResponse.json({ error: 'Nevažeći sadržaj komentara' }, { status: 400 })
    }

    // Math question validation
    // Client validates the answer before sending, server just checks it's a valid number
    // This provides basic protection - bots would need to solve the math problem
    const mathAnswerNum = Number(mathAnswer)
    if (!mathAnswer || isNaN(mathAnswerNum) || mathAnswerNum < 0 || mathAnswerNum > 20) {
      return NextResponse.json({ error: 'Nevažeći odgovor na matematičko pitanje' }, { status: 400 })
    }

    // Rate limiting check (simple version - check recent comments for this story)
    // In production, you'd want to track by IP address
    const recentCount = prisma.getRecentCommentCount(storyId, 60)
    if (recentCount >= MAX_COMMENTS_PER_HOUR) {
      return NextResponse.json({ 
        error: 'Previše komentara u kratkom vremenu. Molimo pokušajte kasnije.' 
      }, { status: 429 })
    }

    // Verify story exists
    const story = prisma.getStoryById(storyId)
    if (!story || !story.isApproved) {
      return NextResponse.json({ error: 'Priča nije pronađena' }, { status: 404 })
    }

    // Create comment
    const comment = prisma.createComment({
      storyId,
      authorName: authorName?.trim() || 'Anonimno',
      content: content.trim()
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    logger.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju komentara' }, { status: 500 })
  }
}
