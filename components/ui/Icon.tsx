import type { CSSProperties } from 'react'

const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '4xl': 'text-4xl',
} as const

type IconSize = keyof typeof SIZE_CLASSES

interface IconProps {
  /** Material Symbols Outlined glyph name, e.g. "play_arrow", "star". */
  name: string
  /** Visual size — maps to Tailwind text-* size. Default `md`. */
  size?: IconSize
  /** Active state — toggles the FILL axis on the variable font. Default false. */
  filled?: boolean
  /** Extra Tailwind classes (typically text color). */
  className?: string
  /** Override the aria-hidden default (true) — only set when the icon
   *  conveys meaning that isn't redundant with surrounding text. */
  ariaHidden?: boolean
  /** Accessible name for the rare case where the icon is meaningful and
   *  there's no adjacent label. Requires ariaHidden=false. */
  ariaLabel?: string
}

/**
 * Material Symbols Outlined icon. Wraps the manual
 * `<span className="material-symbols-outlined">name</span>` pattern used
 * across the codebase and bakes in the FILL toggle + aria-hidden default.
 */
export default function Icon({
  name,
  size = 'md',
  filled = false,
  className = '',
  ariaHidden = true,
  ariaLabel,
}: IconProps) {
  const style: CSSProperties | undefined = filled
    ? { fontVariationSettings: "'FILL' 1" }
    : undefined
  return (
    <span
      className={`material-symbols-outlined ${SIZE_CLASSES[size]} ${className}`}
      style={style}
      aria-hidden={ariaHidden ? 'true' : undefined}
      aria-label={ariaHidden ? undefined : ariaLabel}
      role={ariaHidden ? undefined : 'img'}
    >
      {name}
    </span>
  )
}
