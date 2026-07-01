import { Routes } from '@angular/router';

export const MARKETS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./markets.component').then((m) => m.MarketsComponent) },
];
