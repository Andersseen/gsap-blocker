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

interface StickyCard {
  id: number;
  icon: string;
  title: string;
  body: string;
  theme: 'dark' | 'light' | 'blue';
}

const CARDS: StickyCard[] = [
  {
    id: 1,
    icon: '📅',
    title: 'A new type of Calendar',
    body: 'Plan, schedule and collaborate without the clutter of traditional calendar apps.',
    theme: 'dark',
  },
  {
    id: 2,
    icon: '🛡️',
    title: '#1 in data privacy',
    body: 'Your data stays yours. End-to-end encryption and zero-knowledge architecture by default.',
    theme: 'light',
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Designed for teams',
    body: 'Built from the ground up for async collaboration, stand-ups and sprint planning.',
    theme: 'blue',
  },
];

@Component({
  selector: 'app-sticky-cards-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="sticky-cards-viewport relative h-[28rem] w-full overflow-y-auto rounded-2xl border border-border bg-card/50"
      [class.reduced-motion]="reducedMotion()"
    >
      <div class="sticky-cards-track relative min-h-[400%] w-full">
        @for (card of cards; track card.id) {
          <div
            class="sticky-card absolute inset-0 flex items-center justify-center p-6 md:p-10"
            [class.theme-dark]="card.theme === 'dark'"
            [class.theme-light]="card.theme === 'light'"
            [class.theme-blue]="card.theme === 'blue'"
            [attr.aria-label]="card.title"
          >
            <div
              class="card-inner flex h-full max-h-[24rem] w-full max-w-2xl flex-col items-center justify-center rounded-3xl border p-8 text-center shadow-2xl md:p-12"
            >
              <span
                class="mb-6 inline-flex size-14 items-center justify-center rounded-2xl text-3xl"
                aria-hidden="true"
              >
                {{ card.icon }}
              </span>
              <h3
                class="max-w-lg text-3xl font-black tracking-tighter md:text-5xl"
              >
                {{ card.title }}
              </h3>
              <p class="mt-4 max-w-md text-base opacity-80">{{ card.body }}</p>
              <button
                type="button"
                class="mt-8 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              >
                Learn more
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .sticky-cards-viewport {
      scroll-behavior: smooth;
    }

    .sticky-card {
      /* Cards start visible in normal flow; GSAP handles the stacking motion. */
    }

    .sticky-cards-viewport.reduced-motion .sticky-card {
      position: relative;
      inset: auto;
      margin-bottom: 1rem;
    }

    .theme-dark .card-inner {
      background: #0a0a0a;
      border-color: #27272a;
      color: #fafafa;
    }

    .theme-dark .card-inner button {
      background: #fafafa;
      color: #0a0a0a;
    }

    .theme-light .card-inner {
      background: #ffffff;
      border-color: #e4e4e7;
      color: #18181b;
    }

    .theme-light .card-inner button {
      background: #18181b;
      color: #fafafa;
    }

    .theme-blue .card-inner {
      background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
      border-color: #1d4ed8;
      color: #ffffff;
    }

    .theme-blue .card-inner button {
      background: #ffffff;
      color: #172554;
    }
  `,
})
export default class StickyCardsDemo implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  cards = CARDS;
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
      '.sticky-cards-viewport'
    ) as HTMLElement;
    const track = this.el.nativeElement.querySelector(
      '.sticky-cards-track'
    ) as HTMLElement;
    const cardEls = Array.from(
      this.el.nativeElement.querySelectorAll('.sticky-card')
    ) as HTMLElement[];

    if (!viewport || !track || cardEls.length === 0) return;

    // Stack order: later cards on top.
    cardEls.forEach((card, i) => {
      card.style.zIndex = String(i + 1);
    });

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

      // Card 1: visible at start, scales down/fades as card 2 enters.
      tl.fromTo(
        cardEls[0],
        { scale: 1, opacity: 1 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );
      tl.to(cardEls[0], { scale: 0.9, opacity: 0.35, ease: 'none' }, 0.25);
      tl.to(cardEls[0], { opacity: 0, ease: 'none' }, 0.42);

      // Card 2: slides up over card 1, then scales down as card 3 enters.
      tl.fromTo(
        cardEls[1],
        { yPercent: 100, opacity: 0, scale: 0.92 },
        { yPercent: 0, opacity: 1, scale: 1, ease: 'none' },
        0.2
      );
      tl.to(cardEls[1], { scale: 0.9, opacity: 0.35, ease: 'none' }, 0.58);
      tl.to(cardEls[1], { opacity: 0, ease: 'none' }, 0.75);

      // Card 3: slides up and stays visible until the end.
      tl.fromTo(
        cardEls[2],
        { yPercent: 100, opacity: 0, scale: 0.92 },
        { yPercent: 0, opacity: 1, scale: 1, ease: 'none' },
        0.55
      );
    }, this.el.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.ctx?.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });
  }
}
