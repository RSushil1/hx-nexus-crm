export type PredictionMatch = {
  id: string
  market: string
  category: 'forex' | 'crypto' | 'commodity'
  expiryTime: string
  bullPct: number
  bearPct: number
  status: 'open' | 'resolved'
  result?: 'bull' | 'bear'
  userPrediction?: 'bull' | 'bear'
  userStake?: number
  prizePool: number
}

export type LeaderboardEntry = {
  rank: number
  handle: string
  avatar: string
  winRate: number
  totalPredictions: number
  points: number
  rankChange: number
  isCurrentUser?: boolean
}

export const games = {
  userProfile: {
    handle: 'dana_trader',
    globalRank: 42,
    winRate: 68,
    totalPredictions: 19,
    winStreak: 3,
    totalWins: 13,
    totalLosses: 6,
    pointsWon: 2150,
  },

  matches: [
    { id: 'match-001', market: 'EUR/USD Bull vs Bear',     category: 'forex',     expiryTime: new Date(Date.now() + 15 * 60000).toISOString(),   bullPct: 62, bearPct: 38, status: 'open',     prizePool: 1500, userPrediction: undefined },
    { id: 'match-002', market: 'Gold Breakout',            category: 'commodity', expiryTime: new Date(Date.now() + 45 * 60000).toISOString(),   bullPct: 55, bearPct: 45, status: 'open',     prizePool: 2200, userPrediction: undefined },
    { id: 'match-003', market: 'BTC/USD Weekend Volatility',category: 'crypto',   expiryTime: new Date(Date.now() + 120 * 60000).toISOString(),  bullPct: 71, bearPct: 29, status: 'open',     prizePool: 3800, userPrediction: 'bull', userStake: 100 },
    { id: 'match-004', market: 'GBP/JPY London Open',      category: 'forex',     expiryTime: new Date(Date.now() + 240 * 60000).toISOString(),  bullPct: 48, bearPct: 52, status: 'open',     prizePool: 900,  userPrediction: undefined },
    { id: 'match-005', market: 'EUR/USD Trend',            category: 'forex',     expiryTime: new Date(Date.now() - 30 * 60000).toISOString(),   bullPct: 60, bearPct: 40, status: 'resolved', result: 'bull',  prizePool: 1200, userPrediction: 'bull', userStake: 150 },
    { id: 'match-006', market: 'Silver Spot Price',        category: 'commodity', expiryTime: new Date(Date.now() - 90 * 60000).toISOString(),   bullPct: 45, bearPct: 55, status: 'resolved', result: 'bear',  prizePool: 800,  userPrediction: 'bear', userStake: 75 },
  ] as PredictionMatch[],

  leaderboard: {
    daily: [
      { rank: 1, handle: 'fx_king_99',    avatar: 'F', winRate: 85, totalPredictions: 12, points: 2800, rankChange: 2  },
      { rank: 2, handle: 'crypto_bull',   avatar: 'C', winRate: 80, totalPredictions: 10, points: 2400, rankChange: 0  },
      { rank: 3, handle: 'gold_rush_x',   avatar: 'G', winRate: 78, totalPredictions: 9,  points: 2100, rankChange: -1 },
      { rank: 4, handle: 'traderjamal',   avatar: 'T', winRate: 75, totalPredictions: 8,  points: 1900, rankChange: 3  },
      { rank: 5, handle: 'pipmaster3000', avatar: 'P', winRate: 73, totalPredictions: 11, points: 1750, rankChange: -2 },
      { rank: 6, handle: 'eurusd_queen',  avatar: 'E', winRate: 71, totalPredictions: 7,  points: 1600, rankChange: 1  },
      { rank: 7, handle: 'swift_trader',  avatar: 'S', winRate: 70, totalPredictions: 10, points: 1500, rankChange: 0  },
      { rank: 8, handle: 'bear_hunter',   avatar: 'B', winRate: 69, totalPredictions: 8,  points: 1400, rankChange: -3 },
      { rank: 9, handle: 'forexwizard',   avatar: 'W', winRate: 68, totalPredictions: 9,  points: 1350, rankChange: 4  },
      { rank: 10, handle: 'london_pip',   avatar: 'L', winRate: 67, totalPredictions: 6,  points: 1250, rankChange: -1 },
      { rank: 42, handle: 'dana_trader',  avatar: 'D', winRate: 68, totalPredictions: 19, points: 850,  rankChange: 5, isCurrentUser: true },
    ],
  } as { daily: LeaderboardEntry[] },
}
