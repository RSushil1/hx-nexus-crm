import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizes = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
}

export function Modal({ open, onClose, title, description, children, className, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 p-4',
            sizes[size]
          )}
        >
          <div className={cn(
            'bg-card-bg border border-card-border rounded-2xl shadow-2xl animate-slide-up',
            className
          )}>
            {(title || description) && (
              <div className="flex items-start justify-between p-6 pb-4 border-b border-card-border">
                <div>
                  {title && (
                    <Dialog.Title className="text-lg font-semibold text-text-primary">{title}</Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="mt-1 text-sm text-text-muted">{description}</Dialog.Description>
                  )}
                </div>
                <Dialog.Close asChild>
                  <button
                    onClick={onClose}
                    className="ml-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
                  >
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>
            )}
            <div className="p-6">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Confirm dialog variant
interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-text-secondary">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
              danger
                ? 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20'
                : 'bg-accent text-accent-btn hover:bg-accent-dark'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
