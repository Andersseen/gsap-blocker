import { Component, signal } from '@angular/core';

type Category = { name: string; count: number; emoji: string };

@Component({
  selector: 'page-explore-blocks',
  imports: [],
  template: ` <section class="container mx-auto px-6 md:px-8 py-16">
    <div class="flex items-end justify-between">
      <h2 class="text-2xl md:text-3xl font-bold">Block categories</h2>
      <a class="text-sm underline underline-offset-4" href="/blocks"
        >View all</a
      >
    </div>

    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (c of categories(); track c.name) {
      <a
        andReveal
        class="group rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-gradient-to-br from-white to-white/70 dark:from-zinc-900 dark:to-zinc-900/60 hover:shadow-md transition"
      >
        <div class="text-3xl">{{ c.emoji }}</div>
        <div class="mt-4 flex items-center justify-between">
          <h3 class="font-semibold">{{ c.name }}</h3>
          <span
            class="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800"
            >{{ c.count }} blocks</span
          >
        </div>
        <div
          class="mt-4 h-24 rounded-xl bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.emerald.500/15),transparent)] group-hover:scale-[1.02] transition"
        ></div>
      </a>
      }
    </div>
  </section>`,
})
export default class ExploreBlocksPage {
  categories = signal<Category[]>([
    { name: 'Heroes', count: 8, emoji: '🦸' },
    { name: 'Features', count: 12, emoji: '✨' },
    { name: 'Pricing', count: 6, emoji: '💳' },
    { name: 'Testimonials', count: 7, emoji: '💬' },
    { name: 'CTA', count: 5, emoji: '▶️' },
    { name: 'Footers', count: 4, emoji: '🦶' },
  ]);
}
