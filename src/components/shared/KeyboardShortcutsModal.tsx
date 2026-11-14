import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Keyboard } from 'lucide-react'

interface KeyboardShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { key: 'D', action: 'Navigate to Dashboard Overview' },
    { key: 'A', action: 'Navigate to Accounts Hub' },
    { key: 'F', action: 'Navigate to Cashier (Fund & Withdraw)' },
    { key: 'S', action: 'Navigate to Monthly Statements' },
    { key: 'R', action: 'Navigate to Rewards Hub' },
    { key: 'G', action: 'Navigate to Prediction Arena / Games' },
    { key: '⌘ + K / Ctrl + K', action: 'Open Global Command Palette' },
    { key: '?', action: 'Toggle this Shortcuts Guide' },
    { key: 'Esc', action: 'Close active modal, palette, or drawer' },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Keyboard Navigation Shortcuts"
      description="Quick single-key navigation across the HX Nexus CRM terminal"
      size="sm"
    >
      <div className="space-y-4 text-xs">
        <div className="divide-y divide-card-border/50 border border-card-border rounded-xl overflow-hidden bg-card-bg">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-2.5 hover:bg-card-hover/40 transition-colors">
              <span className="text-text-secondary">{s.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-card-hover border border-card-border text-[11px] font-mono font-bold text-accent shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-text-muted">
          Shortcuts are disabled while typing inside search inputs, ticket messages, or numerical amount fields.
        </p>

        <Button variant="secondary" size="sm" className="w-full" onClick={onClose}>
          Got It
        </Button>
      </div>
    </Modal>
  )
}
