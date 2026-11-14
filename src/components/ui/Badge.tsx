import { cn } from '@/lib/utils'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' | 'live' | 'demo'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<Variant, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger:  'bg-danger/15  text-danger',
  info:    'bg-info/15    text-info',
  neutral: 'bg-card-border text-text-secondary',
  accent:  'bg-accent/15  text-accent',
  live:    'bg-success/15 text-success',
  demo:    'bg-info/15    text-info',
}

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-success': variant === 'success' || variant === 'live',
        'bg-warning': variant === 'warning',
        'bg-danger':  variant === 'danger',
        'bg-info':    variant === 'info' || variant === 'demo',
        'bg-accent':  variant === 'accent',
        'bg-text-muted': variant === 'neutral',
      })} />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    completed:      { variant: 'success', label: 'Completed' },
    active:         { variant: 'success', label: 'Active'    },
    pending:        { variant: 'warning', label: 'Pending'   },
    failed:         { variant: 'danger',  label: 'Failed'    },
    cancelled:      { variant: 'neutral', label: 'Cancelled' },
    resolved:       { variant: 'info',    label: 'Resolved'  },
    closed:         { variant: 'neutral', label: 'Closed'    },
    waiting_broker: { variant: 'warning', label: 'Waiting for broker' },
    open:           { variant: 'accent',  label: 'Open'      },
    funded:         { variant: 'success', label: 'Funded'    },
    pending_kyc:    { variant: 'warning', label: 'Pending KYC' },
    inactive:       { variant: 'neutral', label: 'Inactive'  },
    earned:         { variant: 'success', label: 'Earned'    },
    spent:          { variant: 'info',    label: 'Spent'     },
    expired:        { variant: 'neutral', label: 'Expired'   },
  }
  const { variant, label } = map[status] ?? { variant: 'neutral' as Variant, label: status }
  return <Badge variant={variant} dot>{label}</Badge>
}
