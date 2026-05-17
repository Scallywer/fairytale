'use client'

import Link from 'next/link'

export default function StoryError() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary-container mb-4">
        Ups! Nešto je pošlo po zlu.
      </h1>
      <p className="font-body text-on-surface-variant mb-6">
        Trenutno ne možemo učitati ovu priču. Pokušajte ponovno za nekoliko
        trenutaka.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-label font-bold transition-all motion-reduce:transition-none"
      >
        Vrati se na početnu
      </Link>
    </div>
  )
}
