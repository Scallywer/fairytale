'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Comments from './Comments'

interface StoryReaderProps {
  storyId: string
  title: string
  author: string
  body: string
  imageUrl?: string
  averageRating?: number
  ratingCount?: number
  readingTime?: number
}

export default function StoryReader({ storyId, title, author, body, imageUrl, averageRating, ratingCount, readingTime }: StoryReaderProps) {
  const [isRead, setIsRead] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      const storyRatings = JSON.parse(localStorage.getItem('storyRatings') || '{}')
      setIsRead(readStories.includes(storyId))
      if (storyRatings[storyId]) {
        setRating(storyRatings[storyId])
      }
    }
  }, [storyId])

  const markAsRead = () => {
    if (typeof window !== 'undefined') {
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      if (!readStories.includes(storyId)) {
        // Save scroll position before showing rating
        sessionStorage.setItem('scrollPosition', window.scrollY.toString())
        setShowRating(true)
      }
    }
  }

  const handleRatingSubmit = async () => {
    if (typeof window !== 'undefined') {
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      if (!readStories.includes(storyId)) {
        readStories.push(storyId)
        localStorage.setItem('readStories', JSON.stringify(readStories))
      }
      
      // Submit rating to database if provided
      if (rating > 0) {
        try {
          const userId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          if (!localStorage.getItem('userId')) {
            localStorage.setItem('userId', userId)
          }
          
          await fetch('/api/ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId, rating, userId })
          })
        } catch (error) {
          console.error('Error submitting rating:', error)
        }
      }
      
      setIsRead(true)
      setShowRating(false)
      
      // Navigate back - scroll position will be restored by StoriesList component
      router.push('/')
    }
  }

  const handleSkipRating = () => {
    if (typeof window !== 'undefined') {
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      if (!readStories.includes(storyId)) {
        readStories.push(storyId)
        localStorage.setItem('readStories', JSON.stringify(readStories))
      }
      
      setIsRead(true)
      setShowRating(false)
      
      // Navigate back - scroll position will be restored by StoriesList component
      router.push('/')
    }
  }

  const handleUnmarkAsRead = () => {
    if (typeof window !== 'undefined') {
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      const updatedReadStories = readStories.filter((id: string) => id !== storyId)
      localStorage.setItem('readStories', JSON.stringify(updatedReadStories))
      
      setIsRead(false)
      // Note: We don't remove the rating from the database when unmarking
      // as ratings should persist and be shown to all users
    }
  }

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-8 h-8 ${filled ? 'text-amber-400' : 'text-slate-600'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm md:sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="text-amber-300 hover:text-amber-200 mb-2 text-sm flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Povratak na početnu
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-200 mb-1">{title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="text-amber-300/70 text-sm">
              {author}
            </p>
            {readingTime && (
              <div className="flex items-center gap-1 text-sm text-amber-400/70">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readingTime} min čitanja</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-amber-100 leading-relaxed text-lg md:text-xl font-serif">
            {(() => {
              // Split body into paragraphs
              const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0)
              
              if (paragraphs.length === 0) {
                return <div className="whitespace-pre-line">{body}</div>
              }
              
              const firstParagraph = paragraphs[0]
              const remainingParagraphs = paragraphs.slice(1)
              
              return (
                <>
                  {/* First Paragraph */}
                  <p className="mb-6">{firstParagraph.trim()}</p>
                  
                  {/* Story Image */}
                  {imageUrl && (
                    <div className="my-8 flex justify-center">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="rounded-lg shadow-2xl max-w-md w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Remaining Paragraphs */}
                  {remainingParagraphs.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'mb-6' : 'mb-6'}>
                      {paragraph.trim()}
                    </p>
                  ))}
                </>
              )
            })()}
          </div>
        </div>

        {/* Mark as Read Button */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          {!mounted || !isRead ? (
            <button
              onClick={markAsRead}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Označi kao pročitano
            </button>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-amber-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Pročitano</span>
              </div>
              {averageRating && averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-amber-300 text-sm font-medium">
                    {averageRating.toFixed(1)}
                    {ratingCount && ratingCount > 0 && (
                      <span className="text-xs text-amber-300/60 ml-1">({ratingCount})</span>
                    )}
                  </span>
                </div>
              )}
              <button
                onClick={handleUnmarkAsRead}
                className="px-4 py-2 border border-slate-600 hover:border-slate-500 text-amber-300 rounded-lg text-sm transition-colors"
              >
                Poništi oznaku
              </button>
            </div>
          )}
        </div>

        {/* Rating Modal */}
        {showRating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-amber-200 mb-4">
                Ocijeni priču
              </h2>
              <p className="text-amber-300/70 mb-6">
                Koliko bi ocijenio/ocijenila ovu priču?
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Ocijeni ${star} zvijezda`}
                  >
                    <StarIcon filled={star <= (hoverRating || rating)} />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="text-center text-amber-300 mb-6">
                  Odabrano: {rating} {rating === 1 ? 'zvijezda' : 'zvijezde'}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowRating(false)
                    setRating(0)
                    sessionStorage.removeItem('scrollPosition')
                  }}
                  className="px-4 py-2 border border-slate-600 hover:border-slate-500 text-amber-300 rounded-lg transition-colors"
                >
                  Odustani
                </button>
                <button
                  onClick={handleSkipRating}
                  className="px-4 py-2 border border-slate-600 hover:border-slate-500 text-amber-300 rounded-lg transition-colors"
                >
                  Preskoči
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Spremi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <Comments storyId={storyId} />
      </div>
    </div>
  )
}
