'use client'

import { useEffect, useRef, useState } from 'react'

const HOLD_MS = 400

interface Props {
  onExit: () => void
}

/**
 * Tiny "hold to exit" pill for read-aloud mode. Tap-and-hold for 400 ms
 * triggers the exit; a quick tap shows a fill animation but does not fire.
 *
 * Rationale: the previous implementation was a single-tap pill in the
 * top-right corner — exactly where a parent's thumb rests when holding
 * the phone in landscape. A stray brush would exit Naglas and dump the
 * full chrome back onto the page mid-story. A 400 ms hold is short
 * enough to feel responsive and long enough to be intentional.
 */
export default function NaglasExitPill({ onExit }: Props) {
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const firedRef = useRef(false)

  const stop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startTimeRef.current = null
    setProgress(0)
  }

  const tick = (now: number) => {
    if (startTimeRef.current == null) return
    const elapsed = now - startTimeRef.current
    const p = Math.min(elapsed / HOLD_MS, 1)
    setProgress(p)
    if (p >= 1 && !firedRef.current) {
      firedRef.current = true
      stop()
      onExit()
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const begin = () => {
    if (firedRef.current) return
    startTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => stop(), [])

  return (
    <button
      type="button"
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          begin()
        }
      }}
      onKeyUp={stop}
      className="fixed top-4 left-4 z-50 bg-surface-container-high/85 backdrop-blur-md text-on-surface hover:bg-surface-bright rounded-full font-label text-sm flex items-center gap-2 shadow-[var(--shadow-elevation-2)] overflow-hidden select-none touch-manipulation"
      aria-label="Drži za izlaz iz moda čitanja naglas"
    >
      {/* Hold-progress fill */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-primary-container/60"
        style={{ width: `${progress * 100}%`, transition: 'width 0ms linear' }}
      />
      <span className="relative px-4 py-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
        <span>Drži za izlaz</span>
      </span>
    </button>
  )
}
