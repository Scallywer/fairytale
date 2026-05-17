'use client'

import { useEffect, useId, useRef } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  /** Accessible name. If omitted, provide `aria-labelledby` via children. */
  ariaLabel?: string
  /** Optional ID of an element inside `children` that names the dialog. */
  ariaLabelledBy?: string
  /** Optional ID of an element inside `children` that describes it. */
  ariaDescribedBy?: string
  /** Click target inside the dialog that should receive focus on open. */
  initialFocusRef?: React.RefObject<HTMLElement | null>
  /** Where to return focus when the dialog closes. Defaults to the
   *  element focused at open time. */
  returnFocusRef?: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  /** Tailwind classes applied to the dialog panel. */
  panelClassName?: string
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Accessible modal dialog: role="dialog", aria-modal, focus trap on Tab,
 * Escape to close, body scroll lock, and focus restore on unmount.
 *
 * Renders nothing when `open` is false to keep the DOM clean.
 */
export default function Dialog({
  open,
  onClose,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  initialFocusRef,
  returnFocusRef,
  children,
  panelClassName,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const titleFallbackId = useId()

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Capture & restore focus + initial focus
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = (document.activeElement as HTMLElement) ?? null
    // Snapshot the caller-provided return target now; ref.current may
    // have unmounted by cleanup time.
    const explicitReturnTarget = returnFocusRef?.current ?? null

    const id = window.requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
        return
      }
      const panel = panelRef.current
      if (!panel) return
      const first = panel.querySelector<HTMLElement>(FOCUSABLE)
      if (first) first.focus()
      else panel.focus()
    })

    return () => {
      window.cancelAnimationFrame(id)
      const target = explicitReturnTarget ?? previouslyFocusedRef.current
      if (target && typeof target.focus === 'function') {
        try {
          target.focus()
        } catch {
          /* element may have unmounted */
        }
      }
    }
  }, [open, initialFocusRef, returnFocusRef])

  // Keyboard: Esc to close, Tab to trap focus.
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1)
      if (focusables.length === 0) {
        e.preventDefault()
        panel.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const labelProps: Record<string, string> = {}
  if (ariaLabelledBy) labelProps['aria-labelledby'] = ariaLabelledBy
  else if (ariaLabel) labelProps['aria-label'] = ariaLabel
  else labelProps['aria-labelledby'] = titleFallbackId
  if (ariaDescribedBy) labelProps['aria-describedby'] = ariaDescribedBy

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-surface/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={
          panelClassName ??
          'relative bg-surface-container border border-outline-variant/20 rounded-2xl p-8 max-w-md w-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] focus:outline-none'
        }
        {...labelProps}
      >
        {children}
      </div>
    </div>
  )
}
