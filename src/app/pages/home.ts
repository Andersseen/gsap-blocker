import { Component, signal } from '@angular/core';
import HeroSection from '@components/hero-section';
import CATEGORIES from '@data/categories';
import { AndRevealDirective } from '@shared/directives/and-reveal.directive';
import FeaturesSection from '@components/features-section';
import CategoriesSection from '@components/categories-section';

@Component({
  selector: 'page-home',
  imports: [
    AndRevealDirective,
    HeroSection,
    FeaturesSection,
    CategoriesSection,
  ],
  template: `
    <hero-section />
    <!-- Features -->
    <features-section />

    <!-- Categories -->
    <categories-section />

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
  categories = signal(CATEGORIES);
}
