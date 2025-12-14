import { RouterModule } from '@angular/router';
import { Component, input, Input } from '@angular/core';
import Category from '@shared/interfaces/category.interface';

@Component({
  selector: 'grid-card',
  inputs: ['category'],
  imports: [RouterModule],
  template: `
    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      @for (category of categories(); track category.name) {
      <a
        andReveal
        class="card group block"
        [routerLink]="category.name.toLowerCase()"
      >
        <div class="flex items-start justify-between mb-8">
          <span
            class="inline-flex items-center justify-center size-12 rounded-2xl bg-background border border-border text-2xl shadow-sm text-foreground"
            >{{ category.emoji }}</span
          >
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground"
            >{{ category.count }} items</span
          >
        </div>

        <h3
          class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors"
        >
          {{ category.name }}
        </h3>
        <p class="text-muted-foreground text-sm">Explore specific components</p>

        <div
          class="absolute -bottom-6 -right-6 size-32 bg-gradient-to-br from-border/50 to-transparent rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"
        ></div>
      </a>
      }
    </div>
  `,
})
export default class GridCard {
  categories = input<Category[]>([]);
}
