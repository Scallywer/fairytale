'use client'

import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import Icon from './ui/Icon'

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
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }

  if (!isVisible) return null

  return (
    <Button
      variant="primary"
      size="md"
      glow
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 !h-12 !w-12 !p-0"
      aria-label="Povratak na vrh"
    >
      <Icon name="arrow_upward" />
    </Button>
  )
}
