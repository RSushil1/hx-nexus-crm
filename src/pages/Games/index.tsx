import { useState, useEffect, useMemo } from 'react'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Flame,
  Clock,
  Sparkles,
  Edit2,
  Check,
  ChevronUp,
  ChevronDown,
  Minus,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { games as initialGames, type PredictionMatch, type LeaderboardEntry } from '@/data/games'
import { toast } from 'sonner'

// Zod Schema for Handle Edit
const handleSchema = z.object({
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(15, 'Handle cannot exceed 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
})

type HandleFormData = z.infer<typeof handleSchema>

export default function Games() {
  const [userProfile, setUserProfile] = useState(initialGames.userProfile)
  const [matches, setMatches] = useState<PredictionMatch[]>(initialGames.matches)
  const [editHandleOpen, setEditHandleOpen] = useState(false)

  // Featured Match Live Countdown & Prediction State
  const featuredMatch = matches.find((m) => m.id === 'match-001') || matches[0]
  const [selectedDirection, setSelectedDirection] = useState<'bull' | 'bear' | null>(
    featuredMatch.userPrediction || null
  )
  const [stakeAmount, setStakeAmount] = useState('100')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Countdown timer state (seconds remaining)
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 32)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
  }

  // Handle Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HandleFormData>({
    resolver: zodResolver(handleSchema),
    defaultValues: { handle: userProfile.handle },
  })

  const onSubmitHandle = (data: HandleFormData) => {
    setUserProfile((prev) => ({ ...prev, handle: data.handle }))
    toast.success(`Arena handle updated to @${data.handle}`)
    setEditHandleOpen(false)
  }

  // Handle Match Prediction Submit
  const handlePredictionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDirection) {
      toast.error('Please pick Bullish 🐂 or Bearish 🐻')
      return
    }
    const numericStake = parseInt(stakeAmount, 10) || 0
    if (numericStake <= 0) {
      toast.error('Please enter a valid points stake')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setMatches((prev) =>
        prev.map((m) =>
          m.id === featuredMatch.id
            ? { ...m, userPrediction: selectedDirection, userStake: numericStake }
            : m
        )
      )
      setUserProfile((prev) => ({
        ...prev,
        totalPredictions: prev.totalPredictions + 1,
      }))
      toast.success(
        `Locked in ${selectedDirection.toUpperCase()} prediction on ${featuredMatch.market} for ${numericStake} pts!`
      )
    }, 1000)
  }

  // Match Explorer Filters
  const [matchTab, setMatchTab] = useState<'open' | 'resolved' | 'my'>('open')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'forex' | 'crypto' | 'commodity'>('all')

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // Tab filter
      if (matchTab === 'open' && m.status !== 'open') return false
      if (matchTab === 'resolved' && m.status !== 'resolved') return false
      if (matchTab === 'my' && !m.userPrediction) return false

      // Category filter
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false

      return true
    })
  }, [matches, matchTab, categoryFilter])

  // Leaderboard Tab
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('daily')

  return (
    <PageWrapper
      title="Prediction Arena"
      subtitle="Market forecasting challenges, tournament rounds, and leaderboards."
    >
      {/* ─── Arena Profile Hero Card ─────────────────────────────────────── */}
      <div className="card bg-card-bg border-card-border p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-accent to-amber-600 text-accent-btn font-black text-xl flex items-center justify-center shadow-md border border-accent/30">
              {userProfile.handle.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-text-primary">
                  @{userProfile.handle}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    reset({ handle: userProfile.handle })
                    setEditHandleOpen(true)
                  }}
                  className="p-1 text-text-muted hover:text-accent rounded-md transition-colors"
                  title="Edit Handle"
                >
                  <Edit2 size={14} />
                </button>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30">
                  <Flame size={12} className="text-amber-400 fill-amber-400" />
                  {userProfile.winStreak}-Win Streak!
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Arena Tier 1 Forecasting Specialist · HX Nexus Global Tournament
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-card-bg border border-card-border min-w-[100px]">
              <span className="text-text-muted block text-[10px] uppercase font-bold">Global Rank</span>
              <span className="text-lg font-black text-accent tabular-nums">#{userProfile.globalRank}</span>
            </div>
            <div className="p-3 rounded-xl bg-card-bg border border-card-border min-w-[100px]">
              <span className="text-text-muted block text-[10px] uppercase font-bold">Win Rate</span>
              <span className="text-lg font-black text-success tabular-nums">{userProfile.winRate}%</span>
            </div>
            <div className="p-3 rounded-xl bg-card-bg border border-card-border min-w-[100px]">
              <span className="text-text-muted block text-[10px] uppercase font-bold">Predictions</span>
              <span className="text-lg font-black text-text-primary tabular-nums">{userProfile.totalPredictions}</span>
            </div>
            <div className="p-3 rounded-xl bg-card-bg border border-card-border min-w-[100px]">
              <span className="text-text-muted block text-[10px] uppercase font-bold">Points Won</span>
              <span className="text-lg font-black text-amber-400 tabular-nums">+{userProfile.pointsWon}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Featured Active Match Card ──────────────────────────────────── */}
      <div className="card p-5 border-card-border bg-card-bg space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Featured Live Arena Match
            </span>
            <Badge variant="accent">Prize: {featuredMatch.prizePool} pts</Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-card-bg border border-card-border px-3 py-1.5 rounded-xl">
            <Clock size={14} className="text-accent" />
            <span className="text-text-muted">Resolves In:</span>
            <span className="text-accent font-mono font-bold tabular-nums">
              {formatCountdown(secondsLeft)}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Market & Sentiment Bar */}
          <div className="space-y-4 flex-1 w-full">
            <div>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">
                {featuredMatch.market}
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Will EUR/USD close higher (Bull) or lower (Bear) at the next 15-minute candle expiry?
              </p>
            </div>

            {/* Split Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-success flex items-center gap-1">
                  🐂 Bullish {featuredMatch.bullPct}%
                </span>
                <span className="text-danger flex items-center gap-1">
                  Bearish {featuredMatch.bearPct}% 🐻
                </span>
              </div>

              <div className="w-full h-3.5 rounded-full bg-card-border overflow-hidden flex shadow-inner">
                <div
                  className="bg-emerald-500 h-full transition-all duration-700 rounded-l-full"
                  style={{ width: `${featuredMatch.bullPct}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-700 rounded-r-full"
                  style={{ width: `${featuredMatch.bearPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* User Prediction Action Box */}
          <div className="w-full lg:w-96 p-5 rounded-2xl bg-card-bg border border-card-border space-y-4 shadow-lg">
            {featuredMatch.userPrediction ? (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/40 text-center space-y-2 animate-slide-up">
                <div className="inline-flex items-center gap-1.5 text-accent font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Prediction Locked In!
                </div>
                <div className="text-lg font-black text-text-primary">
                  {featuredMatch.userPrediction === 'bull' ? '🐂 Bullish Call' : '🐻 Bearish Put'}
                </div>
                <p className="text-xs text-text-muted">
                  Staked: <strong className="text-accent">{featuredMatch.userStake} pts</strong> · Estimated win: +{((featuredMatch.userStake || 100) * 1.85).toFixed(0)} pts
                </p>
              </div>
            ) : (
              <form onSubmit={handlePredictionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Choose Your Side
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDirection('bull')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        selectedDirection === 'bull'
                          ? 'bg-success/20 border-success text-success ring-2 ring-success/50 shadow-md'
                          : 'bg-card-hover border-card-border text-text-secondary hover:border-success/40'
                      }`}
                    >
                      🐂 Predict Bull
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDirection('bear')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        selectedDirection === 'bear'
                          ? 'bg-danger/20 border-danger text-danger ring-2 ring-danger/50 shadow-md'
                          : 'bg-card-hover border-card-border text-text-secondary hover:border-danger/40'
                      }`}
                    >
                      🐻 Predict Bear
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase">
                    <span>Stake Nexus Points</span>
                    <span>Balance: 2,450 pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[50, 100, 250].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setStakeAmount(val.toString())}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          stakeAmount === val.toString()
                            ? 'bg-accent/15 border-accent text-accent'
                            : 'bg-card-hover border-card-border text-text-muted hover:text-text-primary'
                        }`}
                      >
                        {val} pts
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-bold"
                  loading={isSubmitting}
                >
                  Submit Prediction
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ─── Match Explorer & Leaderboard Split ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Match Explorer */}
        <div className="card lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
            <div>
              <h2 className="text-base font-bold text-text-primary">Match Explorer</h2>
              <p className="text-xs text-text-muted">
                Active forecasting pools across Forex, Crypto, and Commodities
              </p>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-card-hover p-1 rounded-xl border border-card-border">
              {(
                [
                  { id: 'open', label: 'Open' },
                  { id: 'resolved', label: 'Resolved' },
                  { id: 'my', label: 'My Predictions' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMatchTab(t.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                    matchTab === t.id
                      ? 'bg-card-bg text-accent shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {(
              [
                { id: 'all', label: 'All Markets' },
                { id: 'forex', label: 'Forex' },
                { id: 'crypto', label: 'Crypto' },
                { id: 'commodity', label: 'Commodities' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryFilter(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  categoryFilter === c.id
                    ? 'bg-accent/15 text-accent border border-accent/40'
                    : 'bg-card-bg border border-card-border text-text-muted hover:text-text-primary'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Matches List */}
          <div className="space-y-3">
            {filteredMatches.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-card-bg border border-card-border hover:border-card-border2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary">{m.market}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-card-hover border border-card-border text-text-muted">
                      {m.category}
                    </span>
                    <Badge variant={m.status === 'open' ? 'accent' : 'neutral'}>
                      {m.status === 'open' ? 'Live' : 'Resolved'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1 text-success font-semibold">
                      Bull {m.bullPct}%
                    </span>
                    <span className="flex items-center gap-1 text-danger font-semibold">
                      Bear {m.bearPct}%
                    </span>
                    <span>Pool: {m.prizePool} pts</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {m.userPrediction ? (
                    <div className="text-right">
                      <span className="text-[10px] text-text-muted block">Your Pick</span>
                      <span
                        className={`text-xs font-bold ${
                          m.userPrediction === 'bull' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {m.userPrediction === 'bull' ? '🐂 Bull' : '🐻 Bear'} ({m.userStake} pts)
                      </span>
                    </div>
                  ) : m.status === 'open' ? (
                    <Button variant="outline" size="sm" className="text-xs">
                      Join Pool
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-text-muted">
                      Winner: {m.result?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Leaderboard */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-card-border/60">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-amber-400" />
              <h3 className="text-sm font-bold text-text-primary">Leaderboard</h3>
            </div>

            <div className="flex bg-card-bg border border-card-border rounded-lg p-0.5 text-[11px]">
              {(['daily', 'weekly', 'alltime'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLeaderboardTimeframe(t)}
                  className={`px-2 py-0.5 font-semibold rounded capitalize transition-all ${
                    leaderboardTimeframe === t
                      ? 'bg-card-hover text-accent shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {initialGames.leaderboard.daily.map((trader) => {
              const isUser = trader.isCurrentUser
              return (
                <div
                  key={trader.rank}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isUser
                      ? 'bg-accent/15 border-accent text-text-primary font-bold shadow-md'
                      : 'bg-card-hover/40 border-card-border text-text-secondary hover:border-card-border2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-bold text-xs">
                      {trader.rank === 1 ? '🥇' : trader.rank === 2 ? '🥈' : trader.rank === 3 ? '🥉' : `#${trader.rank}`}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-card-bg border border-card-border flex items-center justify-center font-bold text-xs text-accent">
                      {trader.avatar}
                    </div>
                    <div>
                      <span className="font-semibold block truncate max-w-[100px] text-text-primary">
                        @{trader.handle}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Win: {trader.winRate}% · {trader.totalPredictions} picks
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="font-bold text-amber-400 tabular-nums">
                      {trader.points} pts
                    </span>
                    {trader.rankChange > 0 ? (
                      <span className="text-[10px] text-success flex items-center font-bold">
                        <ChevronUp size={12} /> {trader.rankChange}
                      </span>
                    ) : trader.rankChange < 0 ? (
                      <span className="text-[10px] text-danger flex items-center font-bold">
                        <ChevronDown size={12} /> {Math.abs(trader.rankChange)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted flex items-center">
                        <Minus size={12} />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Modal: Edit User Handle ──────────────────────────────────────── */}
      <Modal
        open={editHandleOpen}
        onClose={() => setEditHandleOpen(false)}
        title="Edit Arena Trader Handle"
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmitHandle)} className="space-y-4 text-xs">
          <div className="space-y-1">
            <Input
              label="New Handle"
              placeholder="e.g. dana_trader"
              {...register('handle')}
              error={errors.handle?.message}
            />
            <span className="text-[10px] text-text-muted">
              3–15 characters, alphanumeric and underscore only. Visible on leaderboards.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditHandleOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Handle
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
