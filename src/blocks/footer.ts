import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'bk-footer',
  imports: [NgOptimizedImage],
  host: {
    class: 'relative isolate overflow-hidden block',
  },
  template: `
    <section
      #root
      class="relative min-h-[72vh] grid items-center py-16 md:py-24"
    >
      <div
        class="container mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center"
      >
        <!-- Text -->
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs md:text-sm"
          >
            <span>★</span>
            <span>{{ badge() }}</span>
          </div>

          <h1 class="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500"
            >
              {{ title() }}
            </span>
          </h1>

          <p
            class="mt-4 text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-prose"
          >
            {{ subtitle() }}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a
              class="hero-cta inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium ring-1 ring-transparent
                 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 transition hover:opacity-90"
              [href]="primaryHref()"
              >{{ primaryText() }}</a
            >

            <a
              class="hero-cta inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium ring-1 ring-zinc-300 dark:ring-zinc-700
                 bg-transparent transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              [href]="secondaryHref()"
              >{{ secondaryText() }}</a
            >
          </div>
        </div>

        <!-- Visual -->
        <div class="relative">
          <div
            class="hero-card relative rounded-3xl shadow-xl ring-1 ring-black/10 backdrop-blur-sm
                  bg-gradient-to-br from-white/70 to-white/40 dark:from-zinc-900/50 dark:to-zinc-900/30 p-4 md:p-6"
          >
            <img
              ngSrc="{{ imageSrc() }}"
              width="1024"
              height="768"
              class="rounded-2xl object-cover w-full h-auto"
              alt="{{ imageAlt() }}"
              priority
            />
            <div
              class="pointer-events-none absolute inset-0 rounded-3xl [mask-image:radial-gradient(transparent,black)]"
            ></div>
          </div>

          <!-- floating shapes -->
          <div
            class="floating floating-a absolute -top-6 -right-6 size-24 rounded-full blur-2xl opacity-60
                  bg-gradient-to-tr from-emerald-400/60 to-cyan-400/60"
          ></div>
          <div
            class="floating floating-b absolute -bottom-6 -left-6 size-24 rounded-full blur-2xl opacity-60
                  bg-gradient-to-tr from-fuchsia-400/60 to-purple-400/60"
          ></div>
        </div>
      </div>

      <!-- background accent -->
      <div
        class="pointer-events-none absolute -z-10 inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.emerald.500/10),transparent)]"
      ></div>
    </section>
  `,
})
export default class BKFooter {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');

  // Inputs (signals)
  title = input<string>('Build faster with Angular + Tailwind');
  subtitle = input<string>(
    'A modern hero block animated with GSAP. Clean, accessible, and easy to customize.'
  );
  badge = input<string>('New');
  primaryText = input<string>('Get started');
  primaryHref = input<string>('#');
  secondaryText = input<string>('Learn more');
  secondaryHref = input<string>('#');
  imageSrc = input<string>(
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop'
  );
  imageAlt = input<string>('Dashboard preview');

  // Lazy gsap reference
  private gsap: any | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const gsapMod = await import('gsap');
    this.gsap = gsapMod.default;

    this.runIntroTimeline();
    this.runFloatingLoop();
  }

  private runIntroTimeline() {
    if (!this.gsap) return;
    const el = this.root()?.nativeElement;
    if (!el) return;

    const tl = this.gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.9 },
    });
    tl.from(el.querySelector('.inline-flex'), { y: 20, autoAlpha: 0 })
      .from(el.querySelector('h1'), { y: 30, autoAlpha: 0 }, '-=0.6')
      .from(el.querySelector('p'), { y: 20, autoAlpha: 0 }, '-=0.6')
      .from(
        el.querySelectorAll('.hero-cta'),
        { y: 14, autoAlpha: 0, stagger: 0.08 },
        '-=0.6'
      )
      .from(
        el.querySelector('.hero-card'),
        { y: 30, rotateX: 6, autoAlpha: 0 },
        '-=0.6'
      )
      .from(
        el.querySelectorAll('.floating'),
        { scale: 0.6, autoAlpha: 0, stagger: 0.1 },
        '-=0.7'
      );
  }

  private runFloatingLoop() {
    if (!this.gsap) return;
    const el = this.root()?.nativeElement;
    if (!el) return;

    this.gsap.to(el.querySelector('.floating-a'), {
      y: -12,
      x: 8,
      repeat: -1,
      yoyo: true,
      duration: 3.5,
      ease: 'sine.inOut',
    });
    this.gsap.to(el.querySelector('.floating-b'), {
      y: 10,
      x: -6,
      repeat: -1,
      yoyo: true,
      duration: 4.2,
      ease: 'sine.inOut',
    });
  }
}
