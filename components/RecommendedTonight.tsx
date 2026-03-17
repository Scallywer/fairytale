'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'

interface Story {
  id: string
  title: string
  author: string
  readingTime?: number
}

interface RecommendedTonightProps {
  stories: Story[]
}

const MAX_RECOMMENDED = 5

export default function RecommendedTonight({ stories }: RecommendedTonightProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('readStories')
      const list = raw ? (JSON.parse(raw) as string[]) : []
      setReadIds(new Set(list))
    } catch {
      setReadIds(new Set())
    }
  }, [])

  const recommended = useMemo(() => {
    const unread = stories.filter((s) => !readIds.has(s.id))
    if (unread.length === 0) return []
    const byShortFirst = [...unread].sort((a, b) => (a.readingTime ?? 99) - (b.readingTime ?? 99))
    return byShortFirst.slice(0, MAX_RECOMMENDED)
  }, [stories, readIds])

  if (recommended.length === 0) return null

  return (
    <section aria-label="Preporučeno za večeras" className="mb-10">
      <h2 className="text-xl font-bold text-amber-200 mb-4">Preporučeno za večeras</h2>
      <p className="text-amber-300/70 text-sm mb-4">
        Još niste pročitali ove priče. Odaberite neku za laku noć.
      </p>
      <ul className="space-y-2">
        {recommended.map((story) => (
          <li key={story.id}>
            <Link
              href={`/story/${story.id}`}
              className="block py-2 px-4 rounded-lg border border-slate-700 bg-slate-800/80 hover:border-amber-500 hover:bg-slate-700/80 text-amber-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <span className="font-medium">{story.title}</span>
              {story.readingTime != null && (
                <span className="text-amber-300/60 text-sm ml-2">({story.readingTime} min)</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
