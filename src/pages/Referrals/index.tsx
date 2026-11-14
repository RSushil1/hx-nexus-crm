import { useState, useMemo } from 'react'
import {
  Users,
  Copy,
  Check,
  QrCode,
  Share2,
  TrendingUp,
  DollarSign,
  UserCheck,
  MousePointerClick,
  Download,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Mail,
  Send,
  MessageCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { referrals as initialReferrals, type Invitee } from '@/data/referrals'
import { formatCurrency, formatDate, copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'

export default function Referrals() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)

  // Invitee table state
  const [statusFilter, setStatusFilter] = useState<'all' | 'funded' | 'pending_kyc' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'commission'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')

  const handleCopyCode = () => {
    copyToClipboard(initialReferrals.code)
    setCopiedCode(true)
    toast.success(`Referral code ${initialReferrals.code} copied to clipboard!`)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyUrl = () => {
    copyToClipboard(initialReferrals.url)
    setCopiedUrl(true)
    toast.success('Referral link copied to clipboard!')
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleShare = (channel: string) => {
    const text = encodeURIComponent(
      `Trade with ultra-tight spreads on HX Nexus CRM! Sign up using my referral link: ${initialReferrals.url}`
    )
    if (channel === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(initialReferrals.url)}&text=${text}`, '_blank')
    } else if (channel === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
    } else if (channel === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    } else if (channel === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent('Join HX Nexus Trader CRM')}&body=${text}`, '_blank')
    }
  }

  const handleExportCSV = () => {
    const headers = 'ID,Masked Email,Registered Date,Status,Commission\n'
    const rows = filteredInvitees
      .map((i) => `"${i.id}","${i.maskedEmail}","${i.registeredAt}","${i.status}",${i.commission}`)
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `referral-invitees-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Referral invitee list exported to CSV')
  }

  // Filtered & Sorted Invitees
  const filteredInvitees = useMemo(() => {
    let list = [...initialReferrals.invitees]
    if (statusFilter !== 'all') {
      list = list.filter((i) => i.status === statusFilter)
    }
    if (search) {
      list = list.filter((i) => i.maskedEmail.toLowerCase().includes(search.toLowerCase()))
    }
    list.sort((a, b) => {
      if (sortBy === 'commission') {
        return sortOrder === 'asc' ? a.commission - b.commission : b.commission - a.commission
      } else {
        const timeA = new Date(a.registeredAt).getTime()
        const timeB = new Date(b.registeredAt).getTime()
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
      }
    })
    return list
  }, [statusFilter, search, sortBy, sortOrder])

  const toggleSort = (field: 'date' | 'commission') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <PageWrapper
      title="Partners & Referrals"
      subtitle="Invite traders to HX Nexus and earn commission on qualifying accounts."
    >
      {/* ─── Top Referral Code Card ───────────────────────────────────────── */}
      <div className="card p-5 bg-card-bg border-card-border space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-accent uppercase tracking-wider block">
              Your Exclusive Partner Code
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-text-primary tracking-wider font-mono">
                {initialReferrals.code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-accent/15 text-accent hover:bg-accent/25 transition-colors border border-accent/40"
                title="Copy Referral Code"
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-text-muted">
              Share your link or direct friends to enter code <strong>{initialReferrals.code}</strong> during registration.
            </p>
          </div>

          {/* Direct Share Link & Social Pills */}
          <div className="w-full lg:w-auto space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-card-bg border border-card-border">
              <span className="font-mono text-xs text-text-secondary truncate max-w-xs sm:max-w-md">
                {initialReferrals.url}
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={copiedUrl ? <Check size={13} /> : <Copy size={13} />}
                onClick={handleCopyUrl}
              >
                {copiedUrl ? 'Copied' : 'Copy'}
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-text-muted font-medium mr-1">Share via:</span>
              <button
                type="button"
                onClick={() => handleShare('telegram')}
                className="px-2.5 py-1 rounded-lg bg-card-hover border border-card-border text-xs font-semibold text-text-primary hover:text-accent hover:border-accent transition-all flex items-center gap-1.5"
              >
                <Send size={12} className="text-sky-400" /> Telegram
              </button>
              <button
                type="button"
                onClick={() => handleShare('whatsapp')}
                className="px-2.5 py-1 rounded-lg bg-card-hover border border-card-border text-xs font-semibold text-text-primary hover:text-accent hover:border-accent transition-all flex items-center gap-1.5"
              >
                <MessageCircle size={12} className="text-emerald-400" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleShare('twitter')}
                className="px-2.5 py-1 rounded-lg bg-card-hover border border-card-border text-xs font-semibold text-text-primary hover:text-accent hover:border-accent transition-all flex items-center gap-1.5"
              >
                <Share2 size={12} className="text-blue-400" /> X (Twitter)
              </button>
              <button
                type="button"
                onClick={() => handleShare('email')}
                className="px-2.5 py-1 rounded-lg bg-card-hover border border-card-border text-xs font-semibold text-text-primary hover:text-accent hover:border-accent transition-all flex items-center gap-1.5"
              >
                <Mail size={12} className="text-purple-400" /> Email
              </button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5 ml-auto"
                icon={<QrCode size={13} />}
                onClick={() => setQrModalOpen(true)}
              >
                QR Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Performance Summary Cards Row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="card p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Invites</span>
            <MousePointerClick size={16} className="text-accent" />
          </div>
          <div>
            <span className="text-2xl font-black text-text-primary tabular-nums">
              {initialReferrals.stats.totalInvites}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-success font-semibold">
              <TrendingUp size={12} /> +{initialReferrals.stats.lastMonthSignups} this month
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Signups</span>
            <Users size={16} className="text-info" />
          </div>
          <div>
            <span className="text-2xl font-black text-text-primary tabular-nums">
              {initialReferrals.stats.successfulSignups}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-success font-semibold">
              <TrendingUp size={12} /> +2 this month
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Funded Accounts</span>
            <UserCheck size={16} className="text-success" />
          </div>
          <div>
            <span className="text-2xl font-black text-text-primary tabular-nums">
              {initialReferrals.stats.fundedAccounts}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-success font-semibold">
              <TrendingUp size={12} /> +{initialReferrals.stats.lastMonthFunded} this month
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card p-4 flex flex-col justify-between gap-2 border-accent/20">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Earnings</span>
            <DollarSign size={16} className="text-accent" />
          </div>
          <div>
            <span className="text-2xl font-black text-accent tabular-nums">
              {formatCurrency(initialReferrals.stats.totalEarnings)}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-success font-semibold">
              <TrendingUp size={12} /> +{formatCurrency(initialReferrals.stats.lastMonthEarnings)} this month
            </div>
          </div>
        </div>
      </div>

      {/* ─── Funnel & Earnings Timeline Split ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Conversion Funnel */}
        <div className="card flex flex-col gap-4">
          <div className="pb-2 border-b border-card-border/60">
            <h3 className="text-sm font-bold text-text-primary">Referral Conversion Funnel</h3>
            <p className="text-xs text-text-muted">
              Progression from unique link visitor clicks to qualified funded traders
            </p>
          </div>

          <div className="space-y-4 py-2">
            {/* Stage 1: Clicks */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">1. Link Clicks</span>
                <span className="text-text-primary tabular-nums">{initialReferrals.stats.clicks} (100%)</span>
              </div>
              <div className="w-full h-7 rounded-xl bg-card-border/60 overflow-hidden relative flex items-center px-3">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-sky-500/30 border-r-2 border-sky-400 rounded-l-xl transition-all duration-500"
                  style={{ width: '100%' }}
                />
                <span className="relative z-10 text-[11px] font-bold text-text-primary">48 Visitors</span>
              </div>
            </div>

            {/* Stage 2: Signups */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">2. Registered Signups</span>
                <span className="text-text-primary tabular-nums">
                  {initialReferrals.stats.successfulSignups} (16.6% conversion)
                </span>
              </div>
              <div className="w-full h-7 rounded-xl bg-card-border/60 overflow-hidden relative flex items-center px-3">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-accent/30 border-r-2 border-accent rounded-l-xl transition-all duration-500"
                  style={{ width: '60%' }}
                />
                <span className="relative z-10 text-[11px] font-bold text-text-primary">8 Registered Traders</span>
              </div>
            </div>

            {/* Stage 3: Funded */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">3. Funded Live Accounts</span>
                <span className="text-text-primary tabular-nums">
                  {initialReferrals.stats.fundedAccounts} (62.5% of signups)
                </span>
              </div>
              <div className="w-full h-7 rounded-xl bg-card-border/60 overflow-hidden relative flex items-center px-3">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-500/40 border-r-2 border-emerald-400 rounded-l-xl transition-all duration-500"
                  style={{ width: '38%' }}
                />
                <span className="relative z-10 text-[11px] font-bold text-text-primary">
                  5 Active Funded ($625 Earned)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cumulative Earnings Timeline Chart */}
        <div className="card flex flex-col gap-4">
          <div className="pb-2 border-b border-card-border/60">
            <h3 className="text-sm font-bold text-text-primary">Cumulative Commission Growth</h3>
            <p className="text-xs text-text-muted">
              Monthly affiliate payouts accredited directly to your primary live wallet
            </p>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={initialReferrals.earningsTimeline} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="p-2 rounded-lg bg-card-bg border border-card-border shadow-lg text-xs">
                          <p className="font-bold text-text-primary">{data.month}</p>
                          <p className="text-accent font-mono font-bold">${data.earnings}.00 Payout</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#earningsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Invitee Activity Table ────────────────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
          <div>
            <h3 className="text-base font-bold text-text-primary">Invitee Activity & Commissions</h3>
            <p className="text-xs text-text-muted">
              Track registration status, KYC milestones, and credited referral payouts
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-card-hover p-1 rounded-lg border border-card-border">
              {(['all', 'funded', 'pending_kyc', 'inactive'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                    statusFilter === s
                      ? 'bg-card-bg text-accent shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Download size={13} />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-card-border/80 text-text-muted">
                <th className="pb-2 font-medium">Invitee Email</th>
                <th
                  className="pb-2 font-medium cursor-pointer hover:text-text-primary transition-colors"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    <span>Registered Date</span>
                    {sortBy === 'date' ? (
                      sortOrder === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </th>
                <th className="pb-2 font-medium">Status</th>
                <th
                  className="pb-2 font-medium text-right cursor-pointer hover:text-text-primary transition-colors"
                  onClick={() => toggleSort('commission')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Commission</span>
                    {sortBy === 'commission' ? (
                      sortOrder === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {filteredInvitees.map((item) => (
                <tr key={item.id} className="hover:bg-card-hover/40 transition-colors">
                  <td className="py-3 font-mono font-medium text-text-primary">
                    {item.maskedEmail}
                  </td>
                  <td className="py-3 text-text-muted">{formatDate(item.registeredAt, 'short')}</td>
                  <td className="py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td
                    className={`py-3 text-right font-bold tabular-nums ${
                      item.commission > 0 ? 'text-success' : 'text-text-muted'
                    }`}
                  >
                    {item.commission > 0 ? `+${formatCurrency(item.commission)}` : '$0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Referral Program Info Accordion ───────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="pb-2 border-b border-card-border/60">
          <h3 className="text-sm font-bold text-text-primary">
            How the HX Nexus Affiliate Program Works
          </h3>
          <p className="text-xs text-text-muted">
            Transparent commission tiers, weekly payouts, and zero earning caps
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {initialReferrals.programInfo.map((p) => (
            <AccordionItem
              key={p.step}
              value={`step-${p.step}`}
              title={`Step ${p.step}: ${p.title}`}
              subtitle="Click to expand details"
            >
              <div className="space-y-2 text-xs text-text-muted">
                <p>{p.desc}</p>
                {p.step === 3 && (
                  <p className="text-[11px] text-accent font-semibold pt-1">
                    ✓ Commissions are audited every Friday and deposited directly into your primary Live USD trading account without withdrawal restrictions.
                  </p>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* ─── Modal: QR Code Share ──────────────────────────────────────────── */}
      <Modal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Share Referral QR Code"
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="w-48 h-48 p-2 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-card-border">
            <div className="w-full h-full bg-[#090A0D] rounded-xl flex flex-col items-center justify-center p-3 text-white">
              <QrCode size={110} className="text-accent" />
              <span className="text-[9px] font-mono mt-1 text-slate-300">CODE: {initialReferrals.code}</span>
            </div>
          </div>

          <div className="w-full space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-bold">Referral Landing Page</span>
            <div className="flex items-center justify-between p-2 rounded-lg bg-card-hover border border-card-border">
              <span className="font-mono text-xs text-accent truncate">{initialReferrals.url}</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-1 hover:text-white"
                title="Copy Link"
              >
                {copiedUrl ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => setQrModalOpen(false)}
          >
            Done
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
