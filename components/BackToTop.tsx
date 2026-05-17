'use client'

import { useEffect, useRef, useState } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      rafRef.current = null
      setIsVisible(window.scrollY > 300)
    }
    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-primary-container text-on-primary-container rounded-full shadow-[0_10px_20px_rgba(252,211,77,0.2)] transition-all duration-[400ms] motion-reduce:transition-none hover:scale-110 motion-reduce:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
      aria-label="Povratak na vrh"
    >
      <span className="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
    </button>
  )
}
