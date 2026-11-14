import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  FileText,
  Gift,
  Gamepad2,
  Users,
  Headphones,
  ShieldCheck,
  User,
  Bell,
  Sun,
  Moon,
  Search,
  CreditCard,
  ArrowRightLeft,
  Command as CommandIcon,
} from 'lucide-react'
import { useThemeStore } from '@/store'
import { toast } from 'sonner'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-[20%] z-50 -translate-x-1/2 w-full max-w-xl p-0 shadow-2xl animate-scale-in">
          <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search across pages, trading accounts, and quick actions
          </Dialog.Description>
          <div className="overflow-hidden rounded-2xl border border-card-border bg-card-bg text-text-primary shadow-2xl">
            <Command
              className="w-full flex flex-col"
              filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase())) return 1
                return 0
              }}
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 px-4 border-b border-card-border/70 bg-card-bg">
                <Search size={18} className="text-text-muted shrink-0" />
                <Command.Input
                  placeholder="Type a command, page name, or account ID..."
                  className="w-full h-14 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-text-muted bg-card-hover px-2 py-1 rounded border border-card-border shrink-0">
                  ESC to close
                </kbd>
              </div>

              {/* Command Items List */}
              <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
                <Command.Empty className="py-8 text-center text-text-muted">
                  No matching commands or pages found.
                </Command.Empty>

                {/* Group 1: Navigation Pages */}
                <Command.Group
                  heading="Navigation"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                    <span className="ml-auto text-[10px] text-text-muted font-mono">D</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/accounts'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <Wallet size={15} />
                    <span>Accounts Portfolio</span>
                    <span className="ml-auto text-[10px] text-text-muted font-mono">A</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/fund'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <ArrowDownToLine size={15} />
                    <span>Cashier (Deposit & Withdraw)</span>
                    <span className="ml-auto text-[10px] text-text-muted font-mono">F</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/statements'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <FileText size={15} />
                    <span>Monthly Statements Hub</span>
                    <span className="ml-auto text-[10px] text-text-muted font-mono">S</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/rewards'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <Gift size={15} />
                    <span>Rewards & Loyalty Hub</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/games'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <Gamepad2 size={15} />
                    <span>Prediction Arena</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/referrals'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <Users size={15} />
                    <span>Referrals & Affiliate</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/support'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <Headphones size={15} />
                    <span>Help Center & Support Desk</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/onboarding'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <ShieldCheck size={15} />
                    <span>Onboarding & KYC Compliance</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/profile'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <User size={15} />
                    <span>Profile & Security Settings</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/notifications'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <Bell size={15} />
                    <span>Notifications Center</span>
                  </Command.Item>
                </Command.Group>

                {/* Group 2: Trading Accounts */}
                <Command.Group
                  heading="Live Trading Accounts"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider pt-2"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/accounts/acct-live-usd'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <CreditCard size={15} className="text-accent" />
                    <span>Standard Live USD</span>
                    <span className="font-mono text-[10px] text-text-muted">#8839201</span>
                    <span className="ml-auto text-success font-bold font-mono">$10,450.00</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/accounts/acct-raw-usd'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <CreditCard size={15} className="text-accent" />
                    <span>Raw Spread USD</span>
                    <span className="font-mono text-[10px] text-text-muted">#8839202</span>
                    <span className="ml-auto text-success font-bold font-mono">$2,500.00</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/accounts/acct-std-eur'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <CreditCard size={15} className="text-accent" />
                    <span>Standard EUR</span>
                    <span className="font-mono text-[10px] text-text-muted">#8839203</span>
                    <span className="ml-auto text-success font-bold font-mono">€1,320.00</span>
                  </Command.Item>
                </Command.Group>

                {/* Group 3: Quick Actions */}
                <Command.Group
                  heading="Quick Actions"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider pt-2"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => navigate('/accounts/transfer'))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    <ArrowRightLeft size={15} />
                    <span>Make an Internal Account Transfer</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() =>
                      runCommand(() => {
                        toggleTheme()
                        toast.info(`Switched theme to ${theme === 'dark' ? 'Light' : 'Dark'}`)
                      })
                    }
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors aria-selected:bg-accent/15 aria-selected:text-accent font-medium"
                  >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode Theme</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-card-border/70 bg-card-bg/60 text-[11px] text-text-muted">
                <div className="flex items-center gap-3">
                  <span>Navigation: <kbd className="font-mono bg-card-hover px-1 rounded">↑</kbd> <kbd className="font-mono bg-card-hover px-1 rounded">↓</kbd></span>
                  <span>Select: <kbd className="font-mono bg-card-hover px-1 rounded">↵</kbd></span>
                </div>
                <span>HX Nexus Portal v2.0</span>
              </div>
            </Command>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
