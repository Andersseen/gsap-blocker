import { Component, signal } from '@angular/core';
import HeroSection from '@components/hero-section';
import CATEGORIES from '@data/categories';
import { AndRevealDirective } from '@shared/directives/and-reveal.directive';
import FeaturesSection from '@components/features';

@Component({
  selector: 'page-home',
  imports: [AndRevealDirective, HeroSection, FeaturesSection],
  template: `
    <hero-section />

    <!-- Features -->
    <features-section />

    <!-- Categories -->
    <section
      class="container mx-auto px-6 md:px-8 py-24 border-t border-border"
    >
      <div class="flex items-end justify-between mb-12">
        <div>
          <h2
            class="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4"
          >
            Block categories
          </h2>
          <p class="text-muted-foreground text-lg">
            Browse our collection of animated components.
          </p>
        </div>
        <a
          class="text-sm font-medium text-foreground hover:underline underline-offset-4"
          href="/blocks"
          >View all categories -></a
        >
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (c of categories(); track c.name) {
        <a andReveal class="card group block">
          <div class="flex items-start justify-between mb-8">
            <span
              class="inline-flex items-center justify-center size-12 rounded-2xl bg-background border border-border text-2xl shadow-sm text-foreground"
              >{{ c.emoji }}</span
            >
            <span
              class="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground"
              >{{ c.count }} items</span
            >
          </div>

          <h3
            class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors"
          >
            {{ c.name }}
          </h3>
          <p class="text-muted-foreground text-sm">
            Explore {{ c.name.toLowerCase() }} components
          </p>

          <div
            class="absolute -bottom-6 -right-6 size-32 bg-gradient-to-br from-border/50 to-transparent rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"
          ></div>
        </a>
        }
      </div>
    </section>

    <section class="container mx-auto px-6 md:px-8 pb-24">
      <div
        andReveal
        class="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background p-12 md:p-24 text-center"
      >
        <div class="relative z-10 max-w-2xl mx-auto">
          <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Ready to build?
          </h2>
          <p class="text-lg md:text-xl opacity-80 mb-10 leading-relaxed">
            Stop wasting time on animation boilerplate. Drop in our blocks and
            ship your landing page today.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a
              class="inline-flex items-center justify-center h-12 px-8 rounded-full bg-background text-foreground font-bold hover:scale-105 transition-transform"
              href="/docs"
              >Read Documentation</a
            >
            <a
              class="inline-flex items-center justify-center h-12 px-8 rounded-full border border-background/20 hover:bg-background/10 font-semibold transition-colors"
              href="/blocks"
              >Explore All Blocks</a
            >
          </div>
        </div>

        <div
          class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div
            class="absolute -top-[20%] -left-[10%] size-[500px] bg-blue-500/30 rounded-full blur-[100px]"
          ></div>
          <div
            class="absolute -bottom-[20%] -right-[10%] size-[500px] bg-purple-500/30 rounded-full blur-[100px]"
          ></div>
        </div>
      </div>
    </section>
  `,
})
export default class HomePage {
  categories = signal(CATEGORIES);
}
