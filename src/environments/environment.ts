/**
 * Development environment configuration.
 * Centralizes API base URLs so services can swap mock JSON for real APIs
 * (Binance, CoinGecko, etc.) without changing component code.
 */
export const environment = {
  production: false,
  apiBaseUrl: '/assets/mock',
  appName: 'Wallet Dashboard',
  defaultCurrency: 'USD',
  refreshIntervalMs: 30_000,
};
