export type Invitee = {
  id: string
  maskedEmail: string
  registeredAt: string
  status: 'funded' | 'pending_kyc' | 'inactive'
  commission: number
}

export const referrals = {
  code: 'DANA-NX77',
  url: 'https://trade.hxnexus.com?ref=DANA-NX77',
  stats: {
    totalInvites: 14,
    successfulSignups: 8,
    fundedAccounts: 5,
    totalEarnings: 625.00,
    clicks: 48,
    lastMonthSignups: 2,
    lastMonthFunded: 1,
    lastMonthEarnings: 125.00,
  },
  funnelData: [
    { stage: 'Clicks',   value: 48 },
    { stage: 'Signups',  value: 8  },
    { stage: 'Funded',   value: 5  },
  ],
  earningsTimeline: [
    { month: 'Jun 2026', earnings: 0   },
    { month: 'Jul 2026', earnings: 125 },
    { month: 'Aug 2026', earnings: 250 },
    { month: 'Sep 2026', earnings: 250 },
    { month: 'Oct 2026', earnings: 500 },
    { month: 'Nov 2026', earnings: 625 },
  ],
  invitees: [
    { id: 'inv-001', maskedEmail: 'al***@gmail.com',    registeredAt: '2026-11-01T10:00:00Z', status: 'funded',      commission: 125.00 },
    { id: 'inv-002', maskedEmail: 'jo***@outlook.com',  registeredAt: '2026-10-20T14:30:00Z', status: 'funded',      commission: 125.00 },
    { id: 'inv-003', maskedEmail: 'ma***@yahoo.com',    registeredAt: '2026-10-10T09:15:00Z', status: 'funded',      commission: 125.00 },
    { id: 'inv-004', maskedEmail: 're***@hotmail.com',  registeredAt: '2026-09-25T11:00:00Z', status: 'funded',      commission: 125.00 },
    { id: 'inv-005', maskedEmail: 'sa***@gmail.com',    registeredAt: '2026-09-15T16:45:00Z', status: 'funded',      commission: 125.00 },
    { id: 'inv-006', maskedEmail: 'ch***@gmail.com',    registeredAt: '2026-10-30T08:00:00Z', status: 'pending_kyc', commission: 0      },
    { id: 'inv-007', maskedEmail: 'fa***@icloud.com',   registeredAt: '2026-11-05T13:20:00Z', status: 'pending_kyc', commission: 0      },
    { id: 'inv-008', maskedEmail: 'ni***@gmail.com',    registeredAt: '2026-11-10T17:00:00Z', status: 'inactive',    commission: 0      },
  ] as Invitee[],

  programInfo: [
    { step: 1, title: 'Share your link',     desc: 'Share your unique referral link or code with friends.' },
    { step: 2, title: 'They sign up & fund', desc: 'Your friend creates an account and makes their first deposit.' },
    { step: 3, title: 'You earn commission', desc: 'Receive $125 for every successfully funded referral.' },
  ],
}
