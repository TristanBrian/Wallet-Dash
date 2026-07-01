/** Public API endpoints for live crypto data. */
export const COINGECKO_API = '/api/coingecko';
export const FEAR_GREED_API = '/api/fng';

export const COIN_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  BNB: '#F3BA2F',
  ADA: '#0033AD',
  DOGE: '#C2A633',
  USDT: '#26A17B',
};

/** Simulated holdings — quantities stay local; prices come from CoinGecko. */
export const PORTFOLIO_HOLDINGS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', quantity: 0.82, averageBuyPrice: 58200 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', quantity: 12.5, averageBuyPrice: 2850 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', quantity: 108, averageBuyPrice: 128 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '◆', quantity: 16.7, averageBuyPrice: 580 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳', quantity: 8000, averageBuyPrice: 0.58 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', quantity: 22755, averageBuyPrice: 0.15 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', icon: '₮', quantity: 4040.78, averageBuyPrice: 1.0 },
] as const;

export const PORTFOLIO_COIN_IDS = PORTFOLIO_HOLDINGS.map((c) => c.id).join(',');

/** Wallet metadata — balances are local; USD values are enriched with live prices. */
export const WALLET_TEMPLATES = [
  {
    id: 'w1',
    name: 'Main Bitcoin Wallet',
    network: 'Bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    balance: 0.82,
    status: 'active' as const,
    assetSymbol: 'BTC',
    coinId: 'bitcoin',
  },
  {
    id: 'w2',
    name: 'ETH Staking',
    network: 'Ethereum',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    balance: 12.5,
    status: 'active' as const,
    assetSymbol: 'ETH',
    coinId: 'ethereum',
  },
  {
    id: 'w3',
    name: 'Solana Trading',
    network: 'Solana',
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    balance: 108,
    status: 'active' as const,
    assetSymbol: 'SOL',
    coinId: 'solana',
  },
  {
    id: 'w4',
    name: 'BNB Savings',
    network: 'BNB Chain',
    address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
    balance: 16.7,
    status: 'inactive' as const,
    assetSymbol: 'BNB',
    coinId: 'binancecoin',
  },
  {
    id: 'w5',
    name: 'USDT Reserve',
    network: 'Ethereum',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    balance: 4040.78,
    status: 'pending' as const,
    assetSymbol: 'USDT',
    coinId: 'tether',
  },
];

export const QUICK_ACTIONS = [
  { id: '1', label: 'Deposit', icon: 'add_circle', route: '/wallets' },
  { id: '2', label: 'Withdraw', icon: 'remove_circle', route: '/wallets' },
  { id: '3', label: 'Swap', icon: 'swap_horiz', route: '/transactions' },
  { id: '4', label: 'Buy Crypto', icon: 'shopping_cart', route: '/markets' },
];

export const WALLET_DISTRIBUTION = [
  { symbol: 'Main BTC', name: 'Main BTC', value: 45000, percent: 35, color: '#F7931A' },
  { symbol: 'ETH Staking', name: 'ETH Staking', value: 32000, percent: 25, color: '#627EEA' },
  { symbol: 'Trading', name: 'Trading', value: 28000, percent: 22, color: '#00D4AA' },
  { symbol: 'Cold Storage', name: 'Cold Storage', value: 15000, percent: 12, color: '#4A90D9' },
  { symbol: 'DeFi', name: 'DeFi', value: 8456, percent: 6, color: '#9945FF' },
];
