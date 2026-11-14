import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import AccountsHub from '@/pages/Accounts'
import AccountDetail from '@/pages/Accounts/AccountDetail'
import Transfer from '@/pages/Accounts/Transfer'
import Fund from '@/pages/Fund'
import Statements from '@/pages/Statements'
import Rewards from '@/pages/Rewards'
import Games from '@/pages/Games'
import Referrals from '@/pages/Referrals'
import Support from '@/pages/Support'
import Onboarding from '@/pages/Onboarding'
import Profile from '@/pages/Profile'
import Notifications from '@/pages/Notifications'
import NotFound from '@/pages/NotFound'
import { useAuthStore } from '@/store'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'accounts', element: <AccountsHub /> },
      { path: 'accounts/transfer', element: <Transfer /> },
      { path: 'accounts/:id', element: <AccountDetail /> },
      { path: 'fund', element: <Fund /> },
      { path: 'statements', element: <Statements /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'games', element: <Games /> },
      { path: 'referrals', element: <Referrals /> },
      { path: 'support', element: <Support /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: 'profile', element: <Profile /> },
      { path: 'notifications', element: <Notifications /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
