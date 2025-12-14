import {
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-split-cta',
  imports: [NgOptimizedImage],
  host: {
    class: 'block w-full h-[600px] mb-24',
  },
  template: `
    <section
      #root
      class="w-full h-full flex flex-col md:flex-row relative group"
    >
      <!-- Left Side -->
      <div
        class="cta-side cta-left flex-1 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer"
      >
        <div
          class="relative z-10 text-center p-8 transition-transform duration-500 ease-out group-hover/left:scale-105"
        >
          <h2 class="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Designers
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400">
            Join our creative community
          </p>
          <div
            class="mt-8 opacity-0 translate-y-4 transition-all duration-300 group-hover/left:opacity-100 group-hover/left:translate-y-0"
          >
            <span
              class="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foreground text-background"
              >Get Started -></span
            >
          </div>
        </div>
        <!-- BG Image -->
        <img
          ngSrc="https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=800"
          fill
          class="object-cover opacity-0 grayscale transition-all duration-700 ease-out group-hover/left:opacity-30 group-hover/left:grayscale-0 group-hover/left:scale-110"
          alt="Designers"
        />
      </div>

      <!-- Right Side -->
      <div
        class="cta-side cta-right flex-1 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center cursor-pointer"
      >
        <div
          class="relative z-10 text-center p-8 transition-transform duration-500 ease-out group-hover/right:scale-105"
        >
          <h2 class="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Developers
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400">
            Contribute to the codebase
          </p>
          <div
            class="mt-8 opacity-0 translate-y-4 transition-all duration-300 group-hover/right:opacity-100 group-hover/right:translate-y-0"
          >
            <span
              class="inline-flex items-center justify-center px-6 py-3 rounded-full border border-zinc-900 dark:border-white text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >Documentation -></span
            >
          </div>
        </div>
        <!-- BG Image -->
        <img
          ngSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"
          fill
          class="object-cover opacity-0 grayscale transition-all duration-700 ease-out group-hover/right:opacity-30 group-hover/right:grayscale-0 group-hover/right:scale-110"
          alt="Developers"
        />
      </div>

      <!-- Center Divider/Icon -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 bg-card rounded-full shadow-xl flex items-center justify-center z-20 pointer-events-none"
      >
        <span class="font-bold text-xl">&</span>
      </div>
    </section>
  `,
  styles: [
    `
      /* Using Utility classes + group-hover modifiers logic for simple hover. 
       GSAP could be used for more complex morphing if needed, but CSS is performant here. */
      :host {
        display: block;
      }
    `,
  ],
})
export default class SplitCta implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');

    // Optional: Add some GSAP spring physics to the center bubble on hover?
    const el = this.root().nativeElement;
    const sides = el.querySelectorAll('.cta-side');
    const bubble = el.querySelector('.absolute');

    sides.forEach((side) => {
      side.addEventListener('mouseenter', () => {
        gsap.to(bubble, { scale: 1.2, duration: 0.4, ease: 'back.out(1.7)' });
      });
      side.addEventListener('mouseleave', () => {
        gsap.to(bubble, { scale: 1, duration: 0.4 });
      });
    });
  }
}
