import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '../utils/format.utils';
import { CurrencyCode } from '../../core/models/user.model';

/**
 * CurrencyFormatPipe — transforms raw numbers into localized currency strings.
 * Pipes are ideal for display formatting: they keep templates clean and are reusable.
 */
@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currency: CurrencyCode = 'USD'): string {
    if (value == null) return '—';
    return formatCurrency(value, currency);
  }
}
