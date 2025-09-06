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
    loadComponent: () => import('./pages/explore-blocks'),
    children: [
      // { path: ':id', component: Heroes } // subruta dinámica
    ]
  },
  
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs'),
  },
  {
    path: '**',
    redirectTo: './pages/home'
  }
];
