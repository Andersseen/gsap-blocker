import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./'),
    children: [
      { path: '', loadComponent: () => import('./page') },
      { path: 'heroes', loadComponent: () => import('@blocks/hero') },
      {
        path: 'hero-modern',
        loadComponent: () => import('@blocks/hero-modern'),
      },
      { path: 'features', loadComponent: () => import('@blocks/features') },
      {
        path: 'bento-grid',
        loadComponent: () => import('@blocks/bento-grid'),
      },
      { path: 'pricing', loadComponent: () => import('@blocks/pricing') },
      { path: 'cta', loadComponent: () => import('@blocks/cta-2') },
      {
        path: 'cta-split',
        loadComponent: () => import('@blocks/split-cta'),
      },
      { path: 'footers', loadComponent: () => import('@blocks/footer') },
      {
        path: 'footer-interactive',
        loadComponent: () => import('@blocks/interactive-footer'),
      },
      {
        path: 'testimonials',
        loadComponent: () => import('@blocks/testimonials'),
      },
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
