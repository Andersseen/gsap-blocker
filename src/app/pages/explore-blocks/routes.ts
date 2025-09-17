import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./'),
    children: [
      { path: '', loadComponent: () => import('./page') },
      { path: 'heroes', loadComponent: () => import('@blocks/hero') },
      { path: 'features', loadComponent: () => import('@blocks/features') },
      { path: 'pricing', loadComponent: () => import('@blocks/pricing') },
      { path: 'cta', loadComponent: () => import('@blocks/cta-2') },
      { path: 'footers', loadComponent: () => import('@blocks/footer') },
      {
        path: 'testimonials',
        loadComponent: () => import('@blocks/testimonials'),
      },
    ],
  },
];

export default routes;
