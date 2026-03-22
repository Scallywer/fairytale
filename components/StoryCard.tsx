'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface StoryCardProps {
  id: string
  title: string
  author: string
  imageUrl?: string
  viewMode?: 'list' | 'gallery'
  averageRating?: number
  ratingCount?: number
  readingTime?: number
  readCount?: number
  commentCount?: number
}

function StoryCardMetaRow({
  readingTime,
  commentCount = 0,
  readCount = 0,
  size,
}: {
  readingTime?: number
  commentCount?: number
  readCount?: number
  size: 'sm' | 'md'
}) {
  const text = size === 'sm' ? 'text-xs text-amber-400/70' : 'text-sm text-amber-400/70'
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${text}`}>
      {readingTime != null && readingTime > 0 && (
        <span className="inline-flex items-center gap-1 shrink-0">
          <svg className={icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{readingTime} min čitanja</span>
        </span>
      )}
      <span className="inline-flex items-center gap-1 shrink-0" aria-label={`${commentCount} odobrenih komentara`}>
        <svg className={icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20v-4a7 7 0 014-6.305V7a7 7 0 1114 0v.695A7 7 0 0121 12z"
          />
        </svg>
        <span>{commentCount}</span>
      </span>
      <span className="inline-flex items-center gap-1 shrink-0" aria-label={`${readCount} čitanja`}>
        <svg className={icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{readCount}</span>
      </span>
    </div>
  )
}

export default function StoryCard({
  id,
  title,
  author,
  imageUrl,
  viewMode = 'list',
  averageRating,
  ratingCount,
  readingTime,
  readCount,
  commentCount,
}: StoryCardProps) {
  const [isRead, setIsRead] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
      if (typeof window !== 'undefined') {
        const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
        setIsRead(readStories.includes(id))
      }
    })
  }, [id])

  // Generate thumbnail color based on title
  const getThumbnailColor = (title: string) => {
    const colors = [
      'bg-amber-500',
      'bg-amber-600',
      'bg-yellow-600',
      'bg-orange-600',
      'bg-amber-700',
      'bg-yellow-700',
    ]
    const index = title.charCodeAt(0) % colors.length
    return colors[index]
  }

  const firstLetter = title.charAt(0).toUpperCase()

  // Gallery mode layout
  if (viewMode === 'gallery') {
    return (
      <Link href={`/story/${id}`}>
        <div className={`group relative rounded-lg border border-slate-700 bg-slate-800 overflow-hidden transition-all hover:border-amber-500 hover:bg-slate-700 cursor-pointer ${mounted && isRead ? 'opacity-40 grayscale-[60%]' : ''}`}>
          {/* Thumbnail */}
          <div className="relative">
            {imageUrl ? (
              <div className="relative w-full h-64 border-b border-slate-600">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 25rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            ) : (
              <div className={`${getThumbnailColor(title)} flex h-64 items-center justify-center text-5xl font-bold text-white`}>
                {firstLetter}
              </div>
            )}
            {/* Read Checkmark overlay */}
            {mounted && isRead && (
              <div className="absolute top-2 right-2 bg-slate-900/70 rounded-full p-1">
                <svg
                  className="h-5 w-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-amber-200 group-hover:text-amber-100 mb-1 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-amber-300/70 mb-2">
              {author}
            </p>
            <div className="mb-2">
              <StoryCardMetaRow
                readingTime={readingTime}
                commentCount={commentCount}
                readCount={readCount ?? 0}
                size="sm"
              />
            </div>
            {averageRating && averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className="flex gap-0.5"
                  role="img"
                  aria-label={`Ocjena: ${averageRating.toFixed(1)} od 5 zvijezda`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-amber-400">
                  {averageRating.toFixed(1)}
                  {ratingCount && ratingCount > 0 && (
                    <span className="text-xs text-amber-400/60 ml-1">({ratingCount})</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // List mode layout (default)
  return (
      <Link href={`/story/${id}`}>
        <div className={`group relative rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-amber-500 hover:bg-slate-700 cursor-pointer ${mounted && isRead ? 'opacity-40 grayscale-[60%]' : ''}`}>
        <div className="flex flex-col gap-4">
          {/* Title and Checkmark */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-amber-200 group-hover:text-amber-100">
              {title}
            </h3>
            {/* Read Checkmark */}
            {mounted && isRead && (
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div className="flex justify-center">
            {imageUrl ? (
              <div className="relative h-72 w-72 rounded-lg overflow-hidden border border-slate-600">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="18rem"
                  className="object-cover"
                  priority={false}
                />
              </div>
            ) : (
              <div className={`${getThumbnailColor(title)} flex h-72 w-72 items-center justify-center rounded-lg text-6xl font-bold text-white`}>
                {firstLetter}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex flex-col gap-1">
            <p className="text-sm text-amber-300/70">
              {author}
            </p>
            <div className="mt-1">
              <StoryCardMetaRow
                readingTime={readingTime}
                commentCount={commentCount}
                readCount={readCount ?? 0}
                size="md"
              />
            </div>
            {averageRating && averageRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="flex gap-0.5"
                  role="img"
                  aria-label={`Ocjena: ${averageRating.toFixed(1)} od 5 zvijezda`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-base font-medium text-amber-400">
                  {averageRating.toFixed(1)}
                  {ratingCount && ratingCount > 0 && (
                    <span className="text-sm text-amber-400/60 ml-1">({ratingCount})</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
