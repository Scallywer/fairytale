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
  createdAt?: string
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

  // Lazy state init runs once on mount (treated as pure by the React rules)
  // and gives us a stable "now" timestamp for the New-badge cutoff.
  const [nowMs] = useState(() => Date.now())

  const recommended = useMemo(() => {
    const unread = stories.filter((s) => !readIds.has(s.id))
    if (unread.length === 0) return []
    const byShortFirst = [...unread].sort((a, b) => (a.readingTime ?? 99) - (b.readingTime ?? 99))
    return byShortFirst.slice(0, MAX_RECOMMENDED)
  }, [stories, readIds])

  if (recommended.length === 0) return null

  const featured = recommended[0]
  const secondary = recommended.length > 1 ? recommended[1] : null

  const isNew = (createdAt?: string): boolean => {
    if (!createdAt) return false
    return nowMs - new Date(createdAt).getTime() < 1000 * 60 * 60 * 24 * 30
  }
  const isShortRead = (rt?: number): boolean => typeof rt === 'number' && rt > 0 && rt <= 5
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
          <span className="font-label text-on-surface-variant text-sm font-bold tracking-[0.2em] uppercase mb-2 block">
            Za večeras
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface">
            Preporučeno za laku noć
          </h2>
          <p className="font-label text-on-surface-variant/70 text-sm mt-2">
            Kratke nepročitane priče — za brzo uspavljivanje.
          </p>
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
              priority
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
              {isNew(featured.createdAt) && (
                <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-label text-xs font-bold uppercase tracking-wider">
                  Novo
                </span>
              )}
              {isShortRead(featured.readingTime) && !isNew(featured.createdAt) && (
                <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary-container font-label text-xs font-bold uppercase tracking-wider">
                  Kratko
                </span>
              )}
              {featured.readingTime && (
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label text-xs">
                  {featured.readingTime} min naglas
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
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
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
                  {secondary.readingTime} min naglas
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
              <span className="text-primary font-label font-bold flex items-center gap-2 group-hover:gap-4 transition-all motion-reduce:group-hover:gap-2 motion-reduce:transition-none">
                Saznaj više
                <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
              </span>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}
