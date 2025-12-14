import { Component, ElementRef, inject, viewChild, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-hero-video',
  template: `
    <section
      class="relative h-screen w-full overflow-hidden flex items-center justify-center text-center"
    >
      <!-- Video Background -->
      <div class="absolute inset-0 select-none">
        <video
          autoplay
          muted
          loop
          playsinline
          class="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4"
            type="video/mp4"
          />
        </video>
        <div class="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      <!-- Content -->
      <div class="relative z-20 container mx-auto px-6">
        <div class="max-w-4xl mx-auto space-y-8">
          <h1
            class="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6"
          >
            {{ title() }}
          </h1>
          <p class="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            {{ subtitle() }}
          </p>
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              class="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform"
            >
              Get Started
            </button>
            <button
              class="px-8 py-4 rounded-full border border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-colors"
            >
              View Showreel
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class HeroVideo {
  title = input('Cinematic Experiences');
  subtitle = input(
    'Create immersive web experiences with fullscreen video backgrounds and minimal overlays.'
  );
}
