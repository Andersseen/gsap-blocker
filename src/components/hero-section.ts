import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'hero-section',
  template: `
    <section
      #root
      class="relative min-h-[78vh] grid items-center py-20 md:py-28"
    >
      <!-- Background grid + glow -->
      <div aria-hidden="true" class="absolute inset-0 -z-10">
        <!-- subtle grid -->
        <div class="absolute inset-0 opacity-[0.08]"></div>
        <!-- radial glow -->
        <div class="absolute inset-0"></div>
        <!-- floating blobs (no images) -->
        <div
          class="blob-a absolute -top-16 -left-10 h-56 w-56 rounded-full blur-3xl opacity-50 "
        ></div>
        <div
          class="blob-b absolute -bottom-20 -right-10 h-64 w-64 rounded-full blur-3xl opacity-40"
        ></div>
        <!-- scanning beam -->
        <div
          class="beam absolute top-0 left-1/2 -translate-x-1/2 h-[140%] w-[28%] rotate-12 blur-3xl opacity-0 pointer-events-none"
        ></div>
      </div>

      <div class="container mx-auto px-6 md:px-8">
        <div class="max-w-3xl">
          <div
            class="hero-badge inline-flex items-center gap-2 rounded-full bg-foreground/20 p-4 py-1 text-xs md:text-sm backdrop-blur"
          >
            <span class="inline-block size-1.5 rounded-full bg-primary"></span>
            <span>{{ badge() }}</span>
          </div>

          <h1
            class="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            <span>Build landing pages </span>
            <span
              class="bg-clip-text text-transparent bg-[linear-gradient(90deg,theme(colors.emerald.400),theme(colors.cyan.400),theme(colors.fuchsia.400))] [background-size:200%] animate-none"
            >
              {{ highlight() }}
            </span>
            <span> with Angular + Tailwind</span>
          </h1>

          <p class="mt-4 text-base md:text-lg max-w-prose">
            {{ subtitle() }}
          </p>

          <div class="hero-ctas mt-8 flex flex-wrap gap-3">
            <a
              class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium ring-1 ring-transparent"
              [href]="primaryHref()"
              >{{ primaryText() }}</a
            >

            <a
              class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium ring-1"
              [href]="secondaryHref()"
              >{{ secondaryText() }}</a
            >
          </div>

          <!-- quick points (text-only) -->
          <ul class="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
            <li
              class="stat flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <span class="inline-block size-1.5 rounded-full"></span>
              <span class="text-sm">SSR-safe animations</span>
            </li>
            <li
              class="stat flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <span
                class="inline-block size-1.5 rounded-full bg-emerald-500"
              ></span>
              <span class="text-sm">Zero images, pure CSS glow</span>
            </li>
            <li
              class="stat flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <span class="inline-block size-1.5 rounded-full"></span>
              <span class="text-sm">Accessible & responsive</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export default class HeroSection {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private gsap: any | null = null;

  // Inputs
  badge = input<string>('New');
  highlight = input<string>('ridiculously fast');
  subtitle = input<string>(
    'Animated, accessible, and ready to ship. No images needed—just gradients, glow, and GSAP.'
  );
  primaryText = input<string>('Get started');
  primaryHref = input<string>('#');
  secondaryText = input<string>('Browse blocks');
  secondaryHref = input<string>('#');

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.default;

    const el = this.root()?.nativeElement;
    if (!el) return;

    // Intro reveal
    const tl = this.gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.9 },
    });
    tl.from(el.querySelector('.hero-badge'), { y: 16, autoAlpha: 0 })
      .from(el.querySelector('h1'), { y: 24, autoAlpha: 0 }, '-=0.6')
      .from(el.querySelector('p'), { y: 18, autoAlpha: 0 }, '-=0.6')
      .from(
        el.querySelectorAll('.hero-ctas a'),
        { y: 14, autoAlpha: 0, stagger: 0.08 },
        '-=0.6'
      )
      .from(
        el.querySelectorAll('.stat'),
        { y: 12, autoAlpha: 0, stagger: 0.06 },
        '-=0.5'
      );

    // Floating blobs loop
    this.gsap.to(el.querySelector('.blob-a'), {
      y: -14,
      x: 10,
      repeat: -1,
      yoyo: true,
      duration: 4,
      ease: 'sine.inOut',
    });
    this.gsap.to(el.querySelector('.blob-b'), {
      y: 12,
      x: -8,
      repeat: -1,
      yoyo: true,
      duration: 4.6,
      ease: 'sine.inOut',
    });

    // Scanning beam sweep loop
    const beam = el.querySelector('.beam');
    if (beam) {
      this.gsap.set(beam, { opacity: 1 });
      const sweep = () =>
        this.gsap
          .fromTo(
            beam,
            { xPercent: -120 },
            { xPercent: 120, duration: 3.5, ease: 'power1.inOut' }
          )
          .then(() =>
            this.gsap.to(beam, {
              opacity: 0.6,
              duration: 0.6,
              yoyo: true,
              repeat: 1,
            })
          );
      sweep();
      setInterval(sweep, 5500);
    }

    // Subtle gradient text shimmer (no keyframes, GSAP controlled)
    const gradientSpan = el.querySelector(
      'h1 span:nth-child(2)'
    ) as HTMLElement | null;
    if (gradientSpan) {
      this.gsap.to(gradientSpan, {
        backgroundPositionX: '200%',
        repeat: -1,
        duration: 6,
        ease: 'none',
      });
    }
  }
}
