import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  CreditCard,
  Banknote,
  LifeBuoy,
  MoreHorizontal,
  Star,
  Gamepad2,
  Users,
  CheckCircle2,
  User,
  FileText,
  X,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [showDrawer, setShowDrawer] = useState(false)

  const primaryTabs = [
    { label: 'Dashboard', to: '/', icon: LayoutGrid },
    { label: 'Accounts', to: '/accounts', icon: CreditCard },
    { label: 'Fund', to: '/fund', icon: Banknote },
    { label: 'Support', to: '/support', icon: LifeBuoy },
  ]

  const moreTabs = [
    { label: 'Statements', to: '/statements', icon: FileText },
    { label: 'Rewards', to: '/rewards', icon: Star },
    { label: 'Games', to: '/games', icon: Gamepad2 },
    { label: 'Referrals', to: '/referrals', icon: Users },
    { label: 'Onboarding', to: '/onboarding', icon: CheckCircle2 },
    { label: 'Profile', to: '/profile', icon: User },
    { label: 'Notifications', to: '/notifications', icon: Bell },
  ]

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card-bg/95 backdrop-blur-md border-t border-card-border z-30 flex items-center justify-around px-2">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-lg text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-text-muted hover:text-text-secondary'
                )
              }
            >
              <Icon size={19} />
              <span>{tab.label}</span>
            </NavLink>
          )
        })}

        {/* More Tab Trigger */}
        <button
          onClick={() => setShowDrawer(true)}
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-lg text-[10px] font-medium transition-colors',
            showDrawer ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          <MoreHorizontal size={19} />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-up Drawer for More tabs */}
      {showDrawer && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setShowDrawer(false)}
          />
          <div className="fixed bottom-16 left-0 right-0 bg-card-bg border-t border-card-border rounded-t-2xl z-50 p-4 lg:hidden animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-card-border">
              <span className="text-sm font-bold text-text-primary">More Sections</span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3">
              {moreTabs.map((t) => {
                const Icon = t.icon
                return (
                  <NavLink
                    key={t.to}
                    to={t.to}
                    onClick={() => setShowDrawer(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all text-center',
                        isActive
                          ? 'bg-accent/15 border-accent/40 text-accent font-semibold'
                          : 'bg-card-hover border-card-border text-text-secondary hover:text-text-primary'
                      )
                    }
                  >
                    <Icon size={20} />
                    <span className="text-xs">{t.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
