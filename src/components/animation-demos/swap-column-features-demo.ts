import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { gsap } from 'gsap';

@Component({
  selector: 'app-swap-column-features-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-full max-w-3xl flex-col gap-4">
      <div
        class="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3"
      >
        <span class="text-sm font-medium text-muted-foreground">
          Swap layout with GSAP
        </span>
        <button
          type="button"
          class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
          [attr.aria-pressed]="swapped()"
          (click)="toggleSwap()"
        >
          {{ swapped() ? 'Reset columns' : 'Swap columns' }}
        </button>
      </div>

      <div
        class="swap-stage relative overflow-hidden rounded-3xl border border-border bg-background p-6 md:p-10"
      >
        <div
          class="grid min-h-[16rem] grid-cols-1 items-center gap-6 md:grid-cols-2"
        >
          <!-- Text column -->
          <div class="swap-text space-y-3">
            <h3 class="text-2xl font-black tracking-tighter text-foreground">
              They're all here
            </h3>
            <p class="text-sm leading-relaxed text-muted-foreground">
              Show a part of your product that explains what "They're all here"
              means. Swap the visual and text columns to change the rhythm.
            </p>
            <span
              class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              Angular + GSAP
            </span>
          </div>

          <!-- Visual column -->
          <div
            class="swap-visual rounded-2xl border border-border bg-foreground p-4 text-background shadow-xl"
          >
            <div class="mb-3 flex items-center gap-1.5">
              <span class="size-3 rounded-full bg-red-400"></span>
              <span class="size-3 rounded-full bg-yellow-400"></span>
              <span class="size-3 rounded-full bg-green-400"></span>
            </div>
            <pre
              class="overflow-x-auto text-xs font-mono leading-relaxed opacity-90"
            ><code>gsap.to(el, &#123;
  xPercent: -100,
  duration: 0.6,
  ease: 'power3.out'
&#125;);</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .swap-text,
    .swap-visual {
      will-change: transform, opacity;
    }
  `,
})
export default class SwapColumnFeaturesDemo {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  swapped = signal(false);
  private reducedMotion = false;
  private gsapInstance: typeof import('gsap').default | null = null;
  private activeTimeline: gsap.core.Timeline | null = null;
  private firstEffect = true;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.reducedMotion = matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    effect(() => {
      const isSwapped = this.swapped();
      void this.animate(isSwapped);
    });

    this.destroyRef.onDestroy(() => {
      this.activeTimeline?.kill();
      if (this.gsapInstance) {
        const textCol = this.el.nativeElement.querySelector('.swap-text');
        const visualCol = this.el.nativeElement.querySelector('.swap-visual');
        if (textCol && visualCol) {
          this.gsapInstance.killTweensOf([textCol, visualCol]);
        }
      }
    });
  }

  private async animate(isSwapped: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Skip animation on initial render so the demo loads in its resting state.
    if (this.firstEffect) {
      this.firstEffect = false;
      return;
    }

    if (!this.gsapInstance) {
      const mod = await import('gsap');
      this.gsapInstance = mod.default;
    }

    const gsap = this.gsapInstance;
    const textCol = this.el.nativeElement.querySelector(
      '.swap-text'
    ) as HTMLElement;
    const visualCol = this.el.nativeElement.querySelector(
      '.swap-visual'
    ) as HTMLElement;

    if (!textCol || !visualCol) return;

    this.activeTimeline?.kill();
    gsap.killTweensOf([textCol, visualCol]);

    if (this.reducedMotion) {
      gsap.set([textCol, visualCol], { clearProps: 'all' });
      textCol.style.order = isSwapped ? '2' : '1';
      visualCol.style.order = isSwapped ? '1' : '2';
      return;
    }

    const xMove = 100;
    const duration = 0.7;
    const ease = 'power3.inOut';

    const tl = gsap.timeline({ defaults: { ease } });
    this.activeTimeline = tl;

    const textOut = isSwapped ? xMove : -xMove;
    const visualOut = isSwapped ? -xMove : xMove;

    tl.to(
      textCol,
      { xPercent: textOut, opacity: 0.5, scale: 0.96, duration },
      0
    );
    tl.to(
      visualCol,
      { xPercent: visualOut, opacity: 0.5, scale: 0.96, duration },
      0
    );
    tl.set(textCol, { order: isSwapped ? 2 : 1 });
    tl.set(visualCol, { order: isSwapped ? 1 : 2 });
    tl.fromTo(
      textCol,
      { xPercent: -textOut, opacity: 0.5, scale: 0.96 },
      { xPercent: 0, opacity: 1, scale: 1, duration }
    );
    tl.fromTo(
      visualCol,
      { xPercent: -visualOut, opacity: 0.5, scale: 0.96 },
      { xPercent: 0, opacity: 1, scale: 1, duration },
      '<'
    );
  }

  toggleSwap() {
    this.swapped.update((v) => !v);
  }
}
