import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { gsap } from 'gsap';

@Component({
  selector: 'app-disappearing-features-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="disappearing-viewport relative h-[28rem] w-full overflow-y-auto rounded-2xl border border-border bg-sky-50 dark:bg-sky-950/30"
      [class.reduced-motion]="reducedMotion()"
    >
      <div
        class="disappearing-track relative min-h-[250%] w-full px-6 py-10 md:px-10"
      >
        <div
          class="grid min-h-[24rem] grid-cols-1 gap-8 md:grid-cols-2 md:items-center"
        >
          <!-- Left column -->
          <div class="disappearing-text space-y-4">
            <span
              class="inline-flex items-center rounded-full border border-violet-300 bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
            >
              Features
            </span>
            <h2
              class="text-3xl font-black tracking-tighter text-foreground md:text-4xl"
            >
              Learn and grow with Angular motion
            </h2>
            <p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Build scroll-driven experiences that feel premium without
              sacrificing accessibility or performance.
            </p>
          </div>

          <!-- Right column -->
          <div class="relative h-64 md:h-80">
            <div
              class="disappearing-panel-top absolute inset-x-0 top-0 z-10 rounded-2xl border border-border bg-background p-5 shadow-lg"
            >
              <div class="mb-3 h-2 w-16 rounded-full bg-primary/30"></div>
              <p class="text-sm text-muted-foreground">
                Top panel fades away as the section scrolls.
              </p>
            </div>
            <div
              class="disappearing-panel-bottom absolute inset-x-0 bottom-0 z-20 rounded-2xl border border-border bg-foreground p-5 text-background shadow-xl"
            >
              <div class="mb-3 h-2 w-16 rounded-full bg-secondary/50"></div>
              <p class="text-sm opacity-90">
                Bottom panel rises and takes the spotlight.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .disappearing-text,
    .disappearing-panel-top,
    .disappearing-panel-bottom {
      will-change: transform, opacity;
    }

    .disappearing-viewport.reduced-motion .disappearing-text,
    .disappearing-viewport.reduced-motion .disappearing-panel-top,
    .disappearing-viewport.reduced-motion .disappearing-panel-bottom {
      will-change: auto;
      opacity: 1 !important;
      transform: none !important;
    }
  `,
})
export default class DisappearingFeaturesDemo implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  reducedMotion = signal(false);
  private ctx: gsap.Context | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.reducedMotion.set(
      matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    if (this.reducedMotion()) return;

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    const viewport = this.el.nativeElement.querySelector(
      '.disappearing-viewport'
    ) as HTMLElement;
    const track = this.el.nativeElement.querySelector(
      '.disappearing-track'
    ) as HTMLElement;
    const text = this.el.nativeElement.querySelector(
      '.disappearing-text'
    ) as HTMLElement;
    const panelTop = this.el.nativeElement.querySelector(
      '.disappearing-panel-top'
    ) as HTMLElement;
    const panelBottom = this.el.nativeElement.querySelector(
      '.disappearing-panel-bottom'
    ) as HTMLElement;

    if (!viewport || !track || !text || !panelTop || !panelBottom) return;

    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          scroller: viewport,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // Left text drifts up and fades
      tl.fromTo(
        text,
        { y: 0, opacity: 1 },
        { y: -60, opacity: 0.15, ease: 'none' },
        0
      );

      // Top panel fades out
      tl.fromTo(
        panelTop,
        { y: 0, opacity: 1 },
        { y: -30, opacity: 0, ease: 'none' },
        0
      );

      // Bottom panel rises and becomes fully visible
      tl.fromTo(
        panelBottom,
        { y: 60, opacity: 0.4, scale: 0.96 },
        { y: -40, opacity: 1, scale: 1, ease: 'none' },
        0
      );
    }, this.el.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.ctx?.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });
  }
}
