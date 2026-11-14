/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'app-bg':       withOpacity('--bg-app'),
        'card-bg':      withOpacity('--bg-card'),
        'card-hover':   withOpacity('--bg-card-hover'),
        'card-border':  withOpacity('--border-card'),
        'card-border2': withOpacity('--border-card-subtle'),
        'accent':       withOpacity('--accent'),
        'accent-dark':  withOpacity('--accent-dark'),
        'accent-btn':   withOpacity('--accent-btn'),
        'text-primary': withOpacity('--text-primary'),
        'text-secondary': withOpacity('--text-secondary'),
        'text-muted':   withOpacity('--text-muted'),
        // Semantics
        'success':  '#10B981',
        'danger':   '#F43F5E',
        'warning':  '#F59E0B',
        'info':     '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'metric': ['1.875rem', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.02em' }],
        'metric-sm': ['1.375rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      boxShadow: {
        'card':       'var(--card-shadow)',
        'card-hover': 'var(--card-shadow-hover)',
        'accent-glow':'0 0 20px rgba(245, 158, 11, 0.18)',
        'btn-tactile':'0 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
      },
      animation: {
        'fade-in':       'fadeIn 0.2s ease-out',
        'slide-up':      'slideUp 0.2s ease-out',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:  { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
