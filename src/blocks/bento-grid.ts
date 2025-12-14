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
  selector: 'app-bento-grid',
  imports: [NgOptimizedImage],
  host: {
    class: 'block w-full bg-zinc-50 dark:bg-zinc-950 py-24',
  },
  template: `
    <section #root class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="mb-16 max-w-2xl">
        <h2
          class="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 reveal-header opacity-0"
        >
          {{ title() }}
        </h2>
        <p
          class="text-lg text-zinc-600 dark:text-zinc-400 reveal-header opacity-0"
        >
          {{ description() }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        <!-- Large Item -->
        <div
          class="bento-item md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-0"
        >
          <div class="absolute inset-0 p-8 flex flex-col justify-between z-10">
            <div>
              <div
                class="size-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400"
              >
                <svg
                  class="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3
                class="text-2xl font-semibold text-zinc-900 dark:text-white mb-2"
              >
                Instant Performance
              </h3>
              <p class="text-zinc-600 dark:text-zinc-400">
                Optimized for speed with zero configuration.
              </p>
            </div>
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-zinc-900 z-0"
          ></div>
          <img
            ngSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
            width="800"
            height="600"
            class="absolute right-0 top-1/2 -translate-y-1/2 w-2/3 h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 ease-out"
            alt="Performance"
          />
        </div>

        <!-- Tall Item -->
        <div
          class="bento-item md:row-span-2 relative group overflow-hidden rounded-3xl bg-zinc-900 dark:bg-white border border-zinc-200 dark:border-zinc-800 opacity-0 text-white dark:text-zinc-900"
        >
          <div class="absolute inset-0 p-8 flex flex-col z-10">
            <h3 class="text-xl font-semibold mb-2">Dark Mode First</h3>
            <p class="text-zinc-400 dark:text-zinc-600 text-sm">
              Seamless switching between themes.
            </p>
            <div
              class="mt-auto relative h-40 w-full rounded-xl bg-zinc-800 dark:bg-zinc-100 overflow-hidden"
            >
              <div
                class="absolute inset-2 rounded-lg bg-zinc-700 dark:bg-zinc-200"
              ></div>
            </div>
          </div>
        </div>

        <!-- Standard Item -->
        <div
          class="bento-item relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-0 p-8"
        >
          <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Security
          </h3>
          <p class="text-zinc-600 dark:text-zinc-400 text-sm">
            Enterprise-grade protection out of the box.
          </p>
        </div>

        <!-- Standard Item -->
        <div
          class="bento-item relative group overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-transparent opacity-0 p-8 text-white"
        >
          <h3 class="text-lg font-semibold mb-2">Scalable</h3>
          <p class="text-purple-100 text-sm">Grow without limits.</p>
        </div>
      </div>
    </section>
  `,
})
export default class BentoGrid implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  readonly title = input('Everything you need');
  readonly description = input(
    'A collection of powerful features packed into a beautiful, responsive grid layout designed to convert.'
  );

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const el = this.root().nativeElement;

    // Header reveal
    gsap.to(el.querySelectorAll('.reveal-header'), {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
      startAt: { y: 30, autoAlpha: 0 },
    });

    // Grid items reveal
    gsap.fromTo(
      el.querySelectorAll('.bento-item'),
      { autoAlpha: 0, scale: 0.95, y: 20 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el.querySelector('.grid'),
          start: 'top 85%',
        },
      }
    );
  }
}
