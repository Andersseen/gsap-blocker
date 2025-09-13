import { Component, signal } from '@angular/core';
import HeroSection from '@components/hero-section';
import CATEGORIES from '@data/categories';
import FEATURES from '@data/features';
import { AndRevealDirective } from '@shared/directives/and-reveal.directive';

@Component({
  selector: 'page-home',
  imports: [AndRevealDirective, HeroSection],
  template: `
    <hero-section />
    <!-- Features -->
    <section class="container mx-auto px-6 md:px-8 py-20">
      <h2 class="text-2xl md:text-3xl font-bold">Why this library</h2>
      <p class="mt-2 max-w-prose">
        Ship faster with opinionated building blocks that play nicely with
        Angular Material and Tailwind.
      </p>

      <div class="mt-10 grid md:grid-cols-3 gap-6">
        @for (f of features(); track f.title) {
        <article andReveal class="rounded-2xl border">
          <div class="text-2xl">{{ f.icon }}</div>
          <h3 class="mt-3 font-semibold">{{ f.title }}</h3>
          <p class="mt-1 text-sm">
            {{ f.desc }}
          </p>
        </article>
        }
      </div>
    </section>

    <!-- Categories -->
    <section class="container mx-auto px-6 md:px-8 py-16">
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
          class="group rounded-2xl border p-5 hover:shadow-md transition"
        >
          <div class="text-3xl">{{ c.emoji }}</div>
          <div class="mt-4 flex items-center justify-between">
            <h3 class="font-semibold">{{ c.name }}</h3>
            <span
              class="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800"
              >{{ c.count }} blocks</span
            >
          </div>
          <div class="mt-4 h-24 rounded-xl transition"></div>
        </a>
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="container mx-auto px-6 md:px-8 py-20">
      <div andReveal class="rounded-3xl p-10 md:p-14">
        <h2 class="text-2xl md:text-3xl font-bold">
          Start building with Material Blocks
        </h2>
        <p class="mt-2 opacity-90 max-w-prose">
          Install, drop a block, ship something useful today.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            class="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
            href="/docs"
            >Read the docs</a
          >
          <a
            class="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium ring-1"
            href="/blocks"
            >Explore blocks</a
          >
        </div>
      </div>
    </section>
  `,
})
export default class HomePage {
  features = signal(FEATURES);
  categories = signal(CATEGORIES);
}
