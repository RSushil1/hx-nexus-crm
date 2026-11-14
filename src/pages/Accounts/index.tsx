import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  PlusCircle,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ConfirmModal, Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAccountStore } from '@/store'
import { accountTypes } from '@/data/accounts'
import { formatCurrency, copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'

export default function AccountsHub() {
  const navigate = useNavigate()
  const { accounts, resetDemo } = useAccountStore()

  // Filters
  const [filter, setFilter] = useState<'all' | 'live' | 'demo'>('all')

  // Copied IDs
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Reset Demo modal
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [demoIdToReset, setDemoIdToReset] = useState<string | null>(null)

  // Open New Account modal
  const [openModalOpen, setOpenModalOpen] = useState(false)
  const [selectedCatalogueType, setSelectedCatalogueType] = useState('standard')
  const [newCurrency, setNewCurrency] = useState('USD')
  const [newLeverage, setNewLeverage] = useState('1:500')
  const [isCreating, setIsCreating] = useState(false)

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text)
    setCopiedId(id)
    toast.success(`Account ID ${text} copied to clipboard`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleResetConfirm = () => {
    if (demoIdToReset) {
      resetDemo(demoIdToReset)
      toast.success('Demo account balance reset to $50,000.00!')
      setDemoIdToReset(null)
    }
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      setOpenModalOpen(false)
      toast.success('Trading account opened successfully! Check your email for MT5 credentials.')
    }, 1200)
  }

  // Filtered accounts list
  const filteredAccounts = accounts.filter((a) => {
    if (filter === 'live') return a.type === 'live'
    if (filter === 'demo') return a.type === 'demo'
    return true
  })

  // Portfolio calculations
  const totalUsdHeld = accounts
    .filter((a) => a.type === 'live' && a.currency === 'USD')
    .reduce((sum, a) => sum + a.balance, 0)
  const totalEurHeld = accounts
    .filter((a) => a.type === 'live' && a.currency === 'EUR')
    .reduce((sum, a) => sum + a.balance, 0)
  const liveCount = accounts.filter((a) => a.type === 'live').length
  const demoCount = accounts.filter((a) => a.type === 'demo').length

  const usdPct = Math.round((totalUsdHeld / (totalUsdHeld + totalEurHeld * 1.08)) * 100)
  const eurPct = 100 - usdPct

  return (
    <PageWrapper
      title="Trading Accounts"
      subtitle="MetaTrader 5 accounts, balance allocation, and internal transfers."
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<ArrowRightLeft size={15} />}
            onClick={() => navigate('/accounts/transfer')}
          >
            Transfer Funds
          </Button>
          <Button
            variant="primary"
            icon={<PlusCircle size={15} />}
            onClick={() => setOpenModalOpen(true)}
          >
            Open Account
          </Button>
        </div>
      }
    >
      {/* ─── Portfolio Summary Bar ─────────────────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-card-border/60">
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Portfolio Currency Distribution
            </h2>
            <p className="text-xs text-text-muted">
              Live balances held across all segregated broker accounts
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              USD: {usdPct}%
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              EUR: {eurPct}%
            </span>
          </div>
        </div>

        {/* Stacked visual distribution bar */}
        <div className="h-3 w-full bg-card-border rounded-full overflow-hidden flex">
          <div
            className="h-full bg-accent transition-all duration-700"
            style={{ width: `${usdPct}%` }}
            title={`USD: ${usdPct}%`}
          />
          <div
            className="h-full bg-indigo-400 transition-all duration-700"
            style={{ width: `${eurPct}%` }}
            title={`EUR: ${eurPct}%`}
          />
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-card-hover/60 border border-card-border/50">
            <span className="text-text-muted block text-[11px] mb-1">USD Held</span>
            <span className="text-base font-bold text-text-primary tabular-nums">
              {formatCurrency(totalUsdHeld, 'USD')}
            </span>
            <span className="text-[10px] text-text-muted block mt-0.5">2 live accounts</span>
          </div>
          <div className="p-3 rounded-xl bg-card-hover/60 border border-card-border/50">
            <span className="text-text-muted block text-[11px] mb-1">EUR Held</span>
            <span className="text-base font-bold text-text-primary tabular-nums">
              {formatCurrency(totalEurHeld, 'EUR')}
            </span>
            <span className="text-[10px] text-text-muted block mt-0.5">1 live account</span>
          </div>
          <div className="p-3 rounded-xl bg-card-hover/60 border border-card-border/50">
            <span className="text-text-muted block text-[11px] mb-1">Live Accounts</span>
            <span className="text-base font-bold text-accent tabular-nums">{liveCount} Active</span>
            <span className="text-[10px] text-text-muted block mt-0.5">MetaTrader 5</span>
          </div>
          <div className="p-3 rounded-xl bg-card-hover/60 border border-card-border/50">
            <span className="text-text-muted block text-[11px] mb-1">Practice Accounts</span>
            <span className="text-base font-bold text-info tabular-nums">{demoCount} Demo</span>
            <span className="text-[10px] text-text-muted block mt-0.5">Virtual funds</span>
          </div>
        </div>
      </div>

      {/* ─── Filter Pills ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {(['all', 'live', 'demo'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full capitalize transition-all ${
              filter === t
                ? 'bg-accent/15 text-accent border border-accent/40 shadow-sm'
                : 'bg-card-bg text-text-muted border border-card-border hover:text-text-primary'
            }`}
          >
            {t === 'all' ? 'All Accounts' : t === 'live' ? 'Live Accounts' : 'Practice Accounts'}
          </button>
        ))}
      </div>

      {/* ─── Account Cards Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((acc) => {
          const isDemo = acc.type === 'demo'
          return (
            <div
              key={acc.id}
              className="card flex flex-col justify-between gap-4 border-card-border hover:border-card-border2 hover:shadow-card-hover transition-all relative overflow-hidden group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors">
                      {acc.name}
                    </h3>
                    <Badge variant={isDemo ? 'demo' : 'live'} dot>
                      {isDemo ? 'Demo' : 'Live'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span>{acc.platform}</span>
                    <span>·</span>
                    <span>{acc.accountType}</span>
                    <span>·</span>
                    <span>{acc.leverage}</span>
                  </div>
                </div>

                {/* Copy Login ID button */}
                <button
                  onClick={() => handleCopy(acc.loginId, acc.id)}
                  title="Copy Login ID"
                  className="p-1.5 rounded-lg bg-card-hover border border-card-border text-text-muted hover:text-text-primary hover:border-card-border2 transition-all flex items-center gap-1 text-xs"
                >
                  {copiedId === acc.id ? (
                    <Check size={13} className="text-accent" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span className="font-mono text-[11px]">{acc.loginId}</span>
                </button>
              </div>

              {/* Balances Display */}
              <div className="space-y-1 py-1">
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                  Available Balance
                </span>
                <div className="text-2xl font-extrabold tabular-nums text-text-primary tracking-tight">
                  {formatCurrency(acc.balance, acc.currency)}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                  <span>Equity: <strong className="text-text-secondary font-semibold">{formatCurrency(acc.equity, acc.currency)}</strong></span>
                  <span>Margin Level: <strong className="text-success font-semibold">{acc.marginLevel.toFixed(1)}%</strong></span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-card-border/60 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/accounts/${acc.id}`)}
                >
                  View Details
                </Button>

                {isDemo ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RotateCcw size={13} />}
                    onClick={() => {
                      setDemoIdToReset(acc.id)
                      setResetModalOpen(true)
                    }}
                    title="Reset Virtual Demo Balance"
                  >
                    Reset
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Banknote size={13} />}
                      onClick={() => navigate('/fund')}
                      title="Deposit Funds"
                    >
                      Fund
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowRightLeft size={13} />}
                      onClick={() => navigate(`/accounts/transfer?from=${acc.id}`)}
                      title="Transfer Funds"
                    >
                      Transfer
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Available Account Types Catalogue ─────────────────────────────── */}
      <div className="card flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between pb-3 border-b border-card-border/60">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Broker Trading Account Types
            </h2>
            <p className="text-xs text-text-muted">
              Select and open additional MT5 accounts suited to your trading style
            </p>
          </div>
          <Badge variant="accent">3 Tiers Available</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accountTypes.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-card-hover/50 border border-card-border flex flex-col justify-between gap-4"
            >
              <div>
                <h3 className="text-sm font-bold text-text-primary">{cat.name}</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {cat.description}
                </p>

                <div className="space-y-1.5 mt-4 text-xs border-t border-card-border/50 pt-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Spreads:</span>
                    <span className="font-semibold text-text-secondary">{cat.spread}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Commission:</span>
                    <span className="font-semibold text-text-secondary">{cat.commission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Max Leverage:</span>
                    <span className="font-semibold text-accent">{cat.leverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Min Deposit:</span>
                    <span className="font-semibold text-text-secondary">{cat.minDeposit}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setSelectedCatalogueType(cat.id)
                  setOpenModalOpen(true)
                }}
              >
                Open {cat.name.split(' ')[0]}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Modal: Reset Demo Account Balance ─────────────────────────────── */}
      <ConfirmModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Virtual Balance?"
        message="Are you sure you want to reset your Demo MT5 virtual balance back to $50,000.00? Any active demo positions will be liquidated."
        confirmLabel="Reset to $50,000"
      />

      {/* ─── Modal: Open New Account Form ──────────────────────────────────── */}
      <Modal
        open={openModalOpen}
        onClose={() => setOpenModalOpen(false)}
        title="Open MetaTrader 5 Account"
        description="Choose your account configuration. Your credentials will be emailed to your registered address."
        size="md"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <Select
            label="Account Type"
            value={selectedCatalogueType}
            onChange={(e) => setSelectedCatalogueType(e.target.value)}
            options={[
              { label: 'Standard Account (Zero commission)', value: 'standard' },
              { label: 'Raw Spread Account (From 0.0 pips)', value: 'raw' },
              { label: 'Islamic Swap-Free Account', value: 'islamic' },
            ]}
          />

          <Select
            label="Base Currency"
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value)}
            options={[
              { label: 'USD — US Dollar', value: 'USD' },
              { label: 'EUR — Euro', value: 'EUR' },
            ]}
          />

          <Select
            label="Account Leverage"
            value={newLeverage}
            onChange={(e) => setNewLeverage(e.target.value)}
            options={[
              { label: '1:500 (Maximum)', value: '1:500' },
              { label: '1:200 (Recommended)', value: '1:200' },
              { label: '1:100 (Conservative)', value: '1:100' },
              { label: '1:50 (Low Risk)', value: '1:50' },
            ]}
          />

          <div className="p-3 rounded-lg bg-card-hover border border-card-border text-xs text-text-muted flex items-start gap-2">
            <Shield size={14} className="shrink-0 mt-0.5 text-accent" />
            <span>
              By opening an account, you agree to HX Nexus risk disclosure and execution terms.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpenModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isCreating}
            >
              Confirm & Open Account
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
