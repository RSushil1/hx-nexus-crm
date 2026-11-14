export type Notification = {
  id: string
  title: string
  message: string
  category: 'funding' | 'platform' | 'verification' | 'rewards' | 'system'
  read: boolean
  timestamp: string
  link?: string
}

export const notifications: Notification[] = [
  { id: 'notif-001', title: 'Deposit Approved',       message: 'Your $1,000 Visa card deposit has been approved and credited.',      category: 'funding',      read: false, timestamp: '2026-11-13T10:25:00Z', link: '/fund' },
  { id: 'notif-002', title: 'Internal Transfer Done', message: 'Transfer of $500 from Raw Spread USD to Live USD is complete.',       category: 'funding',      read: false, timestamp: '2026-11-11T09:05:00Z', link: '/accounts' },
  { id: 'notif-003', title: 'KYC Approved',           message: 'Your identity verification has been approved. Account fully verified.', category: 'verification', read: true,  timestamp: '2026-08-02T10:05:00Z', link: '/onboarding' },
  { id: 'notif-004', title: 'Referral Bonus Earned',  message: 'You earned $125 from a successful referral. Great work!',             category: 'rewards',      read: true,  timestamp: '2026-10-25T10:05:00Z', link: '/referrals' },
  { id: 'notif-005', title: 'Server Maintenance',     message: 'MT5 servers will undergo maintenance Nov 15, 00:00–02:00 UTC.',       category: 'system',       read: true,  timestamp: '2026-11-10T10:05:00Z' },
]
