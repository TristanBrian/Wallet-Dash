import { Routes } from '@angular/router';

export const WALLET_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./wallets.component').then((m) => m.WalletsComponent) },
];
