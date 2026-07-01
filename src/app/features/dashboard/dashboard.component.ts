import { Component, inject, signal } from '@angular/core';
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
import { catchError, of } from 'rxjs';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly error = signal(false);
  readonly portfolio = toSignal(
    this.portfolioService.getPortfolio().pipe(catchError(() => { this.error.set(true); return of(null); })),
  );
  readonly recentTx = toSignal(
    this.portfolioService.getRecentTransactions().pipe(catchError(() => of([]))),
  );

  readonly txColumns = ['date', 'asset', 'type', 'amount', 'status'];
  readonly formatDate = formatDate;
  readonly truncateHash = truncateHash;

  retry(): void {
    this.error.set(false);
    this.portfolioService.refresh();
    window.location.reload();
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
