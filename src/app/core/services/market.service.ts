import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import { MarketOverview } from '../models/market.model';

/** MarketService — global market stats, gainers/losers, and trending coins. */
@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly http = inject(HttpClient);
  private cache$?: Observable<MarketOverview>;

  getMarketOverview(): Observable<MarketOverview> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<MarketOverview>(`${environment.apiBaseUrl}${API_PATHS.markets}`)
        .pipe(shareReplay(1));
    }
    return this.cache$;
  }

  refresh(): void {
    this.cache$ = undefined;
  }
}
