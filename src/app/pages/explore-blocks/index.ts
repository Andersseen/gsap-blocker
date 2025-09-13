import { Component, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import CardCategory from '@components/grid-card';

@Component({
  selector: 'page-explore-blocks',
  imports: [RouterModule, CardCategory],
  template: ` <section class="container mx-auto px-6 md:px-8 py-16">
    @if(!showCategory()) {
    <a class="text-sm underline underline-offset-4" href="/blocks">Atras</a>
    <router-outlet></router-outlet>
    }@else {
    <div class="flex items-end justify-between">
      <h2 class="text-2xl md:text-3xl font-bold">Block categories</h2>
      <a class="text-sm underline underline-offset-4" href="/blocks"
        >View all</a
      >
    </div>
    <grid-card [categories]="categories()" />
    }
  </section>`,
})
export default class ExploreBlocksPage {
  showCategory = signal<Boolean>(true);
  categories = signal<Category[]>([
    { id: 1, name: 'Heroes', count: 8, emoji: '🦸' },
    { id: 2, name: 'Features', count: 12, emoji: '✨' },
    { id: 3, name: 'Pricing', count: 6, emoji: '💳' },
    { id: 4, name: 'Testimonials', count: 7, emoji: '💬' },
    { id: 5, name: 'CTA', count: 5, emoji: '▶️' },
    { id: 6, name: 'Footers', count: 4, emoji: '🦶' },
  ]);
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // 👇 ejemplo: muestra outlet si la ruta contiene "/blocks/"
        this.showCategory.set(event.urlAfterRedirects === '/blocks');
        console.log(event.url.includes('/blocks/'));
        console.log(this.showCategory());
      }
    });
  }
}
