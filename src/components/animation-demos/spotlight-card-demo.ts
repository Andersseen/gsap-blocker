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
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-spotlight-card-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .spotlight {
        --x: 50%;
        --y: 50%;
        background: radial-gradient(
          320px circle at var(--x) var(--y),
          color-mix(in srgb, var(--color-primary) 18%, transparent),
          transparent 70%
        );
      }
    `,
  ],
  template: `
    <div
      #card
      class="spotlight relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-10 focus-within:ring-2 focus-within:ring-ring"
    >
      <div class="relative">
        <h3 class="text-xl font-bold text-foreground">Spotlight card</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Move the pointer over this card — the glow follows it, smoothed with
          GSAP.
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
          [attr.aria-pressed]="saved()"
          (click)="saved.set(!saved())"
        >
          <span aria-hidden="true">{{ saved() ? '★' : '☆' }}</span>
          {{ saved() ? 'Saved' : 'Save' }}
        </button>
      </div>
    </div>
  `,
})
export default class SpotlightCardDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cardRef =
    viewChild.required<ElementRef<HTMLElement>>('card');

  private cleanup: (() => void) | null = null;

  saved = signal(false);

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => this.cleanup?.());
  }

  private async setup() {
    if (!isPlatformBrowser(this.platformId)) return;

    const card = this.cardRef().nativeElement;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
      return;
    }

    const { gsap } = await import('gsap');

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      gsap.to(card, {
        '--x': `${x}%`,
        '--y': `${y}%`,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('pointermove', onMove);

    this.cleanup = () => {
      card.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(card);
    };
  }
}
