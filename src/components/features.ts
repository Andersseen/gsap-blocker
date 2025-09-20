import { Component, signal } from '@angular/core';
import FEATURES from '@data/features';
import { AndRevealDirective } from '@shared/directives/and-reveal.directive';

@Component({
  selector: 'features-section',
  imports: [AndRevealDirective],
  template: ` <section class="container mx-auto px-6 md:px-8 py-20">
    <h2 class="text-2xl md:text-3xl font-bold">Why this library</h2>
    <p class="mt-2 max-w-prose">
      Ship faster with opinionated building blocks that play nicely with Angular
      Material and Tailwind.
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
  </section>`,
})
export default class FeaturesSection {
  features = signal(FEATURES);
}
