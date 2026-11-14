import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  CreditCard,
  Banknote,
  FileText,
  Star,
  Gamepad2,
  Users,
  LifeBuoy,
  CheckCircle2,
  User,
  ShieldAlert,
  Bell,
} from 'lucide-react'
import { user } from '@/data/user'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
  onCloseMobile?: () => void
}

export function Sidebar({ className, onCloseMobile }: SidebarProps) {
  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Dashboard', to: '/', icon: LayoutGrid },
      ],
    },
    {
      label: 'MONEY',
      items: [
        { label: 'Accounts', to: '/accounts', icon: CreditCard },
        { label: 'Fund', to: '/fund', icon: Banknote },
        { label: 'Statements', to: '/statements', icon: FileText },
      ],
    },
    {
      label: 'ENGAGEMENT',
      items: [
        { label: 'Rewards', to: '/rewards', icon: Star },
        { label: 'Games', to: '/games', icon: Gamepad2 },
        { label: 'Referrals', to: '/referrals', icon: Users },
      ],
    },
    {
      label: 'YOUR ACCOUNT',
      items: [
        { label: 'Support', to: '/support', icon: LifeBuoy },
        { label: 'Onboarding', to: '/onboarding', icon: CheckCircle2 },
        { label: 'Profile', to: '/profile', icon: User },
        { label: 'Notifications', to: '/notifications', icon: Bell },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'w-64 h-screen bg-card-bg border-r border-card-border flex flex-col justify-between select-none z-30 shrink-0 sticky top-0',
        className
      )}
    >
      {/* Top Header & Trader Card */}
      <div className="flex flex-col p-4 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-1.5 px-2 py-1">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            hx nexus
          </span>
          <span className="w-2 h-2 rounded-full bg-accent inline-block" />
        </div>

        {/* Identity Card */}
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-card-bg border border-card-border/70 hover:border-card-border hover:bg-card-hover transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-bold text-sm flex items-center justify-center shrink-0 border border-accent/30">
            {user.avatar}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {user.firstName}
            </span>
            <span className="text-xs text-text-muted truncate">
              Client · ••rgan
            </span>
          </div>
        </NavLink>
      </div>

      {/* Nav List with custom scrollbar */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-5">
        {navSections.map((sec) => (
          <div key={sec.label} className="space-y-1">
            <div className="px-3 text-[10px] font-semibold text-text-muted tracking-wider uppercase">
              {sec.label}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                        isActive
                          ? 'bg-card-hover text-text-primary border border-card-border shadow-sm'
                          : 'text-text-secondary hover:text-text-primary hover:bg-card-hover/50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className={cn(
                              'transition-colors',
                              isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                            )}
                          />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-accent-glow" />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Compliance Disclaimer */}
      <div className="p-4 border-t border-card-border/60 bg-app-bg/60">
        <div className="flex items-start gap-2 text-text-muted">
          <ShieldAlert size={14} className="shrink-0 mt-0.5 text-text-muted" />
          <p className="text-[11px] leading-tight">
            <strong className="font-semibold text-text-secondary">CRM workspace</strong> · Balances and funding are for account servicing. No dealing or order tools.
          </p>
        </div>
      </div>
    </aside>
  )
}
