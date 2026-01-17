'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Story {
  id: string
  title: string
  author: string
  body: string
  isApproved: boolean
  createdAt: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
        fetchStories()
      } else {
        setLoading(false)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'login' }),
    })

    if (response.ok) {
      sessionStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      fetchStories()
    } else {
      alert('Netočna lozinka')
    }
  }

  const fetchStories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin?action=getStories')
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (storyId: string, currentStatus: boolean) => {
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId, action: 'toggleApproval', password }),
    })

    if (response.ok) {
      fetchStories()
    } else {
      alert('Greška pri ažuriranju')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Link
            href="/"
            className="text-amber-300 hover:text-amber-200 mb-6 text-sm flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Povratak na početnu
          </Link>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-amber-200 mb-4">Admin pristup</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-amber-200 mb-2">
                  Lozinka
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                Prijava
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const unapprovedStories = stories.filter((s) => !s.isApproved)
  const approvedStories = stories.filter((s) => s.isApproved)

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-amber-200 mb-2">Admin panel</h1>
              <p className="text-amber-300/70 text-sm">Upravljanje pričama</p>
            </div>
            <Link
              href="/"
              className="text-amber-300 hover:text-amber-200 text-sm flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Početna
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8 text-amber-300/70">Učitavanje...</div>
        ) : (
          <>
            {/* Unapproved Stories */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-amber-200 mb-4">
                Priče koje čekaju odobrenje ({unapprovedStories.length})
              </h2>
              {unapprovedStories.length === 0 ? (
                <p className="text-amber-300/70">Nema priča koje čekaju odobrenje.</p>
              ) : (
                <div className="space-y-4">
                  {unapprovedStories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-amber-200 mb-2">{story.title}</h3>
                          <p className="text-amber-300/70 text-sm mb-1">
                            Autor: {story.author}
                          </p>
                          <p className="text-amber-300/50 text-xs">
                            {new Date(story.createdAt).toLocaleDateString('hr-HR')}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleApproval(story.id, story.isApproved)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Odobri
                        </button>
                      </div>
                      <div className="bg-slate-900 rounded p-4 max-h-48 overflow-y-auto">
                        <p className="text-amber-100 text-sm whitespace-pre-line line-clamp-6">
                          {story.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Approved Stories */}
            <section>
              <h2 className="text-2xl font-bold text-amber-200 mb-4">
                Odobrene priče ({approvedStories.length})
              </h2>
              {approvedStories.length === 0 ? (
                <p className="text-amber-300/70">Nema odobrenih priča.</p>
              ) : (
                <div className="space-y-4">
                  {approvedStories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-amber-200 mb-2">{story.title}</h3>
                          <p className="text-amber-300/70 text-sm">
                            Autor: {story.author}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleApproval(story.id, story.isApproved)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Poništi odobrenje
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
