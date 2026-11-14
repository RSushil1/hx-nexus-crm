import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  Mail,
  Smartphone,
  Globe,
  Laptop,
  Key,
  Bell,
  Download,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Lock,
  Info,
  Palette,
  Check,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'
import { user as initialUser } from '@/data/user'
import { formatDate } from '@/lib/utils'
import { useThemeStore, type ColorPalette } from '@/store'
import { toast } from 'sonner'

export default function Profile() {
  const { theme, palette, setTheme, setPalette } = useThemeStore()
  const [sessions, setSessions] = useState(initialUser.sessions)

  // Notification Preferences with optimistic UI + localStorage persistence
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('hx_user_preferences')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // Fallback
      }
    }
    return initialUser.preferences
  })

  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [closeModalOpen, setCloseModalOpen] = useState(false)

  const handleTogglePref = (key: keyof typeof prefs, val: boolean) => {
    const updated = { ...prefs, [key]: val }
    setPrefs(updated)
    setSavingKey(String(key))

    // Simulate optimistic backend synchronization
    setTimeout(() => {
      localStorage.setItem('hx_user_preferences', JSON.stringify(updated))
      setSavingKey(null)
      toast.success('Notification preference saved')
    }, 400)
  }

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    toast.info('Session revoked. Access token invalidated.')
  }

  const handleDownloadUserData = () => {
    const dataArchive = {
      user: {
        id: initialUser.id,
        name: initialUser.fullName,
        email: initialUser.email,
        memberSince: initialUser.memberSince,
        locale: initialUser.locale,
        mfaEnabled: initialUser.mfaEnabled,
      },
      preferences: prefs,
      sessions: sessions,
      exportDate: new Date().toISOString(),
      compliance: 'GDPR / MiFID II Data Portability Standard',
    }

    const blob = new Blob([JSON.stringify(dataArchive, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `hxnexus-data-export-${initialUser.id}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Personal profile archive exported to JSON')
  }

  return (
    <PageWrapper
      title="Profile & Settings"
      subtitle="Identity credentials, authentication, active devices, and security."
    >
      {/* ─── Profile Hero Header ─────────────────────────────────────────── */}
      <div className="card p-5 border-card-border bg-card-bg">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-accent to-amber-600 text-accent-btn font-black text-2xl flex items-center justify-center shadow-md border border-accent/30 shrink-0">
            {initialUser.avatar}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-text-primary tracking-tight">
                {initialUser.fullName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/30">
                <ShieldCheck size={13} />
                MFA Active
              </span>
              <Badge variant="accent">Tier 2 Verified</Badge>
            </div>

            <p className="text-xs text-text-muted">
              Registered ID: <span className="font-mono text-text-secondary">{initialUser.id}</span> · Member since{' '}
              {formatDate(initialUser.memberSince, 'short')}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Contact & Security Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <div className="card flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <User size={16} className="text-accent" />
                Contact & Regulatory Record
              </h3>
              <span className="text-[10px] text-text-muted uppercase font-bold">Locked by AML</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-card-border/50">
                <span className="text-text-muted">Full Legal Name</span>
                <span className="font-semibold text-text-primary">{initialUser.fullName}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-card-border/50">
                <span className="text-text-muted">Registered Email</span>
                <span className="font-mono font-semibold text-text-primary">{initialUser.maskedEmail}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-card-border/50">
                <span className="text-text-muted">Primary Language & Locale</span>
                <span className="font-semibold text-text-secondary flex items-center gap-1">
                  <Globe size={13} className="text-accent" /> {initialUser.locale} (English - UAE)
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-text-muted">Tax Residency</span>
                <span className="font-semibold text-text-secondary">United Arab Emirates</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card-hover/80 border border-card-border text-[11px] text-text-muted flex items-start gap-2">
            <Info size={14} className="text-accent shrink-0 mt-0.5" />
            <span>
              To modify your legal name, registered country, or email, please submit an official identity amendment request via{' '}
              <Link to="/support" className="text-accent font-semibold hover:underline">
                Client Support
              </Link>.
            </span>
          </div>
        </div>

        {/* Security & Sessions Card */}
        <div className="card flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ShieldCheck size={16} className="text-accent" />
                Security & Active Sessions
              </h3>
              <Badge variant="accent">{sessions.length} Active Devices</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-card-hover/70 border border-card-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Key size={18} className="text-emerald-400" />
                  <div>
                    <span className="font-bold text-text-primary block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[11px] text-text-muted">Google Authenticator TOTP active</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-success">Enabled ✓</span>
              </div>

              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block pt-1">
                Authorized Login Sessions
              </span>

              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3 rounded-xl bg-card-bg border border-card-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    {sess.device.includes('iPhone') ? (
                      <Smartphone size={16} className="text-text-muted" />
                    ) : (
                      <Laptop size={16} className="text-text-muted" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">{sess.device}</span>
                        {sess.current && (
                          <span className="text-[9px] bg-accent/15 text-accent font-bold px-1.5 py-0.5 rounded-full">
                            This Device
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-muted">
                        Last active: {formatDate(sess.lastActive, 'short')}
                      </span>
                    </div>
                  </div>

                  {!sess.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger hover:bg-danger/10 text-xs h-7 px-2"
                      onClick={() => handleRevokeSession(sess.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-text-muted">
            Revoking a session will terminate active WebSockets and require re-authentication.
          </div>
        </div>
      </div>

      {/* ─── Interface Theme & Canvas Background Style ────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Palette size={16} className="text-accent" />
              Interface Theme & Background
            </h3>
            <p className="text-xs text-text-muted">
              Select your preferred workspace canvas background and terminal illumination
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-card-hover text-accent border border-card-border">
            {theme === 'light' ? 'Light Mode Active' : `${palette.toUpperCase()} Active`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-1">
          {/* Option 1: Midnight Navy */}
          <div
            onClick={() => {
              setPalette('midnight')
              toast.success('Switched to Midnight Navy theme')
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              theme === 'dark' && palette === 'midnight'
                ? 'bg-card-hover border-accent ring-1 ring-accent'
                : 'bg-card-bg border-card-border hover:border-card-border2'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-[#334155] bg-[#0B0F19] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
                </div>
                <span className="text-xs font-bold text-text-primary">Midnight Navy</span>
              </div>
              {theme === 'dark' && palette === 'midnight' && (
                <span className="text-accent text-[10px] font-bold flex items-center gap-0.5">
                  <Check size={12} /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Institutional deep slate blue canvas with warm amber accents.
            </p>
            <div className="h-2 w-full rounded-full bg-[#0B0F19] border border-[#1E293B] overflow-hidden flex">
              <div className="w-2/3 bg-[#111827]" />
              <div className="w-1/3 bg-[#F59E0B]" />
            </div>
          </div>

          {/* Option 2: Obsidian Charcoal */}
          <div
            onClick={() => {
              setPalette('obsidian')
              toast.success('Switched to Obsidian Charcoal theme')
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              theme === 'dark' && palette === 'obsidian'
                ? 'bg-card-hover border-accent ring-1 ring-accent'
                : 'bg-card-bg border-card-border hover:border-card-border2'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-[#2C2F3A] bg-[#090A0D] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#121317]" />
                </div>
                <span className="text-xs font-bold text-text-primary">Obsidian Charcoal</span>
              </div>
              {theme === 'dark' && palette === 'obsidian' && (
                <span className="text-accent text-[10px] font-bold flex items-center gap-0.5">
                  <Check size={12} /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Pure black AMOLED canvas with high-contrast sharp typography.
            </p>
            <div className="h-2 w-full rounded-full bg-[#090A0D] border border-[#202229] overflow-hidden flex">
              <div className="w-2/3 bg-[#121317]" />
              <div className="w-1/3 bg-[#F59E0B]" />
            </div>
          </div>

          {/* Option 3: Emerald Hedge */}
          <div
            onClick={() => {
              setPalette('emerald')
              toast.success('Switched to Emerald Hedge theme')
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              theme === 'dark' && palette === 'emerald'
                ? 'bg-card-hover border-accent ring-1 ring-accent'
                : 'bg-card-bg border-card-border hover:border-card-border2'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-[#244338] bg-[#08120F] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0E1B17]" />
                </div>
                <span className="text-xs font-bold text-text-primary">Emerald Hedge</span>
              </div>
              {theme === 'dark' && palette === 'emerald' && (
                <span className="text-accent text-[10px] font-bold flex items-center gap-0.5">
                  <Check size={12} /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Prestigious hedge fund forest canvas with mint & emerald accents.
            </p>
            <div className="h-2 w-full rounded-full bg-[#08120F] border border-[#1A3129] overflow-hidden flex">
              <div className="w-2/3 bg-[#0E1B17]" />
              <div className="w-1/3 bg-[#10B981]" />
            </div>
          </div>

          {/* Option 4: Executive Light Mode */}
          <div
            onClick={() => {
              setTheme('light')
              toast.success('Switched to Executive Light mode')
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              theme === 'light'
                ? 'bg-card-hover border-accent ring-1 ring-accent'
                : 'bg-card-bg border-card-border hover:border-card-border2'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-slate-300 bg-[#F8FAFC] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                </div>
                <span className="text-xs font-bold text-text-primary">Executive Light</span>
              </div>
              {theme === 'light' && (
                <span className="text-accent text-[10px] font-bold flex items-center gap-0.5">
                  <Check size={12} /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Crisp daylight paper canvas with high-contrast slate text.
            </p>
            <div className="h-2 w-full rounded-full bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex">
              <div className="w-2/3 bg-white" />
              <div className="w-1/3 bg-[#D97706]" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Notification Preferences Card (Optimistic UI) ───────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Bell size={16} className="text-accent" />
              Notification & Dispatch Preferences
            </h3>
            <p className="text-xs text-text-muted">
              Customized dispatch triggers for margin alerts, trade execution summaries, and system updates
            </p>
          </div>
          {savingKey && (
            <span className="text-[11px] text-accent animate-pulse">
              Saving preference...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {/* Toggle 1: Product updates */}
          <div className="p-3.5 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={prefs.productUpdates}
              onCheckedChange={(val) => handleTogglePref('productUpdates', val)}
              label="Platform & Bridge Updates"
              description="Receive notifications about MT5 bridge updates, scheduled maintenance, and new features."
            />
          </div>

          {/* Toggle 2: Marketing email */}
          <div className="p-3.5 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={prefs.marketingEmail}
              onCheckedChange={(val) => handleTogglePref('marketingEmail', val)}
              label="Promotional & Bonus Offers"
              description="Occasional emails regarding deposit bonus events, prediction arena leaderboards, and trading contests."
            />
          </div>

          {/* Toggle 3: SMS Alerts */}
          <div className="p-3.5 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={prefs.smsAlerts}
              onCheckedChange={(val) => handleTogglePref('smsAlerts', val)}
              label="Critical Movement SMS Alerts"
              description="Receive instant SMS notifications on wire clearance, large withdrawals (> $1,000), and margin calls."
            />
          </div>

          {/* Toggle 4: Weekly Summary */}
          <div className="p-3.5 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={prefs.weeklySummary}
              onCheckedChange={(val) => handleTogglePref('weeklySummary', val)}
              label="Weekly Performance Digest"
              description="Consolidated email report sent every Sunday summarizing gross P/L, turnover lots, and points earned."
            />
          </div>
        </div>
      </div>

      {/* ─── NEW: Danger Zone Card ─────────────────────────────────────────── */}
      <div className="card p-5 border-danger/30 bg-gradient-to-r from-card-bg via-[#1A0F0F] to-card-bg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <AlertTriangle size={16} className="text-danger" />
            <h4 className="text-sm font-bold text-danger">Data Privacy & Account Termination</h4>
          </div>
          <p className="text-xs text-text-muted max-w-xl">
            Export a full JSON archive of your personal records and transaction history under GDPR Article 20, or initiate a permanent account closure request.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={13} />}
            onClick={handleDownloadUserData}
          >
            Download My Data
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setCloseModalOpen(true)}
          >
            Close Account
          </Button>
        </div>
      </div>

      {/* ─── Modal: Account Closure Confirmation ───────────────────────────── */}
      <Modal
        open={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Request Trading Account Closure"
        description="Formal notice of account termination"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-text-secondary leading-relaxed">
            In accordance with CySEC regulations, all open positions must be liquidated and your cash balance withdrawn before an account can be closed.
          </p>

          <div className="p-3 rounded-xl bg-card-hover border border-card-border space-y-1">
            <span className="font-bold text-text-primary block">Requirements before closure:</span>
            <ul className="list-disc pl-4 text-text-muted space-y-1 text-[11px]">
              <li>Zero open floating trading lots on MetaTrader 5</li>
              <li>Pending withdrawal clearance of remaining capital</li>
              <li>All active support tickets marked resolved</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-1/2"
              onClick={() => setCloseModalOpen(false)}
            >
              Cancel
            </Button>
            <Link to="/support" className="w-1/2">
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => setCloseModalOpen(false)}
              >
                Open Closure Ticket
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
