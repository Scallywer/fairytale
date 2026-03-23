'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-amber-200 mb-4">Nešto je pošlo po krivu</h1>
        <p className="text-amber-300/90 mb-6">
          {error.message || 'Došlo je do neočekivane greške.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
          >
            Pokušaj ponovo
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-slate-600 hover:border-slate-500 text-amber-300 rounded-lg font-medium transition-colors"
          >
            Početna
          </Link>
        </div>
      </div>
    </div>
  )
}
