import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({
  value,
  title,
  subtitle,
  children,
  className,
}: {
  value: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn('border border-card-border rounded-xl bg-card-bg overflow-hidden', className)}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center justify-between p-4 text-left font-medium transition-all hover:bg-card-hover group'
          )}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
              {title}
            </span>
            {subtitle && <span className="text-xs text-text-muted">{subtitle}</span>}
          </div>
          <ChevronDown
            size={16}
            className="text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down border-t border-card-border p-4 bg-card-bg">
        {children}
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}
