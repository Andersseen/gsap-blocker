import { Component, effect, signal, viewChild } from '@angular/core';
import FEATURES from '@data/features';
import { AndGsapFromDirective } from '@shared/directives/and-gsap-from';
import { AndGsapTimelineDirective } from '@shared/directives/and-gsap-timeline';
import { AndWhenVisibleDirective } from '@shared/directives/and-when-visible.directive';

@Component({
  selector: 'features-section',
  imports: [
    AndGsapFromDirective,
    AndGsapTimelineDirective,
    AndWhenVisibleDirective,
  ],
  template: `
    <section
      andGsapTimeline
      [defaults]="{ ease: 'power3.out', duration: 0.9 }"
      #tl="andGsapTimeline"
      andWhenVisible
      #vis="andWhenVisible"
      [paused]="!vis.isVisible()"
      offset="30%"
      class="container mx-auto px-6 md:px-8 py-20"
    >
      <h2 andGsapFrom [from]="{ y: 16, autoAlpha: 0 }" [at]="'-=0.1'">
        Why this library
      </h2>

      <p andGsapFrom [from]="{ y: 18, autoAlpha: 0 }" [at]="'-=0.4'">
        Ship faster with opinionated building blocks that play nicely with
        Angular Material and Tailwind.
      </p>

      <div class="mt-10 grid md:grid-cols-3 gap-6">
        @for (f of features(); track f.title) {
        <article
          andGsapFrom
          [from]="{ y: 14, autoAlpha: 0 }"
          [at]="'-=0.5'"
          class="rounded-2xl shadow-sm hover:shadow-lg p-6 transition-shadow duration-300 ease-in-out"
        >
          <div class="text-2xl">{{ f.icon }}</div>
          <h3 class="mt-3 font-semibold">{{ f.title }}</h3>
          <p class="mt-1 text-sm">{{ f.desc }}</p>
        </article>
        }
      </div>
    </section>
  `,
})
export default class FeaturesSection {
  features = signal(FEATURES);
}
