'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#0b1326]">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-amber-200 mb-4">Nešto je pošlo po krivu</h1>
            <p className="text-amber-300/90 mb-6">
              Došlo je do neočekivane greške. Pokušajte ponovo.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              Pokušaj ponovo
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
