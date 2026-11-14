import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  Sparkles,
  Zap,
  Gift,
  Heart,
  Clock,
  ArrowRight,
  CheckCircle2,
  Download,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { LinearProgress } from '@/components/ui/Progress'
import {
  rewards as initialRewards,
  tierThresholds,
  tierBenefits,
  type Tier,
  type Challenge,
  type RewardItem,
  type PointsEntry,
} from '@/data/rewards'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function Rewards() {
  const [points, setPoints] = useState(initialRewards.currentPoints)
  const [tier, setTier] = useState<Tier>(initialRewards.currentTier)
  const [challenges, setChallenges] = useState<Challenge[]>(initialRewards.challenges)
  const [catalogue, setCatalogue] = useState<RewardItem[]>(initialRewards.catalogue)
  const [history, setHistory] = useState<PointsEntry[]>(initialRewards.history)

  // Filters
  const [catalogueFilter, setCatalogueFilter] = useState<'all' | 'rebate' | 'bonus' | 'swag' | 'voucher'>('all')
  const [historyFilter, setHistoryFilter] = useState<'all' | 'earned' | 'spent' | 'expired'>('all')

  // Modals & Tooltips
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)
  const [redeemModalOpen, setRedeemModalOpen] = useState(false)
  const [showTierBenefits, setShowTierBenefits] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  // Tier progress calculations
  const nextTier: Tier = tier === 'Bronze' ? 'Silver' : tier === 'Silver' ? 'Gold' : 'Platinum'
  const targetPoints = tierThresholds[nextTier]
  const prevTarget = tierThresholds[tier]
  const pointsNeeded = Math.max(0, targetPoints - points)
  const progressToNext = Math.min(
    100,
    Math.max(0, ((points - prevTarget) / (targetPoints - prevTarget)) * 100)
  )

  // Wishlist toggle
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCatalogue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextWish = !item.wishlisted
          toast.info(nextWish ? `Added ${item.name} to wishlist` : `Removed ${item.name} from wishlist`)
          return { ...item, wishlisted: nextWish }
        }
        return item
      })
    )
  }

  // Claim Challenge
  const handleClaimChallenge = (ch: Challenge) => {
    setPoints((prev) => prev + ch.points)
    setChallenges((prev) =>
      prev.map((c) => (c.id === ch.id ? { ...c, status: 'completed' as const, progress: c.target } : c))
    )
    const newEntry: PointsEntry = {
      id: `ph-${Date.now()}`,
      date: new Date().toISOString(),
      activity: `Bounty claimed: ${ch.title}`,
      points: ch.points,
      type: 'earned',
    }
    setHistory((prev) => [newEntry, ...prev])
    toast.success(`Claimed +${ch.points} Nexus Points for "${ch.title}"!`)
  }

  // Redeem Reward
  const handleRedeemConfirm = () => {
    if (!selectedReward) return
    if (points < selectedReward.pointsCost) {
      toast.error('Insufficient Nexus Points for this reward')
      return
    }

    setIsRedeeming(true)
    setTimeout(() => {
      setIsRedeeming(false)
      setPoints((prev) => prev - selectedReward.pointsCost)
      const newEntry: PointsEntry = {
        id: `ph-${Date.now()}`,
        date: new Date().toISOString(),
        activity: `Redeemed: ${selectedReward.name}`,
        points: -selectedReward.pointsCost,
        type: 'spent',
      }
      setHistory((prev) => [newEntry, ...prev])
      toast.success(`Successfully redeemed ${selectedReward.name}! Instructions sent to your email.`)
      setRedeemModalOpen(false)
      setSelectedReward(null)
    }, 1200)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Date,Activity,Type,Points\n'
    const rows = history
      .map((h) => `"${h.id}","${h.date}","${h.activity}","${h.type}",${h.points}`)
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `nexus-points-ledger-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Points history exported to CSV')
  }

  // Filtered lists
  const filteredCatalogue = useMemo(() => {
    if (catalogueFilter === 'all') return catalogue
    return catalogue.filter((item) => item.category === catalogueFilter)
  }, [catalogue, catalogueFilter])

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'all') return history
    return history.filter((h) => h.type === historyFilter)
  }, [history, historyFilter])

  return (
    <PageWrapper
      title="Rewards & Loyalty"
      subtitle="Trading milestones, VIP tiers, and rebate vouchers."
    >
      {/* ─── Hero Loyalty Card ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden card bg-card-bg border-card-border p-5">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Tier Badge & Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30 shadow-sm animate-pulse">
                <Sparkles size={13} />
                🥈 {tier} Tier Member
              </span>
              <button
                type="button"
                onClick={() => setShowTierBenefits(!showTierBenefits)}
                className="text-xs text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
              >
                <Info size={13} />
                <span>Tier Perks</span>
              </button>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-black text-text-primary tracking-tight tabular-nums">
                  {points.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                  Nexus Points
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Lifetime earned: <strong className="text-text-secondary">{initialRewards.lifetimePoints.toLocaleString()} pts</strong> · Points never expire for active traders
              </p>
            </div>
          </div>

          {/* Right: Progress towards next tier */}
          <div className="w-full lg:w-96 p-4 rounded-xl bg-card-hover/60 border border-card-border/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-1.5">
                <Award size={14} className="text-accent" />
                Next Tier: 🥇 {nextTier}
              </span>
              <span className="font-bold text-accent tabular-nums">
                {pointsNeeded > 0 ? `${pointsNeeded.toLocaleString()} pts to go` : 'Tier Achieved!'}
              </span>
            </div>

            <LinearProgress
              value={progressToNext}
              max={100}
              colorClass="bg-gradient-to-r from-accent to-emerald-400"
              size="md"
            />

            <div className="flex justify-between text-[11px] text-text-muted">
              <span>{prevTarget.toLocaleString()} pts ({tier})</span>
              <span>{targetPoints.toLocaleString()} pts ({nextTier})</span>
            </div>
          </div>
        </div>

        {/* Tier Benefits Dropdown Panel */}
        {showTierBenefits && (
          <div className="mt-6 pt-5 border-t border-card-border/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-slide-up">
            {(['Silver', 'Gold', 'Platinum'] as Tier[]).map((t) => {
              const isCurrent = t === tier
              return (
                <div
                  key={t}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-accent/10 border-accent text-text-primary'
                      : 'bg-card-bg border-card-border text-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">
                      {t === 'Silver' ? '🥈 Silver' : t === 'Gold' ? '🥇 Gold' : '💎 Platinum'}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-accent text-accent-btn px-2 py-0.5 rounded-full">
                        Current Tier
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1.5 text-[11px]">
                    {tierBenefits[t].map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 size={12} className={isCurrent ? 'text-accent shrink-0 mt-0.5' : 'text-text-muted shrink-0 mt-0.5'} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── Active Challenges Grid ────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Zap size={18} className="text-accent" />
              Active Trading Challenges & Bounties
            </h2>
            <p className="text-xs text-text-muted">
              Fulfill objectives to unlock instant points bonuses. New challenges refresh monthly.
            </p>
          </div>
          <span className="text-xs text-text-muted hidden sm:inline">
            {challenges.filter((c) => c.status === 'completed').length} of {challenges.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((ch) => {
            const isDone = ch.progress >= ch.target || ch.status === 'completed'
            const isPending = ch.status === 'pending'
            return (
              <div
                key={ch.id}
                className={`card p-4.5 flex flex-col justify-between gap-4 transition-all hover:border-card-border2 ${
                  isDone ? 'border-accent/30 bg-accent/5' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-text-primary">{ch.title}</h3>
                    <Badge variant={isDone ? 'accent' : 'neutral'}>
                      +{ch.points} pts
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{ch.description}</p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-card-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted text-[11px]">Progress</span>
                    <span className="font-semibold text-text-secondary tabular-nums">
                      {ch.progress} / {ch.target}
                    </span>
                  </div>

                  <LinearProgress
                    value={ch.progress}
                    max={ch.target}
                    colorClass={isDone ? 'bg-accent' : 'bg-text-secondary'}
                    size="sm"
                  />

                  <div className="flex items-center justify-between pt-1">
                    {ch.expiresAt ? (
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Clock size={11} className="text-warning" />
                        Ends in 16 days
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted">Ongoing</span>
                    )}

                    {isDone ? (
                      ch.status === 'completed' ? (
                        <span className="text-[11px] font-bold text-success flex items-center gap-1">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          onClick={() => handleClaimChallenge(ch)}
                        >
                          Claim Reward
                        </Button>
                      )
                    ) : ch.link ? (
                      <Link to={ch.link}>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          Start <ArrowRight size={12} className="ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-text-muted font-medium">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Rewards Catalogue ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Gift size={18} className="text-accent" />
              Rewards Catalogue
            </h2>
            <p className="text-xs text-text-muted">
              Redeem commission fee rebates, trading balance credit, branded merchandise, or retail vouchers.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-card-bg border border-card-border p-1 rounded-xl overflow-x-auto max-w-full">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'rebate', label: 'Fee Rebates' },
                { id: 'bonus', label: 'Bonus Credit' },
                { id: 'swag', label: 'Swag & Gear' },
                { id: 'voucher', label: 'Vouchers' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCatalogueFilter(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  catalogueFilter === cat.id
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalogue Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCatalogue.map((item) => {
            const canAfford = points >= item.pointsCost
            const shortfall = item.pointsCost - points
            return (
              <div
                key={item.id}
                className="card p-4 flex flex-col justify-between gap-3 group hover:border-card-border2 transition-all relative"
              >
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(item.id, e)}
                  title={item.wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-card-hover/80 text-text-muted hover:text-danger transition-colors z-10"
                >
                  <Heart
                    size={15}
                    className={item.wishlisted ? 'fill-danger text-danger' : 'text-text-muted'}
                  />
                </button>

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-card-hover border border-card-border flex items-center justify-center text-accent">
                    <Gift size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-card-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary tabular-nums">
                      {item.pointsCost.toLocaleString()} pts
                    </span>
                    {!canAfford && (
                      <span className="text-[10px] text-danger font-medium">
                        Need {shortfall.toLocaleString()} more
                      </span>
                    )}
                  </div>

                  <Button
                    variant={canAfford ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full text-xs"
                    disabled={!canAfford}
                    onClick={() => {
                      setSelectedReward(item)
                      setRedeemModalOpen(true)
                    }}
                  >
                    {canAfford ? 'Redeem Item' : 'Insufficient Points'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Points History Ledger ────────────────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-card-border/60">
          <div>
            <h2 className="text-base font-bold text-text-primary">Points Ledger & History</h2>
            <p className="text-xs text-text-muted">
              Complete audit trail of earned bounties, tier boosts, and redemptions
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-card-hover p-1 rounded-lg border border-card-border">
              {(['all', 'earned', 'spent', 'expired'] as const).map((f) => (
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
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Activity</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-card-hover/40 transition-colors">
                  <td className="py-2.5 text-text-muted">{formatDate(item.date, 'short')}</td>
                  <td className="py-2.5 font-medium text-text-primary">{item.activity}</td>
                  <td className="py-2.5">
                    <StatusBadge status={item.type} />
                  </td>
                  <td
                    className={`py-2.5 text-right font-bold tabular-nums ${
                      item.points > 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal: Confirm Reward Redemption ─────────────────────────────── */}
      {selectedReward && (
        <Modal
          open={redeemModalOpen}
          onClose={() => setRedeemModalOpen(false)}
          title="Confirm Reward Redemption"
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-card-hover/70 border border-card-border space-y-1.5">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                {selectedReward.category}
              </span>
              <h4 className="text-sm font-bold text-text-primary">{selectedReward.name}</h4>
              <p className="text-text-muted text-[11px] leading-relaxed">
                {selectedReward.description}
              </p>
            </div>

            <div className="space-y-2 py-2 border-y border-card-border/60">
              <div className="flex justify-between">
                <span className="text-text-muted">Available Balance:</span>
                <span className="font-semibold text-text-primary tabular-nums">{points.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Points Deduction:</span>
                <span className="font-bold text-danger tabular-nums">-{selectedReward.pointsCost.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-card-border/40">
                <span className="text-text-primary">Remaining Points:</span>
                <span className="text-accent tabular-nums">{(points - selectedReward.pointsCost).toLocaleString()} pts</span>
              </div>
            </div>

            <p className="text-[11px] text-text-muted leading-relaxed">
              Upon confirmation, digital vouchers and fee rebate codes will be dispatched immediately to your verified email address.
            </p>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={() => setRedeemModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-1/2"
                loading={isRedeeming}
                onClick={handleRedeemConfirm}
              >
                Confirm & Redeem
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  )
}
