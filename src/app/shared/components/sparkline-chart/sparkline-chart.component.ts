import { Component, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-sparkline-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `<canvas baseChart type="line" [data]="chartData()" [options]="options"></canvas>`,
  styles: `:host { display: block; width: 100px; height: 32px; }`,
})
export class SparklineChartComponent {
  readonly data = input.required<number[]>();
  readonly positive = input(true);

  chartData(): ChartConfiguration<'line'>['data'] {
    const color = this.positive() ? '#00d4aa' : '#f6465d';
    return {
      labels: this.data().map((_, i) => i.toString()),
      datasets: [
        {
          data: this.data(),
          borderColor: color,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    };
  }

  options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };
}
