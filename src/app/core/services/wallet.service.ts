import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map, switchMap, tap } from 'rxjs';
import { Wallet } from '../models/wallet.model';
import { COINGECKO_API, PORTFOLIO_COIN_IDS } from '../constants/crypto.constants';
import { buildWallets, CoinGeckoMarket } from '../utils/coingecko.mapper';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly http = inject(HttpClient);
  private readonly wallets$ = new BehaviorSubject<Wallet[] | null>(null);

  getWallets(): Observable<Wallet[]> {
    if (this.wallets$.value === null) {
      return this.http
        .get<CoinGeckoMarket[]>(
          `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${PORTFOLIO_COIN_IDS}`,
        )
        .pipe(
          map((markets) => buildWallets(markets)),
          tap((wallets) => this.wallets$.next(wallets)),
          switchMap(() => this.wallets$.pipe(filter((w): w is Wallet[] => w !== null))),
        );
    }

    return this.wallets$.pipe(filter((w): w is Wallet[] => w !== null));
  }

  getWalletById(id: string): Observable<Wallet | undefined> {
    return this.getWallets().pipe(
      map((wallets) => wallets.find((w) => w.id === id)),
    );
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
