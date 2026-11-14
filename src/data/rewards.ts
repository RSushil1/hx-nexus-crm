export type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export type Challenge = {
  id: string
  title: string
  description: string
  progress: number
  target: number
  points: number
  status: 'active' | 'completed' | 'pending'
  expiresAt?: string
  link?: string
}

export type RewardItem = {
  id: string
  name: string
  description: string
  category: 'rebate' | 'bonus' | 'swag' | 'voucher'
  pointsCost: number
  image?: string
  wishlisted?: boolean
}

export type PointsEntry = {
  id: string
  date: string
  activity: string
  points: number
  type: 'earned' | 'spent' | 'expired'
}

export const tierThresholds: Record<Tier, number> = {
  Bronze:   0,
  Silver:   1000,
  Gold:     3000,
  Platinum: 10000,
}

export const tierBenefits: Record<Tier, string[]> = {
  Bronze:   ['Access to basic rewards catalogue', 'Referral programme access'],
  Silver:   ['5% fee rebate on commissions', 'Priority support queue', 'Early access to new features'],
  Gold:     ['10% fee rebate on commissions', 'Dedicated account manager', 'Exclusive trading signals', 'Monthly bonus credits'],
  Platinum: ['15% fee rebate', 'VIP support 24/7', 'Private market analysis', 'Quarterly cash bonus'],
}

export const rewards = {
  currentPoints: 2450,
  currentTier: 'Silver' as Tier,
  lifetimePoints: 8920,

  challenges: [
    { id: 'ch-001', title: 'Complete 5 deposits', description: 'Make 5 separate deposit transactions', progress: 3, target: 5, points: 250, status: 'active', expiresAt: '2026-11-30T23:59:59Z' },
    { id: 'ch-002', title: 'Verify phone number', description: 'Add and verify your mobile number', progress: 0, target: 1, points: 100, status: 'pending', link: '/onboarding' },
    { id: 'ch-003', title: 'Refer a trader', description: 'Invite friends who successfully fund an account', progress: 1, target: 2, points: 500, status: 'active', link: '/referrals' },
    { id: 'ch-004', title: 'Open a Raw Spread account', description: 'Experience ultra-tight spreads', progress: 1, target: 1, points: 200, status: 'completed' },
    { id: 'ch-005', title: 'First prediction win', description: 'Win your first prediction in the Arena', progress: 1, target: 1, points: 150, status: 'completed' },
    { id: 'ch-006', title: 'Trade 10 lots in a month', description: 'Accumulate 10 lots of trading volume', progress: 6, target: 10, points: 400, status: 'active', expiresAt: '2026-11-30T23:59:59Z' },
  ] as Challenge[],

  catalogue: [
    { id: 'rw-001', name: '$25 Fee Rebate',          description: '25 USD credited as trading commission rebate', category: 'rebate',  pointsCost: 500,  wishlisted: false },
    { id: 'rw-002', name: '$50 Bonus Credit',         description: '$50 non-withdrawable trading bonus',           category: 'bonus',   pointsCost: 1000, wishlisted: true  },
    { id: 'rw-003', name: 'HX Nexus Trading Mug',    description: 'Premium ceramic mug with HX Nexus branding',   category: 'swag',    pointsCost: 750,  wishlisted: false },
    { id: 'rw-004', name: '$100 Amazon Voucher',      description: 'Digital Amazon gift card',                     category: 'voucher', pointsCost: 1500, wishlisted: false },
    { id: 'rw-005', name: '$100 Fee Rebate',          description: '$100 USD credited as commission rebate',       category: 'rebate',  pointsCost: 1800, wishlisted: false },
    { id: 'rw-006', name: 'HX Nexus Cap & T-Shirt',  description: 'Branded apparel pack',                         category: 'swag',    pointsCost: 1200, wishlisted: false },
    { id: 'rw-007', name: '$200 Bonus Credit',        description: '$200 non-withdrawable trading bonus',          category: 'bonus',   pointsCost: 3500, wishlisted: false },
    { id: 'rw-008', name: 'Luxury Watch Voucher',     description: 'Redeemable at select watch retailers',         category: 'voucher', pointsCost: 8000, wishlisted: false },
  ] as RewardItem[],

  history: [
    { id: 'ph-001', date: '2026-11-13T10:22:00Z', activity: 'Deposit completed',       points:  50, type: 'earned'  },
    { id: 'ph-002', date: '2026-11-11T09:00:00Z', activity: 'Internal transfer made',  points:  25, type: 'earned'  },
    { id: 'ph-003', date: '2026-11-08T11:15:00Z', activity: 'Deposit completed',       points:  50, type: 'earned'  },
    { id: 'ph-004', date: '2026-11-01T08:30:00Z', activity: 'Crypto deposit',          points:  75, type: 'earned'  },
    { id: 'ph-005', date: '2026-10-29T17:22:00Z', activity: 'Prediction arena win',    points: 150, type: 'earned'  },
    { id: 'ph-006', date: '2026-10-25T10:00:00Z', activity: 'Referral bonus',          points: 500, type: 'earned'  },
    { id: 'ph-007', date: '2026-10-20T09:30:00Z', activity: '$25 Fee Rebate redeemed', points: -500, type: 'spent'  },
    { id: 'ph-008', date: '2026-10-15T13:45:00Z', activity: 'Monthly trading volume',  points: 400, type: 'earned'  },
    { id: 'ph-009', date: '2026-10-01T00:00:00Z', activity: 'Promotional bonus expired', points: -200, type: 'expired' },
  ] as PointsEntry[],
}
