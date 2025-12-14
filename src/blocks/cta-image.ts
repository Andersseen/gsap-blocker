import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-cta-image',
  imports: [NgOptimizedImage],
  template: `
    <div class="py-24 bg-background">
      <div class="container mx-auto px-6 md:px-12">
        <div
          class="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 overflow-hidden rounded-3xl bg-secondary/30 border border-border p-8 md:p-12"
        >
          <div class="flex-1 space-y-8">
            <h2
              class="text-3xl md:text-5xl font-black tracking-tighter text-foreground"
            >
              Start building today
            </h2>
            <p class="text-xl text-muted-foreground leading-relaxed">
              Stop wasting time on boilerplate. Use our production-ready blocks
              to ship your next project in record time.
            </p>
            <div class="flex flex-wrap gap-4">
              <button
                class="px-8 py-4 rounded-xl bg-foreground text-background font-bold hover:scale-105 transition-transform"
              >
                Get Started
              </button>
              <button
                class="px-8 py-4 rounded-xl border border-border bg-background text-foreground font-bold hover:bg-secondary transition-colors"
              >
                Read Documentation
              </button>
            </div>
          </div>

          <div
            class="flex-1 w-full relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500"
          >
            <img
              ngSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
              fill
              class="object-cover"
              alt="Coding environment"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class CtaImage {}
