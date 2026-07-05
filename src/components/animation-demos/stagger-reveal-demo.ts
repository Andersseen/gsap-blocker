import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import type { gsap } from 'gsap';

interface StaggerItem {
  id: number;
  label: string;
  emoji: string;
}

const ITEMS: StaggerItem[] = [
  { id: 1, label: 'Design', emoji: '🎨' },
  { id: 2, label: 'Build', emoji: '🛠️' },
  { id: 3, label: 'Animate', emoji: '✨' },
  { id: 4, label: 'Test', emoji: '🧪' },
  { id: 5, label: 'Ship', emoji: '🚀' },
  { id: 6, label: 'Measure', emoji: '📈' },
];

@Component({
  selector: 'app-stagger-reveal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-2xl">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        @for (item of items(); track item.id) {
          <div
            #item
            class="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center"
          >
            <span class="text-3xl" aria-hidden="true">{{ item.emoji }}</span>
            <span class="text-sm font-semibold text-foreground">{{
              item.label
            }}</span>
          </div>
        }
      </div>

      <button
        type="button"
        class="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
        (click)="replay()"
      >
        <span aria-hidden="true">↻</span> Replay
      </button>
    </div>
  `,
})
export default class StaggerRevealDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly itemRefs = viewChildren<ElementRef<HTMLElement>>('item');

  private gsapInstance: typeof import('gsap').default | null = null;
  private tween: gsap.core.Tween | null = null;

  items = signal(ITEMS);

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

    const targets = this.itemRefs().map((ref) => ref.nativeElement);
    if (!targets.length) return;

    this.tween?.kill();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.gsapInstance.set(targets, { opacity: 1, y: 0 });
      return;
    }

    this.tween = this.gsapInstance.from(targets, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
    });
  }

  replay() {
    this.play();
  }
}
