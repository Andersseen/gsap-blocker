import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import FeaturesSection from '@components/features-section';
import HeroSection from '@components/hero-section';
import CATEGORIES from '@data/categories';
import { AndRevealDirective } from '@shared/directives/and-reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-home',
  imports: [AndRevealDirective, HeroSection, FeaturesSection],
  template: `
    <hero-section />

    <!-- Features -->
    @defer (on viewport) {
      <features-section />
    } @placeholder {
      <div class="min-h-[500px]"></div>
    }

    <!-- Categories -->
    @defer (on viewport) {
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
              class="group rounded-2xl border p-5 hover:shadow-md transition bg-card hover:bg-card/80"
              href="/blocks"
            >
              <div class="text-3xl">{{ c.emoji }}</div>
              <div class="mt-4 flex items-center justify-between">
                <h3 class="font-semibold text-foreground">{{ c.name }}</h3>
                <span
                  class="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                  >{{ c.count }} blocks</span
                >
              </div>
              <div
                class="mt-4 h-24 rounded-xl relative overflow-hidden border border-border/50 flex items-center justify-center bg-background/50"
              >
                <div
                  class="absolute inset-0 opacity-[0.4]"
                  style="background-image: radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0); background-size: 14px 14px;"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
              </div>
            </a>
          }
        </div>
      </section>
    } @placeholder {
      <div class="min-h-[400px]"></div>
    }

    @defer (on viewport) {
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
    } @placeholder {
      <div class="min-h-[300px]"></div>
    }
  `,
})
export default class HomePage {
  categories = signal(CATEGORIES);
}
