import HeroSection from '@components/hero-section';
import { Routes } from '@angular/router';
import Hero from '../blocks/hero';
import AndPricingSection from '../blocks/pricing';
import Features from '../blocks/features';

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
      { path: 'heroes', loadComponent: () => import('../blocks/hero') },
      { path: 'features', loadComponent: () => import('../blocks/features') },
      { path: 'pricing', loadComponent: () => import('../blocks/pricing') },
      { path: 'cta', loadComponent: () => import('../blocks/cta') },
      { path: 'footers', loadComponent: () => import('../blocks/footer') },
      {
        path: 'testimonials',
        loadComponent: () => import('../blocks/testimonials'),
      },
    ],
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
