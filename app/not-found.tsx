import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stranica nije pronađena',
  description: 'Tražena stranica ne postoji. Vratite se na početnu stranicu i pronađite priču za laku noć.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-bold text-primary-container mb-4 font-headline">404</p>
        <h1 className="text-2xl font-bold text-on-surface mb-3 font-headline">Stranica nije pronađena</h1>
        <p className="text-on-surface-variant mb-8 font-body">
          Ova priča ne postoji ili je premještena. Možda ćete pronaći nešto lijepo na početnoj stranici!
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-primary-container text-on-primary-container rounded-full font-label font-bold hover:scale-[1.02] transition-all duration-[400ms] shadow-[0_0_20px_rgba(252,211,77,0.2)]"
        >
          Povratak na početnu
        </Link>
      </div>
    </div>
  )
}
