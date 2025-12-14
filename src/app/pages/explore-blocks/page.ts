import { Component, signal } from '@angular/core';
import CardCategory from '@components/grid-card';
import CATEGORIES from '@data/categories';

@Component({
  selector: 'explore-blocks',
  imports: [CardCategory],
  template: `
    <div class="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div class="max-w-7xl mx-auto">
        <div class="mb-16">
          <h1
            class="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6"
          >
            Block Library
          </h1>
          <p class="text-xl md:text-2xl text-muted-foreground max-w-3xl">
            A comprehensive collection of animated components. Copy, paste, and
            ship faster.
          </p>
        </div>

        <grid-card [categories]="categories()" />
      </div>
    </div>
  `,
})
export default class ExploreBlocks {
  categories = signal(CATEGORIES);
}
