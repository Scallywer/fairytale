'use client'

export default function StoryError() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-amber-200 mb-4">
        Ups! Nešto je pošlo po zlu.
      </h1>
      <p className="text-amber-300/80 mb-6">
        Trenutno ne možemo učitati ovu priču. Pokušaj ponovno za nekoliko
        trenutaka.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
      >
        Vrati se na početnu
      </a>
    </div>
  )
}

