import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import { Transaction, TransactionFilters } from '../models/transaction.model';

/** TransactionService — paginated, filterable transaction history. */
@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);

  getTransactions(
    filters: TransactionFilters = {},
    page = 0,
    pageSize = 10,
  ): Observable<{ items: Transaction[]; total: number }> {
    return this.http.get<Transaction[]>(`${environment.apiBaseUrl}${API_PATHS.transactions}`).pipe(
      map((txs) => {
        let filtered = [...txs];

        if (filters.asset) {
          filtered = filtered.filter((t) => t.asset === filters.asset);
        }
        if (filters.type) {
          filtered = filtered.filter((t) => t.type === filters.type);
        }
        if (filters.status) {
          filtered = filtered.filter((t) => t.status === filters.status);
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.asset.toLowerCase().includes(q) ||
              t.hash.toLowerCase().includes(q) ||
              t.network.toLowerCase().includes(q),
          );
        }

        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const total = filtered.length;
        const items = filtered.slice(page * pageSize, (page + 1) * pageSize);
        return { items, total };
      }),
    );
  }
}
