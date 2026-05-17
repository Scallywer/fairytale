'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Comments from './Comments'
import Dialog from './Dialog'
import NaglasExitPill from './NaglasExitPill'
import Icon from './ui/Icon'
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
  const [fontSize, setFontSize] = useState(1.125)
  const [showCopied, setShowCopied] = useState(false)
  const [readAloud, setReadAloud] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [dyslexic, setDyslexic] = useState(false)
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null)
  const router = useRouter()
  const readCountSentRef = useRef(false)
  const readDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [optimisticReadDelta, setOptimisticReadDelta] = useState(0)
  const displayedReadCount = (readCount ?? 0) + optimisticReadDelta

  // Reading progress bar + auto-hide sticky header on scroll-down.
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        if (docHeight > 0) setReadProgress(Math.min(scrollTop / docHeight, 1))
        // After 200px of progress, hide the header when scrolling down,
        // reveal when scrolling up. Less than 200px → always show.
        if (scrollTop < 200) {
          setHeaderHidden(false)
        } else {
          const delta = scrollTop - lastY
          if (delta > 4) setHeaderHidden(true)
          else if (delta < -4) setHeaderHidden(false)
        }
        lastY = scrollTop
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => {
      // Range raised to 1.0–2.5 rem. Floor 0.875 was below comfortable
      // read-aloud size on phones; ceiling 2.0 wasn't enough for a propped
      // bedside phone at arm's length.
      const next = Math.max(1.0, Math.min(2.5, prev + delta))
      try { localStorage.setItem('storyFontSize', String(next)) } catch { /* ignore */ }
      return next
    })
  }

  const toggleDyslexic = () => {
    setDyslexic(prev => {
      const next = !prev
      try { localStorage.setItem('storyDyslexic', next ? '1' : '0') } catch { /* ignore */ }
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
        const savedFont = localStorage.getItem('storyFontSize')
        if (savedFont) {
          const parsed = parseFloat(savedFont)
          if (!Number.isNaN(parsed)) setFontSize(parsed)
        }
        if (localStorage.getItem('readAloudMode') === '1') {
          setReadAloud(true)
        }
        if (localStorage.getItem('storyDyslexic') === '1') {
          setDyslexic(true)
        }
      }
    })
  }, [storyId])

  const toggleReadAloud = () => {
    setReadAloud((prev) => {
      const next = !prev
      try {
        localStorage.setItem('readAloudMode', next ? '1' : '0')
      } catch { /* ignore */ }
      if (next) setFontSize((f) => Math.max(f, 1.5))
      return next
    })
  }

  // Apply / remove the candle theme + reading-mode marker on <html>
  // so the whole viewport (including any portal/fixed children) inherits
  // the warm palette + animation suppression.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (readAloud) {
      root.setAttribute('data-theme', 'candle')
      root.setAttribute('data-reading-mode', 'naglas')
    } else {
      root.removeAttribute('data-theme')
      root.removeAttribute('data-reading-mode')
    }
    return () => {
      root.removeAttribute('data-theme')
      root.removeAttribute('data-reading-mode')
    }
  }, [readAloud])

  // Per-story scroll memory in Naglas. Parents get interrupted at
  // bedtime; coming back to paragraph 1 is a tax.
  const NAGLAS_SCROLL_KEY = `naglas:scroll:${storyId}`
  useEffect(() => {
    if (!readAloud || typeof window === 'undefined') return
    // Restore on mount/enter
    const saved = sessionStorage.getItem(NAGLAS_SCROLL_KEY)
    if (saved) {
      const y = Number(saved)
      if (!Number.isNaN(y) && y > 0) {
        window.scrollTo({ top: y, behavior: 'auto' })
      }
    }
    // Persist as the user scrolls — passive listener, debounced via rAF.
    let ticking = false
    const save = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        try { sessionStorage.setItem(NAGLAS_SCROLL_KEY, String(window.scrollY)) } catch { /* ignore */ }
        ticking = false
      })
    }
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readAloud, storyId])

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
          await fetch('/api/ratings', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId, rating })
          })
        } catch (error) {
          logger.error('Error submitting rating:', error)
        }
      }

      setIsRead(true)
      setShowRating(false)
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
    }
  }

  const handleRatingCancel = () => {
    setShowRating(false)
    setRating(0)
    sessionStorage.removeItem('scrollPosition')
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
      {/* Reading progress bar — 2px solid, no glow. Previously a 1px
          bar with a 10px shadow that read as a yellow smear and failed
          to register against the navy surface. */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60] print:hidden bg-surface-container-low">
        <div
          className="h-full bg-primary-container transition-[width] duration-150 motion-reduce:transition-none"
          style={{ width: `${readProgress * 100}%` }}
        />
      </div>

      {/* Sticky Header — hidden in read-aloud mode; auto-hides on
          scroll-down past 200px so the reader can settle into the page. */}
      {!readAloud && (
        <header
          className={`sticky top-0 z-50 bg-surface/60 backdrop-blur-xl shadow-[var(--shadow-elevation-3)] print:static print:bg-transparent print:shadow-none transition-transform duration-[var(--duration)] motion-reduce:transition-none ${
            headerHidden ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="group flex items-center gap-2 text-on-surface hover:text-primary-container transition-colors duration-[400ms] motion-reduce:transition-none"
              >
                <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                <span className="font-label font-medium hidden sm:inline">Natrag</span>
              </button>
              <div className="h-8 w-px bg-surface-container-highest hidden sm:block" />
              <div className="min-w-0">
                <h1 className="font-headline text-xl md:text-2xl font-bold text-primary tracking-tight truncate">
                  {title}
                </h1>
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                  Autor: {author}
                  {readingTime != null && readingTime > 0 && <> &bull; {readingTime} min naglas</>}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-on-surface-variant font-label text-sm">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">visibility</span>
                <span>{displayedReadCount} čitanja</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Read-aloud floating exit pill — moved to top-LEFT (out of the
          thumb's natural swipe arc) and requires a 400ms hold to confirm,
          so an accidental tap doesn't blow the reading moment. The
          progress fill on the pill animates during the hold. */}
      {readAloud && <NaglasExitPill onExit={toggleReadAloud} />}

      {/* Main Content. Default body container = max-w-prose (~65ch),
          the read-aloud sweet spot the visual reviewers flagged. Previously
          max-w-4xl (~90ch) produced ribbon-paragraphs that hurt line tracking
          for parents reading aloud. The figure below still bleeds out via
          negative margins so the illustration can be larger than the prose. */}
      <main className={readAloud ? 'max-w-prose mx-auto px-6 py-20' : 'max-w-prose mx-auto px-6 py-12 md:py-20'}>
        {/* Tags & Controls — collapsed in read-aloud mode */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 ${readAloud ? 'hidden' : ''}`}>
          <div className="flex items-center gap-2">
            {averageRating != null && averageRating > 0 && (
              <span className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-full font-label text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
                {averageRating.toFixed(1)}
                {ratingCount != null && ratingCount > 0 && <span className="opacity-60 ml-1">({ratingCount})</span>}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-full shadow-inner print:hidden">
            <button
              onClick={toggleReadAloud}
              className="px-4 h-12 sm:h-10 flex items-center gap-2 rounded-full hover:bg-surface-container-high transition-all motion-reduce:transition-none text-on-surface"
              aria-label="Uđi u mod čitanja naglas"
              aria-pressed={readAloud}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">menu_book</span>
              <span className="font-label text-sm font-medium">Naglas</span>
            </button>
            <button
              onClick={toggleDyslexic}
              className="px-3 h-12 sm:h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all motion-reduce:transition-none text-on-surface"
              aria-label="Uključi font za disleksiju"
              aria-pressed={dyslexic}
              title="Font prilagođen za disleksiju"
            >
              <span className="font-label text-sm font-medium">Dx</span>
            </button>
            <div className="w-px h-4 bg-surface-container-highest" />
            <button
              onClick={() => adjustFontSize(-0.125)}
              className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all motion-reduce:transition-none text-on-surface"
              aria-label="Smanji veličinu teksta"
            >
              <span className="font-label text-sm">A-</span>
            </button>
            <button
              onClick={() => adjustFontSize(0.125)}
              className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all motion-reduce:transition-none text-on-surface font-bold"
              aria-label="Povećaj veličinu teksta"
            >
              <span className="font-label text-lg">A+</span>
            </button>
            <div className="w-px h-4 bg-surface-container-highest" />
            <button
              onClick={handleShare}
              className="px-6 h-10 flex items-center gap-2 rounded-full bg-surface-container-high hover:bg-surface-bright transition-all motion-reduce:transition-none text-on-surface relative"
              aria-label="Podijeli priču"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">share</span>
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
        <article
          className={`story-content text-on-surface font-body space-y-8 relative ${dyslexic ? 'story-dyslexic' : ''}`}
          style={{ fontSize: `${fontSize}rem` }}
          data-active-para={readAloud ? (activeParagraph ?? -1) : undefined}
          onClick={(e) => {
            if (!readAloud) return
            const target = (e.target as HTMLElement).closest('p')
            if (!target) return
            // Walk the immediate paragraphs (and pacing-hr wrappers) of
            // the article and find which one contains this <p>.
            const articleEl = e.currentTarget as HTMLElement
            const items = Array.from(articleEl.querySelectorAll(':scope > p, :scope > div')) as HTMLElement[]
            let idx = -1
            items.forEach((el, i) => {
              if (el.contains(target)) idx = i
              el.dataset.paraActive = el.contains(target) ? 'true' : 'false'
            })
            setActiveParagraph(idx)
          }}
        >
          {(() => {
            const paragraphs = splitIntoParagraphs(body)

            if (paragraphs.length === 0) {
              return <div className="whitespace-pre-line leading-[1.8]">{body}</div>
            }

            const firstParagraph = paragraphs[0]
            const remainingParagraphs = paragraphs.slice(1)

            return (
              <>
                <p
                  className="leading-[1.8] text-on-surface/90 story-dropcap"
                  style={{ ['--dropcap-size' as string]: `${fontSize * 3}rem` }}
                >
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

                {(() => {
                  // Pacing hairlines: render at ~50% and ~85% of the
                  // remaining-paragraph stream when there are enough
                  // paragraphs to make pacing meaningful (≥6 total).
                  const total = paragraphs.length
                  const halfIdx = total >= 6 ? Math.floor(remainingParagraphs.length * 0.5) - 1 : -1
                  const endIdx = total >= 6 ? Math.floor(remainingParagraphs.length * 0.85) - 1 : -1
                  return remainingParagraphs.map((paragraph, index) => (
                    <div key={index}>
                      {index === halfIdx && (
                        <div className="story-pacing-hr" aria-hidden="true">polovica</div>
                      )}
                      {index === endIdx && index !== halfIdx && (
                        <div className="story-pacing-hr" aria-hidden="true">uskoro kraj</div>
                      )}
                      <p className="leading-[1.8] text-on-surface/90">{paragraph}</p>
                    </div>
                  ))
                })()}
              </>
            )
          })()}
        </article>

        {/* End of Story Section — hidden in Naglas (Phase G adds the
            kid-facing "Još jedna kratka priča?" CTA which lives here). */}
        {!readAloud && (
        <div className="mt-20 flex flex-col items-center gap-12 py-16 bg-surface-container-low rounded-xl">
          <div className="text-center space-y-4">
            <h3 className="font-headline text-3xl text-primary">Kraj priče</h3>
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
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                Označi kao pročitano
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 bg-surface-container-highest px-8 py-4 rounded-full">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
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
                     aria-hidden="true">
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label text-sm text-on-surface">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Related stories — hidden in read-aloud mode */}
        {!readAloud && relatedStories.length > 0 && (
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
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>
                      <span className="font-label text-xs">{s.readingTime} min čitanja</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments — Phase G collapses these behind a <details>; in
            Naglas they're hidden outright since a bedtime device is no
            place to leave a moderated comment. */}
        {!readAloud && (
          <section id="comments" aria-label="Komentari">
            <Comments storyId={storyId} />
          </section>
        )}
      </main>

      <Dialog
        open={showRating}
        onClose={handleRatingCancel}
        ariaLabelledBy="rating-dialog-title"
        ariaDescribedBy="rating-dialog-desc"
        panelClassName="relative bg-surface-container-high rounded-2xl p-8 max-w-md w-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] focus:outline-none"
      >
        <h2 id="rating-dialog-title" className="text-2xl font-bold font-headline text-primary-container mb-4">
          Ocijeni priču
        </h2>
        <p id="rating-dialog-desc" className="text-on-surface-variant mb-6 font-body">
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
              className="transition-transform motion-reduce:transition-none hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded"
              aria-label={`Ocijeni ${star} zvijezda`}
              aria-pressed={rating === star}
            >
              <Icon
                name="star"
                size="4xl"
                filled={star <= (hoverRating || rating)}
                className={star <= (hoverRating || rating) ? 'text-primary-container' : 'text-surface-container-highest'}
              />
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
            onClick={handleRatingCancel}
            className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright font-label font-bold transition-all motion-reduce:transition-none"
          >
            Odustani
          </button>
          <button
            type="button"
            onClick={handleSkipRating}
            className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright font-label font-bold transition-all motion-reduce:transition-none"
          >
            Preskoči
          </button>
          <button
            type="button"
            onClick={handleRatingSubmit}
            disabled={rating === 0}
            className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-all motion-reduce:hover:scale-100 motion-reduce:transition-none"
          >
            Spremi
          </button>
        </div>
      </Dialog>

      {/* Footer — hidden in Naglas to keep the page text-only. */}
      {!readAloud && (
      <footer className="bg-surface w-full pt-20 pb-10 print:hidden">
        <div className="flex flex-col items-center gap-8 w-full max-w-7xl mx-auto px-8">
          <div className="text-lg font-headline text-primary italic">Priče za laku noć</div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/" className="text-on-surface/70 hover:text-primary-container transition-colors duration-[400ms] font-body">Početna</Link>
            <Link href="/submit" className="text-on-surface/70 hover:text-primary-container transition-colors duration-[400ms] font-body">Predloži priču</Link>
          </nav>
          <div className="text-on-surface-variant/50 text-sm font-label mt-8">
            &copy; {new Date().getFullYear()} Priče za laku noć. Sva prava pridržana.
          </div>
        </div>
      </footer>
      )}
    </div>
  )
}
