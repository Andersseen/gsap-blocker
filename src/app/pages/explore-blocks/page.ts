import { Component, signal } from '@angular/core';
import CardCategory from '@components/grid-card';
import CATEGORIES from '@data/categories';

@Component({
  selector: 'explore-blocks',
  imports: [CardCategory],
  template: `
    <div class="flex items-end justify-between">
      <h2 class="text-2xl md:text-3xl font-bold">Block categories</h2>
      <a class="text-sm underline underline-offset-4" href="/blocks"
        >View all</a
      >
    </div>
    <grid-card [categories]="categories()" />
  `,
})
export default class ExploreBlocks {
  categories = signal(CATEGORIES);
}
