import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Asset } from '../models/asset.model';
import { COINGECKO_API, PORTFOLIO_COIN_IDS } from '../constants/crypto.constants';
import { buildAssets, CoinGeckoMarket } from '../utils/coingecko.mapper';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private readonly http = inject(HttpClient);
  private cache$?: Observable<Asset[]>;

  getAssets(): Observable<Asset[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<CoinGeckoMarket[]>(
          `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${PORTFOLIO_COIN_IDS}&sparkline=true`,
        )
        .pipe(
          map((markets) => buildAssets(markets)),
          shareReplay(1),
        );
    }

    return this.cache$;
  }

  getAssetBySymbol(symbol: string): Observable<Asset | undefined> {
    return this.getAssets().pipe(
      map((assets) => assets.find((a) => a.symbol === symbol)),
    );
  }

  refresh(): void {
    this.cache$ = undefined;
  }
}
