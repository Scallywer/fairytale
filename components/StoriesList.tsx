'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import StoryCard from './StoryCard'

interface Story {
  id: string
  title: string
  author: string
  country: string
  imageUrl?: string
  averageRating?: number
  ratingCount?: number
}

interface StoriesListProps {
  stories: Story[]
}

export default function StoriesList({ stories }: StoriesListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list')

  // Sort stories: unread first, then read
  const sortedStories = useMemo(() => {
    if (typeof window === 'undefined') return stories
    
    const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
    
    const unreadStories = stories.filter(story => !readStories.includes(story.id))
    const readStoriesList = stories.filter(story => readStories.includes(story.id))
    
    return [...unreadStories, ...readStoriesList]
  }, [stories])

  useEffect(() => {
    // Restore scroll position when component mounts
    if (typeof window !== 'undefined') {
      const savedScrollPosition = sessionStorage.getItem('scrollPosition')
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10)
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY)
          sessionStorage.removeItem('scrollPosition')
        })
      }
    }
  }, [])

  return (
    <>
      {/* View Toggle */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-1 bg-slate-700 rounded-lg p-1 border border-slate-600">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-amber-600 text-white'
                : 'text-amber-300/70 hover:text-amber-300'
            }`}
            aria-label="List view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'gallery'
                ? 'bg-amber-600 text-white'
                : 'text-amber-300/70 hover:text-amber-300'
            }`}
            aria-label="Gallery view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stories */}
      {sortedStories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-amber-300/70 text-lg">
            Još nema odobrenih priča. Provjeri admin stranicu!
          </p>
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'flex flex-col gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
          {sortedStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              author={story.author}
              country={story.country}
              imageUrl={story.imageUrl}
              viewMode={viewMode}
              averageRating={story.averageRating}
              ratingCount={story.ratingCount}
            />
          ))}
        </div>
      )}
    </>
  )
}
