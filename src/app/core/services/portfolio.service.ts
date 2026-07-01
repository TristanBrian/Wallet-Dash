import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { PortfolioData } from '../models/portfolio.model';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import { COINGECKO_API, PORTFOLIO_COIN_IDS } from '../constants/crypto.constants';
import { buildPortfolioData, CoinGeckoMarket } from '../utils/coingecko.mapper';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private cache$?: Observable<PortfolioData>;

  getPortfolio(): Observable<PortfolioData> {
    if (!this.cache$) {
      this.cache$ = forkJoin({
        markets: this.http.get<CoinGeckoMarket[]>(
          `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${PORTFOLIO_COIN_IDS}&sparkline=true`,
        ),
        history: this.http.get<{ prices: [number, number][] }>(
          `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=365`,
        ),
      }).pipe(
        map(({ markets, history }) => buildPortfolioData(markets, history)),
        shareReplay(1),
      );
    }

    return this.cache$;
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${environment.apiBaseUrl}${API_PATHS.transactions}`)
      .pipe(
        map((txs) =>
          [...txs]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        ),
      );
  }

  refresh(): void {
    this.cache$ = undefined;
  }
}
