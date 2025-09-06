import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home'),
  },

  {
    path: 'docs',
    loadComponent: () => import('./pages/docs'),
  },
];
