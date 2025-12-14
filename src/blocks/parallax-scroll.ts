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
  selector: 'app-parallax-scroll',
  imports: [NgOptimizedImage],
  host: {
    class: 'block w-full overflow-hidden bg-white dark:bg-zinc-950 py-32',
  },
  template: `
    <section #root class="max-w-7xl mx-auto px-6">
      <div
        class="flex flex-col md:flex-row items-start justify-between mb-24 gap-12"
      >
        <h2
          class="text-4xl md:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white max-w-2xl"
        >
          Visual storytelling made simple.
        </h2>
        <div class="max-w-sm">
          <p class="text-zinc-600 dark:text-zinc-400 text-lg mb-8">
            Scroll to explore our gallery. The images move at different speeds
            to create a sense of depth and immersion.
          </p>
          <button
            class="px-6 py-3 rounded-full border border-zinc-900 dark:border-white text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors"
          >
            Explore Details
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[100vh]">
        <!-- Col 1 -->
        <div class="md:col-span-5 flex flex-col gap-12 pt-12 md:pt-0">
          <div
            class="parallax-item bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden aspect-[4/5] relative"
          >
            <img
              ngSrc="https://images.unsplash.com/photo-1549411989-bd7885b59a60?q=80&w=800"
              fill
              class="object-cover"
              alt="Art 1"
            />
          </div>
          <div
            class="parallax-item bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden aspect-square relative"
            data-speed="1.2"
          >
            <img
              ngSrc="https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=800"
              fill
              class="object-cover"
              alt="Art 2"
            />
          </div>
        </div>

        <!-- Col 2 -->
        <div class="md:col-span-1"></div>

        <!-- Col 3 -->
        <div class="md:col-span-6 flex flex-col gap-12 pt-0 md:pt-32">
          <div
            class="parallax-item bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden aspect-[3/2] relative"
            data-speed="0.8"
          >
            <img
              ngSrc="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800"
              fill
              class="object-cover"
              alt="Art 3"
            />
          </div>
          <div
            class="parallax-item bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden aspect-[4/5] relative"
          >
            <img
              ngSrc="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800"
              fill
              class="object-cover"
              alt="Art 4"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class ParallaxScroll implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const el = this.root().nativeElement;
    const items = el.querySelectorAll('.parallax-item');

    items.forEach((item: any) => {
      const speed = parseFloat(item.getAttribute('data-speed') || '1');

      gsap.to(item, {
        y: -100 * speed, // Move up as we scroll down
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });
  }
}
