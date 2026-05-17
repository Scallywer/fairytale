'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DRAFT_KEY = 'submit-story-draft-v1'
const TITLE_MAX = 200
const AUTHOR_MAX = 100
const BODY_MAX = 50_000
const BODY_MIN = 200 // ~30 seconds of read-aloud — anything shorter is too thin

interface Draft {
  title: string
  author: string
  body: string
}

const EMPTY_DRAFT: Draft = { title: '', author: '', body: '' }

export default function SubmitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Draft>(EMPTY_DRAFT)
  const [hydrated, setHydrated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Draft, string>>>({})

  // Hydrate draft from localStorage once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Draft>
        setFormData({
          title: typeof parsed.title === 'string' ? parsed.title : '',
          author: typeof parsed.author === 'string' ? parsed.author : '',
          body: typeof parsed.body === 'string' ? parsed.body : '',
        })
      }
    } catch {
      /* drop malformed drafts */
    }
    setHydrated(true)
  }, [])

  // Autosave on change (debounced via setTimeout, ~500ms).
  useEffect(() => {
    if (!hydrated) return
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
      } catch {
        /* quota or private mode — ignore */
      }
    }, 500)
    return () => window.clearTimeout(t)
  }, [formData, hydrated])

  const update = (field: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Draft, string>> = {}
    if (!formData.title.trim()) errs.title = 'Naslov je obavezan.'
    else if (formData.title.length > TITLE_MAX) errs.title = `Najviše ${TITLE_MAX} znakova.`
    if (!formData.author.trim()) errs.author = 'Autor je obavezan.'
    else if (formData.author.length > AUTHOR_MAX) errs.author = `Najviše ${AUTHOR_MAX} znakova.`
    if (formData.body.trim().length < BODY_MIN) errs.body = `Priča treba imati barem ${BODY_MIN} znakova.`
    else if (formData.body.length > BODY_MAX) errs.body = `Najviše ${BODY_MAX} znakova.`
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const clearDraft = () => {
    setFormData(EMPTY_DRAFT)
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!validate()) {
      setMessage({ type: 'error', text: 'Molimo ispravite naznačene greške.' })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Priča je uspješno poslana! Čeka odobrenje.' })
        clearDraft()
        setTimeout(() => router.push('/'), 2000)
      } else {
        const error = await response.json().catch(() => ({}))
        setMessage({ type: 'error', text: error?.error || 'Greška pri slanju priče.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Greška pri slanju priče.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const bodyChars = formData.body.length
  const titleChars = formData.title.length
  const authorChars = formData.author.length

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-surface/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-on-surface hover:text-primary-container transition-colors duration-[400ms] motion-reduce:transition-none"
          >
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            <span className="font-label font-medium">Natrag</span>
          </Link>
          <div className="h-8 w-px bg-surface-container-highest" />
          <h1 className="font-headline text-xl md:text-2xl font-bold text-primary-container tracking-tight">
            Predloži priču
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <p className="text-on-surface-variant font-body mb-8">
          Vaš nacrt se automatski sprema u pregledniku tijekom pisanja.
          Možete zatvoriti karticu i nastaviti kasnije.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label htmlFor="title" className="font-label text-sm font-bold text-on-surface uppercase tracking-wider">
                Naslov *
              </label>
              <span className={`font-label text-xs ${titleChars > TITLE_MAX ? 'text-error' : 'text-on-surface-variant/60'}`} aria-live="polite">
                {titleChars}/{TITLE_MAX}
              </span>
            </div>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={update('title')}
              maxLength={TITLE_MAX + 50}
              aria-invalid={!!fieldErrors.title || undefined}
              aria-describedby={fieldErrors.title ? 'title-error' : undefined}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container/40 focus:outline-none font-label text-base"
              placeholder="Naslov vaše priče"
            />
            {fieldErrors.title && (
              <p id="title-error" className="mt-2 text-error font-label text-sm">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label htmlFor="author" className="font-label text-sm font-bold text-on-surface uppercase tracking-wider">
                Autor *
              </label>
              <span className={`font-label text-xs ${authorChars > AUTHOR_MAX ? 'text-error' : 'text-on-surface-variant/60'}`} aria-live="polite">
                {authorChars}/{AUTHOR_MAX}
              </span>
            </div>
            <input
              type="text"
              id="author"
              required
              value={formData.author}
              onChange={update('author')}
              maxLength={AUTHOR_MAX + 30}
              aria-invalid={!!fieldErrors.author || undefined}
              aria-describedby={fieldErrors.author ? 'author-error' : undefined}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container/40 focus:outline-none font-label text-base"
              placeholder="Vaše ime"
            />
            {fieldErrors.author && (
              <p id="author-error" className="mt-2 text-error font-label text-sm">{fieldErrors.author}</p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label htmlFor="body" className="font-label text-sm font-bold text-on-surface uppercase tracking-wider">
                Priča *
              </label>
              <span
                className={`font-label text-xs ${bodyChars > BODY_MAX ? 'text-error' : bodyChars < BODY_MIN ? 'text-on-surface-variant/60' : 'text-tertiary-container'}`}
                aria-live="polite"
              >
                {bodyChars.toLocaleString('hr-HR')}/{BODY_MAX.toLocaleString('hr-HR')} znakova
              </span>
            </div>
            <textarea
              id="body"
              required
              rows={15}
              value={formData.body}
              onChange={update('body')}
              maxLength={BODY_MAX + 5_000}
              aria-invalid={!!fieldErrors.body || undefined}
              aria-describedby={fieldErrors.body ? 'body-error' : 'body-hint'}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container/40 focus:outline-none font-body text-lg leading-relaxed resize-none"
              placeholder="Jednom davno, u dalekom kraljevstvu..."
            />
            {fieldErrors.body ? (
              <p id="body-error" className="mt-2 text-error font-label text-sm">{fieldErrors.body}</p>
            ) : (
              <p id="body-hint" className="mt-2 text-on-surface-variant/60 font-label text-xs">
                Preporučena duljina: 1 000 – 8 000 znakova (oko 4–5 minuta čitanja naglas).
              </p>
            )}
          </div>

          <div aria-live="polite" role="status">
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
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={clearDraft}
              disabled={!formData.title && !formData.author && !formData.body}
              className="text-on-surface-variant hover:text-on-surface underline-offset-4 hover:underline disabled:opacity-40 disabled:cursor-not-allowed font-label text-sm"
            >
              Obriši nacrt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-label font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all duration-[400ms] motion-reduce:hover:scale-100 motion-reduce:active:scale-100 motion-reduce:transition-none shadow-[0_0_20px_rgba(252,211,77,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Šalje se...' : 'Pošalji priču'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
