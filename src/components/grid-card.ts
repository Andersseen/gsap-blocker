import { RouterModule } from '@angular/router';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'grid-card',
  inputs: ['category'],
  imports: [RouterModule],
  template: `
    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (category of categories(); track category.name) {
      <a
        andReveal
        class="group rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-gradient-to-br from-white to-white/70 dark:from-zinc-900 dark:to-zinc-900/60 hover:shadow-md transition"
        [routerLink]="category.name.toLowerCase()"
      >
        <span>{{ category.id }}</span>
        <div class="text-3xl">{{ category.emoji }}</div>
        <div class="mt-4 flex items-center justify-between">
          <h3 class="font-semibold">{{ category.name }}</h3>
          <span
            class="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800"
            >{{ category.count }} blocks</span
          >
        </div>
        <div
          class="mt-4 h-24 rounded-xl bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.emerald.500/15),transparent)] group-hover:scale-[1.02] transition"
        ></div>
      </a>
      }
    </div>
  `,
})
export default class GridCard {
  categories = input<Category[]>([]);
}
