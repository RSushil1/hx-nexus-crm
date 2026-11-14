import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  prefix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leadingIcon, trailingIcon, prefix, type, className, ...props }, ref) => {
    const [showPwd, setShowPwd] = useState(false)
    const isPassword = type === 'password'

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-sm font-medium text-text-muted select-none">{prefix}</span>
          )}
          {leadingIcon && !prefix && (
            <span className="absolute left-3 text-text-muted">{leadingIcon}</span>
          )}
          <input
            ref={ref}
            type={isPassword ? (showPwd ? 'text' : 'password') : type}
            className={cn(
              'w-full h-10 rounded-lg bg-card-hover border border-card-border text-text-primary text-sm transition-colors',
              'placeholder:text-text-muted',
              'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-danger focus:border-danger focus:ring-danger/30',
              (leadingIcon || prefix) ? 'pl-9' : 'pl-3',
              (trailingIcon || isPassword) ? 'pr-10' : 'pr-3',
              prefix && 'pl-7',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {trailingIcon && !isPassword && (
            <span className="absolute right-3 text-text-muted">{trailingIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Numeric input with quick percentage chips
interface NumericInputProps extends InputProps {
  chips?: { label: string; value: number | string }[]
  onChipSelect?: (val: number | string) => void
  currencyPrefix?: string
}

export function NumericInput({ chips, onChipSelect, currencyPrefix, ...props }: NumericInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Input prefix={currencyPrefix} type="number" min="0" step="0.01" {...props} />
      {chips && (
        <div className="flex gap-2 flex-wrap">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => onChipSelect?.(c.value)}
              className="px-3 py-1 text-xs font-medium rounded-md bg-card-hover border border-card-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
