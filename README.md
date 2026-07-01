# Wallet Dashboard

A production-quality Angular learning project — a cryptocurrency portfolio dashboard inspired by Binance, Coinbase, and Kraken.

## Tech Stack

- Angular 21 (standalone components)
- Angular Material + SCSS
- Angular Signals & RxJS
- HttpClient with mock JSON (API-ready services)
- Chart.js via ng2-charts
- Lazy-loaded feature routes

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200)

## Build

```bash
npm run build
```

## Project Structure

```
src/app/
├── core/           # Services, models, constants
├── shared/         # Reusable components, pipes, utils
├── features/       # Lazy-loaded feature pages
├── layout/         # Sidebar, toolbar, main shell
└── environments/   # API configuration
public/assets/mock/ # Mock JSON data
```

## Features

| Route | Description |
|-------|-------------|
| `/dashboard` | Portfolio overview, charts, recent transactions |
| `/wallets` | Wallet table with CRUD actions |
| `/assets` | Holdings with sparklines and P/L |
| `/transactions` | Paginated, filterable transaction history |
| `/markets` | Market overview, gainers/losers, fear & greed |
| `/settings` | Theme, profile, notifications, API keys |
| `/help` | Angular architecture learning notes |

## Angular Concepts Demonstrated

- **Standalone Components** — no NgModules
- **Signals** — `ThemeService`, `NotificationService` UI state
- **Dependency Injection** — `inject()` in services and components
- **Lazy Routing** — each feature loads on demand
- **Reactive Forms** — transactions filters, settings
- **HttpClient** — services abstract mock vs real API
- **RxJS** — `switchMap`, `combineLatest`, `shareReplay`
- **Pipes** — currency and percent formatting

## Switching to Real APIs

Update `environment.ts` / `environment.prod.ts` `apiBaseUrl` and adapt service methods to match API response shapes. Services are designed as the single integration point.

## License

MIT
