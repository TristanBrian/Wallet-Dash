import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StatusIndicatorComponent } from '../../shared/components/status-indicator/status-indicator.component';
import { formatDate, truncateHash } from '../../shared/utils/format.utils';
import { TransactionFilters } from '../../core/models/transaction.model';
import { combineLatest, debounceTime, switchMap, startWith, catchError, of } from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);

  readonly page = signal(0);
  readonly pageSize = signal(10);

  readonly filterForm = this.fb.nonNullable.group({
    asset: '',
    type: '' as TransactionFilters['type'],
    status: '' as TransactionFilters['status'],
    search: '',
  });

  readonly result = toSignal(
    combineLatest([
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue()), debounceTime(300)),
      toObservable(this.page),
      toObservable(this.pageSize),
    ]).pipe(
      switchMap(([filters, page, pageSize]) =>
        this.transactionService.getTransactions(filters, page, pageSize),
      ),
      catchError(() => of({ items: [], total: 0 })),
    ),
    { initialValue: undefined },
  );

  readonly columns = ['date', 'asset', 'network', 'type', 'amount', 'fee', 'status', 'hash'];
  readonly formatDate = formatDate;
  readonly truncateHash = truncateHash;

  onPage(event: PageEvent): void {
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onFilterChange(): void {
    this.page.set(0);
  }
}
