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
    } catch {
      setMessage({ type: 'error', text: 'Greška pri slanju priče.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-on-surface hover:text-primary-container transition-colors duration-[400ms]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label font-medium">Natrag</span>
          </Link>
          <div className="h-8 w-px bg-surface-container-highest" />
          <h1 className="font-headline text-xl md:text-2xl font-bold text-primary-container tracking-tight">
            Predloži priču
          </h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-8 py-12 md:py-20">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block font-label text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
              Naslov *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-surface-container-lowest border-none rounded-full py-4 px-8 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/20 focus:outline-none font-label text-lg"
              placeholder="Naslov vaše priče"
            />
          </div>

          <div>
            <label htmlFor="author" className="block font-label text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
              Autor *
            </label>
            <input
              type="text"
              id="author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-surface-container-lowest border-none rounded-full py-4 px-8 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/20 focus:outline-none font-label text-lg"
              placeholder="Vaše ime"
            />
          </div>

          <div>
            <label htmlFor="body" className="block font-label text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
              Priča *
            </label>
            <textarea
              id="body"
              required
              rows={15}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full bg-surface-container-lowest border-none rounded-xl py-4 px-8 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none font-body text-xl leading-relaxed resize-none"
              placeholder="Jednom davno, u dalekom kraljevstvu..."
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl font-label ${
                message.type === 'success'
                  ? 'bg-tertiary-container/20 text-tertiary border border-tertiary-container/30'
                  : 'bg-error-container/20 text-error border border-error/30'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-label font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all duration-[400ms] shadow-[0_0_20px_rgba(252,211,77,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Šalje se...' : 'Pošalji priču'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
