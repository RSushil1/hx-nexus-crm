import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size    = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:   'bg-accent text-accent-btn font-bold hover:bg-amber-400 active:translate-y-[1px] shadow-btn-tactile',
  secondary: 'bg-card-bg text-text-primary border border-card-border hover:border-card-border2 hover:bg-card-hover active:translate-y-[1px] shadow-sm',
  ghost:     'text-text-secondary hover:text-text-primary hover:bg-card-hover active:translate-y-[1px]',
  danger:    'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 active:translate-y-[1px]',
  outline:   'bg-transparent border border-card-border text-text-secondary hover:border-card-border2 hover:text-text-primary hover:bg-card-hover active:translate-y-[1px]',
}

const sizes: Record<Size, string> = {
  xs: 'h-7  px-2.5 text-xs  rounded-lg gap-1.5',
  sm: 'h-8  px-3   text-xs  rounded-lg gap-1.5 font-semibold',
  md: 'h-9  px-3.5 text-xs  rounded-xl gap-2 font-semibold',
  lg: 'h-10 px-4.5 text-sm  rounded-xl gap-2 font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, icon, iconRight, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? <span className="shrink-0">{icon}</span> : null}
      {children && <span>{children}</span>}
      {iconRight && <span className="shrink-0 ml-auto">{iconRight}</span>}
    </button>
  )
)
Button.displayName = 'Button'
