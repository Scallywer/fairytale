import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stranica nije pronađena',
  description: 'Tražena stranica ne postoji. Vratite se na početnu stranicu i pronađite priču za laku noć.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-bold text-amber-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-amber-200 mb-3">Stranica nije pronađena</h1>
        <p className="text-amber-300/90 mb-8">
          Ova priča ne postoji ili je premještena. Možda ćete pronaći nešto lijepo na početnoj stranici!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          Povratak na početnu
        </Link>
      </div>
    </div>
  )
}
