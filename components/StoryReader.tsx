'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Comments from './Comments'
import { logger } from '@/lib/logger'
import { splitIntoParagraphs } from '@/lib/utils'

const READ_COUNT_THRESHOLD_MS = 5000

interface RelatedStory {
  id: string
  title: string
  author: string
  readingTime?: number
}

interface StoryReaderProps {
  storyId: string
  title: string
  author: string
  body: string
  imageUrl?: string
  averageRating?: number
  ratingCount?: number
  readingTime?: number
  readCount?: number
  relatedStories?: RelatedStory[]
}

export default function StoryReader({ storyId, title, author, body, imageUrl, averageRating, ratingCount, readingTime, readCount, relatedStories = [] }: StoryReaderProps) {
  const [isRead, setIsRead] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [readProgress, setReadProgress] = useState(0)
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('storyFontSize')
      if (saved) return parseFloat(saved)
    }
    return 1.125
  })
  const [showCopied, setShowCopied] = useState(false)
  const router = useRouter()
  const readCountSentRef = useRef(false)
  const readDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [optimisticReadDelta, setOptimisticReadDelta] = useState(0)
  const displayedReadCount = (readCount ?? 0) + optimisticReadDelta

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setReadProgress(Math.min(scrollTop / docHeight, 1))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => {
      const next = Math.max(0.875, Math.min(2, prev + delta))
      localStorage.setItem('storyFontSize', String(next))
      return next
    })
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  const recordStoryRead = useCallback(() => {
    if (readCountSentRef.current) return
    readCountSentRef.current = true
    if (readDelayTimerRef.current != null) {
      clearTimeout(readDelayTimerRef.current)
      readDelayTimerRef.current = null
    }
    fetch(`/api/stories/${storyId}/read`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setOptimisticReadDelta(1)
        } else {
          readCountSentRef.current = false
        }
      })
      .catch(() => {
        readCountSentRef.current = false
      })
  }, [storyId])

  useEffect(() => {
    const timerId = setTimeout(() => {
      readDelayTimerRef.current = null
      recordStoryRead()
    }, READ_COUNT_THRESHOLD_MS)
    readDelayTimerRef.current = timerId
    return () => {
      clearTimeout(timerId)
      readDelayTimerRef.current = null
    }
  }, [storyId, recordStoryRead])

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
      if (typeof window !== 'undefined') {
        const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
        const storyRatings = JSON.parse(localStorage.getItem('storyRatings') || '{}')
        setIsRead(readStories.includes(storyId))
        if (storyRatings[storyId]) {
          setRating(storyRatings[storyId])
        }
      }
    })
  }, [storyId])

  const markAsRead = () => {
    if (typeof window !== 'undefined') {
      recordStoryRead()
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      if (!readStories.includes(storyId)) {
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
          logger.error('Error submitting rating:', error)
        }
      }

      setIsRead(true)
      setShowRating(false)
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
      router.push('/')
    }
  }

  const handleUnmarkAsRead = () => {
    if (typeof window !== 'undefined') {
      const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
      const updatedReadStories = readStories.filter((id: string) => id !== storyId)
      localStorage.setItem('readStories', JSON.stringify(updatedReadStories))
      setIsRead(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] print:hidden">
        <div
          className="h-full bg-primary-container shadow-[0_0_10px_rgba(252,211,77,0.5)] transition-[width] duration-150"
          style={{ width: `${readProgress * 100}%` }}
        />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-surface/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] print:static print:bg-transparent print:shadow-none">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-on-surface hover:text-primary-container transition-colors duration-[400ms]"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-label font-medium hidden sm:inline">Natrag</span>
            </button>
            <div className="h-8 w-px bg-surface-container-highest hidden sm:block" />
            <div className="min-w-0">
              <h1 className="font-headline text-xl md:text-2xl font-bold text-primary-container tracking-tight truncate">
                {title}
              </h1>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Autor: {author}
                {readingTime != null && readingTime > 0 && <> &bull; {readingTime} min čitanja</>}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-on-surface-variant font-label text-sm">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>{displayedReadCount} pregleda</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Tags & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2">
            {averageRating != null && averageRating > 0 && (
              <span className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-full font-label text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {averageRating.toFixed(1)}
                {ratingCount != null && ratingCount > 0 && <span className="opacity-60 ml-1">({ratingCount})</span>}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-full shadow-inner print:hidden">
            <button
              onClick={() => adjustFontSize(-0.125)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all text-on-surface"
              aria-label="Smanji veličinu teksta"
            >
              <span className="font-label text-sm">A-</span>
            </button>
            <div className="w-px h-4 bg-surface-container-highest" />
            <button
              onClick={() => adjustFontSize(0.125)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all text-on-surface font-bold"
              aria-label="Povećaj veličinu teksta"
            >
              <span className="font-label text-lg">A+</span>
            </button>
            <div className="w-px h-4 bg-surface-container-highest" />
            <button
              onClick={handleShare}
              className="px-6 h-10 flex items-center gap-2 rounded-full bg-surface-container-high hover:bg-surface-bright transition-all text-on-surface relative"
              aria-label="Podijeli priču"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              <span className="font-label text-sm font-medium">Podijeli</span>
              {showCopied && (
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs bg-surface-container-high text-primary px-3 py-1.5 rounded-full whitespace-nowrap font-label shadow-lg">
                  Kopirano!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Story Content */}
        <article className="story-content text-on-surface font-body space-y-8 relative" style={{ fontSize: `${fontSize}rem` }}>
          {(() => {
            const paragraphs = splitIntoParagraphs(body)

            if (paragraphs.length === 0) {
              return <div className="whitespace-pre-line leading-[1.8]">{body}</div>
            }

            const firstParagraph = paragraphs[0]
            const remainingParagraphs = paragraphs.slice(1)

            return (
              <>
                <p className="leading-[1.8] text-on-surface/90 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary-container">
                  {firstParagraph}
                </p>

                {/* Story Image */}
                {imageUrl && (
                  <figure className="my-16 -mx-6 md:-mx-20 overflow-hidden rounded-xl group relative">
                    <div className="relative w-full h-[400px]">
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        sizes="(min-width: 768px) 56rem, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        unoptimized
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                  </figure>
                )}

                {remainingParagraphs.map((paragraph, index) => (
                  <p key={index} className="leading-[1.8] text-on-surface/90">
                    {paragraph}
                  </p>
                ))}
              </>
            )
          })()}
        </article>

        {/* End of Story Section */}
        <div className="mt-20 flex flex-col items-center gap-12 py-16 bg-surface-container-low rounded-xl">
          <div className="text-center space-y-4">
            <h3 className="font-headline text-3xl text-primary-container">Kraj priče</h3>
            <p className="font-label text-on-surface-variant italic">
              Nadamo se da ste uživali u čitanju.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {!mounted || !isRead ? (
              <button
                type="button"
                onClick={markAsRead}
                className="group flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label font-bold hover:scale-[1.02] transition-all duration-[400ms] shadow-[0_10px_20px_rgba(252,211,77,0.2)]"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Označi kao pročitano
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 bg-surface-container-highest px-8 py-4 rounded-full">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-label font-bold text-on-surface">Pročitano</span>
                </div>
                <button
                  type="button"
                  onClick={handleUnmarkAsRead}
                  className="px-6 py-4 bg-surface-container-highest rounded-full font-label text-sm text-on-surface-variant hover:bg-surface-bright transition-all"
                >
                  Poništi oznaku
                </button>
              </>
            )}

            {/* Inline Rating */}
            {mounted && isRead && averageRating != null && averageRating > 0 && (
              <div className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest rounded-full">
                <span className="font-label text-on-surface mr-2">Ocjena:</span>
                <div className="flex gap-1 text-primary-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: star <= Math.round(averageRating) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label text-sm text-on-surface">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Related stories */}
        {relatedStories.length > 0 && (
          <section aria-label="Ostale priče" className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline text-3xl text-primary">Slične priče</h2>
              <div className="h-px flex-1 bg-surface-container-highest mx-8 hidden md:block" />
              <Link href="/" className="font-label text-primary-container hover:underline transition-all">
                Vidi sve
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedStories.map((s) => (
                <Link
                  key={s.id}
                  href={`/story/${s.id}`}
                  className="bg-surface-container-low p-6 rounded-xl group hover:bg-surface-container-high transition-all duration-[400ms]"
                >
                  <span className="font-label text-xs uppercase tracking-widest text-primary-container mb-2 block">
                    {s.author}
                  </span>
                  <h4 className="font-headline text-xl text-on-surface mb-3 group-hover:text-primary transition-colors">
                    {s.title}
                  </h4>
                  {s.readingTime != null && (
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="font-label text-xs">{s.readingTime} min čitanja</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Scroll to comments */}
        <div className="mt-10 print:hidden">
          <a
            href="#comments"
            className="inline-flex items-center gap-2 text-primary-container hover:text-primary font-label font-bold transition-colors"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            Skok na komentare
          </a>
        </div>

        {/* Comments Section */}
        <section id="comments" aria-label="Komentari">
          <Comments storyId={storyId} />
        </section>
      </main>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-high rounded-xl p-8 max-w-md w-full shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl font-bold font-headline text-primary-container mb-4">
              Ocijeni priču
            </h2>
            <p className="text-on-surface-variant mb-6 font-body">
              Koliko bi ocijenio/ocijenila ovu priču?
            </p>

            <div
              className="flex justify-center gap-2 mb-6"
              role="group"
              aria-label="Ocijeni priču od 1 do 5 zvijezda"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded"
                  aria-label={`Ocijeni ${star} zvijezda`}
                  aria-pressed={rating === star}
                >
                  <span
                    className={`material-symbols-outlined text-4xl ${star <= (hoverRating || rating) ? 'text-primary-container' : 'text-surface-container-highest'}`}
                    style={{ fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-primary-container mb-6 font-label">
                Odabrano: {rating} {rating === 1 ? 'zvijezda' : 'zvijezde'}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowRating(false)
                  setRating(0)
                  sessionStorage.removeItem('scrollPosition')
                }}
                className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright font-label font-bold transition-all"
              >
                Odustani
              </button>
              <button
                type="button"
                onClick={handleSkipRating}
                className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright font-label font-bold transition-all"
              >
                Preskoči
              </button>
              <button
                type="button"
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
              >
                Spremi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-surface w-full pt-20 pb-10 print:hidden">
        <div className="flex flex-col items-center gap-8 w-full max-w-7xl mx-auto px-8">
          <div className="text-lg font-headline text-primary-container">Priče za laku noć</div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/" className="text-on-surface/70 hover:text-primary-container transition-colors duration-[400ms] font-body">Početna</Link>
            <Link href="/submit" className="text-on-surface/70 hover:text-primary-container transition-colors duration-[400ms] font-body">Predloži priču</Link>
          </nav>
          <div className="text-on-surface-variant/50 text-sm font-label mt-8">
            &copy; {new Date().getFullYear()} Priče za laku noć. Sva prava pridržana.
          </div>
        </div>
      </footer>
    </div>
  )
}
