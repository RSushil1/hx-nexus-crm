import { useState, useMemo } from 'react'
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Layers,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Printer,
  Sparkles,
  CheckCircle2,
  Mail,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from 'recharts'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { statements, type Statement } from '@/data/statements'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function Statements() {
  const [currencyFilter, setCurrencyFilter] = useState<'All' | 'USD' | 'EUR'>('All')
  const [yearFilter, setYearFilter] = useState<number>(2026)

  // Preview Modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null)

  // Comparison Tool
  const [compareMode, setCompareMode] = useState(false)
  const [compareIdA, setCompareIdA] = useState<string>('stmt-001')
  const [compareIdB, setCompareIdB] = useState<string>('stmt-002')

  // Filtered statements list
  const filteredStatements = useMemo(() => {
    return statements.filter((s) => {
      const matchCurr = currencyFilter === 'All' || s.currency === currencyFilter
      const matchYear = s.year === yearFilter
      return matchCurr && matchYear
    })
  }, [currencyFilter, yearFilter])

  // Annual Totals
  const annualDeposits = useMemo(
    () => filteredStatements.reduce((sum, s) => sum + s.netDeposits, 0),
    [filteredStatements]
  )
  const annualPL = useMemo(
    () => filteredStatements.reduce((sum, s) => sum + s.netPL, 0),
    [filteredStatements]
  )

  // Chart data for annual closing balances
  const chartData = useMemo(() => {
    return filteredStatements.map((s) => ({
      month: s.month.slice(0, 3),
      closing: s.closingBalance,
      pl: s.netPL,
    }))
  }, [filteredStatements])

  // Handlers
  const handleDownloadCSV = (s: Statement) => {
    const csvContent =
      'Month,Year,Currency,OpeningBalance,ClosingBalance,NetDeposits,NetWithdrawals,NetPL,TotalTrades\n' +
      `"${s.month}",${s.year},"${s.currency}",${s.openingBalance},${s.closingBalance},${s.netDeposits},${s.netWithdrawals},${s.netPL},${s.totalTrades}\n`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `statement-${s.month}-${s.year}-${s.currency}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloaded CSV statement for ${s.month} ${s.year}`)
  }

  const handleDownloadPDF = (s: Statement) => {
    toast.success(`Generated official PDF statement for ${s.month} ${s.year}`)
  }

  const handlePreview = (s: Statement) => {
    setSelectedStatement(s)
    setPreviewModalOpen(true)
  }

  // Statements for compare
  const stmtA = statements.find((s) => s.id === compareIdA) || statements[0]
  const stmtB = statements.find((s) => s.id === compareIdB) || statements[1]

  return (
    <PageWrapper
      title="Statements"
      subtitle="Monthly trading reconciliations and tax summaries."
      actions={
        <Button
          variant={compareMode ? 'primary' : 'outline'}
          size="sm"
          icon={<ArrowRightLeft size={14} />}
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? 'Close Comparison' : 'Compare Months'}
        </Button>
      }
    >
      {/* ─── Header Badges & Filters Row ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">
            {filteredStatements.length} statement{filteredStatements.length === 1 ? '' : 's'} available
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-xs text-text-muted font-mono">PDF & CSV</span>
        </div>

        {/* Currency & Year selectors */}
        <div className="flex items-center gap-2">
          <div className="flex bg-card-hover border border-card-border rounded-lg p-0.5">
            {(['All', 'USD', 'EUR'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrencyFilter(c)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  currencyFilter === c
                    ? 'bg-accent/15 text-accent font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex bg-card-hover border border-card-border rounded-lg p-0.5">
            {[2026, 2025].map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  yearFilter === y
                    ? 'bg-card-bg text-text-primary font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Annual Summary Card with Recharts Mini Chart ────────────── */}
      <div className="card p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-card-border">
        <div className="space-y-1 max-w-sm">
          <span className="text-[11px] font-semibold text-accent uppercase tracking-wider block">
            Annual Overview · {yearFilter}
          </span>
          <h2 className="text-base font-semibold text-text-primary">
            Trading & Cash Flow Summary
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Reconciliation of cleared deposits, turnover volume, and realized trading performance.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-lg bg-card-hover border border-card-border min-w-[120px]">
              <span className="text-text-muted block text-[10px] uppercase tracking-wider">Deposits</span>
              <span className="text-sm font-semibold text-text-primary tabular-nums">
                {formatCurrency(annualDeposits)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-card-hover border border-card-border min-w-[120px]">
              <span className="text-text-muted block text-[10px] uppercase tracking-wider">Net Trading P/L</span>
              <span className={`text-sm font-semibold tabular-nums ${annualPL >= 0 ? 'text-success' : 'text-danger'}`}>
                {annualPL >= 0 ? '+' : ''}{formatCurrency(annualPL)}
              </span>
            </div>
          </div>
        </div>

        {/* Mini Recharts Bar Chart */}
        <div className="flex-1 max-w-md h-32 pt-2">
          <div className="text-[10px] font-medium text-text-muted mb-1 flex items-center justify-between">
            <span>Closing Balances</span>
            <span className="text-text-muted font-mono">{yearFilter} Monthly</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#525866" fontSize={10} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="p-2.5 rounded-lg bg-card-bg border border-card-border shadow-xl text-[11px]">
                        <p className="font-semibold text-text-primary mb-1">{data.month}</p>
                        <p className="text-accent font-mono">Closing: {formatCurrency(data.closing)}</p>
                        <p className={`font-mono ${data.pl >= 0 ? 'text-success' : 'text-danger'}`}>
                          P/L: {data.pl >= 0 ? '+' : ''}{formatCurrency(data.pl)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="closing" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Side-by-Side Statement Comparison Tool ───────────────────── */}
      {compareMode && (
        <div className="card p-4 flex flex-col gap-4 border-accent/30 bg-card-bg">
          <div className="flex items-center justify-between border-b border-card-border pb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-accent" />
              <h3 className="text-xs font-semibold text-text-primary">
                Side-by-Side Comparison
              </h3>
            </div>
            <button
              onClick={() => setCompareMode(false)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column A */}
            <div className="p-3.5 rounded-lg bg-card-hover border border-card-border space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Period A</label>
                <select
                  value={compareIdA}
                  onChange={(e) => setCompareIdA(e.target.value)}
                  className="w-full h-8 px-2.5 bg-card-bg border border-card-border rounded-md text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                >
                  {statements.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.month} {s.year} ({s.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-text-muted">Opening:</span>
                  <span className="font-medium text-text-primary tabular-nums">{formatCurrency(stmtA.openingBalance, stmtA.currency)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-text-muted">Closing:</span>
                  <span className="font-medium text-text-primary tabular-nums">{formatCurrency(stmtA.closingBalance, stmtA.currency)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-text-muted">Deposits:</span>
                  <span className="font-medium text-text-secondary tabular-nums">{formatCurrency(stmtA.netDeposits, stmtA.currency)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Trading P/L:</span>
                  <span className={`font-semibold tabular-nums ${stmtA.netPL >= 0 ? 'text-success' : 'text-danger'}`}>
                    {stmtA.netPL >= 0 ? '+' : ''}{formatCurrency(stmtA.netPL, stmtA.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Column B */}
            <div className="p-3.5 rounded-lg bg-card-hover border border-card-border space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Period B</label>
                <select
                  value={compareIdB}
                  onChange={(e) => setCompareIdB(e.target.value)}
                  className="w-full h-8 px-2.5 bg-card-bg border border-card-border rounded-md text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                >
                  {statements.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.month} {s.year} ({s.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-text-muted">Opening:</span>
                  <span className="font-medium text-text-primary tabular-nums">{formatCurrency(stmtB.openingBalance, stmtB.currency)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-text-muted">Closing:</span>
                  <span className="font-medium text-text-primary tabular-nums">{formatCurrency(stmtB.closingBalance, stmtB.currency)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-card-border/50">
                  <span className="text-text-muted">Deposits:</span>
                  <span className="font-medium text-text-secondary tabular-nums">{formatCurrency(stmtB.netDeposits, stmtB.currency)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Trading P/L:</span>
                  <span className={`font-semibold tabular-nums ${stmtB.netPL >= 0 ? 'text-success' : 'text-danger'}`}>
                    {stmtB.netPL >= 0 ? '+' : ''}{formatCurrency(stmtB.netPL, stmtB.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Monthly Statements Cards List ─────────────────────────────────── */}
      <div className="space-y-2.5">
        {filteredStatements.map((s) => (
          <div
            key={s.id}
            className="card p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-card-border2 transition-all"
          >
            {/* Month & Period Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-card-hover text-accent border border-card-border flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-text-primary">
                    {s.month} {s.year}
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card-hover text-text-muted border border-card-border">
                    {s.currency}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted">
                  {s.totalTrades} closed trades
                </span>
              </div>
            </div>

            {/* Financial Data Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Opening</span>
                <span className="font-medium text-text-secondary tabular-nums">
                  {formatCurrency(s.openingBalance, s.currency)}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Closing</span>
                <span className="font-semibold text-text-primary tabular-nums">
                  {formatCurrency(s.closingBalance, s.currency)}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Deposits</span>
                <span className="font-medium text-text-secondary tabular-nums">
                  {formatCurrency(s.netDeposits, s.currency)}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Trading P/L</span>
                <span className={`font-semibold tabular-nums ${s.netPL >= 0 ? 'text-success' : 'text-danger'}`}>
                  {s.netPL >= 0 ? '+' : ''}{formatCurrency(s.netPL, s.currency)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-card-border/60 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                icon={<Eye size={13} />}
                onClick={() => handlePreview(s)}
              >
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Download size={13} />}
                onClick={() => handleDownloadCSV(s)}
              >
                CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download size={13} />}
                onClick={() => handleDownloadPDF(s)}
              >
                PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Delivery Settings Card ────────────────────────────────────────── */}
      <div className="card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 border-card-border bg-card-hover text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-card-bg text-accent border border-card-border shrink-0">
            <Mail size={16} />
          </div>
          <div>
            <span className="font-semibold text-text-primary block text-xs">Monthly Email Delivery</span>
            <span className="text-[11px] text-text-muted">
              Statements are dispatched on the 1st of each month to <span className="font-mono text-text-secondary">dana.reyes@hxnexus.com</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] bg-success/10 text-success font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-success/20">
            <CheckCircle2 size={11} /> Active
          </span>
        </div>
      </div>

      {/* ─── Modal: Statement Preview ──────────────────────────────────────── */}
      {selectedStatement && (
        <Modal
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          title={`Official Statement — ${selectedStatement.month} ${selectedStatement.year}`}
          description={`HX Nexus Segregated Trader Statement · Currency: ${selectedStatement.currency}`}
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Header metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-card-hover/80 border border-card-border">
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Account Holder</span>
                <span className="font-bold text-text-primary">Dana Reyes</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Login ID</span>
                <span className="font-mono font-bold text-text-primary">8839201</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Platform</span>
                <span className="font-bold text-text-primary">MetaTrader 5</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Clearance Period</span>
                <span className="font-semibold text-text-secondary">Full Month</span>
              </div>
            </div>

            {/* Financial Summary Table */}
            <div className="border border-card-border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y divide-card-border/50">
                  <tr className="bg-card-hover/30">
                    <td className="p-3 text-text-muted">Opening Cash Balance</td>
                    <td className="p-3 text-right font-bold text-text-primary tabular-nums">
                      {formatCurrency(selectedStatement.openingBalance, selectedStatement.currency)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-muted">Total Deposits Cleared</td>
                    <td className="p-3 text-right font-semibold text-text-secondary tabular-nums">
                      +{formatCurrency(selectedStatement.netDeposits, selectedStatement.currency)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-muted">Total Withdrawals Processed</td>
                    <td className="p-3 text-right font-semibold text-text-secondary tabular-nums">
                      -{formatCurrency(selectedStatement.netWithdrawals, selectedStatement.currency)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-muted">Closed Trading Net Profit/Loss</td>
                    <td className={`p-3 text-right font-bold tabular-nums ${selectedStatement.netPL >= 0 ? 'text-success' : 'text-danger'}`}>
                      {selectedStatement.netPL >= 0 ? '+' : ''}
                      {formatCurrency(selectedStatement.netPL, selectedStatement.currency)}
                    </td>
                  </tr>
                  <tr className="bg-accent/10 font-bold">
                    <td className="p-3 text-text-primary">Closing Balance</td>
                    <td className="p-3 text-right text-accent text-sm tabular-nums">
                      {formatCurrency(selectedStatement.closingBalance, selectedStatement.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Print / Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer size={13} />}
                onClick={() => window.print()}
              >
                Print Statement
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPreviewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  )
}
