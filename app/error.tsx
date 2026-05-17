'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Do not leak `error.message` to the public — server-side details may
  // describe internals. The optional `digest` is enough for grepping logs.
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="max-w-md w-full text-center">
        <h1 className="font-headline text-3xl font-bold text-primary-container mb-4">
          Nešto je pošlo po krivu
        </h1>
        <p className="font-body text-on-surface-variant mb-2">
          Došlo je do neočekivane greške.
        </p>
        {error.digest && (
          <p className="font-label text-xs text-on-surface-variant/50 mb-6">
            Šifra greške: <code className="font-mono">{error.digest}</code>
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-label font-bold hover:scale-[1.02] transition-all motion-reduce:hover:scale-100 motion-reduce:transition-none"
          >
            Pokušaj ponovo
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-outline-variant/30 text-on-surface hover:bg-surface-container-high rounded-full font-label font-bold transition-colors motion-reduce:transition-none"
          >
            Početna
          </Link>
        </div>
      </div>
    </div>
  )
}
