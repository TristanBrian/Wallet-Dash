import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';

/**
 * ChartCard — wraps ng2-charts BaseChartDirective in a Material card.
 * Chart.js is registered globally via provideCharts() in app.config.
 */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ChartCardComponent {
  readonly title = input.required<string>();
  readonly type = input<ChartType>('line');
  readonly labels = input.required<string[]>();
  readonly datasets = input.required<ChartConfiguration['data']['datasets']>();
  readonly height = input('280px');

  readonly chartData = computed(() => ({
    labels: this.labels(),
    datasets: this.datasets() ?? [],
  }));

  readonly chartOptions = computed<ChartConfiguration['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: this.type() === 'doughnut' || this.type() === 'pie', position: 'bottom' },
    },
    scales:
      this.type() === 'doughnut' || this.type() === 'pie'
        ? undefined
        : {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#848e9c' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#848e9c' } },
          },
  }));
}
