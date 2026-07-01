export interface Asset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  currentPrice: number;
  quantity: number;
  averageBuyPrice: number;
  profitLoss: number;
  profitLossPercent: number;
  allocationPercent: number;
  sparkline: number[];
  change24h: number;
}
