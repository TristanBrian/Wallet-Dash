import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MarketService } from '../../core/services/market.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatisticCardComponent } from '../../shared/components/statistic-card/statistic-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { PercentChangePipe } from '../../shared/pipes/percent-change.pipe';
import { formatCompact } from '../../shared/utils/format.utils';
import { catchError, of } from 'rxjs';
import { MarketOverview } from '../../core/models/market.model';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    PageHeaderComponent,
    StatisticCardComponent,
    ChartCardComponent,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    PercentChangePipe,
  ],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent {
  private readonly marketService = inject(MarketService);

  readonly market = toSignal(
    this.marketService.getMarketOverview().pipe(catchError(() => of(null as MarketOverview | null))),
  );
  readonly formatCompact = formatCompact;

  trendChart(m: MarketOverview) {
    return {
      labels: m.marketTrend.map((x) => x.date),
      datasets: [
        {
          label: 'Market Cap (B)',
          data: m.marketTrend.map((x) => x.value),
          borderColor: '#00d4aa',
          backgroundColor: 'rgba(0, 212, 170, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
}
