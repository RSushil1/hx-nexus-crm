import { useState } from 'react'
import {
  CreditCard,
  Building2,
  Coins,
  QrCode,
  Copy,
  Check,
  ArrowDownToLine,
  ArrowUpFromLine,
  Download,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  Smartphone,
  Wallet,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/Badge'
import { LinearProgress } from '@/components/ui/Progress'
import { NumericInput, Input } from '@/components/ui/Input'
import { useAccountStore } from '@/store'
import { cashierHistory as initialCashierHistory, type Transaction } from '@/data/transactions'
import { formatCurrency, formatDate, copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'

type PaymentMethodType = 'card' | 'wire' | 'crypto' | 'paypal' | 'applepay'

export default function Fund() {
  const { accounts, updateBalance } = useAccountStore()
  const liveAccounts = accounts.filter((a) => a.type === 'live')

  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const [selectedAccountId, setSelectedAccountId] = useState(liveAccounts[0]?.id || '')
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card')

  // Transactions state (with cancellation support)
  const [history, setHistory] = useState<Transaction[]>(initialCashierHistory)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  // Crypto QR modal
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Card details mock
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [historyFilter, setHistoryFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'pending'>('all')

  const targetAccount = liveAccounts.find((a) => a.id === selectedAccountId) || liveAccounts[0]
  const numericAmount = parseFloat(amount) || 0

  const trc20Address = 'TJ8QhXNexus782kL90PqMzTRC20OfficialVault'

  // Presets
  const depositPresets = [
    { label: '$100', value: 100 },
    { label: '$250', value: 250 },
    { label: '$500', value: 500 },
    { label: '$1,000', value: 1000 },
    { label: '$2,500', value: 2500 },
  ]

  const methodProcessingTimes: Record<PaymentMethodType, string> = {
    card: 'Instant deposit / 1-2 hours payout',
    wire: '1-3 business days',
    crypto: '~15 minutes (12 network confirmations)',
    paypal: 'Instant / Same day',
    applepay: 'Instant 1-touch clearance',
  }

  const handleCopyCrypto = () => {
    copyToClipboard(trc20Address)
    setCopiedAddress(true)
    toast.success('TRC-20 deposit address copied!')
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault()
    if (numericAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (mode === 'withdraw' && numericAmount > targetAccount.balance) {
      toast.error('Withdrawal amount exceeds available account balance')
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        accountId: targetAccount.id,
        type: mode === 'deposit' ? 'deposit' : 'withdrawal',
        description:
          mode === 'deposit'
            ? `${selectedMethod.toUpperCase()} deposit`
            : `${selectedMethod.toUpperCase()} withdrawal`,
        amount: mode === 'deposit' ? numericAmount : -numericAmount,
        currency: targetAccount.currency,
        date: new Date().toISOString(),
        status: mode === 'deposit' ? 'completed' : 'pending',
        method: selectedMethod.toUpperCase(),
        reference: `${mode === 'deposit' ? 'DEP' : 'WDR'}-${Date.now().toString().slice(-6)}`,
        category: 'movement',
      }

      setHistory((prev) => [newTx, ...prev])

      if (mode === 'deposit') {
        updateBalance(targetAccount.id, numericAmount)
        toast.success(`Successfully deposited ${formatCurrency(numericAmount, targetAccount.currency)}!`)
      } else {
        updateBalance(targetAccount.id, -numericAmount)
        toast.success(
          `Withdrawal request for ${formatCurrency(numericAmount, targetAccount.currency)} submitted for review!`
        )
      }
      setAmount('')
    }, 1500)
  }

  const handleCancelPending = (id: string, amountToRefund: number) => {
    setHistory((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'cancelled' as const } : t))
    )
    if (amountToRefund < 0) {
      updateBalance(targetAccount.id, Math.abs(amountToRefund))
    }
    toast.info('Pending withdrawal cancelled. Funds restored to account.')
  }

  const handleExportCSV = () => {
    const headers = 'Reference,Method,Type,Date,Amount,Currency,Status\n'
    const rows = history
      .map(
        (t) =>
          `"${t.reference || t.id}","${t.method || 'Internal'}","${t.type}","${t.date}",${t.amount},"${t.currency}","${t.status}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `cashier-history-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Cashier history exported to CSV')
  }

  const filteredHistory = history.filter((t) => {
    if (historyFilter === 'deposit') return t.type === 'deposit'
    if (historyFilter === 'withdrawal') return t.type === 'withdrawal'
    if (historyFilter === 'pending') return t.status === 'pending'
    return true
  })

  return (
    <PageWrapper
      title="Cashier & Funding"
      subtitle="Deposit and withdraw capital across verified settlement rails."
    >
      {/* ─── Mode Switcher (Deposit vs Withdraw) ───────────────────────────── */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-card-bg border border-card-border shadow-sm">
          <button
            type="button"
            onClick={() => setMode('deposit')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'deposit'
                ? 'bg-accent text-accent-btn shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <ArrowDownToLine size={16} />
            Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'withdraw'
                ? 'bg-accent text-accent-btn shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <ArrowUpFromLine size={16} />
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* ─── Main Cashier Grid: Form + Limits Sidebar ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cashier Form */}
        <div className="card lg:col-span-2 flex flex-col gap-6">
          <form onSubmit={handleExecute} className="space-y-6">
            {/* Target Account Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {mode === 'deposit' ? 'Destination Account' : 'Source Account'}
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full h-12 px-3.5 bg-card-hover border border-card-border rounded-xl text-sm font-semibold text-text-primary focus:outline-none focus:border-accent"
              >
                {liveAccounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-card-bg">
                    {a.name} — Balance: {formatCurrency(a.balance, a.currency)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Select {mode === 'deposit' ? 'Funding Channel' : 'Payout Method'}
                </label>
                <span className="text-[11px] text-text-muted flex items-center gap-1">
                  <Clock size={12} className="text-accent" />
                  {methodProcessingTimes[selectedMethod]}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Method 1: Card */}
                <div
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    selectedMethod === 'card'
                      ? 'bg-accent/10 border-accent text-text-primary ring-1 ring-accent'
                      : 'bg-card-hover border-card-border text-text-secondary hover:border-card-border2'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard size={18} className={selectedMethod === 'card' ? 'text-accent' : 'text-text-muted'} />
                    <span className="text-[9px] font-bold bg-success/15 text-success px-1.5 py-0.5 rounded-full">
                      Instant
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Credit/Debit Card</span>
                    <span className="text-[10px] text-text-muted">Visa, MC · 0%</span>
                  </div>
                </div>

                {/* Method 2: Bank Wire */}
                <div
                  onClick={() => setSelectedMethod('wire')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    selectedMethod === 'wire'
                      ? 'bg-accent/10 border-accent text-text-primary ring-1 ring-accent'
                      : 'bg-card-hover border-card-border text-text-secondary hover:border-card-border2'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 size={18} className={selectedMethod === 'wire' ? 'text-accent' : 'text-text-muted'} />
                    <span className="text-[9px] font-bold bg-info/15 text-info px-1.5 py-0.5 rounded-full">
                      1-3 Days
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Bank Wire</span>
                    <span className="text-[10px] text-text-muted">SWIFT/IBAN · 0%</span>
                  </div>
                </div>

                {/* Method 3: Tether USDT TRC20 */}
                <div
                  onClick={() => setSelectedMethod('crypto')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    selectedMethod === 'crypto'
                      ? 'bg-accent/10 border-accent text-text-primary ring-1 ring-accent'
                      : 'bg-card-hover border-card-border text-text-secondary hover:border-card-border2'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Coins size={18} className={selectedMethod === 'crypto' ? 'text-accent' : 'text-text-muted'} />
                    <span className="text-[9px] font-bold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">
                      ~15m
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">USDT TRC-20</span>
                    <span className="text-[10px] text-text-muted">Crypto · 0%</span>
                  </div>
                </div>

                {/* Method 4: PayPal (NEW) */}
                <div
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    selectedMethod === 'paypal'
                      ? 'bg-accent/10 border-accent text-text-primary ring-1 ring-accent'
                      : 'bg-card-hover border-card-border text-text-secondary hover:border-card-border2'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Wallet size={18} className={selectedMethod === 'paypal' ? 'text-accent' : 'text-text-muted'} />
                    <span className="text-[9px] font-bold bg-sky-400/15 text-sky-400 px-1.5 py-0.5 rounded-full">
                      Instant
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">PayPal</span>
                    <span className="text-[10px] text-text-muted">Direct Wallet</span>
                  </div>
                </div>

                {/* Method 5: Apple / Google Pay (NEW) */}
                <div
                  onClick={() => setSelectedMethod('applepay')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    selectedMethod === 'applepay'
                      ? 'bg-accent/10 border-accent text-text-primary ring-1 ring-accent'
                      : 'bg-card-hover border-card-border text-text-secondary hover:border-card-border2'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone size={18} className={selectedMethod === 'applepay' ? 'text-accent' : 'text-text-muted'} />
                    <span className="text-[9px] font-bold bg-purple-400/15 text-purple-400 px-1.5 py-0.5 rounded-full">
                      1-Tap
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Apple/Google Pay</span>
                    <span className="text-[10px] text-text-muted">Device Native</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Method Details Box */}
            {selectedMethod === 'card' && (
              <div className="p-4 rounded-xl bg-card-hover/60 border border-card-border space-y-3">
                <span className="text-xs font-bold text-text-primary block">Card Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Card Number"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Expires"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'wire' && (
              <div className="p-4 rounded-xl bg-card-hover/60 border border-card-border space-y-2 text-xs">
                <span className="font-bold text-text-primary block">Broker Wire Beneficiary Details</span>
                <div className="space-y-1 text-text-muted">
                  <p><strong>Beneficiary:</strong> HX Nexus Global Clearing Ltd</p>
                  <p><strong>Bank:</strong> Barclays International Plc, London</p>
                  <p><strong>IBAN:</strong> GB89BARC20000088392019</p>
                  <p><strong>SWIFT/BIC:</strong> BARCGB22</p>
                  <p><strong>Payment Reference (Mandatory):</strong> HXN-{targetAccount.loginId}</p>
                </div>
              </div>
            )}

            {selectedMethod === 'crypto' && (
              <div className="p-4 rounded-xl bg-card-hover/60 border border-card-border space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">TRC-20 Dedicated Deposit Vault</span>
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="flex items-center gap-1 text-accent hover:underline font-semibold"
                  >
                    <QrCode size={14} /> View QR Code
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card-bg border border-card-border">
                  <span className="font-mono text-xs text-text-secondary truncate">{trc20Address}</span>
                  <button
                    type="button"
                    onClick={handleCopyCrypto}
                    className="p-1 text-text-muted hover:text-accent ml-2 shrink-0"
                  >
                    {copiedAddress ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-text-muted leading-tight">
                  ⚠️ Send only USDT via the TRC-20 (Tron) network. Sending any other asset or via ERC-20 will result in loss of funds. Requires 12 network confirmations.
                </p>
              </div>
            )}

            {selectedMethod === 'paypal' && (
              <div className="p-4 rounded-xl bg-card-hover/60 border border-card-border space-y-2 text-xs">
                <span className="font-bold text-text-primary block">PayPal Express Clearance</span>
                <p className="text-text-muted">
                  You will authenticate via the PayPal sandbox popup modal. Funds are credited instantly without merchant surcharges.
                </p>
                <div className="p-2.5 rounded-lg bg-card-bg border border-card-border text-[11px] text-accent">
                  ✓ Verified PayPal Account: dana.reyes@hxnexus.com
                </div>
              </div>
            )}

            {selectedMethod === 'applepay' && (
              <div className="p-4 rounded-xl bg-card-hover/60 border border-card-border space-y-2 text-xs">
                <span className="font-bold text-text-primary block">Apple Pay / Google Pay Direct</span>
                <p className="text-text-muted">
                  Biometric 1-tap confirmation with Apple Touch ID, Face ID, or Google Wallet. Zero latency processing.
                </p>
              </div>
            )}

            {/* Amount Input with Chips */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {mode === 'deposit' ? 'Deposit Amount' : 'Withdrawal Request Amount'}
                </label>
                {mode === 'withdraw' && (
                  <button
                    type="button"
                    onClick={() => setAmount(targetAccount.balance.toString())}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Withdraw All ({formatCurrency(targetAccount.balance, targetAccount.currency)})
                  </button>
                )}
              </div>
              <NumericInput
                currencyPrefix={targetAccount.currency === 'USD' ? '$' : '€'}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                chips={mode === 'deposit' ? depositPresets : undefined}
                onChipSelect={(val) => setAmount(String(val))}
              />
            </div>

            {/* Payout breakdown in withdraw mode */}
            {mode === 'withdraw' && numericAmount > 0 && (
              <div className="p-4 rounded-xl bg-card-hover/80 border border-card-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">You Request:</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(numericAmount, targetAccount.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Broker Clearance Fee:</span>
                  <span className="font-semibold text-success">$0.00 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Estimated Settlement:</span>
                  <span className="font-semibold text-accent">{methodProcessingTimes[selectedMethod]}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-card-border font-bold">
                  <span className="text-text-primary">Net Payout to Your Channel:</span>
                  <span className="text-accent text-sm">{formatCurrency(numericAmount, targetAccount.currency)}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm"
              loading={isProcessing}
            >
              {mode === 'deposit'
                ? `Confirm Deposit ${numericAmount > 0 ? formatCurrency(numericAmount, targetAccount.currency) : ''}`
                : `Submit Withdrawal Request ${numericAmount > 0 ? formatCurrency(numericAmount, targetAccount.currency) : ''}`}
            </Button>
          </form>
        </div>

        {/* Right 1 Col: Limits & Verification Panel */}
        <div className="space-y-6">
          <div className="card flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-card-border/60">
              <ShieldCheck size={16} className="text-accent" />
              <h3 className="text-sm font-bold text-text-primary">
                Funding Limits & Status
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-text-muted">Daily Limit</span>
                  <span className="font-semibold text-text-primary">$10,000 / $50,000</span>
                </div>
                <LinearProgress value={20} max={100} colorClass="bg-accent" size="sm" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-text-muted">Monthly Limit</span>
                  <span className="font-semibold text-text-primary">$45,000 / $250,000</span>
                </div>
                <LinearProgress value={18} max={100} colorClass="bg-indigo-400" size="sm" />
              </div>

              <div className="p-3 rounded-lg bg-card-hover/80 border border-card-border space-y-1">
                <span className="font-semibold text-text-primary block">KYC Tier 2 Verified</span>
                <p className="text-text-muted text-[11px] leading-relaxed">
                  Your identity and proof of address are approved. Contact support to request enterprise institutional limits.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 space-y-1">
                <span className="font-semibold text-accent block flex items-center gap-1.5">
                  <Sparkles size={13} /> Fast-Track Clearance
                </span>
                <p className="text-text-muted text-[11px]">
                  VIP routing active. Card and Crypto withdrawals under $5,000 are processed without manual AML holds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Cashier Transaction History Table ─────────────────────────────── */}
      <div className="card flex flex-col gap-4 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
          <div>
            <h2 className="text-base font-bold text-text-primary">Cashier History</h2>
            <p className="text-xs text-text-muted">
              Historical deposits, bank transfers, and withdrawal receipts
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-card-hover p-1 rounded-lg border border-card-border">
              {(['all', 'deposit', 'withdrawal', 'pending'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setHistoryFilter(f)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                    historyFilter === f
                      ? 'bg-card-bg text-accent shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {f}
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
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 font-medium">Method</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                <th className="pb-2 font-medium text-right">Status</th>
                <th className="pb-2 font-medium text-center w-10">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {filteredHistory.map((t) => {
                const isExpanded = expandedRowId === t.id
                return (
                  <tr key={t.id} className="group hover:bg-card-hover/40 transition-colors">
                    <td className="py-3 font-mono text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <span>{t.reference || t.id}</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-text-primary">{t.method || 'Internal'}</td>
                    <td className="py-3 capitalize text-text-secondary">{t.type}</td>
                    <td className="py-3 text-text-muted">{formatDate(t.date, 'short')}</td>
                    <td
                      className={`py-3 text-right font-bold tabular-nums ${
                        t.amount >= 0 ? 'text-success' : 'text-text-primary'
                      }`}
                    >
                      {t.amount >= 0 ? '+' : ''}
                      {formatCurrency(t.amount, t.currency)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <StatusBadge status={t.status} />
                        {t.status === 'pending' && t.type === 'withdrawal' && (
                          <button
                            type="button"
                            onClick={() => handleCancelPending(t.id, t.amount)}
                            title="Cancel pending withdrawal"
                            className="text-[10px] text-danger hover:underline font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setExpandedRowId(isExpanded ? null : t.id)}
                        className="p-1 text-text-muted hover:text-accent rounded"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Expandable Accordion Detail if row selected */}
        {expandedRowId && (
          <div className="p-4 rounded-xl bg-card-hover/70 border border-card-border space-y-2 text-xs animate-slide-up">
            {(() => {
              const item = history.find((t) => t.id === expandedRowId)
              if (!item) return null
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Transaction Ref</span>
                    <span className="font-mono text-accent">{item.reference || item.id}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Account</span>
                    <span className="font-semibold text-text-primary">{item.accountId}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Description</span>
                    <span className="text-text-secondary">{item.description}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Clearance Fee</span>
                    <span className="font-semibold text-success">$0.00 (Zero Fee)</span>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* ─── Modal: Crypto QR Code ─────────────────────────────────────────── */}
      <Modal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Tether USDT (TRC-20) Deposit Address"
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="w-44 h-44 p-2 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-card-border">
            <div className="w-full h-full bg-[#090A0D] rounded-xl flex flex-col items-center justify-center p-3 text-white">
              <QrCode size={96} className="text-accent" />
              <span className="text-[9px] font-mono mt-1 text-slate-300">TRC-20 VERIFIED</span>
            </div>
          </div>

          <div className="w-full space-y-1">
            <span className="text-[11px] text-text-muted uppercase">TRC-20 Address</span>
            <div className="flex items-center justify-between p-2 rounded-lg bg-card-hover border border-card-border">
              <span className="font-mono text-xs text-accent truncate">{trc20Address}</span>
              <button onClick={handleCopyCrypto} className="p-1 hover:text-white">
                {copiedAddress ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <Button variant="secondary" size="sm" className="w-full" onClick={() => setQrModalOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
