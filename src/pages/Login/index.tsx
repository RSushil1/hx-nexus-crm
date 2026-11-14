import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react'
import { useAuthStore, useThemeStore, DEMO_CREDENTIALS } from '@/store'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Redirect destination after successful login
  const from = (location.state as any)?.from?.pathname || '/'

  // If already authenticated, redirect to workspace
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.')
      return
    }
    if (!password) {
      setErrorMsg('Please enter your account password.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const res = login(email, password)
      setLoading(false)

      if (res.success) {
        toast.success('Authenticated successfully. Welcome back to HX Nexus.')
        navigate(from, { replace: true })
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please check credentials.')
        toast.error('Sign-in failed. Please verify credentials.')
      }
    }, 600)
  }

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setErrorMsg(null)
    toast.info('Populated demo credentials for Dana Reyes')
  }

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200">
      {/* Top Header Row with Brand & Theme Switcher */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            hx nexus
          </span>
          <span className="w-2 h-2 rounded-full bg-accent inline-block" />
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-card-hover text-text-muted border border-card-border ml-1 hidden sm:inline-block">
            PRIME TERMINAL
          </span>
        </div>

        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover border border-card-border transition-colors flex items-center gap-1.5 text-xs"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-text-secondary" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="card p-6 sm:p-8 flex flex-col gap-6 shadow-2xl border-card-border">
          {/* Card Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Sign In to Terminal
            </h1>
            <p className="text-xs text-text-muted">
              Secure client portal for accounts, funding, and statements.
            </p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="p-3.5 rounded-xl bg-card-hover border border-card-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Sparkles size={13} className="text-accent" />
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-accent font-semibold hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-text-secondary border-t border-card-border/60">
              <div>
                <span className="text-[10px] text-text-muted uppercase block font-sans">Email</span>
                <span className="truncate block font-semibold text-text-primary">{DEMO_CREDENTIALS.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase block font-sans">Password</span>
                <span className="font-semibold text-text-primary">{DEMO_CREDENTIALS.password}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-card-hover border border-card-border text-text-primary text-xs focus:outline-none focus:border-accent transition-colors"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('For this evaluation demo, use password123')}
                  className="text-[11px] text-text-muted hover:text-accent transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-9 pr-10 rounded-lg bg-card-hover border border-card-border text-text-primary text-xs focus:outline-none focus:border-accent transition-colors font-mono"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-muted hover:text-text-primary"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-card-border text-accent focus:ring-accent bg-card-hover"
              />
              <label htmlFor="remember" className="text-xs text-text-muted cursor-pointer select-none">
                Remember this terminal session
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full text-xs font-bold mt-2"
              disabled={loading}
              icon={!loading && <ArrowRight size={14} />}
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Compliance & Security Callout */}
          <div className="pt-2 border-t border-card-border flex items-center justify-center gap-2 text-[11px] text-text-muted">
            <ShieldCheck size={14} className="text-success shrink-0" />
            <span>256-Bit TLS Encryption · Institutional Security</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-5xl mx-auto py-3 text-center text-xs text-text-muted">
        <p className="text-[11px]">
          HX Nexus Segregated Accounts · For authorised portfolio servicing only.
        </p>
      </div>
    </div>
  )
}
