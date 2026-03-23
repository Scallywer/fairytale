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

export default function StoryCard({
  id,
  title,
  author,
  imageUrl,
  viewMode = 'gallery',
  averageRating,
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

  const getThumbnailColor = (t: string) => {
    const colors = [
      'from-amber-900/60 to-surface-container-low',
      'from-indigo-900/60 to-surface-container-low',
      'from-emerald-900/60 to-surface-container-low',
      'from-rose-900/60 to-surface-container-low',
      'from-violet-900/60 to-surface-container-low',
      'from-cyan-900/60 to-surface-container-low',
    ]
    return colors[t.charCodeAt(0) % colors.length]
  }

  const firstLetter = title.charAt(0).toUpperCase()

  // List mode
  if (viewMode === 'list') {
    return (
      <Link href={`/story/${id}`}>
        <div className={`group bg-surface-container-low p-4 rounded-xl flex gap-4 transition-all duration-[400ms] hover:bg-surface-container-high ${mounted && isRead ? 'opacity-50' : ''}`}>
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getThumbnailColor(title)} flex items-center justify-center text-3xl font-bold text-white/70`}>
                {firstLetter}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-headline text-lg leading-tight mb-1 text-on-surface group-hover:text-primary transition-colors truncate">
                {title}
              </h4>
              {mounted && isRead && (
                <span className="material-symbols-outlined text-primary-container text-lg ml-2 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
            </div>
            <p className="font-label text-xs text-on-surface-variant mb-3">{author}</p>
            <div className="flex items-center gap-4">
              {averageRating != null && averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label text-xs text-on-surface">{averageRating.toFixed(1)}</span>
                </div>
              )}
              {readingTime != null && readingTime > 0 && (
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="font-label text-xs">{readingTime} min</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Gallery mode (default)
  return (
    <Link href={`/story/${id}`}>
      <article className={`group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-all duration-[400ms] flex flex-col h-full shadow-lg hover:-translate-y-2 ${mounted && isRead ? 'opacity-50' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getThumbnailColor(title)} flex items-center justify-center text-6xl font-bold text-white/40`}>
              {firstLetter}
            </div>
          )}
          {averageRating != null && averageRating > 0 && (
            <div className="absolute top-4 right-4 bg-surface-container/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-white text-xs font-bold font-label">{averageRating.toFixed(1)}</span>
            </div>
          )}
          {mounted && isRead && (
            <div className="absolute top-4 left-4 bg-surface-container/80 backdrop-blur-md p-1.5 rounded-full">
              <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-primary-container">
              {author}
            </span>
            {readingTime != null && readingTime > 0 && (
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-[11px] font-label">{readingTime} min</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/10">
            <span className="text-xs font-label text-on-surface-variant italic">
              Autor: {author}
            </span>
            <div className="flex items-center gap-3">
              {readCount != null && (
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">visibility</span>
                  <span className="text-[10px] font-label">{readCount >= 1000 ? `${(readCount / 1000).toFixed(1)}k` : readCount}</span>
                </div>
              )}
              {commentCount != null && (
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">chat_bubble</span>
                  <span className="text-[10px] font-label">{commentCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
