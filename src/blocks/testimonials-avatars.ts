import { Component, input } from '@angular/core';

@Component({
  selector: 'app-testimonials-avatars',
  template: `
    <div class="py-24 bg-background border-t border-border">
      <div class="container mx-auto px-6 md:px-12 text-center">
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-foreground mb-2">
            Trusted by 10,000+ developers
          </h3>
          <p class="text-muted-foreground">
            Join the community building the future of the web.
          </p>
        </div>

        <div
          class="flex flex-wrap justify-center gap-6 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <!-- Placeholder logos/avatars -->
          @for (item of [1,2,3,4,5]; track item) {
          <div class="flex items-center gap-3">
            <div
              class="size-10 rounded-full bg-muted border border-border"
            ></div>
            <div class="h-4 w-20 bg-muted/50 rounded"></div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export default class TestimonialsAvatars {}
