import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home'),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home'),
  },
  {
    path: 'blocks',
    loadChildren: () => import('./pages/explore-blocks/routes'),
  },

  {
    path: 'docs',
    loadComponent: () => import('./pages/docs'),
  },
  {
    path: '**',
    redirectTo: './pages/home',
  },
];
