import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Globe,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  Check,
  ExternalLink,
  ShieldCheck,
  Search,
  HelpCircle,
} from 'lucide-react'
import { useThemeStore, useNotifStore, useAuthStore } from '@/store'
import { user } from '@/data/user'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface HeaderProps {
  onOpenMobileMenu?: () => void
  onOpenCommandPalette?: () => void
  onOpenShortcuts?: () => void
}

export function Header({
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenShortcuts,
}: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, language, setLanguage } = useThemeStore()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifStore()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Signed out of terminal workspace.')
    navigate('/login')
  }

  const [showSnapshot, setShowSnapshot] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showNotifMenu, setShowNotifMenu] = useState(false)
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'read'>('all')

  const unreads = unreadCount()

  // Languages list
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  ]
  const currentLang = languages.find((l) => l.code === language) || languages[0]

  // Filtered notifications
  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'unread') return !n.read
    if (notifFilter === 'read') return n.read
    return true
  })

  // Derive section breadcrumb title
  const getSectionTitle = (pathname: string) => {
    if (pathname === '/') return 'Overview'
    if (pathname.startsWith('/accounts/transfer')) return 'Accounts / Transfer'
    if (pathname.startsWith('/accounts/')) return 'Accounts / Account Detail'
    if (pathname.startsWith('/accounts')) return 'Accounts'
    if (pathname.startsWith('/fund')) return 'Cashier'
    if (pathname.startsWith('/statements')) return 'Statements'
    if (pathname.startsWith('/rewards')) return 'Rewards'
    if (pathname.startsWith('/games')) return 'Games'
    if (pathname.startsWith('/referrals')) return 'Referrals'
    if (pathname.startsWith('/support')) return 'Support'
    if (pathname.startsWith('/onboarding')) return 'Onboarding'
    if (pathname.startsWith('/profile')) return 'Profile'
    return 'Portal'
  }

  return (
    <header className="h-16 px-4 md:px-6 bg-card-bg/95 backdrop-blur-md border-b border-card-border flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Mobile Toggle + Breadcrumb + Demo Snapshot widget */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic section indicator */}
        <span className="text-sm font-semibold text-text-primary hidden sm:inline-block">
          {getSectionTitle(location.pathname)}
        </span>

        {/* Demo Snapshot Widget Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSnapshot(!showSnapshot)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Demo snapshot</span>
            <ChevronDown size={13} className={cn('transition-transform', showSnapshot && 'rotate-180')} />
          </button>

          {showSnapshot && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSnapshot(false)} />
              <div className="absolute left-0 mt-2 w-64 p-3 bg-card-bg border border-card-border rounded-xl shadow-xl z-50 animate-slide-up flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-card-border pb-2">
                  <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Snapshot Overview
                  </span>
                  <span className="text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded font-mono">
                    PROD-DEMO
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-card-border/50">
                    <span className="text-text-muted">Live accounts:</span>
                    <span className="font-semibold text-text-primary">3 active</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-card-border/50">
                    <span className="text-text-muted">Supported Currencies:</span>
                    <span className="font-semibold text-text-primary">USD, EUR</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-text-muted">Open challenges:</span>
                    <span className="font-semibold text-accent">2 in progress</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side controls: Theme, Language, Notifications, Avatar, Sign Out */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Command Palette Trigger Pill */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card-bg border border-card-border text-xs text-text-muted hover:text-text-primary hover:border-accent/40 transition-all shadow-sm"
          title="Search & Quick Actions (Cmd+K)"
        >
          <Search size={14} className="text-accent" />
          <span className="text-[11px]">Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-card-hover border border-card-border font-mono text-[9px] font-bold text-text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Shortcuts Help Button */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          <HelpCircle size={17} />
        </button>

        {/* Theme Switcher Toggle Pill */}
        <button
          onClick={() => {
            toggleTheme()
            toast.info(theme === 'dark' ? 'Switched to Light mode' : 'Switched to Dark mode')
          }}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-text-secondary" />
          )}
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors border border-transparent hover:border-card-border"
          >
            <Globe size={15} />
            <span className="hidden md:inline">{currentLang.label}</span>
            <ChevronDown size={13} className={cn('transition-transform', showLangMenu && 'rotate-180')} />
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 mt-2 w-44 p-1.5 bg-card-bg border border-card-border rounded-xl shadow-xl z-50 animate-slide-up flex flex-col gap-0.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code)
                      setShowLangMenu(false)
                    }}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-colors text-left',
                      language === l.code
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {language === l.code && <Check size={14} className="text-accent" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreads > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 text-[10px] font-bold bg-accent text-accent-btn rounded-full flex items-center justify-center animate-pulse">
                {unreads}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card-bg border border-card-border rounded-xl shadow-2xl z-50 animate-slide-up overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-3.5 border-b border-card-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">Notifications</span>
                    {unreads > 0 && (
                      <span className="text-[10px] font-semibold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                        {unreads} new
                      </span>
                    )}
                  </div>
                  {unreads > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-accent hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Filter tabs */}
                <div className="flex border-b border-card-border text-xs px-3 pt-2 gap-3 bg-app-bg/60">
                  {(['all', 'unread', 'read'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNotifFilter(t)}
                      className={cn(
                        'pb-2 font-medium capitalize transition-colors relative',
                        notifFilter === t
                          ? 'text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent'
                          : 'text-text-muted hover:text-text-secondary'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Notification Items List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-card-border/50">
                  {filteredNotifs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-text-muted">
                      No notifications to show
                    </div>
                  ) : (
                    filteredNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          'p-3.5 flex items-start gap-3 hover:bg-card-hover/80 transition-colors cursor-pointer',
                          !n.read && 'bg-accent/5'
                        )}
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full mt-1.5 shrink-0',
                            !n.read ? 'bg-accent' : 'bg-transparent'
                          )}
                        />
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-text-primary truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-text-muted shrink-0">
                              {formatDate(n.timestamp, 'relative')}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary leading-snug line-clamp-2">
                            {n.message}
                          </p>
                          {n.link && (
                            <Link
                              to={n.link}
                              onClick={() => setShowNotifMenu(false)}
                              className="text-[11px] text-accent font-medium inline-flex items-center gap-1 mt-0.5 hover:underline"
                            >
                              View details <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer link to full notification center */}
                <div className="p-2 border-t border-card-border bg-app-bg/60 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-accent hover:underline font-semibold block py-1"
                  >
                    Open Notification Center →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Pill / Profile quick-link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-card-bg border border-card-border hover:border-accent/40 hover:bg-card-hover transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs flex items-center justify-center">
            {user.avatar}
          </div>
          <span className="text-xs font-semibold text-text-primary hidden sm:inline">
            {user.fullName}
          </span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-card-hover transition-colors"
          title="Sign Out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
