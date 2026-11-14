import { cn } from '@/lib/utils'

interface TabsProps {
  tabs: { id: string; label: string; badge?: string | number }[]
  active: string
  onChange: (id: string) => void
  variant?: 'pill' | 'underline' | 'segment'
  className?: string
}

export function Tabs({ tabs, active, onChange, variant = 'pill', className }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex gap-1 border-b border-card-border', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors relative',
              tab.id === active
                ? 'text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-card-border rounded-full">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'segment') {
    return (
      <div className={cn('inline-flex items-center bg-card-hover rounded-lg p-1 gap-1', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
              tab.id === active
                ? 'bg-card-bg text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  // pill (default)
  return (
    <div className={cn('flex gap-2 flex-wrap', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-3.5 py-1.5 text-sm font-medium rounded-full transition-all',
            tab.id === active
              ? 'bg-accent/15 text-accent border border-accent/30'
              : 'bg-card-hover text-text-muted border border-transparent hover:text-text-secondary hover:border-card-border'
          )}
        >
          {tab.label}
          {tab.badge !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  )
}
