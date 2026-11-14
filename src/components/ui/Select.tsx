import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { label: string; value: string | number; disabled?: boolean }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-10 px-3.5 pr-10 rounded-lg bg-card-hover border border-card-border text-text-primary text-sm appearance-none cursor-pointer transition-colors',
              'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-danger focus:border-danger focus:ring-danger/30',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value} disabled={opt.disabled} className="bg-card-bg text-text-primary py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
