import { cn } from '@/lib/utils'

// Generic MetricCard
interface MetricCardProps {
  label: string
  value: string | React.ReactNode
  subValue?: string | React.ReactNode
  icon?: React.ReactNode
  iconBg?: string
  delta?: number
  deltaLabel?: string
  className?: string
  onClick?: () => void
}

export function MetricCard({ label, value, subValue, icon, iconBg, delta, deltaLabel, className, onClick }: MetricCardProps) {
  const isPositive = delta !== undefined && delta >= 0
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card-bg border border-card-border rounded-xl p-5 flex flex-col gap-3',
        onClick && 'cursor-pointer hover:bg-card-hover hover:border-card-border2 transition-all',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBg ?? 'bg-card-hover')}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold tabular-nums text-text-primary tracking-tight">{value}</div>
        {subValue && <div className="text-sm text-text-secondary">{subValue}</div>}
      </div>
      {delta !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-success' : 'text-danger')}>
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(delta).toFixed(2)}</span>
          {deltaLabel && <span className="text-text-muted font-normal">{deltaLabel}</span>}
        </div>
      )}
    </div>
  )
}

// Skeleton loader card
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-card-bg border border-card-border rounded-xl p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 skeleton rounded" />
        <div className="h-9 w-9 skeleton rounded-lg" />
      </div>
      <div className="h-8 w-32 skeleton rounded" />
      <div className="h-3 w-20 skeleton rounded" />
    </div>
  )
}

// Quick action button card
interface QuickActionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  badge?: string | number
  className?: string
}

export function QuickAction({ icon, label, onClick, badge, className }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl bg-card-bg border border-card-border',
        'hover:bg-card-hover hover:border-card-border2 transition-all group relative',
        className
      )}
    >
      {badge !== undefined && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 text-xs font-bold bg-accent text-accent-btn rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors whitespace-nowrap">
        {label}
      </span>
    </button>
  )
}
