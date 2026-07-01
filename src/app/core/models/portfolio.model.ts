export interface PortfolioSummary {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  todayProfitLoss: number;
  totalAssets: number;
  totalWallets: number;
}

export interface PortfolioAllocation {
  symbol: string;
  name: string;
  value: number;
  percent: number;
  color: string;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

export interface TopMover {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export interface PortfolioData {
  fetchedAt: string;
  summary: PortfolioSummary;
  allocation: PortfolioAllocation[];
  performance: PerformancePoint[];
  monthlyProfit: PerformancePoint[];
  topMovers: TopMover[];
  quickActions: QuickAction[];
  walletDistribution: PortfolioAllocation[];
}
