export type Transaction = {
  id: string
  accountId: string
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out' | 'commission' | 'swap' | 'profit' | 'loss' | 'bonus'
  description: string
  amount: number
  currency: string
  date: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  method?: string
  reference?: string
  category: 'movement' | 'points'
}

export const transactions: Transaction[] = [
  { id: 'tx-001', accountId: 'acct-live-usd', type: 'deposit',      description: 'Visa card deposit',         amount: 1000.00, currency: 'USD', date: '2026-11-13T10:22:00Z', status: 'completed', method: 'Visa',       reference: 'DEP-2026-1113-001', category: 'movement' },
  { id: 'tx-002', accountId: 'acct-live-usd', type: 'profit',       description: 'Trading profit — EUR/USD',  amount:  482.50, currency: 'USD', date: '2026-11-12T16:45:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-003', accountId: 'acct-live-usd', type: 'transfer_in',  description: 'Internal transfer from Raw Spread', amount: 500.00, currency: 'USD', date: '2026-11-11T09:00:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-004', accountId: 'acct-raw-usd',  type: 'transfer_out', description: 'Internal transfer to Live USD',    amount: -500.00, currency: 'USD', date: '2026-11-11T09:00:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-005', accountId: 'acct-live-usd', type: 'commission',   description: 'Raw spread commission',     amount:   -3.50, currency: 'USD', date: '2026-11-10T12:30:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-006', accountId: 'acct-live-usd', type: 'deposit',      description: 'Bank wire deposit',         amount: 2500.00, currency: 'USD', date: '2026-11-08T11:15:00Z', status: 'completed', method: 'Wire',       reference: 'DEP-2026-1108-002', category: 'movement' },
  { id: 'tx-007', accountId: 'acct-live-usd', type: 'withdrawal',   description: 'Visa card withdrawal',      amount: -500.00, currency: 'USD', date: '2026-11-05T14:00:00Z', status: 'completed', method: 'Visa',       reference: 'WDR-2026-1105-001', category: 'movement' },
  { id: 'tx-008', accountId: 'acct-live-usd', type: 'deposit',      description: 'USDT TRC-20 deposit',       amount:  750.00, currency: 'USD', date: '2026-11-01T08:30:00Z', status: 'completed', method: 'USDT',       reference: 'DEP-2026-1101-003', category: 'movement' },
  { id: 'tx-009', accountId: 'acct-live-usd', type: 'loss',         description: 'Trading loss — GBP/JPY',   amount: -120.00, currency: 'USD', date: '2026-10-29T17:22:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-010', accountId: 'acct-live-usd', type: 'bonus',        description: 'Referral bonus credited',   amount:  125.00, currency: 'USD', date: '2026-10-25T10:00:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-011', accountId: 'acct-raw-usd',  type: 'deposit',      description: 'Visa card deposit',         amount: 1500.00, currency: 'USD', date: '2026-10-20T09:30:00Z', status: 'completed', method: 'Visa',       reference: 'DEP-2026-1020-004', category: 'movement' },
  { id: 'tx-012', accountId: 'acct-live-usd', type: 'withdrawal',   description: 'Bank wire withdrawal',      amount: -300.00, currency: 'USD', date: '2026-10-15T13:45:00Z', status: 'pending',   method: 'Wire',       reference: 'WDR-2026-1015-002', category: 'movement' },
  { id: 'tx-013', accountId: 'acct-std-eur',  type: 'deposit',      description: 'Visa card deposit',         amount:  500.00, currency: 'EUR', date: '2026-10-10T11:00:00Z', status: 'completed', method: 'Visa',       reference: 'DEP-2026-1010-005', category: 'movement' },
  { id: 'tx-014', accountId: 'acct-live-usd', type: 'profit',       description: 'Trading profit — Gold',     amount:  320.00, currency: 'USD', date: '2026-10-08T15:20:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-015', accountId: 'acct-live-usd', type: 'deposit',      description: 'Visa card deposit',         amount: 2000.00, currency: 'USD', date: '2026-09-30T10:00:00Z', status: 'completed', method: 'Visa',       reference: 'DEP-2026-0930-006', category: 'movement' },
  { id: 'tx-016', accountId: 'acct-live-usd', type: 'swap',         description: 'Overnight swap charge',     amount:   -8.20, currency: 'USD', date: '2026-09-25T00:01:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-017', accountId: 'acct-live-usd', type: 'deposit',      description: 'USDT TRC-20 deposit',       amount:  500.00, currency: 'USD', date: '2026-09-20T16:30:00Z', status: 'failed',    method: 'USDT',       reference: 'DEP-2026-0920-007', category: 'movement' },
  { id: 'tx-018', accountId: 'acct-live-usd', type: 'profit',       description: 'Trading profit — BTC/USD',  amount:  890.00, currency: 'USD', date: '2026-09-15T12:00:00Z', status: 'completed', category: 'movement' },
  { id: 'tx-019', accountId: 'acct-live-usd', type: 'withdrawal',   description: 'Visa card withdrawal',      amount: -1000.00,currency: 'USD', date: '2026-09-10T14:30:00Z', status: 'completed', method: 'Visa',       reference: 'WDR-2026-0910-003', category: 'movement' },
  { id: 'tx-020', accountId: 'acct-live-usd', type: 'deposit',      description: 'Bank wire deposit',         amount: 3000.00, currency: 'USD', date: '2026-09-01T09:00:00Z', status: 'completed', method: 'Wire',       reference: 'DEP-2026-0901-008', category: 'movement' },
]

export const cashierHistory = transactions.filter(t =>
  ['deposit', 'withdrawal'].includes(t.type)
)
