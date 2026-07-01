import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PercentChangePipe } from '../../pipes/percent-change.pipe';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

/**
 * StatisticCard — reusable KPI display used across Dashboard and Markets.
 * Uses signal inputs (input()) for type-safe, reactive one-way data binding.
 */
@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, PercentChangePipe, CurrencyFormatPipe],
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.scss',
})
export class StatisticCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<number | string>();
  readonly icon = input<string>('insights');
  readonly change = input<number | null>(null);
  readonly isCurrency = input(false);
  readonly isPercent = input(false);
  readonly subtitle = input<string | null>(null);

  numericValue(): number | null {
    const v = this.value();
    return typeof v === 'number' ? v : null;
  }
}
