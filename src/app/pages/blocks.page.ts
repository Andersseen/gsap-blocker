import { RouteMeta } from '@analogjs/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'Block Library — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Browse our collection of animated heroes, features, pricing, testimonials, CTAs, and footers.',
    },
    { property: 'og:title', content: 'Block Library — GSAP Blocker' },
    {
      property: 'og:description',
      content:
        'Browse our collection of animated heroes, features, pricing, testimonials, CTAs, and footers.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-blocks-layout',
  imports: [RouterOutlet, RouterLink],
  template: ` <section class="container mx-auto px-6 md:px-8 py-16">
    @if (!showCategory()) {
      <a
        class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
        routerLink="/blocks"
      >
        ← Back
      </a>
    }
    <router-outlet />
  </section>`,
})
export default class BlocksLayoutPage {
  private readonly router = inject(Router);

  showCategory = signal<boolean>(true);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showCategory.set(event.urlAfterRedirects === '/blocks');
      }
    });
  }
}
