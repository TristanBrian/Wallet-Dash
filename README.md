# Wallet Dashboard

A cryptocurrency portfolio dashboard built with **Angular 21** to teach real-world architecture and best practices. The UI is inspired by exchanges like Binance, Coinbase, and Kraken — dark theme, responsive layout, charts, tables, and a full app shell — but the real goal is learning **how** a production Angular app is structured.

> This is a learning project first. Every layer demonstrates a deliberate Angular pattern you can reuse in production apps.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Angular Concepts Map](#angular-concepts-map)
- [Data Layer](#data-layer)
- [Connecting Real APIs](#connecting-real-apis)
- [Theming](#theming)
- [Learning Path](#learning-path)

---

## Features

### Pages

| Route | What you'll find |
|-------|------------------|
| `/dashboard` | Portfolio value, 24h change, P/L, live market snapshot, quick actions, growth & allocation charts, recent transactions, top movers |
| `/wallets` | Wallet table with view, edit, delete, and copy-address actions |
| `/assets` | BTC, ETH, SOL, BNB, ADA, DOGE, USDT holdings with sparklines and profit/loss |
| `/transactions` | Paginated history with asset, type, status, and search filters |
| `/markets` | Top gainers/losers, trending coins, fear & greed index, dominance stats |
| `/settings` | Theme switch, currency, notification prefs, profile, mock API keys |
| `/help` | Quick reference for Angular patterns used in this repo |

### UI & UX

- Dark theme by default with light mode toggle
- Responsive layout (desktop, tablet, mobile)
- Left sidebar navigation + top toolbar
- Live market snapshot cards for common crypto prices on the dashboard
- Loading spinners, skeleton loaders, empty states, and error states
- Material Design components throughout
- Snackbars and confirmation dialogs

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 21 (standalone components) |
| Language | TypeScript (strict mode) |
| UI | Angular Material, SCSS |
| Charts | Chart.js + ng2-charts |
| State | Angular Signals (no NgRx) |
| Async | RxJS + HttpClient |
| Forms | Reactive Forms |
| Routing | Angular Router (lazy-loaded) |
| SSR | Angular SSR (optional production build) |

---

## Prerequisites

- **Node.js** 20+
- **npm** 11+ (or use the version pinned in `package.json`)

---

## Getting Started

```bash
# Clone and enter the project
cd customer_dash

# Install dependencies
npm install

# Start the dev server
npm start
```

Open **http://localhost:4200** — you'll land on the dashboard.

### Production build

```bash
npm run build
```

Output is written to `dist/customer_dash/`.

### SSR (server-side rendering)

```bash
npm run build
npm run serve:ssr:customer_dash
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with hot reload |
| `npm run build` | Production build (with SSR prerender) |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run unit tests (Vitest) |
| `npm run serve:ssr:customer_dash` | Serve the SSR build locally |

---

## Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, models, constants
│   │   ├── constants/           # API paths, navigation config
│   │   ├── models/              # Typed interfaces (Wallet, Asset, etc.)
│   │   └── services/            # PortfolioService, WalletService, …
│   ├── shared/                  # Reusable UI building blocks
│   │   ├── components/          # StatisticCard, ChartCard, PageHeader, …
│   │   ├── pipes/               # currencyFormat, percentChange
│   │   └── utils/               # Pure formatting helpers
│   ├── features/                # One folder per page (lazy-loaded)
│   │   ├── dashboard/
│   │   ├── wallet/
│   │   ├── assets/
│   │   ├── transactions/
│   │   ├── markets/
│   │   ├── settings/
│   │   └── help/
│   ├── layout/                  # App shell
│   │   ├── sidebar/
│   │   ├── toolbar/
│   │   ├── footer/
│   │   └── main-layout/
│   ├── app.routes.ts            # Root routing config
│   └── app.config.ts            # App-wide providers
├── environments/                # API base URL, app config
└── styles.scss                  # Global theme tokens + Material theme

public/
└── assets/mock/                 # Mock JSON consumed by HttpClient
    ├── portfolio.json
    ├── wallets.json
    ├── assets.json
    ├── transactions.json
    ├── markets.json
    ├── notifications.json
    └── user.json
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Layout (MainLayout → Sidebar + Toolbar + RouterOutlet) │
├─────────────────────────────────────────────────────────┤
│  Feature Components (Dashboard, Wallets, Assets, …)     │
├─────────────────────────────────────────────────────────┤
│  Shared Components (StatisticCard, ChartCard, …)        │
├─────────────────────────────────────────────────────────┤
│  Core Services (HttpClient → mock JSON / future APIs)   │
├─────────────────────────────────────────────────────────┤
│  Models & Constants (strong typing, single source)      │
└─────────────────────────────────────────────────────────┘
```

**Data flow (typical feature page):**

1. Component injects a service via `inject()`
2. Service fetches data with `HttpClient` (live APIs + selected local mocks)
3. Component bridges Observable → Signal with `toSignal()` or uses the `async` pipe
4. Template renders via shared components and pipes

**Key design decisions:**

- **Standalone components** — no NgModules; each component declares its own imports
- **Feature folders** — routing, component, and styles live together per page
- **Services as integration boundary** — swap mock data for real APIs without touching templates
- **Signals for UI state** — theme and notifications; RxJS for HTTP and form streams

---

## Angular Concepts Map

| Concept | Where to look |
|---------|---------------|
| Standalone components | Every `.component.ts` file |
| `inject()` DI | `core/services/*.ts`, feature components |
| Signals | `core/services/theme.service.ts`, `notification.service.ts` |
| `toSignal()` | `features/dashboard/dashboard.component.ts` |
| Lazy routing | `app.routes.ts`, `features/*/**.routes.ts` |
| Reactive Forms | `features/transactions/`, `features/settings/` |
| HttpClient | All files in `core/services/` |
| RxJS operators | `transaction.service.ts`, `transactions.component.ts` |
| Pipes | `shared/pipes/` |
| Material dialogs | `wallets.component.ts` + `confirmation-dialog` |
| Chart integration | `shared/components/chart-card/`, `app.config.ts` |

Each service and major component includes comments explaining **why** that pattern was chosen — start with `ThemeService` or `PortfolioService` if you're new to the codebase.

---

## Data Layer

The app now uses a hybrid data layer:

- **Live APIs** for market-sensitive crypto data (prices, sparkline, global stats, trending, fear & greed)
- **Local mock JSON** for user-scoped demo data (transactions, notifications, user profile)

Services still read from a configurable base URL for local sources:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: '/assets/mock',
  // ...
};
```

| Service | Source | Responsibility |
|---------|--------|----------------|
| `PortfolioService` | CoinGecko + local holdings constants | Summary, allocation, performance, top movers |
| `WalletService` | CoinGecko + local wallet templates | Wallet balances in USD using live prices |
| `AssetService` | CoinGecko + local holdings constants | Holdings with live prices and sparklines |
| `MarketService` | CoinGecko + Alternative.me | Global market stats, gainers/losers, trending, fear & greed |
| `TransactionService` | `transactions.json` | Filtered, paginated transaction history |
| `NotificationService` | `notifications.json`, `user.json` | Alerts and user profile |

---

## Connecting Real APIs

Most market data is already live. The app is still structured so you can swap/extend providers without a rewrite:

1. **Update the environment** — set `apiBaseUrl` to your API host
2. **Adapt service methods** — map API responses to existing model interfaces in `core/models/`
3. **Keep components unchanged** — they depend on services, not data source

Current live providers:

- CoinGecko (`https://api.coingecko.com/api/v3`)
- Alternative.me Fear & Greed (`https://api.alternative.me/fng/`)

Compatible future integrations:

- CoinGecko / CoinMarketCap for market and asset prices
- Binance / Coinbase for wallet balances and transactions
- Your own backend for user settings and API keys

Example change:

```typescript
// environment.prod.ts
apiBaseUrl: 'https://api.yourbackend.com/v1'
```

Then update `API_PATHS` in `core/constants/api.constants.ts` to match your endpoints.

### Verifying Live Data

Use the dashboard to verify live fetches at runtime:

1. Start the app with `npm start`
2. Open `/dashboard`
3. Confirm the badge below KPI cards shows `Live API: CoinGecko | Last pull: ...`
4. Use the refresh icon in that badge and verify the timestamp updates
5. Confirm the `Market Snapshot` section refreshes common coin prices like BTC, ETH, SOL, BNB, ADA, DOGE, XRP, and USDT

For local development, live requests are routed through `proxy.conf.json` (`/api/coingecko`, `/api/fng`) to avoid browser CORS failures. Netlify production uses direct provider URLs (no Angular dev proxy in static hosting). If you edit proxy settings, restart `ng serve`.

If the timestamp does not update or values stay static, check browser network requests to CoinGecko endpoints and API rate-limit responses.

---

## Theming

The app uses CSS custom properties for a crypto-exchange aesthetic:

- **Dark mode** (default) — `#0b0e11` background, amber accent (`#f0b90b`)
- **Light mode** — toggle via toolbar or Settings page

Theme state is managed by `ThemeService` (Signals + `localStorage` persistence). Global tokens live in `src/styles.scss`; Material theming is in `src/styles/_theme.scss`.

---

## Learning Path

Suggested order for exploring the codebase:

1. **`app.routes.ts`** — see how lazy loading wires up features
2. **`layout/main-layout/`** — understand the app shell
3. **`features/dashboard/`** — charts, signals, and service consumption
4. **`core/services/`** — HttpClient patterns and caching
5. **`features/transactions/`** — Reactive Forms + RxJS filtering
6. **`features/settings/`** — forms bound to injectable services
7. **`shared/components/`** — reusable UI patterns

Visit `/help` in the running app for an in-browser summary of these patterns.

---

## License

MIT
