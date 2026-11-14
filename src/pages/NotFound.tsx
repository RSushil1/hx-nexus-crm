import { Link } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <PageWrapper title="404 — Page Not Found" subtitle="The workspace route you are looking for does not exist.">
      <div className="card flex flex-col items-center justify-center py-16 gap-4 text-center">
        <span className="text-6xl font-extrabold text-accent">404</span>
        <p className="text-text-secondary max-w-md">
          This portal view may have been moved or is restricted by your broker permissions.
        </p>
        <Link to="/">
          <Button variant="primary" icon={<Home size={16} />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </PageWrapper>
  )
}
