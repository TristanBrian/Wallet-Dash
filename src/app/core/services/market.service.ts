import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { MarketOverview } from '../models/market.model';
import { COINGECKO_API, FEAR_GREED_API } from '../constants/crypto.constants';
import {
  CoinGeckoGlobal,
  CoinGeckoMarket,
  CoinGeckoMarketChart,
  FearGreedResponse,
  mapMarketOverview,
} from '../utils/coingecko.mapper';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly http = inject(HttpClient);
  private cache$?: Observable<MarketOverview>;

  getMarketOverview(): Observable<MarketOverview> {
    if (!this.cache$) {
      this.cache$ = forkJoin({
        global: this.http.get<CoinGeckoGlobal>(`${COINGECKO_API}/global`),
        markets: this.http.get<CoinGeckoMarket[]>(
          `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=false`,
        ),
        trending: this.http.get<{ coins: { item: { id: string } }[] }>(
          `${COINGECKO_API}/search/trending`,
        ),
        fearGreed: this.http.get<FearGreedResponse>(`${FEAR_GREED_API}?limit=1`),
        marketChart: this.http.get<CoinGeckoMarketChart>(
          `${COINGECKO_API}/global/market_cap_chart?days=7&vs_currency=usd`,
        ),
      }).pipe(
        switchMap(({ global, markets, trending, fearGreed, marketChart }) => {
          const trendingIds = trending.coins
            .slice(0, 5)
            .map((c) => c.item.id)
            .join(',');

          if (!trendingIds) {
            return of(mapMarketOverview(global, markets, [], fearGreed, marketChart));
          }

          return this.http
            .get<CoinGeckoMarket[]>(
              `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${trendingIds}`,
            )
            .pipe(
              map((trendingMarkets) =>
                mapMarketOverview(global, markets, trendingMarkets, fearGreed, marketChart),
              ),
            );
        }),
        shareReplay(1),
      );
    }

    return this.cache$;
  }

  refresh(): void {
    this.cache$ = undefined;
  }
}
