import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { notifications as initialNotifications, type Notification } from '@/data/notifications'
import { user as initialUser } from '@/data/user'

// ─── Theme Store ────────────────────────────────────────────────────────────
export type ThemeMode = 'dark' | 'light'
export type ColorPalette = 'midnight' | 'obsidian' | 'emerald'

export function applyThemeToDOM(theme: ThemeMode, palette: ColorPalette = 'midnight') {
  if (typeof document === 'undefined') return
  const isLight = theme === 'light'
  document.documentElement.classList.toggle('light', isLight)
  document.documentElement.classList.toggle('dark', !isLight)
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : palette)
}

type ThemeStore = {
  theme: ThemeMode
  palette: ColorPalette
  language: string
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
  setPalette: (p: ColorPalette) => void
  setLanguage: (lang: string) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      palette: 'midnight',
      language: 'en',
      setTheme: (mode: ThemeMode) => {
        set({ theme: mode })
        applyThemeToDOM(mode, get().palette)
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        applyThemeToDOM(next, get().palette)
      },
      setPalette: (p: ColorPalette) => {
        set({ palette: p, theme: 'dark' })
        applyThemeToDOM('dark', p)
      },
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'hx-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme, state.palette || 'midnight')
        }
      },
    }
  )
)

// ─── Notification Store ──────────────────────────────────────────────────────
type NotifStore = {
  notifications: Notification[]
  markRead: (id: string) => void
  markAllRead: () => void
  deleteNotif: (id: string) => void
  clearRead: () => void
  unreadCount: () => number
}

export const useNotifStore = create<NotifStore>()((set, get) => ({
  notifications: initialNotifications,
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  deleteNotif: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  clearRead: () =>
    set((s) => ({ notifications: s.notifications.filter((n) => !n.read) })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))

// ─── User / Preferences Store ────────────────────────────────────────────────
type UserStore = {
  preferences: typeof initialUser.preferences
  setPreference: (key: keyof typeof initialUser.preferences, val: boolean) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      preferences: initialUser.preferences,
      setPreference: (key, val) =>
        set((s) => ({ preferences: { ...s.preferences, [key]: val } })),
    }),
    { name: 'hx-user-prefs' }
  )
)

// ─── Account Store ───────────────────────────────────────────────────────────
import { accounts as initialAccounts, type Account } from '@/data/accounts'

type AccountStore = {
  accounts: Account[]
  selectedId: string | null
  setSelected: (id: string) => void
  updateBalance: (id: string, delta: number) => void
  resetDemo: (id: string) => void
}

export const useAccountStore = create<AccountStore>()((set) => ({
  accounts: initialAccounts,
  selectedId: 'acct-live-usd',
  setSelected: (id) => set({ selectedId: id }),
  updateBalance: (id, delta) =>
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === id ? { ...a, balance: a.balance + delta, equity: a.equity + delta } : a
      ),
    })),
  resetDemo: (id) =>
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === id ? { ...a, balance: 50000, equity: 50000 } : a
      ),
    })),
}))

// ─── Rewards Store ───────────────────────────────────────────────────────────
import { rewards as initialRewards } from '@/data/rewards'

type RewardsStore = {
  points: number
  wishlist: string[]
  toggleWishlist: (id: string) => void
  redeemItem: (pointsCost: number) => void
}

export const useRewardsStore = create<RewardsStore>()(
  persist(
    (set) => ({
      points: initialRewards.currentPoints,
      wishlist: initialRewards.catalogue.filter((i) => i.wishlisted).map((i) => i.id),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
      redeemItem: (cost) =>
        set((s) => ({ points: Math.max(0, s.points - cost) })),
    }),
    { name: 'hx-rewards' }
  )
)

// ─── Auth Store ─────────────────────────────────────────────────────────────
export type AuthUser = {
  id: string
  email: string
  fullName: string
  role: string
  avatar: string
}

export const DEMO_CREDENTIALS = {
  email: 'dana.reyes@hxnexus.com',
  password: 'password123',
}

type AuthStore = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, pass: string) => { success: boolean; error?: string }
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: true,
      user: {
        id: initialUser.id,
        email: initialUser.email,
        fullName: initialUser.fullName,
        role: 'Client Trader · Tier 2 Verified',
        avatar: initialUser.avatar,
      },
      login: (email: string, pass: string) => {
        const trimmedEmail = email.trim().toLowerCase()
        if (
          (trimmedEmail === DEMO_CREDENTIALS.email.toLowerCase() && pass === DEMO_CREDENTIALS.password) ||
          (trimmedEmail.includes('@') && pass.length >= 4)
        ) {
          const isDemo = trimmedEmail === DEMO_CREDENTIALS.email.toLowerCase()
          set({
            isAuthenticated: true,
            user: {
              id: initialUser.id,
              email: trimmedEmail,
              fullName: isDemo ? initialUser.fullName : trimmedEmail.split('@')[0],
              role: 'Client Trader · Tier 2 Verified',
              avatar: (isDemo ? initialUser.fullName : trimmedEmail).charAt(0).toUpperCase(),
            },
          })
          return { success: true }
        }
        return {
          success: false,
          error: 'Invalid credentials. Enter dana.reyes@hxnexus.com / password123 or any email with 4+ char password.',
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    { name: 'hx-auth' }
  )
)
