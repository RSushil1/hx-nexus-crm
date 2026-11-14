export type Account = {
  id: string
  name: string
  type: 'live' | 'demo'
  currency: 'USD' | 'EUR'
  platform: 'MT5' | 'MT4'
  leverage: string
  status: 'active' | 'inactive'
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  floatingPL: number
  group: string
  server: string
  loginId: string
  createdAt: string
  accountType: 'Standard' | 'Raw Spread' | 'Islamic' | 'Demo'
  commission?: string
  spread?: string
}

export const accounts: Account[] = [
  {
    id: 'acct-live-usd',
    name: 'Live USD',
    type: 'live',
    currency: 'USD',
    platform: 'MT5',
    leverage: '1:500',
    status: 'active',
    balance: 10250.00,
    equity: 10732.50,
    margin: 2858.00,
    freeMargin: 7874.50,
    marginLevel: 375.5,
    floatingPL: 482.50,
    group: 'pro-usd-500',
    server: 'HXNexus-Live',
    loginId: '8839201',
    createdAt: '2024-03-17',
    accountType: 'Standard',
    spread: '1.0 pip',
    commission: 'None',
  },
  {
    id: 'acct-raw-usd',
    name: 'Raw Spread USD',
    type: 'live',
    currency: 'USD',
    platform: 'MT5',
    leverage: '1:200',
    status: 'active',
    balance: 3200.00,
    equity: 3200.00,
    margin: 0,
    freeMargin: 3200.00,
    marginLevel: 999.9,
    floatingPL: 0,
    group: 'raw-usd-200',
    server: 'HXNexus-Live',
    loginId: '8839202',
    createdAt: '2024-05-10',
    accountType: 'Raw Spread',
    spread: '0.0 pip',
    commission: '$3.50/lot',
  },
  {
    id: 'acct-std-eur',
    name: 'Standard EUR',
    type: 'live',
    currency: 'EUR',
    platform: 'MT5',
    leverage: '1:100',
    status: 'active',
    balance: 820.00,
    equity: 820.00,
    margin: 0,
    freeMargin: 820.00,
    marginLevel: 999.9,
    floatingPL: 0,
    group: 'std-eur-100',
    server: 'HXNexus-Live',
    loginId: '8839203',
    createdAt: '2024-07-22',
    accountType: 'Standard',
    spread: '1.0 pip',
    commission: 'None',
  },
  {
    id: 'acct-demo-mt5',
    name: 'Demo MT5',
    type: 'demo',
    currency: 'USD',
    platform: 'MT5',
    leverage: '1:500',
    status: 'active',
    balance: 50000.00,
    equity: 50000.00,
    margin: 0,
    freeMargin: 50000.00,
    marginLevel: 999.9,
    floatingPL: 0,
    group: 'demo-usd',
    server: 'HXNexus-Demo',
    loginId: '9900001',
    createdAt: '2024-03-15',
    accountType: 'Demo',
    spread: '1.0 pip',
    commission: 'None',
  },
]

export const accountTypes = [
  {
    id: 'standard',
    name: 'Standard Account',
    description: 'Perfect for all traders. No commissions, tight spreads.',
    spread: 'From 1.0 pip',
    commission: '$0',
    minDeposit: '$100',
    leverage: 'Up to 1:500',
    platform: 'MT5',
  },
  {
    id: 'raw',
    name: 'Raw Spread Account',
    description: 'Ultra-tight spreads with low fixed commission per lot.',
    spread: 'From 0.0 pip',
    commission: '$3.50/lot',
    minDeposit: '$200',
    leverage: 'Up to 1:200',
    platform: 'MT5',
  },
  {
    id: 'islamic',
    name: 'Islamic / Swap-Free',
    description: 'Shariah-compliant accounts with no overnight swap charges.',
    spread: 'From 1.2 pip',
    commission: '$0',
    minDeposit: '$100',
    leverage: 'Up to 1:100',
    platform: 'MT5',
  },
]

// Generate daily balance history
function generateBalanceHistory(baseBalance: number, days: number) {
  const history = []
  const now = new Date()
  let balance = baseBalance * 0.85
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    balance = balance + (Math.random() - 0.45) * balance * 0.02
    history.push({
      date: date.toISOString().split('T')[0],
      balance: Math.round(balance * 100) / 100,
    })
  }
  return history
}

export const accountHistory: Record<string, { date: string; balance: number }[]> = {
  'acct-live-usd': generateBalanceHistory(10250, 90),
  'acct-raw-usd':  generateBalanceHistory(3200, 90),
  'acct-std-eur':  generateBalanceHistory(820, 90),
  'acct-demo-mt5': generateBalanceHistory(50000, 90),
}
