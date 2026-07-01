import { Asset } from '../models/asset.model';
import { MarketCoin, MarketOverview } from '../models/market.model';
import {
  PortfolioAllocation,
  PortfolioSummary,
  PerformancePoint,
  TopMover,
  PortfolioData,
} from '../models/portfolio.model';
import { Wallet } from '../models/wallet.model';
import {
  COIN_COLORS,
  PORTFOLIO_HOLDINGS,
  QUICK_ACTIONS,
  WALLET_DISTRIBUTION,
  WALLET_TEMPLATES,
} from '../constants/crypto.constants';

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinGeckoGlobal {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface CoinGeckoMarketChart {
  market_cap_chart: {
    market_cap: [number, number][];
  };
}

export interface FearGreedResponse {
  data: { value: string; value_classification: string }[];
}

export function toMarketCoin(coin: CoinGeckoMarket): MarketCoin {
  return {
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    changePercent: coin.price_change_percentage_24h ?? 0,
    volume: coin.total_volume,
    marketCap: coin.market_cap,
  };
}

export function mapMarketOverview(
  global: CoinGeckoGlobal,
  markets: CoinGeckoMarket[],
  trendingMarkets: CoinGeckoMarket[],
  fearGreed: FearGreedResponse,
  marketChart: CoinGeckoMarketChart,
): MarketOverview {
  const sorted = [...markets].sort(
    (a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0),
  );

  const caps = marketChart.market_cap_chart.market_cap;
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const recentCaps = caps.slice(-7);

  return {
    globalMarketCap: global.data.total_market_cap.usd,
    volume24h: global.data.total_volume.usd,
    btcDominance: global.data.market_cap_percentage.btc,
    ethDominance: global.data.market_cap_percentage.eth,
    fearGreedIndex: Number(fearGreed.data[0]?.value ?? 50),
    fearGreedLabel: fearGreed.data[0]?.value_classification ?? 'Neutral',
    topGainers: sorted.slice(0, 5).map(toMarketCoin),
    topLosers: [...sorted].reverse().slice(0, 5).map(toMarketCoin),
    trending: trendingMarkets.map(toMarketCoin),
    marketTrend: recentCaps.map(([ts, value], i) => ({
      date: dayLabels[i] ?? new Date(ts).toLocaleDateString('en-US', { weekday: 'short' }),
      value: Math.round(value / 1_000_000_000),
    })),
  };
}

export function buildPortfolioData(
  markets: CoinGeckoMarket[],
  history?: { prices: [number, number][] },
): PortfolioData {
  const priceMap = new Map(markets.map((c) => [c.id, c]));

  const holdings = PORTFOLIO_HOLDINGS.map((h) => {
    const coin = priceMap.get(h.id);
    const price = coin?.current_price ?? 0;
    const value = h.quantity * price;
    const costBasis = h.quantity * h.averageBuyPrice;
    const profitLoss = value - costBasis;
    const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

    return {
      ...h,
      price,
      value,
      change24h: coin?.price_change_percentage_24h ?? 0,
      sparkline: coin?.sparkline_in_7d?.price ?? [],
      profitLoss,
      profitLossPercent,
    };
  });

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const change24hValue = holdings.reduce(
    (sum, h) => sum + h.value * (h.change24h / 100),
    0,
  );
  const change24hPercent =
    totalValue > 0
      ? holdings.reduce((sum, h) => sum + h.value * h.change24h, 0) / totalValue
      : 0;

  const allocation: PortfolioAllocation[] = holdings.map((h) => ({
    symbol: h.symbol,
    name: h.name,
    value: h.value,
    percent: totalValue > 0 ? (h.value / totalValue) * 100 : 0,
    color: COIN_COLORS[h.symbol] ?? '#888',
  }));

  const summary: PortfolioSummary = {
    totalValue,
    change24h: change24hValue,
    change24hPercent,
    todayProfitLoss: change24hValue,
    totalAssets: holdings.length,
    totalWallets: WALLET_TEMPLATES.length,
  };

  const topMovers: TopMover[] = [...markets]
    .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    .slice(0, 3)
    .map((c) => ({
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      price: c.current_price,
      changePercent: c.price_change_percentage_24h ?? 0,
    }));

  const performance = buildMonthlyPerformance(history?.prices, totalValue);
  const monthlyProfit = buildMonthlyProfit(performance);

  return {
    fetchedAt: new Date().toISOString(),
    summary,
    allocation,
    performance,
    monthlyProfit,
    topMovers,
    quickActions: [...QUICK_ACTIONS],
    walletDistribution: WALLET_DISTRIBUTION,
  };
}

export function buildAssets(markets: CoinGeckoMarket[]): Asset[] {
  const priceMap = new Map(markets.map((c) => [c.id, c]));
  const holdings = PORTFOLIO_HOLDINGS.map((h) => {
    const coin = priceMap.get(h.id);
    const price = coin?.current_price ?? 0;
    const value = h.quantity * price;
    const costBasis = h.quantity * h.averageBuyPrice;
    const profitLoss = value - costBasis;

    return { ...h, price, value, coin, profitLoss, costBasis };
  });

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  return holdings.map((h) => ({
    id: h.id,
    symbol: h.symbol,
    name: h.name,
    icon: h.icon,
    currentPrice: h.price,
    quantity: h.quantity,
    averageBuyPrice: h.averageBuyPrice,
    profitLoss: h.profitLoss,
    profitLossPercent: h.costBasis > 0 ? (h.profitLoss / h.costBasis) * 100 : 0,
    allocationPercent: totalValue > 0 ? (h.value / totalValue) * 100 : 0,
    sparkline: h.coin?.sparkline_in_7d?.price ?? [],
    change24h: h.coin?.price_change_percentage_24h ?? 0,
  }));
}

export function buildWallets(markets: CoinGeckoMarket[]): Wallet[] {
  const priceMap = new Map(markets.map((c) => [c.id, c.current_price]));

  return WALLET_TEMPLATES.map((w) => ({
    id: w.id,
    name: w.name,
    network: w.network,
    address: w.address,
    balance: w.balance,
    usdValue: w.balance * (priceMap.get(w.coinId) ?? 0),
    status: w.status,
    assetSymbol: w.assetSymbol,
  }));
}

function buildMonthlyPerformance(
  prices: [number, number][] | undefined,
  totalValue: number,
): PerformancePoint[] {
  if (!prices?.length) return [];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const byMonth = new Map<string, number>();

  for (const [ts, price] of prices) {
    const key = new Date(ts).toLocaleString('en-US', { month: 'short' });
    byMonth.set(key, price);
  }

  const btcPrices = months.map((m) => byMonth.get(m)).filter((p): p is number => p != null);
  if (!btcPrices.length) return [];

  const latestBtc = btcPrices[btcPrices.length - 1];
  const scale = latestBtc > 0 ? totalValue / latestBtc : 1;

  return months
    .filter((m) => byMonth.has(m))
    .map((m) => ({
      date: m,
      value: Math.round((byMonth.get(m) ?? 0) * scale),
    }));
}

function buildMonthlyProfit(performance: PerformancePoint[]): PerformancePoint[] {
  return performance.map((point, i) => ({
    date: point.date,
    value: i === 0 ? 0 : point.value - performance[i - 1].value,
  }));
}
