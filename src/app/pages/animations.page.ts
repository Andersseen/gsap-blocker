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
  title: 'Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Angular-first GSAP animation patterns with live demos, source code and implementation recipes.',
    },
    { property: 'og:title', content: 'Motion Recipes — GSAP Blocker' },
    {
      property: 'og:description',
      content:
        'Angular-first GSAP animation patterns with live demos, source code and implementation recipes.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-animations-layout',
  imports: [RouterOutlet, RouterLink],
  template: ` <section class="container mx-auto px-6 md:px-8 py-16">
    @if (!showIndex()) {
      <a
        class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition"
        routerLink="/animations"
      >
        ← Back to Motion Recipes
      </a>
    }
    <router-outlet />
  </section>`,
})
export default class AnimationsLayoutPage {
  private readonly router = inject(Router);

  showIndex = signal<boolean>(true);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showIndex.set(event.urlAfterRedirects === '/animations');
      }
    });
  }
}
