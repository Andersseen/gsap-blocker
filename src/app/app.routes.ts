import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home'),
  },

  {
    path: 'blocks',
    loadComponent: () => import('./pages/explore-blocks'),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs'),
  },
];
