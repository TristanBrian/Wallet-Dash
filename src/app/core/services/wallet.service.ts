import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, filter, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import { Wallet } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly http = inject(HttpClient);
  private readonly wallets$ = new BehaviorSubject<Wallet[] | null>(null);

  getWallets(): Observable<Wallet[]> {
    if (this.wallets$.value === null) {
      return this.http.get<Wallet[]>(`${environment.apiBaseUrl}${API_PATHS.wallets}`).pipe(
        tap((wallets) => this.wallets$.next(wallets)),
        switchMap(() => this.wallets$.pipe(filter((w): w is Wallet[] => w !== null))),
      );
    }
    return this.wallets$.pipe(filter((w): w is Wallet[] => w !== null));
  }

  getWalletById(id: string): Observable<Wallet | undefined> {
    return new Observable((subscriber) => {
      this.getWallets().subscribe((wallets) => {
        subscriber.next(wallets.find((w) => w.id === id));
        subscriber.complete();
      });
    });
  }

  updateWallet(wallet: Wallet): void {
    const current = this.wallets$.value;
    if (!current) return;
    this.wallets$.next(current.map((w) => (w.id === wallet.id ? wallet : w)));
  }

  deleteWallet(id: string): void {
    const current = this.wallets$.value;
    if (!current) return;
    this.wallets$.next(current.filter((w) => w.id !== id));
  }

  refresh(): void {
    this.wallets$.next(null);
  }
}
