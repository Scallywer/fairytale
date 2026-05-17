import Image from 'next/image'
import type { CSSProperties } from 'react'

interface HeroImageProps {
  src: string
  alt: string
  /** Aspect ratio class — e.g. "aspect-[4/3]", "aspect-[16/9]". Default `aspect-[4/3]`. */
  aspect?: string
  /** next/image sizes attribute. */
  sizes?: string
  /** Above-the-fold marker — sets fetchPriority + skips lazy load. */
  priority?: boolean
  /** "soft" = top→surface gradient at 60% (for text-over-image cards).
   *  "edge" = thin bottom gradient only (for unframed editorial figures).
   *  "none" = no overlay. */
  overlay?: 'soft' | 'edge' | 'none'
  /** When true, the image saturation is muted by 30% — call site uses
   *  this on cards where the image is decoration and the text must win. */
  muted?: boolean
  className?: string
  /** Rounded-corner Tailwind class — default `rounded-xl`. */
  radius?: string
}

/**
 * Single overlay/treatment recipe for hero illustrations. Replaces the
 * three different gradient + opacity combinations spread across
 * RecommendedTonight (featured & secondary cards) and StoryReader
 * (article figure), each of which used a slightly different
 * `opacity-40/60` + gradient mix. The Naglas-mode CSS filter on images
 * applies on top of this via the `:root[data-reading-mode="naglas"]`
 * rule in globals.css.
 */
export default function HeroImage({
  src,
  alt,
  aspect = 'aspect-[4/3]',
  sizes = '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  overlay = 'soft',
  muted = false,
  className = '',
  radius = 'rounded-xl',
}: HeroImageProps) {
  // Until the alpine+sharp runtime optimizer story is fixed, we serve
  // /public images raw. TODO: pre-build webp variants in scripts/ and
  // remove `unoptimized` once the responsive pipeline ships.
  const filterStyle: CSSProperties | undefined = muted
    ? { filter: 'saturate(0.7) brightness(0.9)' }
    : undefined

  return (
    <div className={`relative overflow-hidden ${radius} ${aspect} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={filterStyle}
        unoptimized
      />
      {overlay === 'soft' && (
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
      )}
      {overlay === 'edge' && (
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface/80 to-transparent" />
      )}
    </div>
  )
}
