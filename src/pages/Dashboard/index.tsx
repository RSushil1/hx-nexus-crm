import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Banknote,
  FileText,
  ArrowRightLeft,
  Star,
  TrendingUp,
  Activity,
  Layers,
  Search,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  SlidersHorizontal,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AreaChart } from '@/components/charts/AreaChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { LinearProgress } from '@/components/ui/Progress'
import { Modal } from '@/components/ui/Modal'
import { Switch } from '@/components/ui/Switch'
import { accounts, accountHistory } from '@/data/accounts'
import { transactions } from '@/data/transactions'
import { rewards } from '@/data/rewards'
import { user } from '@/data/user'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function Dashboard() {
  const navigate = useNavigate()

  // Currency filter
  const [selectedCurrency, setSelectedCurrency] = useState<'All' | 'USD' | 'EUR'>('All')
  // Chart timeframe
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D')
  // Feed toggle
  const [feedTab, setFeedTab] = useState<'movements' | 'points'>('movements')
  // Feed search
  const [searchQuery, setSearchQuery] = useState('')

  // Widget customizer state
  type DashboardWidgets = {
    metrics: boolean
    chart: boolean
    quickActions: boolean
    activityFeed: boolean
    rewardsHero: boolean
    accountHealth: boolean
  }

  const defaultWidgets: DashboardWidgets = {
    metrics: true,
    chart: true,
    quickActions: true,
    activityFeed: true,
    rewardsHero: true,
    accountHealth: true,
  }

  const [widgets, setWidgets] = useState<DashboardWidgets>(() => {
    const saved = localStorage.getItem('hx_dashboard_widgets')
    if (saved) {
      try {
        return { ...defaultWidgets, ...JSON.parse(saved) }
      } catch (e) {
        // fallback
      }
    }
    return defaultWidgets
  })

  const [customizerOpen, setCustomizerOpen] = useState(false)

  const toggleWidget = (key: keyof DashboardWidgets) => {
    setWidgets((prev: DashboardWidgets) => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem('hx_dashboard_widgets', JSON.stringify(next))
      return next
    })
  }

  // Filter accounts by currency
  const filteredAccounts = useMemo(() => {
    if (selectedCurrency === 'All') return accounts.filter((a) => a.type === 'live')
    return accounts.filter((a) => a.type === 'live' && a.currency === selectedCurrency)
  }, [selectedCurrency])

  // Aggregate financial metrics
  const totalBalance = useMemo(
    () => filteredAccounts.reduce((sum, a) => sum + a.balance, 0),
    [filteredAccounts]
  )
  const totalEquity = useMemo(
    () => filteredAccounts.reduce((sum, a) => sum + a.equity, 0),
    [filteredAccounts]
  )
  const totalMarginUsed = useMemo(
    () => filteredAccounts.reduce((sum, a) => sum + a.margin, 0),
    [filteredAccounts]
  )
  const totalFreeMargin = useMemo(
    () => filteredAccounts.reduce((sum, a) => sum + a.freeMargin, 0),
    [filteredAccounts]
  )
  const totalFloatingPL = useMemo(
    () => filteredAccounts.reduce((sum, a) => sum + a.floatingPL, 0),
    [filteredAccounts]
  )

  // Chart data based on timeframe
  const chartData = useMemo(() => {
    const raw = accountHistory['acct-live-usd'] || []
    const days = timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 90
    return raw.slice(-days)
  }, [timeframe])

  // Donut data for Margin In Use vs Free Margin
  const donutData = useMemo(() => {
    const used = totalMarginUsed || 2858
    const free = totalFreeMargin || 9824
    return [
      { name: 'Margin In Use', value: used, color: '#F59E0B' },
      { name: 'Free Margin', value: free, color: '#202229' },
    ]
  }, [totalMarginUsed, totalFreeMargin])

  const marginInUsePct = useMemo(() => {
    const total = (totalMarginUsed || 2858) + (totalFreeMargin || 9824)
    return total > 0 ? (((totalMarginUsed || 2858) / total) * 100).toFixed(0) : '0'
  }, [totalMarginUsed, totalFreeMargin])

  // Filtered activity feed
  const filteredFeed = useMemo(() => {
    if (feedTab === 'points') {
      return rewards.history
        .filter((item) =>
          item.activity.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item) => ({
          id: item.id,
          title: item.activity,
          date: item.date,
          amountText: `${item.points > 0 ? '+' : ''}${item.points} pts`,
          isPositive: item.points > 0,
          status: item.type,
          isPoint: true,
        }))
    }
    return transactions
      .filter((t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((t) => ({
        id: t.id,
        title: t.description,
        date: t.date,
        amountText: formatCurrency(t.amount, t.currency),
        isPositive: t.amount >= 0,
        status: t.status,
        isPoint: false,
      }))
  }, [feedTab, searchQuery])

  return (
    <PageWrapper
      title={`Welcome back, ${user.firstName} 👋`}
      subtitle="Account equity, servicing, and margin status overview."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<SlidersHorizontal size={13} />}
            onClick={() => setCustomizerOpen(true)}
            className="text-xs"
          >
            Customize
          </Button>

          <div className="flex items-center gap-1 p-0.5 bg-[#121317] border border-card-border rounded-lg">
            {(['All', 'USD', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedCurrency === curr
                    ? 'bg-accent/15 text-accent font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* ─── Top 3 Financial Metric Cards ─────────────────────────────────── */}
      {widgets.metrics && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Live Balances & Total Equity */}
        <div className="card flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">
              Total Equity ({selectedCurrency})
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <TrendingUp size={17} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold tabular-nums text-text-primary tracking-tight">
              {formatCurrency(totalEquity, selectedCurrency === 'EUR' ? 'EUR' : 'USD')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success">
                <ArrowUpRight size={13} />
                +{formatCurrency(totalFloatingPL, 'USD')}
              </span>
              <span className="text-xs text-text-muted">Floating P/L</span>
            </div>
          </div>
          <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-xs text-text-muted">
            <span>Cash Balance:</span>
            <span className="font-semibold text-text-secondary tabular-nums">
              {formatCurrency(totalBalance, selectedCurrency === 'EUR' ? 'EUR' : 'USD')}
            </span>
          </div>
        </div>

        {/* Card 2: Margin Overview with Donut */}
        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">
              Margin Overview
            </span>
            <span className="text-xs font-semibold text-accent px-2 py-0.5 rounded bg-accent/10">
              {marginInUsePct}% in use
            </span>
          </div>
          <div className="flex items-center gap-4 py-1">
            <div className="w-24 h-24 shrink-0">
              <DonutChart
                data={donutData}
                centerLabel="In Use"
                centerValue={`${marginInUsePct}%`}
                height={96}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Margin Used:
                </span>
                <span className="font-bold text-text-primary tabular-nums">
                  {formatCurrency(totalMarginUsed || 2858)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-card-border" />
                  Free Margin:
                </span>
                <span className="font-bold text-text-secondary tabular-nums">
                  {formatCurrency(totalFreeMargin || 9824)}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-xs text-text-muted">
            <span>Margin Level:</span>
            <span className="font-bold text-success tabular-nums">375.5% (Safe)</span>
          </div>
        </div>

        {/* Card 3: What's Open / Positions Summary */}
        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">
              What's Open
            </span>
            <div className="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center">
              <Layers size={17} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-text-primary tabular-nums">4</span>
              <span className="text-xs text-text-muted">Active open positions</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              EUR/USD, GBP/USD, XAU/USD, BTC/USD
            </p>
          </div>
          <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-xs">
            <span className="text-text-muted">Unrealized Net P/L:</span>
            <span className="font-bold text-success tabular-nums flex items-center gap-0.5">
              <ArrowUpRight size={13} />
              +$482.50
            </span>
          </div>
        </div>
      </div>
      )}

      {/* ─── Balance History Chart & Nexus Points Section ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Balance History Chart */}
        <div className="card lg:col-span-2 flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-card-border/60">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Portfolio Balance Movements
              </h2>
              <p className="text-xs text-text-muted">
                Daily equity valuation history across your live trading accounts
              </p>
            </div>
            {/* Timeframe switchers */}
            <div className="flex items-center gap-1 bg-card-hover p-1 rounded-lg border border-card-border/70 self-start sm:self-auto">
              {(['7D', '30D', '90D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeframe === tf
                      ? 'bg-card-bg text-accent shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <AreaChart data={chartData} color="#F59E0B" height={230} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-card-border/60 text-center text-xs">
            <div className="p-2 rounded-lg bg-card-hover/50">
              <span className="text-text-muted block text-[10px] uppercase">Period Low</span>
              <span className="font-bold text-text-secondary tabular-nums">$9,850.00</span>
            </div>
            <div className="p-2 rounded-lg bg-card-hover/50">
              <span className="text-text-muted block text-[10px] uppercase">Period High</span>
              <span className="font-bold text-text-secondary tabular-nums">$14,500.00</span>
            </div>
            <div className="p-2 rounded-lg bg-card-hover/50">
              <span className="text-text-muted block text-[10px] uppercase">Net Growth</span>
              <span className="font-bold text-success tabular-nums">+14.2%</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Nexus Points & Loyalty Card */}
        <div className="card flex flex-col justify-between gap-4 border-card-border bg-card-bg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                <Star size={18} className="fill-accent/40" />
              </div>
              <div>
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                  Nexus Points
                </span>
                <span className="text-[11px] text-accent font-medium">Silver Tier</span>
              </div>
            </div>
            <span className="text-xs text-text-muted">Level 2</span>
          </div>

          <div className="py-2">
            <div className="text-3xl font-extrabold text-accent tabular-nums tracking-tight">
              {rewards.currentPoints.toLocaleString()} <span className="text-sm font-normal text-text-muted">pts</span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              550 points needed to unlock <strong className="text-amber-400">Gold Tier</strong>
            </p>
            <div className="mt-3">
              <LinearProgress
                value={rewards.currentPoints}
                max={3000}
                colorClass="bg-accent"
                size="md"
              />
            </div>
          </div>

          {/* Mini challenges preview */}
          <div className="space-y-2 border-t border-card-border/60 pt-3">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Active Challenge
            </span>
            <div className="p-2.5 rounded-lg bg-card-hover/80 border border-card-border/60 flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-primary">
                  {rewards.challenges[0].title}
                </span>
                <span className="text-[10px] text-text-muted">
                  {rewards.challenges[0].progress}/{rewards.challenges[0].target} complete
                </span>
              </div>
              <span className="text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded">
                +{rewards.challenges[0].points} pts
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full"
            icon={<Sparkles size={14} />}
            onClick={() => navigate('/rewards')}
          >
            Explore Rewards Hub
          </Button>
        </div>
      </div>

      {/* ─── Quick Actions Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => navigate('/accounts')}
          className="card-hover flex items-center gap-3 p-3.5 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
            <CreditCard size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary block">Accounts</span>
            <span className="text-[11px] text-text-muted">3 live, 1 demo</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/fund')}
          className="card-hover flex items-center gap-3 p-3.5 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Banknote size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary block">Deposit Funds</span>
            <span className="text-[11px] text-text-muted">Instant deposit</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/accounts/transfer')}
          className="card-hover flex items-center gap-3 p-3.5 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowRightLeft size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary block">Internal Transfer</span>
            <span className="text-[11px] text-text-muted">Zero fee</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/statements')}
          className="card-hover flex items-center gap-3 p-3.5 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary block">Statements</span>
            <span className="text-[11px] text-text-muted">PDF & CSV export</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/games')}
          className="card-hover flex items-center gap-3 p-3.5 group text-left col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary block">Prediction Arena</span>
            <span className="text-[11px] text-text-muted">Win points</span>
          </div>
        </button>
      </div>

      {/* ─── NEW: Account Health Status & Margin Risk Widget ───────────────── */}
      <div className="card flex flex-col gap-3 border-card-border bg-card-bg">
        <div className="flex items-center justify-between pb-2 border-b border-card-border/60">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            <h2 className="text-sm font-bold text-text-primary">
              Account Health & Margin Call Protection
            </h2>
          </div>
          <span className="text-xs text-text-muted">Automated broker surveillance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accounts
            .filter((a) => a.type === 'live')
            .map((acc) => {
              const isHealthy = acc.marginLevel > 200
              const isWarning = acc.marginLevel <= 200 && acc.marginLevel >= 100
              return (
                <div
                  key={acc.id}
                  onClick={() => navigate(`/accounts/${acc.id}`)}
                  className="p-3.5 rounded-xl bg-card-hover/70 border border-card-border/60 hover:border-accent/40 cursor-pointer transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">{acc.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHealthy
                          ? 'bg-success/15 text-success'
                          : isWarning
                          ? 'bg-warning/15 text-warning'
                          : 'bg-danger/15 text-danger'
                      }`}
                    >
                      {isHealthy ? '● Healthy' : isWarning ? '▲ Warning' : '✖ Risk'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-text-muted">Margin Level</span>
                    <span className="text-sm font-extrabold text-text-primary tabular-nums">
                      {acc.marginLevel.toFixed(1)}%
                    </span>
                  </div>
                  <LinearProgress
                    value={Math.min(100, (acc.marginLevel / 400) * 100)}
                    colorClass={isHealthy ? 'bg-success' : isWarning ? 'bg-warning' : 'bg-danger'}
                    size="sm"
                  />
                  <div className="flex justify-between text-[11px] text-text-muted pt-1">
                    <span>Free: {formatCurrency(acc.freeMargin, acc.currency)}</span>
                    <span className="text-accent hover:underline flex items-center gap-0.5">
                      Details <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* ─── Recent Activity Feed / Ledger ─────────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text-primary">Recent Activity</h2>
            {/* Movements vs Points pill toggle */}
            <div className="flex items-center bg-card-hover p-0.5 rounded-lg border border-card-border/70 ml-2">
              <button
                onClick={() => setFeedTab('movements')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  feedTab === 'movements'
                    ? 'bg-card-bg text-accent shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Movements
              </button>
              <button
                onClick={() => setFeedTab('points')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  feedTab === 'points'
                    ? 'bg-card-bg text-accent shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Points
              </button>
            </div>
          </div>

          {/* Search filter input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Filter by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-card-hover border border-card-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Activity Items List */}
        <div className="divide-y divide-card-border/50 max-h-96 overflow-y-auto">
          {filteredFeed.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              No matching activity found
            </div>
          ) : (
            filteredFeed.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-card-hover/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.isPoint
                        ? 'bg-amber-400/10 text-amber-400'
                        : item.isPositive
                        ? 'bg-success/10 text-success'
                        : 'bg-card-border text-text-muted'
                    }`}
                  >
                    {item.isPoint ? (
                      <Star size={15} />
                    ) : item.isPositive ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-text-primary truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {formatDate(item.date, 'relative')} · {formatDate(item.date, 'long')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      item.isPositive ? 'text-success' : 'text-text-primary'
                    }`}
                  >
                    {item.amountText}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── Modal: Customize Dashboard Widgets ───────────────────────────── */}
      <Modal
        open={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        title="Customize Dashboard Layout"
        description="Toggle which metric cards and trading feeds appear on your overview screen."
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={widgets.metrics}
              onCheckedChange={() => toggleWidget('metrics')}
              label="Financial Metric Cards"
              description="Total equity, floating P/L, margin breakdown donut"
            />
          </div>
          <div className="p-3 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={widgets.chart}
              onCheckedChange={() => toggleWidget('chart')}
              label="Interactive Equity Chart"
              description="7D / 30D / 90D balance history area chart"
            />
          </div>
          <div className="p-3 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={widgets.quickActions}
              onCheckedChange={() => toggleWidget('quickActions')}
              label="Quick Action Shortcuts"
              description="One-click access to Cashier, Transfer, and Statements"
            />
          </div>
          <div className="p-3 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={widgets.accountHealth}
              onCheckedChange={() => toggleWidget('accountHealth')}
              label="Account Health Monitor"
              description="Margin call risk indicators across live accounts"
            />
          </div>
          <div className="p-3 rounded-xl bg-card-hover/40 border border-card-border">
            <Switch
              checked={widgets.activityFeed}
              onCheckedChange={() => toggleWidget('activityFeed')}
              label="Activity & Movement Ledger"
              description="Real-time transaction and points feed with keyword search"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full mt-2"
            onClick={() => setCustomizerOpen(false)}
          >
            Save Layout Preferences
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
