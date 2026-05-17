import type { ReactNode, ElementType } from 'react'

type Variant = 'eyebrow' | 'meta' | 'body' | 'lede' | 'title' | 'display' | 'caption'

interface TextProps {
  as?: ElementType
  variant?: Variant
  className?: string
  children?: ReactNode
}

/**
 * Typography roles. Replaces the `tracking-[0.2em] uppercase font-label
 * text-xs font-bold` cargo-culted eyebrow pattern (9+ places) and the
 * scattered hardcoded sizes. Six roles, one place to tune.
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  eyebrow: 'font-label font-bold text-xs tracking-[0.18em] uppercase text-on-surface-variant',
  meta: 'font-label text-xs text-on-surface-variant',
  body: 'font-body text-base leading-relaxed text-on-surface',
  lede: 'font-body text-lg leading-relaxed text-on-surface',
  title: 'font-headline text-2xl md:text-3xl font-bold text-on-surface',
  display: 'font-headline text-4xl md:text-5xl font-bold text-on-surface',
  caption: 'font-body italic text-sm text-on-surface-variant',
}

export default function Text({ as: Tag = 'span', variant = 'body', className = '', children }: TextProps) {
  return <Tag className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}>{children}</Tag>
}
