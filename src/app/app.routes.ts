import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home'),
    data: {
      seo: {
        title: 'GSAP Blocker — Animated UI blocks for Angular',
        description:
          'A curated collection of production-ready, animated UI blocks built with Angular, Tailwind CSS, and GSAP.',
      },
    },
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'blocks',
    loadChildren: () => import('./pages/explore-blocks/routes'),
    data: {
      seo: {
        title: 'Block Library — GSAP Blocker',
        description:
          'Browse our collection of animated heroes, features, pricing, testimonials, CTAs, and footers.',
      },
    },
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs'),
    data: {
      seo: {
        title: 'Documentation — GSAP Blocker',
        description:
          'Learn how to use GSAP Blocker blocks in your Angular projects.',
      },
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
