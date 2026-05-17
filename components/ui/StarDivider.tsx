/**
 * Decorative section break: hairline · sparkle · hairline.
 * Used between major page sections so the brand voice (constellation /
 * folkloric / bedtime) reads even when no illustration is present.
 *
 * Pure CSS-friendly, currentColor-aware, no fonts required.
 */
export default function StarDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-on-surface-variant/40 ${className}`} aria-hidden="true">
      <span className="flex-1 h-px bg-outline-variant/30" />
      <svg viewBox="0 0 24 24" width="14" height="14" className="text-primary-container/70" aria-hidden="true">
        <path
          d="M12 1 L13.5 9.2 L22 11 L13.5 12.8 L12 21 L10.5 12.8 L2 11 L10.5 9.2 Z"
          fill="currentColor"
        />
      </svg>
      <span className="flex-1 h-px bg-outline-variant/30" />
    </div>
  )
}
