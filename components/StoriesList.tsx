'use client'

import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import StoryCard from './StoryCard'

const EMPTY_READ_IDS: readonly string[] = []

let readIdsCacheKey: string | null = null
let readIdsCached: readonly string[] = EMPTY_READ_IDS

function readReadIdsSnapshot(): readonly string[] {
  if (typeof window === 'undefined') return EMPTY_READ_IDS
  try {
    const raw = localStorage.getItem('readStories')
    const key = raw === null || raw === '' ? '[]' : raw
    if (key === readIdsCacheKey) return readIdsCached
    readIdsCacheKey = key
    const parsed = JSON.parse(key) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) {
      readIdsCached = EMPTY_READ_IDS
    } else {
      readIdsCached = parsed as string[]
    }
    return readIdsCached
  } catch {
    readIdsCacheKey = null
    readIdsCached = EMPTY_READ_IDS
    return EMPTY_READ_IDS
  }
}

function subscribeReadIds(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'readStories' || e.key === null) {
      readIdsCacheKey = null
      onChange()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

function useReadStoryIds() {
  return useSyncExternalStore(subscribeReadIds, readReadIdsSnapshot, () => EMPTY_READ_IDS)
}

interface Story {
  id: string
  title: string
  author: string
  imageUrl?: string
  averageRating?: number
  ratingCount?: number
  readingTime?: number
  readCount?: number
  commentCount?: number
  createdAt?: string
}

interface StoriesListProps {
  stories: Story[]
}

export default function StoriesList({ stories }: StoriesListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('gallery')
  const [visibleCount, setVisibleCount] = useState(20)
  const readIds = useReadStoryIds()

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxReadingTime, setMaxReadingTime] = useState<number | null>(null)
  const [readStatus, setReadStatus] = useState<'all' | 'read' | 'unread'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'newest' | 'oldest' | 'default'>('default')

  // Dropdown states
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const filterDropdownsRef = useRef<HTMLDivElement>(null)

  // Get unique authors for filter dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Set(stories.map(s => s.author))
    return Array.from(authors).sort()
  }, [stories])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || selectedAuthor !== null || minRating !== null || maxReadingTime !== null || readStatus !== 'all' || sortBy !== 'default'
  }, [searchQuery, selectedAuthor, minRating, maxReadingTime, readStatus, sortBy])

  // Filtered and sorted stories (readIds via useSyncExternalStore: SSR [], then client localStorage)
  const filteredStories = useMemo(() => {
    const readStories = readIds
    let filtered = [...stories]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query)
      )
    }

    if (selectedAuthor) {
      filtered = filtered.filter(story => story.author === selectedAuthor)
    }

    if (minRating !== null) {
      filtered = filtered.filter(story =>
        story.averageRating !== undefined && story.averageRating >= minRating
      )
    }

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

    if (readStatus === 'read') {
      filtered = filtered.filter(story => readStories.includes(story.id))
    } else if (readStatus === 'unread') {
      filtered = filtered.filter(story => !readStories.includes(story.id))
    }

    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title, 'hr')
          case 'author':
            return a.author.localeCompare(b.author, 'hr')
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0)
          case 'newest':
            return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
          case 'oldest':
            return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0)
          default:
            return 0
        }
      })
    } else {
      const unreadStories = filtered.filter(story => !readStories.includes(story.id))
      const readStoriesList = filtered.filter(story => readStories.includes(story.id))
      return [...unreadStories, ...readStoriesList]
    }

    return filtered
  }, [stories, readIds, searchQuery, selectedAuthor, minRating, maxReadingTime, readStatus, sortBy])

  const visibleStories = useMemo(
    () => filteredStories.slice(0, visibleCount),
    [filteredStories, visibleCount]
  )
  const hasMore = filteredStories.length > visibleCount
  const loadMore = () => setVisibleCount((c) => c + 20)

  useEffect(() => {
    queueMicrotask(() => setVisibleCount(20))
  }, [searchQuery, selectedAuthor, minRating, maxReadingTime, readStatus, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAuthor(null)
    setMinRating(null)
    setMaxReadingTime(null)
    setReadStatus('all')
    setSortBy('default')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScrollPosition = sessionStorage.getItem('scrollPosition')
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10)
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY)
          sessionStorage.removeItem('scrollPosition')
        })
      }
    }
  }, [])

  // Close when pointer goes down outside the filter controls (avoids racing document click vs toggle)
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const el = filterDropdownsRef.current
      if (!el || el.contains(e.target as Node)) return
      setShowAuthorDropdown(false)
      setShowTimeDropdown(false)
      setShowStatusDropdown(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <section className="space-y-8">
      {/* Toolbar */}
      <div className="bg-surface-container-low rounded-xl p-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="w-full lg:w-1/3 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Traži priču..."
            className="w-full bg-surface-container-lowest border-none rounded-full py-3 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/20 focus:outline-none font-label transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div ref={filterDropdownsRef} className="flex flex-wrap items-center gap-4">
          {/* Author Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowAuthorDropdown(!showAuthorDropdown); setShowTimeDropdown(false); setShowStatusDropdown(false) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer hover:bg-surface-bright transition-colors ${selectedAuthor ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}
            >
              <span className="font-label text-xs font-bold uppercase tracking-wider">{selectedAuthor || 'Autor'}</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            {showAuthorDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-surface-container-high rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-[100] min-w-[200px] py-2 max-h-64 overflow-y-auto">
                <button type="button" onClick={() => { setSelectedAuthor(null); setShowAuthorDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">
                  Svi autori
                </button>
                {uniqueAuthors.map(a => (
                  <button type="button" key={a} onClick={() => { setSelectedAuthor(a); setShowAuthorDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowAuthorDropdown(false); setShowStatusDropdown(false) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer hover:bg-surface-bright transition-colors ${maxReadingTime !== null ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}
            >
              <span className="font-label text-xs font-bold uppercase tracking-wider">Vrijeme</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            {showTimeDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-surface-container-high rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-[100] min-w-[160px] py-2">
                <button type="button" onClick={() => { setMaxReadingTime(null); setShowTimeDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">Sve duljine</button>
                <button type="button" onClick={() => { setMaxReadingTime(5); setShowTimeDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">Do 5 min</button>
                <button type="button" onClick={() => { setMaxReadingTime(10); setShowTimeDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">5-10 min</button>
                <button type="button" onClick={() => { setMaxReadingTime(15); setShowTimeDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">10-15 min</button>
                <button type="button" onClick={() => { setMaxReadingTime(999); setShowTimeDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">Preko 15 min</button>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowAuthorDropdown(false); setShowTimeDropdown(false) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer hover:bg-surface-bright transition-colors ${readStatus !== 'all' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}
            >
              <span className="font-label text-xs font-bold uppercase tracking-wider">Status</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-surface-container-high rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-[100] min-w-[160px] py-2">
                <button type="button" onClick={() => { setReadStatus('all'); setShowStatusDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">Sve priče</button>
                <button type="button" onClick={() => { setReadStatus('unread'); setShowStatusDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">Nepročitano</button>
                <button type="button" onClick={() => { setReadStatus('read'); setShowStatusDropdown(false) }} className="w-full text-left px-4 py-2 text-on-surface font-label text-sm hover:bg-surface-bright transition-colors">Pročitano</button>
              </div>
            )}
          </div>
          </div>

          {hasActiveFilters && (
            <>
              <div className="h-8 w-[1px] bg-outline-variant/30 mx-2" />
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright transition-colors font-label text-xs font-bold"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Očisti
              </button>
            </>
          )}

          <div className="h-8 w-[1px] bg-outline-variant/30 mx-2 hidden lg:block" />

          {/* View Toggle */}
          <div className="flex bg-surface-container-lowest p-1 rounded-full">
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-2 rounded-full transition-colors ${viewMode === 'gallery' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
              aria-label="Prikaz galerije"
            >
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
              aria-label="Prikaz popisa"
            >
              <span className="material-symbols-outlined">format_list_bulleted</span>
            </button>
          </div>
        </div>
      </div>

      {/* Story Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-bold">Sve priče</h2>
          <span className="font-label text-on-surface-variant text-sm">
            Prikazano {filteredStories.length} priča
          </span>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-on-surface-variant text-lg">
              Još nema odobrenih priča. Provjeri admin stranicu!
            </p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-on-surface-variant text-lg mb-4">
              Nema rezultata za odabrane filtere.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-surface-container-high text-primary px-8 py-3 rounded-full font-label font-bold hover:bg-surface-bright transition-all"
              >
                Očisti filtere
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'list'
                ? 'space-y-6'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            }>
              {visibleStories.map((story) => (
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
                  readCount={story.readCount}
                  commentCount={story.commentCount}
                />
              ))}
            </div>
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="bg-surface-container-high text-primary px-10 py-4 rounded-full font-label font-bold hover:bg-surface-bright transition-all flex items-center gap-3"
                >
                  Prikaži više priča
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
