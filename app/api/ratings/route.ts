import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/db'
import { logger } from '@/lib/logger'

// Generate a simple user ID based on browser fingerprint
function getUserId(): string {
  if (typeof window === 'undefined') {
    return 'anonymous'
  }
  
  // Try to get or create a user ID from localStorage
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userId', userId)
  }
  return userId
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storyId, rating, userId } = body

    if (!storyId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Nevažeći ID priče ili ocjena' }, { status: 400 })
    }

    // Use provided userId or generate one (for server-side requests, we'll need userId from client)
    const finalUserId = userId || 'anonymous'
    
    dbHelpers.submitRating(storyId, finalUserId, rating)
    
    // Get updated average rating
    const ratingInfo = dbHelpers.getAverageRating(storyId)
    
    return NextResponse.json({ 
      success: true,
      averageRating: ratingInfo?.averageRating,
      ratingCount: ratingInfo?.ratingCount || 0
    })
  } catch (error) {
    logger.error('Error submitting rating:', error)
    return NextResponse.json({ error: 'Greška pri slanju ocjene' }, { status: 500 })
  }
}
