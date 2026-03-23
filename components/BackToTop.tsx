'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-primary-container text-on-primary-container rounded-full shadow-[0_10px_20px_rgba(252,211,77,0.2)] transition-all duration-[400ms] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
      aria-label="Povratak na vrh"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  )
}
