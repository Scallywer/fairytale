'use client'

import { useCallback, useEffect, useState } from 'react'
import { logger } from '@/lib/logger'

interface Comment {
  id: string
  storyId: string
  authorName: string
  content: string
  createdAt: string
}

interface CommentsProps {
  storyId: string
}

export default function Comments({ storyId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    authorName: '',
    content: '',
    mathAnswer: '',
    honeypot: ''
  })

  const [mathQuestion, setMathQuestion] = useState<{ question: string; answer: number } | null>(null)

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setMathQuestion({
      question: `Koliko je ${num1} + ${num2}?`,
      answer: num1 + num2
    })
  }

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?storyId=${storyId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (err) {
      logger.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }, [storyId])

  useEffect(() => {
    generateMathQuestion()
    fetchComments()
  }, [storyId, fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    if (!mathQuestion || Number(formData.mathAnswer) !== mathQuestion.answer) {
      setMessage({ type: 'error', text: 'Netočan odgovor na matematičko pitanje' })
      setSubmitting(false)
      generateMathQuestion()
      return
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId,
          authorName: formData.authorName,
          content: formData.content,
          mathAnswer: Number(formData.mathAnswer),
          honeypot: formData.honeypot
        })
      })

      if (response.ok) {
        setFormData({ authorName: '', content: '', mathAnswer: '', honeypot: '' })
        setMessage({ type: 'success', text: 'Komentar je poslan i čeka odobrenje moderatora.' })
        generateMathQuestion()
        setTimeout(() => setMessage(null), 5000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Greška pri slanju komentara' })
        generateMathQuestion()
      }
    } catch {
      setMessage({ type: 'error', text: 'Greška pri slanju komentara' })
      generateMathQuestion()
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hr-HR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="mt-24 mb-32">
      <h2 id="comments-heading" className="font-headline text-3xl text-primary mb-10">
        Komentari ({comments.length})
      </h2>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-on-surface-variant font-label">Učitavanje komentara...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant font-label">
          Još nema komentara. Budite prvi koji će komentirati!
        </div>
      ) : (
        <div className="space-y-8 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary-container">person</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label font-bold text-on-surface">{comment.authorName}</span>
                  <span className="font-label text-xs text-on-surface-variant">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="font-body text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      <div className="pt-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="authorName" className="block font-label text-sm font-medium text-on-surface mb-2">
                Vaše ime (opcionalno)
              </label>
              <input
                type="text"
                id="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full bg-surface-container-low border-none rounded-full py-3 px-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/20 focus:outline-none font-label"
                placeholder="Ako ostavite prazno, bit ćete prikazani kao 'Anonimno'"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="content" className="block font-label text-sm font-medium text-on-surface mb-2">
                Vaš komentar *
              </label>
              <textarea
                id="content"
                required
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none resize-none font-body"
                placeholder="Napišite svoj komentar..."
                maxLength={1000}
              />
              <p className="text-xs text-on-surface-variant/50 mt-1 font-label">
                {formData.content.length}/1000 znakova
              </p>
            </div>

            {mathQuestion && (
              <div>
                <label htmlFor="mathAnswer" className="block font-label text-sm font-medium text-on-surface mb-2">
                  {mathQuestion.question} *
                </label>
                <p id="math-caption" className="text-xs text-on-surface-variant/60 mb-1 font-label">
                  Jednostavno pitanje za zaštitu od robota. Unesite broj (0-20).
                </p>
                <input
                  type="number"
                  id="mathAnswer"
                  required
                  value={formData.mathAnswer}
                  onChange={(e) => setFormData({ ...formData, mathAnswer: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-full py-3 px-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container/20 focus:outline-none font-label"
                  placeholder="Unesite odgovor"
                  aria-describedby="math-caption"
                  min={0}
                  max={20}
                />
              </div>
            )}

            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-full font-label text-sm font-bold hover:bg-surface-bright disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Šalje se...' : 'Pošalji komentar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
