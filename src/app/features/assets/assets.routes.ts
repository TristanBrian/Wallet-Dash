import { Routes } from '@angular/router';

export const ASSETS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./assets.component').then((m) => m.AssetsComponent) },
];
