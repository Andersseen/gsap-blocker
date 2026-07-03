import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import CardCategory from '@components/grid-card';
import CATEGORIES from '@data/categories';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-blocks',
  imports: [CardCategory, FormsModule],
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

        <div class="mb-10">
          <label for="block-search" class="sr-only">Search blocks</label>
          <div class="relative max-w-md">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="block-search"
              type="search"
              [(ngModel)]="query"
              placeholder="Search categories..."
              class="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        @if (filteredCategories().length > 0) {
          <app-grid-card [categories]="filteredCategories()" />
        } @else {
          <p class="text-muted-foreground">
            No categories match "{{ query() }}".
          </p>
        }
      </div>
    </div>
  `,
})
export default class ExploreBlocks {
  query = signal('');
  categories = signal(CATEGORIES);

  filteredCategories = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.categories();
    return this.categories().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.emoji.toLowerCase().includes(q) ||
        `${c.count}`.includes(q)
    );
  });
}
