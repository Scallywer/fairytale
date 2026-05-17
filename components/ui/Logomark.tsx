interface LogomarkProps {
  size?: number
  className?: string
  /** Decorative by default — set ariaLabel to make it announced. */
  ariaLabel?: string
}

/**
 * Site logomark: a crescent moon cradling an open book. Single-stroke,
 * scales clean from 16px to 256px. Used in the nav (~28px), in the
 * footer (~24px), and on OG / favicon (~48px+).
 *
 * Uses `currentColor` so it inherits surrounding text color — pair with
 * `text-primary` for the warm-cream brand tone.
 */
export default function Logomark({ size = 28, className = '', ariaLabel }: LogomarkProps) {
  const hidden = !ariaLabel
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={hidden ? 'true' : undefined}
      aria-label={ariaLabel}
      role={hidden ? undefined : 'img'}
    >
      {/* Crescent — outer arc + inner arc form the moon */}
      <path d="M22 5 a12 12 0 1 0 5 18 a9 9 0 1 1 -5 -18 Z" fill="currentColor" opacity="0.85" stroke="none" />
      {/* Open book — spine + two pages tucked under the crescent */}
      <path d="M5 22 v-7 a3 3 0 0 1 3 -3 h4 a3 3 0 0 1 3 3 v7 z" />
      <path d="M15 22 v-7 a3 3 0 0 1 3 -3 h4 a3 3 0 0 1 3 3 v7 z" />
      <path d="M15 12 v10" />
      {/* Two tiny stars */}
      <circle cx="27" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="24" cy="11" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  )
}
