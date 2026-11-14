import { cn } from '@/lib/utils'

interface LinearProgressProps {
  value: number       // 0–100
  max?: number
  label?: string
  sublabel?: string
  showValue?: boolean
  colorClass?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LinearProgress({
  value, max = 100, label, sublabel, showValue, colorClass = 'bg-accent', className, size = 'md'
}: LinearProgressProps) {
  const pct = Math.min(100, (value / max) * 100)
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-text-secondary">{label}</span>}
          {sublabel && <span className="text-xs text-text-muted">{sublabel}</span>}
          {showValue && <span className="text-xs font-medium text-text-primary">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-card-border rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// Radial / Donut progress ring (SVG)
interface RadialProgressProps {
  value: number       // 0–100
  size?: number       // px
  strokeWidth?: number
  children?: React.ReactNode
  colorClass?: string
  className?: string
}

export function RadialProgress({
  value, size = 80, strokeWidth = 6, children, colorClass = 'text-accent', className
}: RadialProgressProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          strokeWidth={strokeWidth} className="text-card-border" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className={cn('transition-all duration-700', colorClass)} />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  )
}
