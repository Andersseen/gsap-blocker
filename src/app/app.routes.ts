import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app'),
  },

  {
    path: 'docs',
    loadComponent: () => import('./docs'),
  },
];
