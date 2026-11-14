export type Statement = {
  id: string
  month: string
  year: number
  currency: 'USD' | 'EUR'
  openingBalance: number
  closingBalance: number
  netDeposits: number
  netWithdrawals: number
  netPL: number
  totalTrades: number
}

function genStmt(id: string, month: string, year: number, currency: 'USD' | 'EUR', open: number, deposits: number, withdrawals: number, pl: number): Statement {
  return {
    id,
    month,
    year,
    currency,
    openingBalance: open,
    closingBalance: open + deposits - withdrawals + pl,
    netDeposits: deposits,
    netWithdrawals: withdrawals,
    netPL: pl,
    totalTrades: Math.floor(Math.random() * 40) + 5,
  }
}

export const statements: Statement[] = [
  genStmt('stmt-001', 'November', 2026, 'USD', 9500.00,  1750.00, 500.00,  482.50),
  genStmt('stmt-002', 'October',  2026, 'USD', 8200.00,  2000.00, 1000.00, 300.00),
  genStmt('stmt-003', 'September',2026, 'USD', 6800.00,  3500.00, 1000.00, 900.00),
  genStmt('stmt-004', 'August',   2026, 'USD', 5500.00,  2000.00, 500.00,  -200.00),
  genStmt('stmt-005', 'July',     2026, 'USD', 4800.00,  1500.00, 0,       400.00  ),
  genStmt('stmt-006', 'June',     2026, 'USD', 4000.00,  1000.00, 0,       -100.00 ),
  genStmt('stmt-007', 'May',      2026, 'USD', 3200.00,  1200.00, 0,       600.00  ),
  genStmt('stmt-008', 'April',    2026, 'USD', 2500.00,  800.00,  0,       100.00  ),
  genStmt('stmt-009', 'March',    2026, 'USD', 2000.00,  600.00,  0,       -100.00 ),
  genStmt('stmt-010', 'February', 2026, 'USD', 1500.00,  600.00,  0,       100.00  ),
  genStmt('stmt-011', 'January',  2026, 'USD', 1000.00,  600.00,  0,       -100.00 ),
  genStmt('stmt-012', 'December', 2025, 'USD', 500.00,   600.00,  0,       100.00  ),
  genStmt('stmt-013', 'November', 2026, 'EUR', 700.00,   200.00,  0,       -80.00  ),
  genStmt('stmt-014', 'October',  2026, 'EUR', 500.00,   250.00,  0,       -50.00  ),
]
