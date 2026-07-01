import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import { Asset } from '../models/asset.model';

/** AssetService — provides holdings data for the Assets page and dashboard widgets. */
@Injectable({ providedIn: 'root' })
export class AssetService {
  private readonly http = inject(HttpClient);
  private cache$?: Observable<Asset[]>;

  getAssets(): Observable<Asset[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<Asset[]>(`${environment.apiBaseUrl}${API_PATHS.assets}`)
        .pipe(shareReplay(1));
    }
    return this.cache$;
  }

  getAssetBySymbol(symbol: string): Observable<Asset | undefined> {
    return new Observable((subscriber) => {
      this.getAssets().subscribe((assets) => {
        subscriber.next(assets.find((a) => a.symbol === symbol));
        subscriber.complete();
      });
    });
  }

  refresh(): void {
    this.cache$ = undefined;
  }
}
