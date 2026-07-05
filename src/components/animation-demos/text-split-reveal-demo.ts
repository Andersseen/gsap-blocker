import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import type { gsap } from 'gsap';

@Component({
  selector: 'app-text-split-reveal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-xl text-center">
      <h2
        class="text-3xl md:text-5xl font-black tracking-tight text-foreground"
        [attr.aria-label]="text()"
      >
        @for (word of words(); track $index) {
          <span #word class="inline-block" aria-hidden="true"
            >{{ word }}&nbsp;</span
          >
        }
      </h2>

      <button
        type="button"
        class="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
        (click)="replay()"
      >
        <span aria-hidden="true">↻</span> Replay
      </button>
    </div>
  `,
})
export default class TextSplitRevealDemo {
  text = input('Build motion the Angular way.');
  words = computed(() => this.text().split(' '));

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly wordRefs = viewChildren<ElementRef<HTMLElement>>('word');

  private gsapInstance: typeof import('gsap').default | null = null;
  private tween: gsap.core.Tween | null = null;

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      this.gsapInstance = gsap;
      this.play();
    });

    this.destroyRef.onDestroy(() => this.tween?.kill());
  }

  private play() {
    if (!this.gsapInstance) return;

    const targets = this.wordRefs().map((ref) => ref.nativeElement);
    if (!targets.length) return;

    this.tween?.kill();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.gsapInstance.set(targets, { opacity: 1, y: 0 });
      return;
    }

    this.tween = this.gsapInstance.from(targets, {
      opacity: 0,
      y: '100%',
      duration: 0.7,
      ease: 'power4.out',
      stagger: 0.06,
    });
  }

  replay() {
    this.play();
  }
}
