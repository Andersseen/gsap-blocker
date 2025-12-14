import { Component } from '@angular/core';
import Testimonials from '@blocks/testimonials'; // "Marquee"
import TestimonialsGrid from '@blocks/testimonials-grid';
import TestimonialsFocus from '@blocks/testimonials-focus';
import TestimonialsAvatars from '@blocks/testimonials-avatars';

@Component({
  selector: 'testimonials-page',
  imports: [
    Testimonials,
    TestimonialsGrid,
    TestimonialsFocus,
    TestimonialsAvatars,
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

        <!-- Block 1: Marquee -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            01. Infinite Marquee
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <testimonials />
          </div>
        </section>

        <!-- Block 2: Grid -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            02. Masonry Grid
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-testimonials-grid />
          </div>
        </section>

        <!-- Block 3: Focus -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            03. Key Highlight
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-testimonials-focus />
          </div>
        </section>

        <!-- Block 4: Avatars -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            04. Trusted By
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-testimonials-avatars />
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class TestimonialsPage {}
