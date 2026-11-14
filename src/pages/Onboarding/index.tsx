import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  CreditCard,
  UserCheck,
  ExternalLink,
  Upload,
  Info,
  Calendar,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { RadialProgress } from '@/components/ui/Progress'
import { user as initialUser } from '@/data/user'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function Onboarding() {
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)

  const steps = [
    {
      id: 1,
      title: 'Complete Personal Profile',
      description: 'Submitted full legal name, date of birth, contact details, and tax country declaration.',
      completedAt: '2024-03-15T10:00:00Z',
      icon: <UserCheck size={20} className="text-accent" />,
      tag: 'Tier 1 Basic',
      actionText: 'View Details',
    },
    {
      id: 2,
      title: 'Identity & Address Verification (KYC)',
      description: 'Government-issued Passport and European utility bill approved under CySEC/FCA AML standards.',
      completedAt: '2024-03-16T14:22:00Z',
      icon: <FileCheck size={20} className="text-accent" />,
      tag: 'Tier 2 Institutional',
      actionText: 'Manage Documents',
    },
    {
      id: 3,
      title: 'Initial Account Deposit Cleared',
      description: 'Processed qualified opening funding via Visa/Bank Wire to establish ledger clearance.',
      completedAt: '2024-03-17T09:45:00Z',
      icon: <CreditCard size={20} className="text-accent" />,
      tag: 'Cashier Cleared',
      actionText: 'View in Cashier',
      link: '/fund',
    },
    {
      id: 4,
      title: 'Open Live MT5 Trading Account',
      description: 'Provisioned institutional Standard USD and Raw Spread live accounts on the MetaTrader 5 gateway.',
      completedAt: '2024-03-17T10:00:00Z',
      icon: <ShieldCheck size={20} className="text-accent" />,
      tag: 'Terminal Ready',
      actionText: 'View Accounts',
      link: '/accounts',
    },
  ]

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault()
    setUploadingDoc(true)
    setTimeout(() => {
      setUploadingDoc(false)
      toast.success('Document uploaded for automated OCR verification!')
      setDocModalOpen(false)
    }, 1500)
  }

  return (
    <PageWrapper
      title="Account Verification"
      subtitle="Regulatory onboarding status, compliance documents, and verification milestones."
    >
      {/* ─── Hero Completion Banner ────────────────────────────────────────── */}
      <div className="card p-5 bg-card-bg border-card-border">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <RadialProgress
              value={100}
              size={92}
              strokeWidth={7}
              colorClass="text-emerald-400"
            >
              <CheckCircle2 size={40} className="text-emerald-400" />
            </RadialProgress>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={16} /> All Clearance Steps Complete
              </span>
              <Badge variant="success">Level 2 Verified</Badge>
              <Badge variant="accent">Full Account Privileges</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              You are all set, {initialUser.firstName}!
            </h2>
            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
              Your identity has been fully authenticated in compliance with anti-money laundering (AML) and know-your-customer (KYC) regulatory mandates. Unlimited deposit limits, automated withdrawals, and maximum leverage are unlocked.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={<FileCheck size={14} />}
              onClick={() => setDocModalOpen(true)}
            >
              Document Vault
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 4-Step Verification Timeline Stepper ──────────────────────────── */}
      <div className="card flex flex-col gap-6">
        <div className="pb-2 border-b border-card-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">Verification Milestones</h3>
            <p className="text-xs text-text-muted">
              4 of 4 steps completed · Verified on {formatDate('2024-03-17T10:00:00Z', 'short')}
            </p>
          </div>
          <span className="text-xs font-bold text-accent font-mono">100% COMPLETE</span>
        </div>

        <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-accent/30">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="relative flex items-start gap-5 pl-2 group animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Stepper Bullet Node */}
              <div className="w-9 h-9 rounded-full bg-card-bg border-2 border-accent text-accent flex items-center justify-center shrink-0 z-10 shadow-md group-hover:scale-105 transition-transform">
                <CheckCircle2 size={18} className="text-accent" />
              </div>

              {/* Step Card Content */}
              <div className="flex-1 p-4 rounded-xl bg-card-hover/40 border border-card-border hover:border-card-border2 hover:bg-card-hover/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">
                      Step {step.id}: {step.title}
                    </span>
                    <Badge variant="success">Completed ✓</Badge>
                    <span className="text-[10px] font-semibold text-text-muted">
                      {step.tag}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                  <span className="text-[10px] text-text-secondary flex items-center gap-1 pt-1 font-mono">
                    <Calendar size={11} className="text-text-muted" /> Completed on {formatDate(step.completedAt, 'short')}
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {step.link ? (
                    <Link to={step.link}>
                      <Button variant="ghost" size="sm" className="text-xs text-accent">
                        {step.actionText} <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-text-muted hover:text-text-primary"
                      onClick={() => setDocModalOpen(true)}
                    >
                      {step.actionText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Compliance Attribution Disclaimer ─────────────────────────────── */}
      <div className="p-4 rounded-xl bg-card-bg border border-card-border/80 text-xs text-text-muted space-y-2">
        <div className="flex items-center gap-2 text-text-secondary font-bold text-xs">
          <Lock size={14} className="text-accent" />
          Regulatory Compliance & Privacy Safeguards
        </div>
        <p className="text-[11px] leading-relaxed">
          HX Nexus Global Clearing Ltd operates in full accordance with international financial intelligence regulations. All client identity documentation is stored in AES-256 encrypted segregated hardware security modules (HSM) and is never shared with third-party advertisers. Documents may be re-requested every 24 months to satisfy periodic European MiFID II audit obligations.
        </p>
      </div>

      {/* ─── Modal: Document Vault ─────────────────────────────────────────── */}
      <Modal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="Verified Compliance Documents"
        description="Encrypted KYC credentials stored on file"
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-3">
            {/* Document 1 */}
            <div className="p-3.5 rounded-xl bg-card-hover border border-card-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck size={24} className="text-accent" />
                <div>
                  <span className="font-bold text-text-primary block">Passport Photo Page</span>
                  <span className="text-[11px] text-text-muted">Issued: Republic of the Philippines · Verified</span>
                </div>
              </div>
              <Badge variant="success">Approved ✓</Badge>
            </div>

            {/* Document 2 */}
            <div className="p-3.5 rounded-xl bg-card-hover border border-card-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck size={24} className="text-accent" />
                <div>
                  <span className="font-bold text-text-primary block">Proof of Address (Utility Bill)</span>
                  <span className="text-[11px] text-text-muted">DEWA Dubai Electricity & Water · Verified</span>
                </div>
              </div>
              <Badge variant="success">Approved ✓</Badge>
            </div>
          </div>

          {/* Upload New Document Box */}
          <form onSubmit={handleSimulateUpload} className="p-4 rounded-xl border border-dashed border-card-border bg-card-bg/60 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-card-hover flex items-center justify-center text-text-muted">
              <Upload size={18} />
            </div>
            <div>
              <span className="font-bold text-text-primary block">Update Proof of Residence</span>
              <span className="text-[11px] text-text-muted">Upload PDF, JPG or PNG (max 10MB)</span>
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              loading={uploadingDoc}
            >
              Upload Replacement Document
            </Button>
          </form>

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => setDocModalOpen(false)}
          >
            Close Vault
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
