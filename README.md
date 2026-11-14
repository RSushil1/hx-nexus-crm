# HX Nexus — Prime Trader CRM & Client Servicing Portal

A modern, institutional-grade client servicing terminal and trader CRM built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. Designed for multi-asset brokerage clients with real-time portfolio tracking, cashier settlement rails, statements reconciliation, and interactive gamification.

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm (or pnpm / yarn)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/RSushil1/hx-nexus-crm.git

# Navigate into project directory
cd hx-nexus-crm

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be running locally at `http://localhost:5174/`.

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Demo Credentials

The platform features an integrated authentication portal with full session persistence:

- **Email**: `dana.reyes@hxnexus.com`
- **Password**: `password123`
*(Or click the **"Auto-fill"** chip on the login page for instant one-click access)*

---

## 🎨 Theme & Appearance Engine

Built on a dynamic CSS custom properties architecture supporting 4 switchable workspace palettes:

| Theme | Aesthetic | Canvas Background | Card Surface |
|---|---|---|---|
| **Midnight Navy** (Default) | Institutional trading terminal | `#0B0F19` | `#111827` |
| **Obsidian Charcoal** | High-contrast AMOLED black | `#090A0D` | `#121317` |
| **Emerald Hedge** | London fund forest with mint accents | `#08120F` | `#0E1B17` |
| **Executive Light** | Daylight clean paper mode | `#F8FAFC` | `#FFFFFF` |

Themes can be switched in real time from the **Profile** page (`/profile`), the top header **Sun/Moon** toggle, or via the Command Palette (`Cmd + K`).

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom CSS variable color engine
- **State Management**: Zustand with persistent storage middleware
- **Data Visualizations**: Recharts (Responsive Area, Bar, and Donut charts)
- **UI Primitives & Modals**: Radix UI Dialog, Framer Motion
- **Navigation & Search**: React Router 7, cmdk (Global Command Palette)
- **Forms & Validation**: React Hook Form, Zod
- **Notifications**: Sonner (Themed toast notifications)
- **Icons**: Lucide React

---

## 📱 Key Features

- **Dashboard (`/`)**: Real-time equity overview, margin utilization gauge, portfolio balance trends, and account health monitoring.
- **Trading Accounts (`/accounts`)**: MetaTrader 5 account management, leverage settings, virtual demo account resetting, and internal transfer routing (`/accounts/transfer`).
- **Cashier & Funding (`/fund`)**: Deposit and withdrawal rails (Cards, Wire Transfer, USDT TRC-20 with QR verification, Apple Pay / Google Pay).
- **Statements (`/statements`)**: Monthly trading reconciliations, annual overview charts, side-by-side statement comparisons, and CSV/PDF downloads.
- **Rewards & Loyalty (`/rewards`)**: VIP tier milestones, trading bounties, and voucher redemptions.
- **Prediction Arena (`/games`)**: Community sentiment market challenges and competitive leaderboard.
- **Referrals (`/referrals`)**: Affiliate tracking, custom partner links, QR code generation, and payout ledger.
- **Support Desk (`/support`)**: Dedicated client support ticketing and real-time live chat simulator.
- **Profile & Settings (`/profile`)**: Trader identity, 2FA status, active login sessions, and theme background switcher.

---

## 📄 License

MIT License. Designed and developed by [Sushil Singh Rathore](https://github.com/RSushil1).
