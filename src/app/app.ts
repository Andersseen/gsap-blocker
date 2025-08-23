import { Component, signal } from '@angular/core';
import HeroSection from '@components/hero-section';
import { AndRevealDirective } from '@shared/directives/and-reveal.directive';

type Feature = { title: string; desc: string; icon: string };
type Category = { name: string; count: number; emoji: string };

@Component({
  selector: 'app',
  imports: [AndRevealDirective, HeroSection],
  host: { class: 'block' },
  template: `
    <hero-section />
    <!-- Features -->
    <section class="container mx-auto px-6 md:px-8 py-20">
      <h2 class="text-2xl md:text-3xl font-bold">Why this library</h2>
      <p class="mt-2 text-zinc-600 dark:text-zinc-300 max-w-prose">
        Ship faster with opinionated building blocks that play nicely with
        Angular Material and Tailwind.
      </p>

      <div class="mt-10 grid md:grid-cols-3 gap-6">
        @for (f of features(); track f.title) {
        <article
          andReveal
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white/60 dark:bg-zinc-900/50"
        >
          <div class="text-2xl">{{ f.icon }}</div>
          <h3 class="mt-3 font-semibold">{{ f.title }}</h3>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
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
    </section>

    <!-- CTA -->
    <section class="container mx-auto px-6 md:px-8 py-20">
      <div
        andReveal
        class="rounded-3xl p-10 md:p-14 bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white"
      >
        <h2 class="text-2xl md:text-3xl font-bold">
          Start building with Material Blocks
        </h2>
        <p class="mt-2 opacity-90 max-w-prose">
          Install, drop a block, ship something useful today.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            class="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium bg-white text-zinc-900"
            href="/docs"
            >Read the docs</a
          >
          <a
            class="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium ring-1 ring-white/70"
            href="/blocks"
            >Explore blocks</a
          >
        </div>
      </div>
    </section>

    <footer class="py-12 text-center text-sm text-zinc-500">
      © {{ year() }} GSAP Blocker. All rights reserved.
    </footer>
  `,
})
export default class App {
  year = signal(new Date().getFullYear());

  features = signal<Feature[]>([
    {
      title: 'Modern Angular patterns',
      desc: 'Signals, control flow, defer, optimized images.',
      icon: '⚡️',
    },
    {
      title: 'Tailwind 4 friendly',
      desc: 'Utilities for layout and theming; minimal custom CSS.',
      icon: '🎨',
    },
    {
      title: 'Material compatible',
      desc: 'Designed to sit nicely alongside Angular Material.',
      icon: '🧩',
    },
    {
      title: 'A11y minded',
      desc: 'Good semantics and keyboard focus by default.',
      icon: '♿',
    },
    {
      title: 'SSR-safe animations',
      desc: 'Lazy-loaded GSAP + IntersectionObserver triggers.',
      icon: '🛡️',
    },
    {
      title: 'Copy-paste ready',
      desc: 'Sections as focused, composable components.',
      icon: '📦',
    },
  ]);

  categories = signal<Category[]>([
    { name: 'Heroes', count: 8, emoji: '🦸' },
    { name: 'Features', count: 12, emoji: '✨' },
    { name: 'Pricing', count: 6, emoji: '💳' },
    { name: 'Testimonials', count: 7, emoji: '💬' },
    { name: 'CTA', count: 5, emoji: '▶️' },
    { name: 'Footers', count: 4, emoji: '🦶' },
  ]);
}
