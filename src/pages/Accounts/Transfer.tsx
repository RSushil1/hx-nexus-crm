import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  ChevronDown,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { NumericInput } from '@/components/ui/Input'
import { useAccountStore } from '@/store'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function Transfer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialFromId = searchParams.get('from') || 'acct-live-usd'

  const { accounts, updateBalance } = useAccountStore()

  // Only live accounts participate in real transfers
  const liveAccounts = useMemo(() => accounts.filter((a) => a.type === 'live'), [accounts])

  const [fromId, setFromId] = useState(initialFromId)
  const [toId, setToId] = useState(
    liveAccounts.find((a) => a.id !== initialFromId)?.id || liveAccounts[1]?.id || ''
  )
  const [amount, setAmount] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [lastTxRef, setLastTxRef] = useState('')

  const fromAccount = liveAccounts.find((a) => a.id === fromId) || liveAccounts[0]
  const toAccount = liveAccounts.find((a) => a.id === toId) || liveAccounts[1]

  const numericAmount = parseFloat(amount) || 0
  const isCrossCurrency = fromAccount.currency !== toAccount.currency
  // Exchange rate mock: 1 EUR = 1.08 USD
  const rate = fromAccount.currency === 'EUR' ? 1.08 : 0.9259
  const creditedAmount = isCrossCurrency ? numericAmount * rate : numericAmount

  const isInsufficient = numericAmount > fromAccount.balance
  const isInvalid = numericAmount <= 0 || isInsufficient || fromId === toId

  // Swap source and destination
  const handleSwap = () => {
    const temp = fromId
    setFromId(toId)
    setToId(temp)
  }

  // Quick chips
  const chips = [
    { label: '25%', value: (fromAccount.balance * 0.25).toFixed(2) },
    { label: '50%', value: (fromAccount.balance * 0.50).toFixed(2) },
    { label: '75%', value: (fromAccount.balance * 0.75).toFixed(2) },
    { label: '100% / Max', value: fromAccount.balance.toFixed(2) },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isInvalid) return

    setIsTransferring(true)
    setTimeout(() => {
      // Execute balances update
      updateBalance(fromId, -numericAmount)
      updateBalance(toId, creditedAmount)

      const ref = `TRF-${Date.now().toString().slice(-6)}`
      setLastTxRef(ref)
      setIsTransferring(false)
      setSuccessModalOpen(true)
      toast.success(`Successfully transferred ${formatCurrency(numericAmount, fromAccount.currency)}!`)
    }, 1200)
  }

  return (
    <PageWrapper
      title="Internal Transfer"
      subtitle="Move funds between your trading accounts with instant settlement."
      maxWidth="narrow"
      actions={
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={14} />}
          onClick={() => navigate('/accounts')}
        >
          Back to Accounts
        </Button>
      }
    >
      <div className="card flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source and Destination Selectors with Swap */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* From Account */}
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                From Account
              </label>
              <div className="relative">
                <select
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="w-full h-14 px-3.5 pr-10 rounded-xl bg-card-hover border border-card-border text-sm font-semibold text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent"
                >
                  {liveAccounts.map((a) => (
                    <option key={a.id} value={a.id} className="bg-card-bg">
                      {a.name} ({formatCurrency(a.balance, a.currency)})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
              <span className="text-[11px] text-text-muted block">
                Available: <strong className="text-text-primary">{formatCurrency(fromAccount.balance, fromAccount.currency)}</strong>
              </span>
            </div>

            {/* Circular Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 mt-4 rounded-full bg-card-bg border border-card-border hover:border-accent hover:text-accent flex items-center justify-center shrink-0 shadow-sm transition-transform active:rotate-180"
              title="Swap source and destination"
            >
              <ArrowRightLeft size={16} />
            </button>

            {/* To Account */}
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                To Account
              </label>
              <div className="relative">
                <select
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="w-full h-14 px-3.5 pr-10 rounded-xl bg-card-hover border border-card-border text-sm font-semibold text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent"
                >
                  {liveAccounts.map((a) => (
                    <option key={a.id} value={a.id} disabled={a.id === fromId} className="bg-card-bg">
                      {a.name} ({formatCurrency(a.balance, a.currency)})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
              <span className="text-[11px] text-text-muted block">
                Available: <strong className="text-text-primary">{formatCurrency(toAccount.balance, toAccount.currency)}</strong>
              </span>
            </div>
          </div>

          {/* Amount Input with Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Transfer Amount ({fromAccount.currency})
            </label>
            <NumericInput
              currencyPrefix={fromAccount.currency === 'USD' ? '$' : '€'}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              chips={chips}
              onChipSelect={(val) => setAmount(String(val))}
              error={isInsufficient ? 'Amount exceeds available balance' : undefined}
            />
          </div>

          {/* Real-time Transfer Preview Card */}
          <div className="p-4 rounded-xl bg-card-hover/70 border border-card-border space-y-3 text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider block text-[11px]">
              Transfer Calculation & Preview
            </span>
            <div className="space-y-2 divide-y divide-card-border/50">
              <div className="flex justify-between items-center pt-1">
                <span className="text-text-muted">{fromAccount.name} Balance (After deduction):</span>
                <span className="font-semibold text-text-secondary tabular-nums">
                  {formatCurrency(Math.max(0, fromAccount.balance - numericAmount), fromAccount.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-text-muted">{toAccount.name} Balance (After credit):</span>
                <span className="font-bold text-accent tabular-nums">
                  {formatCurrency(toAccount.balance + creditedAmount, toAccount.currency)}
                </span>
              </div>
              {isCrossCurrency && (
                <div className="flex justify-between items-center pt-2 text-text-muted">
                  <span>Conversion Rate:</span>
                  <span className="font-mono text-text-secondary">
                    1 {fromAccount.currency} = {rate.toFixed(4)} {toAccount.currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-text-muted">Broker Servicing Fee:</span>
                <span className="font-bold text-success">$0.00 (Free)</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-sm"
            disabled={isInvalid}
            loading={isTransferring}
            icon={<Zap size={16} />}
          >
            Confirm & Execute Transfer
          </Button>
        </form>
      </div>

      {/* ─── Success Modal ─────────────────────────────────────────────────── */}
      <Modal
        open={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false)
          navigate('/accounts')
        }}
        title="Transfer Executed Successfully"
        size="sm"
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider block">Reference Code</span>
            <span className="text-sm font-mono font-bold text-accent mt-0.5 block">{lastTxRef}</span>
          </div>
          <p className="text-xs text-text-secondary">
            Your transfer of <strong className="text-text-primary">{formatCurrency(numericAmount, fromAccount.currency)}</strong> from {fromAccount.name} to {toAccount.name} has been cleared instantly.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              setSuccessModalOpen(false)
              navigate('/accounts')
            }}
          >
            Back to Accounts Hub
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
