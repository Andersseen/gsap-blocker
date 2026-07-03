import { Routes } from '@angular/router';

const categorySeo = (name: string) => ({
  title: `${name} Blocks — GSAP Blocker`,
  description: `Browse ${name.toLowerCase()} blocks for your Angular landing page.`,
});

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./'),
    children: [
      { path: '', loadComponent: () => import('./page') },
      {
        path: 'heroes',
        loadComponent: () => import('./heroes-page'),
        data: { seo: categorySeo('Hero') },
      },
      {
        path: 'features',
        loadComponent: () => import('./features-page'),
        data: { seo: categorySeo('Feature') },
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pricing-page'),
        data: { seo: categorySeo('Pricing') },
      },
      {
        path: 'cta',
        loadComponent: () => import('./cta-page'),
        data: { seo: categorySeo('CTA') },
      },
      {
        path: 'footers',
        loadComponent: () => import('./footers-page'),
        data: { seo: categorySeo('Footer') },
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./testimonials-page'),
        data: { seo: categorySeo('Testimonial') },
      },
      {
        path: 'infinite-marquee',
        loadComponent: () => import('@blocks/infinite-marquee'),
        data: { seo: categorySeo('Marquee') },
      },
      {
        path: 'parallax-scroll',
        loadComponent: () => import('@blocks/parallax-scroll'),
        data: { seo: categorySeo('Parallax') },
      },
    ],
  },
];

export default routes;
