import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'icon'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Renders as a pill (rounded-full). Default true. Set false for boxy. */
  pill?: boolean
  /** Optional leading/trailing icon nodes — should be <Icon /> usually. */
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  /** Adds the amber glow shadow used on the primary site CTA. */
  glow?: boolean
  children?: ReactNode
}

const BASE = 'inline-flex items-center justify-center gap-2 font-label font-bold transition-all motion-reduce:transition-none disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary-container text-on-primary-container hover:scale-[1.02] active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
  secondary:
    'bg-surface-container-high text-on-surface hover:bg-surface-bright',
  ghost:
    'bg-transparent text-on-surface hover:bg-surface-container-high',
  danger:
    'bg-error-container text-on-error-container hover:opacity-90',
  success:
    'bg-success-container text-on-success-container hover:opacity-90',
  icon:
    'bg-transparent text-on-surface hover:bg-surface-container-high',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

const ICON_SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-9 w-9 p-0',
  md: 'h-12 w-12 p-0',
  lg: 'h-14 w-14 p-0',
}

/**
 * Single source of truth for button styling. Replaces ~35 inline pill/CTA
 * blocks across the app. Use:
 *
 *   <Button variant="primary" size="lg" glow>Započni čitanje</Button>
 *   <Button variant="ghost" size="md" leadingIcon={<Icon name="arrow_back" />}>Natrag</Button>
 *   <Button variant="icon" size="md" aria-label="Smanji"><Icon name="remove" /></Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    pill = true,
    glow = false,
    leadingIcon,
    trailingIcon,
    className = '',
    children,
    ...rest
  },
  ref
) {
  const sizeCls = variant === 'icon' ? ICON_SIZE_CLASSES[size] : SIZE_CLASSES[size]
  const radius = pill ? 'rounded-full' : 'rounded-xl'
  const glowCls = glow ? 'shadow-[var(--shadow-glow-primary)]' : ''
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${sizeCls} ${radius} ${glowCls} ${className}`.trim()}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})

export default Button
