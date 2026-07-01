export interface MarketCoin {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface MarketOverview {
  globalMarketCap: number;
  volume24h: number;
  btcDominance: number;
  ethDominance: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
  topGainers: MarketCoin[];
  topLosers: MarketCoin[];
  trending: MarketCoin[];
  marketTrend: { date: string; value: number }[];
}
