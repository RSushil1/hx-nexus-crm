export type TicketStatus = 'open' | 'waiting_broker' | 'resolved' | 'closed'
export type TicketCategory = 'funding' | 'platform' | 'verification' | 'general'

export type TicketMessage = {
  id: string
  sender: 'trader' | 'agent'
  senderName: string
  content: string
  timestamp: string
}

export type Ticket = {
  id: string
  refId: string
  subject: string
  category: TicketCategory
  status: TicketStatus
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

export type Announcement = {
  id: string
  title: string
  content: string
  priority: 'info' | 'action'
  date: string
  read: boolean
}

export const support = {
  agentStatus: 'online' as 'online' | 'offline',
  agentHours: '07:00–19:00 UTC',

  tickets: [
    {
      id: 'tkt-001',
      refId: 'tkt-2026-0805-b',
      subject: 'Deposit not reflected in account',
      category: 'funding',
      status: 'waiting_broker',
      createdAt: '2026-11-08T10:30:00Z',
      updatedAt: '2026-11-09T14:00:00Z',
      messages: [
        { id: 'm1', sender: 'trader', senderName: 'Dana', content: 'Hi, I made a bank wire deposit of $2500 on Nov 8 but it hasn\'t appeared in my account yet. Reference: DEP-2026-1108-002', timestamp: '2026-11-08T10:30:00Z' },
        { id: 'm2', sender: 'agent',  senderName: 'Alex (Support)', content: 'Hello Dana, thank you for contacting HX Nexus support. We have located your wire transfer and it is currently being processed by our banking team. Bank wires typically take 1-3 business days to clear. We will notify you once the funds are credited. Reference: tkt-2026-0805-b', timestamp: '2026-11-08T11:45:00Z' },
        { id: 'm3', sender: 'trader', senderName: 'Dana', content: 'Thanks! It has been 2 days now. Any update?', timestamp: '2026-11-09T09:00:00Z' },
        { id: 'm4', sender: 'agent',  senderName: 'Alex (Support)', content: 'Hi Dana, we have escalated this to our banking department. You should see the funds in your account by end of day today. Apologies for the delay.', timestamp: '2026-11-09T14:00:00Z' },
      ],
    },
    {
      id: 'tkt-002',
      refId: 'tkt-2026-0801-a',
      subject: 'MT5 platform login issue',
      category: 'platform',
      status: 'resolved',
      createdAt: '2026-11-01T08:00:00Z',
      updatedAt: '2026-11-01T12:00:00Z',
      messages: [
        { id: 'm1', sender: 'trader', senderName: 'Dana', content: 'I cannot log into MT5 with account 8839201. Getting "invalid account" error.', timestamp: '2026-11-01T08:00:00Z' },
        { id: 'm2', sender: 'agent',  senderName: 'Sarah (Support)', content: 'Hello Dana, we have reset your MT5 credentials. Please use the new password sent to your registered email and try logging in again.', timestamp: '2026-11-01T10:30:00Z' },
        { id: 'm3', sender: 'trader', senderName: 'Dana', content: 'Working now, thank you!', timestamp: '2026-11-01T12:00:00Z' },
      ],
    },
    {
      id: 'tkt-003',
      refId: 'tkt-2026-0730-c',
      subject: 'KYC document re-submission',
      category: 'verification',
      status: 'closed',
      createdAt: '2026-07-30T15:00:00Z',
      updatedAt: '2026-08-02T10:00:00Z',
      messages: [
        { id: 'm1', sender: 'trader', senderName: 'Dana', content: 'My passport was rejected for KYC. What was the issue?', timestamp: '2026-07-30T15:00:00Z' },
        { id: 'm2', sender: 'agent',  senderName: 'Mike (Compliance)', content: 'Hi Dana, the passport image was blurry. Please re-submit a clear, well-lit photo showing all four corners of the document. No filters or editing.', timestamp: '2026-07-31T09:00:00Z' },
        { id: 'm3', sender: 'trader', senderName: 'Dana', content: 'I have re-uploaded. Please check.', timestamp: '2026-08-01T11:00:00Z' },
        { id: 'm4', sender: 'agent',  senderName: 'Mike (Compliance)', content: 'KYC approved! Your account is now fully verified. Welcome to HX Nexus, Dana! 🎉', timestamp: '2026-08-02T10:00:00Z' },
      ],
    },
  ] as Ticket[],

  announcements: [
    { id: 'ann-001', title: 'Scheduled Server Maintenance', content: 'MT5 live servers will undergo maintenance on Nov 15, 2026 from 00:00–02:00 UTC. Trading will be temporarily unavailable during this window.', priority: 'info',   date: '2026-11-10T10:00:00Z', read: false },
    { id: 'ann-002', title: 'Holiday Trading Hours',         content: 'Markets will close early on Nov 28 (Thanksgiving). Please plan your positions accordingly.', priority: 'info',   date: '2026-11-08T09:00:00Z', read: false },
    { id: 'ann-003', title: 'KYC Re-verification Required',  content: 'As per regulatory requirements, clients who have not updated their proof of address in the past 12 months must re-submit. Please upload a recent utility bill or bank statement.', priority: 'action', date: '2026-11-01T08:00:00Z', read: true  },
  ] as Announcement[],
}
