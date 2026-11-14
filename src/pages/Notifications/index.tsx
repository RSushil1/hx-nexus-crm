import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Wallet,
  Gift,
  Info,
  Clock,
  Filter,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useNotifStore } from '@/store'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function Notifications() {
  const { notifications, markRead, markAllRead, deleteNotif, clearRead, unreadCount } =
    useNotifStore()

  const [tab, setTab] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all')

  const unreads = unreadCount()

  const handleMarkAll = () => {
    markAllRead()
    toast.success('All notifications marked as read')
  }

  const handleClearRead = () => {
    clearRead()
    toast.info('Cleared read notifications')
  }

  const filteredNotifs = useMemo(() => {
    return notifications.filter((n) => {
      if (tab === 'unread' && n.read) return false
      if (tab === 'read' && !n.read) return false
      if (categoryFilter !== 'all' && n.category !== categoryFilter) return false
      return true
    })
  }, [notifications, tab, categoryFilter])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <ShieldAlert size={16} className="text-warning" />
      case 'account':
      case 'funding':
        return <Wallet size={16} className="text-accent" />
      case 'rewards':
      case 'bonus':
        return <Gift size={16} className="text-emerald-400" />
      default:
        return <Info size={16} className="text-info" />
    }
  }

  return (
    <PageWrapper
      title="Notifications"
      subtitle="System advisories, settlement receipts, and account activity."
    >
      <div className="card flex flex-col gap-4">
        {/* Top Controls: Tabs & Bulk Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-card-border/60">
          <div className="flex items-center gap-1 bg-card-hover p-1 rounded-xl border border-card-border">
            {(
              [
                { id: 'all', label: `All (${notifications.length})` },
                { id: 'unread', label: `Unread (${unreads})` },
                { id: 'read', label: 'Read' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  tab === t.id
                    ? 'bg-card-bg text-accent shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {unreads > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={<CheckCheck size={14} />}
                onClick={handleMarkAll}
              >
                Mark all as read
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={handleClearRead}
              className="text-text-muted hover:text-danger"
            >
              Clear read
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter size={12} /> Filter:
          </span>
          {['all', 'security', 'account', 'system', 'bonus'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                categoryFilter === cat
                  ? 'bg-accent/15 text-accent border border-accent/40'
                  : 'bg-card-hover text-text-muted hover:text-text-primary border border-card-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-text-muted space-y-2">
              <Bell size={32} className="mx-auto opacity-30 text-accent" />
              <p className="text-sm font-semibold">No notifications to display</p>
              <p className="text-xs">You're completely caught up on all platform updates.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !n.read
                    ? 'bg-accent/5 border-accent/30 shadow-sm'
                    : 'bg-card-bg/60 border-card-border hover:border-card-border2'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-card-hover border border-card-border flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      )}
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-card-hover border border-card-border text-text-muted">
                        {n.category}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-text-secondary pt-0.5 font-mono">
                      <Clock size={11} className="text-text-muted" />
                      <span>{formatDate(n.timestamp, 'short')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {n.link && (
                    <Link to={n.link}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2.5 text-accent"
                        icon={<ExternalLink size={12} />}
                      >
                        View
                      </Button>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotif(n.id)
                    }}
                    className="p-2 text-text-muted hover:text-danger rounded-lg transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
