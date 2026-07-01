import { Pipe, PipeTransform } from '@angular/core';
import { formatPercent } from '../utils/format.utils';

/** Displays signed percentage changes with consistent formatting. */
@Pipe({ name: 'percentChange', standalone: true })
export class PercentChangePipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 2): string {
    if (value == null) return '—';
    return formatPercent(value, decimals);
  }
}
