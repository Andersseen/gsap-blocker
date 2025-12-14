import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./'),
    children: [
      { path: '', loadComponent: () => import('./page') },
      { path: 'heroes', loadComponent: () => import('./heroes-page') },
      { path: 'features', loadComponent: () => import('./features-page') },
      { path: 'pricing', loadComponent: () => import('./pricing-page') },
      { path: 'cta', loadComponent: () => import('./cta-page') },
      { path: 'footers', loadComponent: () => import('./footers-page') },
      {
        path: 'testimonials',
        loadComponent: () => import('./testimonials-page'),
      },
      // Individual blocks can remain accessible via direct URL if needed,
      // but the main navigation now points to the aggregate pages.
      {
        path: 'infinite-marquee',
        loadComponent: () => import('@blocks/infinite-marquee'),
      },
      {
        path: 'parallax-scroll',
        loadComponent: () => import('@blocks/parallax-scroll'),
      },
    ],
  },
];

export default routes;
