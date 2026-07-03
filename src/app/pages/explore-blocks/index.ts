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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-explore-blocks',
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
export default class ExploreBlocksPage {
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
