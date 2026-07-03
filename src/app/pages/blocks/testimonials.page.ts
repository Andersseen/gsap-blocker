import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import Testimonials from '@blocks/testimonials'; // "Marquee"
import TestimonialsAvatars from '@blocks/testimonials-avatars';
import TestimonialsFocus from '@blocks/testimonials-focus';
import TestimonialsGrid from '@blocks/testimonials-grid';
import BlockShowcase from '@components/block-showcase';

export const routeMeta: RouteMeta = {
  title: 'Testimonial Blocks — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content: 'Browse testimonial blocks for your Angular landing page.',
    },
    { property: 'og:title', content: 'Testimonial Blocks — GSAP Blocker' },
    {
      property: 'og:description',
      content: 'Browse testimonial blocks for your Angular landing page.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-testimonials',
  imports: [
    Testimonials,
    TestimonialsGrid,
    TestimonialsFocus,
    TestimonialsAvatars,
    BlockShowcase,
  ],
  template: `
    <div class="pt-24 pb-12 px-6 md:px-12 bg-background min-h-screen">
      <div class="max-w-7xl mx-auto space-y-24">
        <div class="max-w-3xl">
          <h1
            class="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6"
          >
            Testimonials
          </h1>
          <p class="text-xl text-muted-foreground">
            Social proof that builds trust.
          </p>
        </div>

        <app-block-showcase
          number="01"
          title="Infinite Marquee"
          [padY]="true"
          snippet="import Testimonials from '@blocks/testimonials';

<!-- HTML -->
<app-testimonials />"
        >
          <app-testimonials />
        </app-block-showcase>

        <app-block-showcase
          number="02"
          title="Masonry Grid"
          snippet="import TestimonialsGrid from '@blocks/testimonials-grid';

<!-- HTML -->
<app-testimonials-grid />"
        >
          <app-testimonials-grid />
        </app-block-showcase>

        <app-block-showcase
          number="03"
          title="Key Highlight"
          snippet="import TestimonialsFocus from '@blocks/testimonials-focus';

<!-- HTML -->
<app-testimonials-focus />"
        >
          <app-testimonials-focus />
        </app-block-showcase>

        <app-block-showcase
          number="04"
          title="Trusted By"
          snippet="import TestimonialsAvatars from '@blocks/testimonials-avatars';

<!-- HTML -->
<app-testimonials-avatars />"
        >
          <app-testimonials-avatars />
        </app-block-showcase>
      </div>
    </div>
  `,
})
export default class TestimonialsPage {}
