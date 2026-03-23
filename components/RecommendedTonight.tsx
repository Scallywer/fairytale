'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'

interface Story {
  id: string
  title: string
  author: string
  imageUrl?: string
  readingTime?: number
  body?: string
}

interface RecommendedTonightProps {
  stories: Story[]
}

const MAX_RECOMMENDED = 5

export default function RecommendedTonight({ stories }: RecommendedTonightProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const next = () => {
      try {
        const raw = localStorage.getItem('readStories')
        const list = raw ? (JSON.parse(raw) as string[]) : []
        setReadIds(new Set(list))
      } catch {
        setReadIds(new Set())
      }
    }
    queueMicrotask(next)
  }, [])

  const recommended = useMemo(() => {
    const unread = stories.filter((s) => !readIds.has(s.id))
    if (unread.length === 0) return []
    const byShortFirst = [...unread].sort((a, b) => (a.readingTime ?? 99) - (b.readingTime ?? 99))
    return byShortFirst.slice(0, MAX_RECOMMENDED)
  }, [stories, readIds])

  if (recommended.length === 0) return null

  const featured = recommended[0]
  const secondary = recommended.length > 1 ? recommended[1] : null
  const featuredExcerpt = featured.body
    ? featured.body.slice(0, 120).replace(/\s+\S*$/, '') + '...'
    : ''
  const secondaryExcerpt = secondary?.body
    ? secondary.body.slice(0, 80).replace(/\s+\S*$/, '') + '...'
    : ''

  return (
    <section aria-label="Preporučeno za večeras">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="font-label text-primary-container text-sm font-bold tracking-[0.2em] uppercase mb-2 block">
            Izbor urednika
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
            Preporučeno večeras
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        {/* Large Feature Story */}
        <Link
          href={`/story/${featured.id}`}
          className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low aspect-[16/9] md:aspect-auto md:min-h-[420px] block"
        >
          {featured.imageUrl ? (
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-low" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-label text-xs font-bold uppercase tracking-wider">
                Novo
              </span>
              {featured.readingTime && (
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label text-xs">
                  {featured.readingTime} min čitanja
                </span>
              )}
            </div>
            <h3 className="text-3xl md:text-5xl font-headline font-bold text-white mb-4 leading-tight">
              {featured.title}
            </h3>
            {featuredExcerpt && (
              <p className="text-on-surface-variant text-lg mb-8 line-clamp-2">
                {featuredExcerpt}
              </p>
            )}
            <span className="inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label font-bold group-hover:scale-[1.05] transition-transform duration-[400ms]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Započni čitanje
            </span>
          </div>
        </Link>

        {/* Secondary Feature Story */}
        {secondary && (
          <Link
            href={`/story/${secondary.id}`}
            className="md:col-span-4 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[300px] block"
          >
            {secondary.imageUrl ? (
              <Image
                src={secondary.imageUrl}
                alt={secondary.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-low" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              {secondary.readingTime && (
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label text-xs w-fit mb-4">
                  {secondary.readingTime} min čitanja
                </span>
              )}
              <h3 className="text-2xl font-headline font-bold text-white mb-2">
                {secondary.title}
              </h3>
              {secondaryExcerpt && (
                <p className="text-on-surface-variant text-sm mb-6">
                  {secondaryExcerpt}
                </p>
              )}
              <span className="text-primary-container font-label font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                Saznaj više
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}
