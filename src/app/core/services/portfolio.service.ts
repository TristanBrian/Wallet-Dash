import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import {
  PortfolioAllocation,
  PortfolioSummary,
  PerformancePoint,
  TopMover,
  QuickAction,
} from '../models/portfolio.model';
import { Transaction } from '../models/transaction.model';

export interface PortfolioData {
  summary: PortfolioSummary;
  allocation: PortfolioAllocation[];
  performance: PerformancePoint[];
  monthlyProfit: PerformancePoint[];
  topMovers: TopMover[];
  quickActions: QuickAction[];
  walletDistribution: PortfolioAllocation[];
}

/**
 * PortfolioService — fetches portfolio overview data via HttpClient.
 *
 * Data flow: mock JSON → HttpClient → Observable → component (toSignal or async pipe).
 * When integrating real APIs, only this service and API_PATHS need updating.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private cache$?: Observable<PortfolioData>;

  getPortfolio(): Observable<PortfolioData> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<PortfolioData>(`${this.baseUrl}${API_PATHS.portfolio}`)
        .pipe(shareReplay(1));
    }
    return this.cache$;
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}${API_PATHS.transactions}`).pipe(
      map((txs) =>
        [...txs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
      ),
    );
  }

  refresh(): void {
    this.cache$ = undefined;
  }
}
