'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SubmitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    body: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Priča je uspješno poslana! Čeka odobrenje.' })
        setFormData({ title: '', author: '', body: '' })
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Greška pri slanju priče.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Greška pri slanju priče.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-amber-300 hover:text-amber-200 mb-4 text-sm flex items-center gap-1 inline-block"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Povratak na početnu
          </Link>
          <h1 className="text-3xl font-bold text-amber-200">Pošalji priču</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-amber-200 mb-2">
              Naslov *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-amber-200 mb-2">
              Autor *
            </label>
            <input
              type="text"
              id="author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-amber-200 mb-2">
              Priča *
            </label>
            <textarea
              id="body"
              required
              rows={15}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500 font-serif text-lg leading-relaxed"
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-900/30 text-green-300 border border-green-700'
                  : 'bg-red-900/30 text-red-300 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Šalje se...' : 'Pošalji priču'}
          </button>
        </form>
      </main>
    </div>
  )
}
