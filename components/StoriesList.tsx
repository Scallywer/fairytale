'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import StoryCard from './StoryCard'

interface Story {
  id: string
  title: string
  author: string
  imageUrl?: string
  averageRating?: number
  ratingCount?: number
  readingTime?: number
  createdAt?: string
}

interface StoriesListProps {
  stories: Story[]
}

export default function StoriesList({ stories }: StoriesListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list')
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxReadingTime, setMaxReadingTime] = useState<number | null>(null)
  const [readStatus, setReadStatus] = useState<'all' | 'read' | 'unread'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'newest' | 'oldest' | 'default'>('default')

  // Get unique authors for filter dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Set(stories.map(s => s.author))
    return Array.from(authors).sort()
  }, [stories])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || selectedAuthor !== null || minRating !== null || maxReadingTime !== null || readStatus !== 'all' || sortBy !== 'default'
  }, [searchQuery, selectedAuthor, minRating, maxReadingTime, readStatus, sortBy])

  // Filtered and sorted stories
  const filteredStories = useMemo(() => {
    if (typeof window === 'undefined') return stories
    
    const readStories = JSON.parse(localStorage.getItem('readStories') || '[]')
    let filtered = [...stories]

    // Apply search query (title and author)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(query) || 
        story.author.toLowerCase().includes(query)
      )
    }

    // Apply author filter
    if (selectedAuthor) {
      filtered = filtered.filter(story => story.author === selectedAuthor)
    }

    // Apply rating filter
    if (minRating !== null) {
      filtered = filtered.filter(story => 
        story.averageRating !== undefined && story.averageRating >= minRating
      )
    }

    // Apply reading time filter
    if (maxReadingTime !== null) {
      filtered = filtered.filter(story => {
        if (!story.readingTime) return false
        if (maxReadingTime === 5) return story.readingTime <= 5
        if (maxReadingTime === 10) return story.readingTime > 5 && story.readingTime <= 10
        if (maxReadingTime === 15) return story.readingTime > 10 && story.readingTime <= 15
        if (maxReadingTime === 999) return story.readingTime > 15
        return true
      })
    }

    // Apply read status filter
    if (readStatus === 'read') {
      filtered = filtered.filter(story => readStories.includes(story.id))
    } else if (readStatus === 'unread') {
      filtered = filtered.filter(story => !readStories.includes(story.id))
    }

    // Apply sorting
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title, 'hr')
          case 'author':
            return a.author.localeCompare(b.author, 'hr')
          case 'rating':
            const ratingA = a.averageRating || 0
            const ratingB = b.averageRating || 0
            return ratingB - ratingA
          case 'newest':
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
          case 'oldest':
            const dateAOld = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateBOld = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateAOld - dateBOld
          default:
            return 0
        }
      })
    } else {
      // Default: maintain original read/unread sorting
      const unreadStories = filtered.filter(story => !readStories.includes(story.id))
      const readStoriesList = filtered.filter(story => readStories.includes(story.id))
      return [...unreadStories, ...readStoriesList]
    }

    return filtered
  }, [stories, searchQuery, selectedAuthor, minRating, maxReadingTime, readStatus, sortBy])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAuthor(null)
    setMinRating(null)
    setMaxReadingTime(null)
    setReadStatus('all')
    setSortBy('default')
  }

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
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži priče..."
            className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Author Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedAuthor || ''}
                onChange={(e) => setSelectedAuthor(e.target.value || null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Svi autori</option>
                {uniqueAuthors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex-shrink-0">
              <select
                value={minRating !== null ? minRating.toString() : ''}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Minimalna ocjena</option>
                <option value="1">1+ zvijezda</option>
                <option value="2">2+ zvijezde</option>
                <option value="3">3+ zvijezde</option>
                <option value="4">4+ zvijezde</option>
                <option value="5">5 zvijezda</option>
              </select>
            </div>

            {/* Reading Time Filter */}
            <div className="flex-shrink-0">
              <select
                value={maxReadingTime !== null ? maxReadingTime.toString() : ''}
                onChange={(e) => setMaxReadingTime(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Sve duljine</option>
                <option value="5">Do 5 min</option>
                <option value="10">5-10 min</option>
                <option value="15">10-15 min</option>
                <option value="999">Preko 15 min</option>
              </select>
            </div>

            {/* Read Status Filter */}
            <div className="flex-shrink-0">
              <select
                value={readStatus}
                onChange={(e) => setReadStatus(e.target.value as 'all' | 'read' | 'unread')}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">Sve priče</option>
                <option value="unread">Nepročitano</option>
                <option value="read">Pročitano</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="default">Zadano (nepročitano prvo)</option>
                <option value="title">Sortiraj po naslovu</option>
                <option value="author">Sortiraj po autoru</option>
                <option value="rating">Sortiraj po ocjeni</option>
                <option value="newest">Najnovije prvo</option>
                <option value="oldest">Najstarije prvo</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Očisti filtere
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex-shrink-0">
            <div className="flex gap-1 bg-slate-700 rounded-lg p-1 border border-slate-600">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-300/70 hover:text-amber-300'
                }`}
                aria-label="Prikaz popisa"
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
                aria-label="Prikaz galerije"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Result Count */}
        {hasActiveFilters && (
          <div className="text-sm text-amber-300/70">
            Prikazano {filteredStories.length} od {stories.length} priča
          </div>
        )}
      </div>

      {/* Stories */}
      {stories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-amber-300/70 text-lg">
            Još nema odobrenih priča. Provjeri admin stranicu!
          </p>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-amber-300/70 text-lg mb-4">
            Nema rezultata za odabrane filtere.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Očisti filtere
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'flex flex-col gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              author={story.author}
              imageUrl={story.imageUrl}
              viewMode={viewMode}
              averageRating={story.averageRating}
              ratingCount={story.ratingCount}
              readingTime={story.readingTime}
            />
          ))}
        </div>
      )}
    </>
  )
}
