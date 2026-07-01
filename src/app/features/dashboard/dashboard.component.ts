import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { PortfolioService } from '../../core/services/portfolio.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatisticCardComponent } from '../../shared/components/statistic-card/statistic-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { StatusIndicatorComponent } from '../../shared/components/status-indicator/status-indicator.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { PercentChangePipe } from '../../shared/pipes/percent-change.pipe';
import { formatDate, truncateHash } from '../../shared/utils/format.utils';
import { Subject, catchError, of, startWith, switchMap } from 'rxjs';
import { COINGECKO_API } from '../../core/constants/crypto.constants';

interface DashboardMarketCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
}

/**
 * Dashboard — portfolio overview demonstrating toSignal(), async data, and chart composition.
 * Data flows: PortfolioService (HttpClient) → Observable → toSignal → template.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    PageHeaderComponent,
    StatisticCardComponent,
    ChartCardComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    StatusIndicatorComponent,
    CurrencyFormatPipe,
    PercentChangePipe,
    UpperCasePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  private readonly portfolioService = inject(PortfolioService);
  private readonly refreshTrigger$ = new Subject<void>();

  readonly error = signal(false);
  readonly portfolio = toSignal(
    this.refreshTrigger$.pipe(
      startWith(void 0),
      switchMap(() => this.portfolioService.getPortfolio()),
      catchError(() => {
        this.error.set(true);
        return of(null);
      }),
    ),
  );
  readonly recentTx = toSignal(
    this.refreshTrigger$.pipe(
      startWith(void 0),
      switchMap(() => this.portfolioService.getRecentTransactions()),
      catchError(() => of([])),
    ),
  );
  readonly livePriceSample = toSignal(
    this.refreshTrigger$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.http.get<DashboardMarketCoin[]>(
          `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,cardano,dogecoin,ripple,tether`,
        ),
      ),
      catchError(() => of([] as DashboardMarketCoin[])),
    ),
  );

  readonly txColumns = ['date', 'asset', 'type', 'amount', 'status'];
  readonly formatDate = formatDate;
  readonly truncateHash = truncateHash;
  readonly apiSource = 'CoinGecko';

  retry(): void {
    this.refreshLiveData();
  }

  refreshLiveData(): void {
    this.error.set(false);
    this.portfolioService.refresh();
    this.refreshTrigger$.next();
  }

  lastUpdatedLabel(): string {
    const fetchedAt = this.portfolio()?.fetchedAt;
    if (!fetchedAt) return 'fetching...';
    return new Date(fetchedAt).toLocaleTimeString();
  }

  liveMarketCoins(): DashboardMarketCoin[] {
    return this.livePriceSample() ?? [];
  }

  performanceChart() {
    const p = this.portfolio();
    if (!p) return { labels: [] as string[], datasets: [] };
    return {
      labels: p.performance.map((x) => x.date),
      datasets: [
        {
          label: 'Portfolio Value',
          data: p.performance.map((x) => x.value),
          borderColor: '#f0b90b',
          backgroundColor: 'rgba(240, 185, 11, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  allocationChart() {
    const p = this.portfolio();
    if (!p) return { labels: [] as string[], datasets: [] };
    return {
      labels: p.allocation.map((a) => a.symbol),
      datasets: [
        {
          data: p.allocation.map((a) => a.percent),
          backgroundColor: p.allocation.map((a) => a.color),
          borderWidth: 0,
        },
      ],
    };
  }
}
