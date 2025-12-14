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
  selector: 'app-hero-modern',
  imports: [NgOptimizedImage],
  host: {
    class: 'block w-full overflow-hidden bg-background',
  },
  template: `
    <section
      #root
      class="relative min-h-screen flex flex-col justify-center px-6 md:px-12 py-24"
    >
      <!-- Background Abstract Elements -->
      <div
        class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-50 to-transparent dark:from-zinc-900/20 dark:to-transparent -z-10"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"
      ></div>

      <div
        class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center"
      >
        <!-- Content -->
        <div class="flex flex-col gap-8">
          <div class="overflow-hidden">
            <div
              class="reveal-text text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400"
            >
              {{ badge() }}
            </div>
          </div>

          <h1
            class="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 dark:text-white leading-[0.9]"
          >
            <div class="overflow-hidden">
              <div class="reveal-text">{{ titleLine1() }}</div>
            </div>
            <div class="overflow-hidden">
              <div class="reveal-text text-zinc-400 dark:text-zinc-600">
                {{ titleLine2() }}
              </div>
            </div>
          </h1>

          <p
            class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed opacity-0 reveal-fade"
          >
            {{ description() }}
          </p>

          <div class="flex flex-wrap gap-4 opacity-0 reveal-fade">
            <a
              href="#"
              class="px-8 py-4 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform duration-300"
            >
              {{ primaryCta() }}
            </a>
            <a
              href="#"
              class="px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {{ secondaryCta() }}
            </a>
          </div>
        </div>

        <!-- Visual / Image -->
        <div
          class="relative h-full min-h-[500px] w-full rounded-2xl overflow-hidden reveal-image opacity-0 scale-95 origin-bottom-right"
        >
          <img
            [ngSrc]="imageSrc()"
            width="800"
            height="1000"
            class="object-cover w-full h-full scale-110"
            alt="Hero Visual"
            priority
          />
          <!-- Overlay Text -->
          <div
            class="absolute bottom-8 left-8 right-8 p-6 bg-card/10 backdrop-blur-md border border-border/20 rounded-xl text-white"
          >
            <p class="font-medium text-sm">"{{ quote() }}"</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export default class HeroModern implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  // Inputs
  readonly badge = input('Agentic Design');
  readonly titleLine1 = input('Create');
  readonly titleLine2 = input('Experience');
  readonly description = input(
    'Craft digital experiences that leave a lasting impression using the power of GSAP and Angular Signals.'
  );
  readonly primaryCta = input('Start Building');
  readonly secondaryCta = input('View Showreel');
  readonly imageSrc = input(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop'
  );
  readonly quote = input('Design is intelligence made visible.');

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const { gsap } = await import('gsap');
    const el = this.root().nativeElement;

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.5 },
    });

    // Text Reveal (Staggered)
    tl.from(el.querySelectorAll('.reveal-text'), {
      y: 100,
      stagger: 0.1,
      duration: 1.2,
      skewY: 5,
    });

    // Fade Elements
    tl.to(
      el.querySelectorAll('.reveal-fade'),
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        startAt: { y: 20, autoAlpha: 0 },
      },
      '-=0.8'
    );

    // Image Reveal
    tl.to(
      el.querySelector('.reveal-image'),
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
        ease: 'expo.out',
      },
      '-=1.2'
    );

    // Image Parallax Effect inside container
    tl.to(
      el.querySelector('img'),
      {
        scale: 1,
        duration: 1.5,
        ease: 'expo.out',
      },
      '<'
    );
  }
}
