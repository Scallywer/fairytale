import type { ReactNode } from 'react'

type Variant = 'default' | 'inset' | 'interactive' | 'flat'

interface CardProps {
  variant?: Variant
  /** Tailwind padding utility — default `p-6`. Override for compact rows. */
  padding?: string
  /** Tailwind border-radius utility — default `rounded-xl`. */
  radius?: string
  /** Show a subtle outline-variant border. */
  bordered?: boolean
  className?: string
  children?: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  // Default: a card on the page background.
  default: 'bg-surface-container-low',
  // Inset: nested inside another card or panel.
  inset: 'bg-surface-container-lowest',
  // Interactive: hover-elevates to a higher surface.
  interactive:
    'bg-surface-container-low hover:bg-surface-container-high transition-colors motion-reduce:transition-none',
  // Flat: no fill (e.g. for content groupings on dark surfaces).
  flat: '',
}

/**
 * Container card. Replaces the duplicated
 * `bg-surface-container-low rounded-xl …` pattern repeated across
 * StoryCard, RecommendedTonight, StoryReader (related stories,
 * end-of-story panel), and Comments.
 */
export default function Card({
  variant = 'default',
  padding = 'p-6',
  radius = 'rounded-xl',
  bordered = false,
  className = '',
  children,
}: CardProps) {
  const border = bordered ? 'border border-outline-variant/15' : ''
  return (
    <div className={`${VARIANT_CLASSES[variant]} ${radius} ${padding} ${border} ${className}`.trim()}>
      {children}
    </div>
  )
}
