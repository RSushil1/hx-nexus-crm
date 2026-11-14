import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Lock,
  Search,
  ArrowUpDown,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  ShieldCheck,
  KeyRound,
  ExternalLink,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AreaChart } from '@/components/charts/AreaChart'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useAccountStore } from '@/store'
import { accountHistory } from '@/data/accounts'
import { transactions, type Transaction } from '@/data/transactions'
import { formatCurrency, formatDate, copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'

export default function AccountDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accounts } = useAccountStore()

  // Find account
  const account = accounts.find((a) => a.id === id) || accounts[0]

  // Timeframe for chart
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D')

  // Search & Filter for Ledger Table
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(false)

  // Copied states
  const [copiedLogin, setCopiedLogin] = useState(false)

  // Change Password Form state
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)

  // Chart data
  const chartData = useMemo(() => {
    const raw = accountHistory[account.id] || accountHistory['acct-live-usd'] || []
    const days = timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 90
    return raw.slice(-days)
  }, [account.id, timeframe])

  // Filtered & Sorted Ledger
  const filteredLedger = useMemo(() => {
    let list = transactions.filter((t) => t.accountId === account.id || account.id === 'acct-live-usd')
    if (typeFilter !== 'all') {
      list = list.filter((t) => t.type === typeFilter)
    }
    if (search) {
      list = list.filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
    }
    return [...list].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sortAsc ? -diff : diff
    })
  }, [account.id, typeFilter, search, sortAsc])

  // Password strength calculation
  const pwdStrength = useMemo(() => {
    if (!newPwd) return 0
    let score = 0
    if (newPwd.length >= 8) score++
    if (/[A-Z]/.test(newPwd)) score++
    if (/[0-9]/.test(newPwd)) score++
    if (/[^A-Za-z0-9]/.test(newPwd)) score++
    return score
  }, [newPwd])

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-danger', 'bg-warning', 'bg-info', 'bg-success']

  const handleCopyLogin = () => {
    copyToClipboard(account.loginId)
    setCopiedLogin(true)
    toast.success('Login ID copied to clipboard')
    setTimeout(() => setCopiedLogin(false), 2000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (newPwd !== confirmPwd) {
      toast.error('Passwords do not match')
      return
    }
    setPwdLoading(true)
    setTimeout(() => {
      setPwdLoading(false)
      setNewPwd('')
      setConfirmPwd('')
      toast.success('MetaTrader 5 master password updated successfully!')
    }, 1200)
  }

  const handleExportCSV = () => {
    const headers = 'ID,Type,Description,Amount,Currency,Date,Status\n'
    const rows = filteredLedger
      .map((t) => `"${t.id}","${t.type}","${t.description}",${t.amount},"${t.currency}","${t.date}","${t.status}"`)
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `statement-${account.loginId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('CSV statement exported successfully')
  }

  return (
    <PageWrapper
      title={account.name}
      subtitle={`MetaTrader 5 · Server: ${account.server} · Leverage: ${account.leverage}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={14} />}
            onClick={() => navigate('/accounts')}
          >
            All Accounts
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowRightLeft size={14} />}
            onClick={() => navigate(`/accounts/transfer?from=${account.id}`)}
          >
            Transfer
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Banknote size={14} />}
            onClick={() => navigate('/fund')}
          >
            Fund Account
          </Button>
        </div>
      }
    >
      {/* ─── Financial Status Bar (4 Cards) ────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4 flex flex-col justify-between">
          <span className="text-xs text-text-muted uppercase tracking-wider">Balance</span>
          <div className="text-2xl font-bold tabular-nums text-text-primary mt-1">
            {formatCurrency(account.balance, account.currency)}
          </div>
          <span className="text-[11px] text-text-muted mt-1">Cleared funds</span>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <span className="text-xs text-text-muted uppercase tracking-wider">Equity</span>
          <div className="text-2xl font-bold tabular-nums text-accent mt-1">
            {formatCurrency(account.equity, account.currency)}
          </div>
          <span className="text-[11px] text-success mt-1">
            {account.floatingPL > 0 ? `+${formatCurrency(account.floatingPL, account.currency)} P/L` : '0.00 P/L'}
          </span>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <span className="text-xs text-text-muted uppercase tracking-wider">Margin Level</span>
          <div className="text-2xl font-bold tabular-nums text-text-primary mt-1">
            {account.marginLevel.toFixed(1)}%
          </div>
          <span className="text-[11px] text-success mt-1">
            {account.marginLevel > 200 ? 'Safe health' : 'Warning zone'}
          </span>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <span className="text-xs text-text-muted uppercase tracking-wider">Free Margin</span>
          <div className="text-2xl font-bold tabular-nums text-text-secondary mt-1">
            {formatCurrency(account.freeMargin, account.currency)}
          </div>
          <span className="text-[11px] text-text-muted mt-1">Available to open trades</span>
        </div>
      </div>

      {/* ─── Visual Balance Composition Bar ───────────────────────────────── */}
      <div className="card p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-text-primary">Balance Composition</span>
          <div className="flex items-center gap-4 text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Cash (78%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-card-border" />
              Margin Held (22%)
            </span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-card-border rounded-full overflow-hidden flex">
          <div className="h-full bg-accent" style={{ width: '78%' }} />
          <div className="h-full bg-text-muted" style={{ width: '22%' }} />
        </div>
      </div>

      {/* ─── Main Content Grid: Chart + Sidebar ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chart & Ledger Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equity Chart Card */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-card-border/60">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Equity Growth Trend
                </h3>
                <p className="text-xs text-text-muted">
                  Valuation history over the selected window
                </p>
              </div>
              <div className="flex items-center gap-1 bg-card-hover p-1 rounded-lg border border-card-border/70">
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
            <AreaChart data={chartData} color="#F59E0B" height={220} currency={account.currency} />
          </div>

          {/* Ledger Table Card with Search & CSV Export */}
          <div className="card flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Account Movements Ledger
                </h3>
                <p className="text-xs text-text-muted">
                  Deposits, withdrawals, profits, commissions, and internal transfers
                </p>
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

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-card-hover border border-card-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-8 px-2.5 bg-card-hover border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="profit">Profits</option>
                  <option value="loss">Losses</option>
                  <option value="transfer_in">Transfers In</option>
                  <option value="transfer_out">Transfers Out</option>
                </select>

                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="h-8 px-2.5 bg-card-hover border border-card-border rounded-lg text-xs text-text-muted hover:text-text-primary flex items-center gap-1"
                >
                  <ArrowUpDown size={13} />
                  <span>{sortAsc ? 'Oldest' : 'Newest'}</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-card-border/80 text-text-muted">
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-text-muted">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((t) => (
                      <tr key={t.id} className="hover:bg-card-hover/40 transition-colors">
                        <td className="py-2.5 capitalize font-medium text-text-secondary">
                          {t.type.replace('_', ' ')}
                        </td>
                        <td className="py-2.5 text-text-primary">{t.description}</td>
                        <td className="py-2.5 text-text-muted whitespace-nowrap">
                          {formatDate(t.date, 'short')}
                        </td>
                        <td
                          className={`py-2.5 text-right font-bold tabular-nums ${
                            t.amount >= 0 ? 'text-success' : 'text-text-primary'
                          }`}
                        >
                          {t.amount >= 0 ? '+' : ''}
                          {formatCurrency(t.amount, t.currency)}
                        </td>
                        <td className="py-2.5 text-right">
                          <StatusBadge status={t.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Credentials & Password Change Form */}
        <div className="space-y-6">
          {/* Account Credentials Card */}
          <div className="card flex flex-col gap-3">
            <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-card-border/60">
              Platform Credentials
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-card-border/40">
                <span className="text-text-muted">Platform:</span>
                <span className="font-semibold text-text-primary">{account.platform}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-card-border/40">
                <span className="text-text-muted">Login ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-text-primary">{account.loginId}</span>
                  <button
                    onClick={handleCopyLogin}
                    className="p-1 rounded text-text-muted hover:text-text-primary"
                    title="Copy Login"
                  >
                    {copiedLogin ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-card-border/40">
                <span className="text-text-muted">Server:</span>
                <span className="font-semibold text-text-primary">{account.server}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-card-border/40">
                <span className="text-text-muted">Account Group:</span>
                <span className="font-mono text-text-secondary">{account.group}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Created:</span>
                <span className="text-text-secondary">{account.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Change Master Password Form with Strength Meter */}
          <div className="card flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-card-border/60">
              <KeyRound size={15} className="text-accent" />
              <h3 className="text-sm font-bold text-text-primary">
                Change MT5 Password
              </h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <Input
                label="New Password"
                type="password"
                placeholder="Min 8 characters"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />

              {/* Strength Meter */}
              {newPwd && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-muted">Strength:</span>
                    <span className="font-semibold text-text-primary">
                      {strengthLabels[pwdStrength - 1] || 'Too Weak'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-card-border rounded-full flex gap-1 overflow-hidden">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all ${
                          step <= pwdStrength
                            ? strengthColors[pwdStrength - 1]
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full"
                loading={pwdLoading}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
