import { useState, useRef, useEffect, useMemo } from 'react'
import {
  LifeBuoy,
  MessageSquare,
  Search,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ShieldAlert,
  Headphones,
  PlusCircle,
  FileText,
  User,
  Bot,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import {
  support as initialSupport,
  type Ticket,
  type TicketCategory,
  type TicketStatus,
  type Announcement,
} from '@/data/tickets'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(initialSupport.tickets)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialSupport.announcements)
  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialSupport.tickets[0]?.id || '')

  // Filtering & Sorting
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | TicketCategory>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest')

  // Reply Composer State
  const [replyText, setReplyText] = useState('')
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // New Ticket Form State
  const [newCategory, setNewCategory] = useState<TicketCategory>('general')
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [newTicketError, setNewTicketError] = useState('')

  // Live Chat Simulator State
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [chatQueue, setChatQueue] = useState<'general' | 'funding' | 'platform'>('general')
  const [chatOpeningMsg, setChatOpeningMsg] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent' | 'system'; text: string; time: string }>>([])
  const [chatInput, setChatInput] = useState('')
  const [agentJoined, setAgentJoined] = useState(false)
  const [chatTyping, setChatTyping] = useState(false)

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0]

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeTicket?.messages, isAgentTyping])

  // Filtered & Sorted Tickets
  const filteredTickets = useMemo(() => {
    let list = [...tickets]
    if (categoryFilter !== 'all') {
      list = list.filter((t) => t.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.refId.toLowerCase().includes(q) ||
          t.messages.some((m) => m.content.toLowerCase().includes(q))
      )
    }
    list.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status)
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    return list
  }, [tickets, categoryFilter, search, sortBy])

  // Send Reply in Ticket Thread
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'trader' as const,
      senderName: 'Dana',
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              status: 'waiting_broker' as TicketStatus,
              messages: [...t.messages, userMsg],
            }
          : t
      )
    )
    setReplyText('')
    toast.success('Reply submitted to ticket thread')

    // Simulate Agent Auto-acknowledgement typing after 2 seconds
    setTimeout(() => {
      setIsAgentTyping(true)
      setTimeout(() => {
        setIsAgentTyping(false)
        const agentMsg = {
          id: `m-${Date.now() + 1}`,
          sender: 'agent' as const,
          senderName: 'Alex (Support)',
          content: 'Thank you Dana. Our technical desk has received your update and is reviewing the account log.',
          timestamp: new Date().toISOString(),
        }
        setTickets((prev) =>
          prev.map((t) =>
            t.id === activeTicket.id
              ? { ...t, messages: [...t.messages, agentMsg], updatedAt: new Date().toISOString() }
              : t
          )
        )
      }, 2500)
    }, 1500)
  }

  // Submit New Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim()) {
      setNewTicketError('Subject is required')
      return
    }
    if (newMessage.trim().length < 20) {
      setNewTicketError('Message description must be at least 20 characters')
      return
    }

    setNewTicketError('')
    const newId = `tkt-${Date.now().toString().slice(-4)}`
    const createdTicket: Ticket = {
      id: newId,
      refId: `tkt-2026-${Date.now().toString().slice(-4)}-x`,
      subject: newSubject.trim(),
      category: newCategory,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'trader',
          senderName: 'Dana',
          content: newMessage.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    }

    setTickets((prev) => [createdTicket, ...prev])
    setSelectedTicketId(newId)
    setNewSubject('')
    setNewMessage('')
    toast.success(`Ticket ${createdTicket.refId} successfully submitted!`)
  }

  // Live Chat Simulator Handlers
  const handleStartLiveChat = () => {
    setChatModalOpen(true)
    setAgentJoined(false)
    setChatMessages([
      {
        sender: 'system',
        text: 'Connecting you to an available HX Nexus clearing agent...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])

    if (chatOpeningMsg.trim()) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'user',
            text: chatOpeningMsg.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, 500)
    }

    // Simulate Agent Joining
    setTimeout(() => {
      setAgentJoined(true)
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          text: `Support specialist Alex (Desk: ${chatQueue.toUpperCase()}) has joined the conversation.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])

      // Simulate Agent Typing
      setChatTyping(true)
      setTimeout(() => {
        setChatTyping(false)
        const cannedReplies: Record<string, string> = {
          general: 'Hello Dana! I can see your account #8839201 is active. How may I assist you today?',
          funding: 'Hello Dana! I am checking your recent cashier clearance logs. Do you have a transaction reference ID?',
          platform: 'Hello Dana! Our MT5 London bridge servers are currently 100% operational. What terminal issue are you experiencing?',
        }
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: cannedReplies[chatQueue] || cannedReplies.general,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, 2500)
    }, 2000)
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const text = chatInput.trim()
    setChatInput('')
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])

    // Agent follow up
    setChatTyping(true)
    setTimeout(() => {
      setChatTyping(false)
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'I have logged this note in your CRM trader profile. Our senior dealer has been notified.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 2000)
  }

  // Mark Announcement as Read
  const handleToggleAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    )
  }

  const unreadAnnouncementsCount = announcements.filter((a) => !a.read).length
  const openTicketsCount = tickets.filter((t) => t.status === 'open' || t.status === 'waiting_broker').length

  return (
    <PageWrapper
      title="Support Desk"
      subtitle="Client assistance desk, ticketing, and live dealing notices."
    >
      {/* ─── Status Banner ────────────────────────────────────────────────── */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-card-border bg-card-bg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent border border-accent/40 flex items-center justify-center shrink-0">
            <Headphones size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-text-primary">
                Trading Desk Agents Online
              </h3>
              <span className="text-xs text-text-muted">({initialSupport.agentHours})</span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Average response turnaround: <strong className="text-accent">~4 minutes</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Badge variant="accent">{openTicketsCount} Active Tickets</Badge>
          <Badge variant="info">{unreadAnnouncementsCount} Notices</Badge>
        </div>
      </div>

      {/* ─── Master-Detail Layout: Ticket List & Conversation ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Ticket List (5 cols) */}
        <div className="lg:col-span-5 card flex flex-col gap-4">
          <div className="flex flex-col gap-3 pb-3 border-b border-card-border/60">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary">Your Support Tickets</h2>
              <span className="text-xs text-text-muted">{filteredTickets.length} tickets</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-text-muted" />
              <input
                type="text"
                placeholder="Search tickets by subject, ref, message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-card-hover border border-card-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>

            {/* Category Filter Pills & Sort Dropdown */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1 max-w-[280px]">
                {(['all', 'funding', 'platform', 'verification', 'general'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-0.5 rounded-full capitalize whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? 'bg-accent/15 text-accent border border-accent/40 font-bold'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-7 px-2 rounded-lg bg-card-hover border border-card-border text-[11px] font-semibold text-text-muted focus:outline-none focus:border-accent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No tickets match your filters.
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = ticket.id === activeTicket.id
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-accent/10 border-accent shadow-sm'
                        : 'bg-card-hover/40 border-card-border hover:border-card-border2 hover:bg-card-hover/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-text-primary line-clamp-1">
                        {ticket.subject}
                      </span>
                      <StatusBadge status={ticket.status} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span className="font-mono text-accent">{ticket.refId}</span>
                      <span>{formatDate(ticket.updatedAt, 'short')}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Ticket Conversation Thread (7 cols) */}
        <div className="lg:col-span-7 card flex flex-col h-[640px] p-0 overflow-hidden border-card-border">
          {/* Thread Header */}
          <div className="p-4 border-b border-card-border/60 bg-card-hover/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">{activeTicket.refId}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-card-bg border border-card-border text-text-muted">
                  {activeTicket.category}
                </span>
                <StatusBadge status={activeTicket.status} />
              </div>
              <h3 className="text-sm font-bold text-text-primary mt-1">
                {activeTicket.subject}
              </h3>
            </div>
            <span className="text-[11px] text-text-muted">
              Opened: {formatDate(activeTicket.createdAt, 'short')}
            </span>
          </div>

          {/* Conversation Chat Bubbles */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-card-bg/60">
            {activeTicket.messages.map((m) => {
              const isTrader = m.sender === 'trader'
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isTrader ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-text-muted">
                    {isTrader ? (
                      <>
                        <span>{m.senderName} (You)</span>
                        <span>·</span>
                        <span>{formatDate(m.timestamp, 'short')}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-accent font-semibold">{m.senderName}</span>
                        <span>·</span>
                        <span>{formatDate(m.timestamp, 'short')}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isTrader
                        ? 'bg-accent text-accent-btn rounded-tr-none shadow-sm'
                        : 'bg-card-hover border border-card-border text-text-primary rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              )
            })}

            {/* Agent Typing Indicator */}
            {isAgentTyping && (
              <div className="flex items-center gap-2 text-text-muted text-xs p-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">Support desk is typing a response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Composer */}
          <form onSubmit={handleSendReply} className="p-3 border-t border-card-border/60 bg-card-hover/30">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info('File attachment dialog simulated. Max upload size 10MB.')}
                className="p-2 text-text-muted hover:text-accent rounded-lg border border-card-border bg-card-bg transition-colors"
                title="Attach Document or Screenshot"
              >
                <Paperclip size={15} />
              </button>

              <input
                type="text"
                placeholder="Type your response to support..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl bg-card-bg border border-card-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="h-10 px-4"
                disabled={!replyText.trim()}
                icon={<Send size={13} />}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── Secondary Tools: New Ticket Form & Live Chat Accordions ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accordion 1: Create New Support Ticket */}
        <div className="card flex flex-col gap-4">
          <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <PlusCircle size={16} className="text-accent" />
              Open a New Support Ticket
            </h3>
            <span className="text-xs text-text-muted">Standard Queue</span>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
            {newTicketError && (
              <div className="p-2.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-xs flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{newTicketError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TicketCategory)}
                className="w-full h-10 px-3 rounded-xl bg-card-hover border border-card-border text-xs font-semibold text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="general">General Inquiries & Account Support</option>
                <option value="funding">Cashier, Deposits & Withdrawals</option>
                <option value="platform">MetaTrader 5 & Trading Bridges</option>
                <option value="verification">KYC & Compliance Verification</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of your inquiry..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-card-hover border border-card-border text-xs text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Description</label>
              <textarea
                rows={3}
                placeholder="Provide detailed information regarding the issue (min 20 characters)..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-card-hover border border-card-border text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full text-xs font-bold">
              Submit Ticket to Queue
            </Button>
          </form>
        </div>

        {/* Accordion 2: Instant Live Chat with Agent */}
        <div className="card flex flex-col justify-between gap-4 border-card-border bg-card-bg">
          <div className="space-y-2">
            <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <MessageSquare size={16} className="text-accent" />
                Instant Live Broker Chat
              </h3>
              <span className="text-[10px] font-bold bg-success/15 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live Support Ready
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Connect directly with an authorized trading representative for real-time assistance regarding order execution, margin issues, or payment clearance.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Select Support Desk</label>
              <div className="grid grid-cols-3 gap-2">
                {(['general', 'funding', 'platform'] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setChatQueue(q)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                      chatQueue === q
                        ? 'bg-accent/15 border-accent text-accent'
                        : 'bg-card-hover border-card-border text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {q} Desk
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-muted uppercase">Initial Note (Optional)</label>
              <input
                type="text"
                placeholder="What can we help you with?"
                value={chatOpeningMsg}
                onChange={(e) => setChatOpeningMsg(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card-bg border border-card-border text-xs text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full text-xs font-bold"
              icon={<MessageSquare size={14} />}
              onClick={handleStartLiveChat}
            >
              Start Live Chat Session
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Broker Announcements Section ──────────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-card-border/60">
          <div>
            <h3 className="text-base font-bold text-text-primary">Official Broker Bulletins</h3>
            <p className="text-xs text-text-muted">
              Scheduled maintenance windows, holiday market hours, and compliance advisories
            </p>
          </div>
          <span className="text-xs text-text-muted">
            {announcements.length} Bulletins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                ann.read
                  ? 'bg-card-bg border-card-border opacity-80'
                  : 'bg-card-hover border-card-border2 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={ann.priority === 'action' ? 'danger' : 'info'}>
                    {ann.priority === 'action' ? '⚠️ Action Required' : 'ℹ️ Information'}
                  </Badge>
                  <span className="text-[10px] text-text-muted">{formatDate(ann.date, 'short')}</span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">{ann.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                  {ann.content}
                </p>
              </div>

              <div className="pt-2 border-t border-card-border/50 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleAnnouncementRead(ann.id)}
                  className="text-[11px] font-semibold text-accent hover:underline"
                >
                  {ann.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <span className="text-[10px] text-text-muted">
                  {ann.read ? '✓ Read' : '• New'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Modal: Live Chat Simulation ─────────────────────────────────────── */}
      <Modal
        open={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        title="HX Nexus Live Support Session"
        description="Encrypted clearing desk communication stream"
        size="md"
      >
        <div className="space-y-4 text-xs">
          {/* Safety Alert */}
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0 text-amber-400" />
            <span>Safety Rule: HX Nexus representatives will never ask for your account password or card CVV.</span>
          </div>

          {/* Chat Messages Log */}
          <div className="h-64 overflow-y-auto p-3.5 rounded-xl bg-card-bg border border-card-border space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user'
                    ? 'items-end'
                    : msg.sender === 'system'
                    ? 'items-center text-center'
                    : 'items-start'
                }`}
              >
                {msg.sender === 'system' ? (
                  <span className="text-[10px] text-text-muted italic bg-card-hover px-2.5 py-1 rounded-full border border-card-border">
                    {msg.text}
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] text-text-muted mb-0.5">
                      {msg.sender === 'user' ? 'You' : 'Alex (Agent)'} · {msg.time}
                    </span>
                    <div
                      className={`p-2.5 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-accent text-accent-btn rounded-tr-none font-medium'
                          : 'bg-card-hover border border-card-border text-text-primary rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </>
                )}
              </div>
            ))}

            {chatTyping && (
              <div className="flex items-center gap-2 text-text-muted text-[11px] p-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>Alex is typing...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl bg-card-hover border border-card-border text-xs text-text-primary focus:outline-none focus:border-accent"
            />
            <Button type="submit" variant="primary" size="sm" disabled={!chatInput.trim()}>
              Send
            </Button>
          </form>
        </div>
      </Modal>
    </PageWrapper>
  )
}
