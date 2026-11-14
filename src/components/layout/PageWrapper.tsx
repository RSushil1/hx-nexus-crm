import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageWrapperProps {
  title?: string
  subtitle?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  maxWidth?: 'default' | 'full' | 'narrow' | 'wide'
}

export function PageWrapper({
  title,
  subtitle,
  badge,
  actions,
  children,
  className,
  maxWidth = 'default',
}: PageWrapperProps) {
  const maxWMap = {
    narrow: 'max-w-4xl',
    default: 'max-w-5xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5', maxWMap[maxWidth], className)}
    >
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-card-border/40">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              {title && (
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {title}
                </h1>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}
