import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { KeyboardShortcutsModal } from '@/components/shared/KeyboardShortcutsModal'
import { useThemeStore, applyThemeToDOM } from '@/store'

export function Layout() {
  const navigate = useNavigate()
  const { theme, palette } = useThemeStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false)

  // Ensure theme is applied to DOM on mount and updates
  useEffect(() => {
    applyThemeToDOM(theme, palette)
  }, [theme, palette])

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
        return
      }

      // Ignore single-key shortcuts when typing in inputs/textareas/selects
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      // Toggle shortcuts help
      if (e.key === '?') {
        e.preventDefault()
        setShortcutsModalOpen((prev) => !prev)
        return
      }

      // Direct page navigation shortcuts
      switch (e.key.toLowerCase()) {
        case 'd':
          navigate('/')
          break
        case 'a':
          navigate('/accounts')
          break
        case 'f':
          navigate('/fund')
          break
        case 's':
          navigate('/statements')
          break
        case 'r':
          navigate('/rewards')
          break
        case 'g':
          navigate('/games')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <Sidebar
            className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-up shadow-2xl"
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenShortcuts={() => setShortcutsModalOpen(true)}
        />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Keyboard Shortcuts Guide Modal */}
      <KeyboardShortcutsModal
        open={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Global Toast Provider */}
      <Toaster
        theme={theme === 'light' ? 'light' : 'dark'}
        position="bottom-right"
        toastOptions={{
          className: '!bg-card-bg !border-card-border !text-text-primary !shadow-2xl',
        }}
      />
    </div>
  )
}
