'use client'

import { useEffect, useState } from 'react'

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

  // Generate math question on mount
  useEffect(() => {
    generateMathQuestion()
    fetchComments()
  }, [storyId])

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setMathQuestion({
      question: `Koliko je ${num1} + ${num2}?`,
      answer: num1 + num2
    })
  }

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?storyId=${storyId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    // Validate math answer
    if (!mathQuestion || Number(formData.mathAnswer) !== mathQuestion.answer) {
      setMessage({ type: 'error', text: 'Netočan odgovor na matematičko pitanje' })
      setSubmitting(false)
      generateMathQuestion() // Generate new question
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
          mathAnswer: formData.mathAnswer,
          honeypot: formData.honeypot
        })
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments([newComment, ...comments])
        setFormData({ authorName: '', content: '', mathAnswer: '', honeypot: '' })
        setMessage({ type: 'success', text: 'Komentar je uspješno poslan!' })
        generateMathQuestion() // Generate new question for next comment
        setTimeout(() => setMessage(null), 3000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Greška pri slanju komentara' })
        generateMathQuestion() // Generate new question
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Greška pri slanju komentara' })
      generateMathQuestion() // Generate new question
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
    <div className="mt-12 pt-8 border-t border-slate-700">
      <h2 className="text-2xl font-bold text-amber-200 mb-6">Komentari</h2>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-amber-300/70">Učitavanje komentara...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-amber-300/70">
          Još nema komentara. Budite prvi koji će komentirati!
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold text-sm">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-200">{comment.authorName}</p>
                    <p className="text-xs text-amber-300/50">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              </div>
              <p className="text-amber-100 whitespace-pre-line ml-10">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-amber-200 mb-4">Ostavite komentar</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-amber-200 mb-2">
              Vaše ime (opcionalno)
            </label>
            <input
              type="text"
              id="authorName"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
              placeholder="Ako ostavite prazno, bit ćete prikazani kao 'Anonimno'"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-amber-200 mb-2">
              Vaš komentar *
            </label>
            <textarea
              id="content"
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
              placeholder="Podijelite svoje misli o ovoj priči..."
              maxLength={1000}
            />
            <p className="text-xs text-amber-300/50 mt-1">
              {formData.content.length}/1000 znakova
            </p>
          </div>

          {mathQuestion && (
            <div>
              <label htmlFor="mathAnswer" className="block text-sm font-medium text-amber-200 mb-2">
                {mathQuestion.question} *
              </label>
              <input
                type="number"
                id="mathAnswer"
                required
                value={formData.mathAnswer}
                onChange={(e) => setFormData({ ...formData, mathAnswer: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                placeholder="Unesite odgovor"
              />
            </div>
          )}

          {/* Honeypot field - hidden from users */}
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
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {submitting ? 'Šalje se...' : 'Pošalji komentar'}
          </button>
        </form>
      </div>
    </div>
  )
}
