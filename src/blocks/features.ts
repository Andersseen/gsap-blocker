import {
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

type Slide = { src: string; alt: string; caption?: string };

@Component({
  selector: 'features',
  imports: [NgOptimizedImage],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block select-none',
  },
  template: `
    <section #root class="relative">
      <div
        #viewport
        class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
        (mouseenter)="pause()"
        (mouseleave)="resume()"
        aria-roledescription="carousel"
        [attr.aria-label]="label()"
      >
        <div #track class="flex will-change-transform">
          @for (s of slides(); track s.src) {
          <figure class="w-full shrink-0 relative">
            <img
              ngSrc="{{ s.src }}"
              width="1600"
              height="900"
              class="block w-full h-auto object-cover"
              alt="{{ s.alt }}"
              priority
            />
            @if (s.caption) {
            <figcaption
              class="absolute bottom-3 left-3 text-xs px-2 py-1 rounded bg-black/60 text-white"
            >
              {{ s.caption }}
            </figcaption>
            }
          </figure>
          }
        </div>
      </div>

      <!-- Controls -->
      <button
        type="button"
        class="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-9 bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-700 shadow"
        aria-label="Previous slide"
        (click)="prev()"
      >
        ‹
      </button>
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-9 bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-700 shadow"
        aria-label="Next slide"
        (click)="next()"
      >
        ›
      </button>

      <!-- Dots -->
      <div class="mt-3 flex items-center justify-center gap-2">
        @for (i of dotIndexes(); track i) {
        <button
          type="button"
          class="size-2.5 rounded-full transition"
          [class.bg-zinc-900]="index() === i"
          [class.dark:bg-white]="index() === i"
          [class.bg-zinc-300]="index() !== i"
          [class.dark:bg-zinc-600]="index() !== i"
          [attr.aria-label]="'Go to slide ' + (i + 1)"
          (click)="goTo(i)"
        ></button>
        }
      </div>
    </section>
  `,
})
export default class Features {
  private readonly platformId = inject(PLATFORM_ID);

  // Inputs
  slides = input<Slide[]>([
    {
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
      alt: 'Team working',
      caption: 'Team',
    },
    {
      src: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop',
      alt: 'Laptop on desk',
      caption: 'Workspace',
    },
    {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop',
      alt: 'Code on screen',
      caption: 'Code',
    },
  ]);
  autoplay = input<boolean>(true);
  interval = input<number>(3500);
  loop = input<boolean>(true);
  label = input<string>('Showcase carousel');

  // State
  private viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private track = viewChild<ElementRef<HTMLElement>>('track');
  private root = viewChild<ElementRef<HTMLElement>>('root');
  index = signal(0);
  length = computed(() => this.slides().length);
  dotIndexes = computed(() =>
    Array.from({ length: this.length() }, (_, i) => i)
  );

  private width = 0;
  private ro?: ResizeObserver;
  private timer?: any;
  private gsap: any | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.default;

    const vp = this.viewport()?.nativeElement;
    if (!vp) return;

    // Track width via ResizeObserver
    this.ro = new ResizeObserver(() => {
      this.width = vp.clientWidth;
      this.snapTo(this.index(), 0); // keep alignment on resize
    });
    this.ro.observe(vp);

    // Initial
    this.width = vp.clientWidth;
    this.snapTo(0, 0);

    if (this.autoplay()) this.startTimer();
  }

  private startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.next(), this.interval());
  }
  private stopTimer() {
    if (this.timer) clearInterval(this.timer);
  }
  pause() {
    this.stopTimer();
  }
  resume() {
    if (this.autoplay()) this.startTimer();
  }

  next() {
    const next = this.index() + 1;
    if (next >= this.length()) {
      if (!this.loop()) return this.goTo(0);
      return this.goTo(0);
    }
    this.goTo(next);
  }
  prev() {
    const prev = this.index() - 1;
    if (prev < 0) {
      if (!this.loop()) return this.goTo(this.length() - 1);
      return this.goTo(this.length() - 1);
    }
    this.goTo(prev);
  }

  goTo(i: number) {
    if (i < 0 || i >= this.length()) return;
    this.index.set(i);
    this.snapTo(i, 0.6);
  }

  private snapTo(i: number, duration = 0.6) {
    if (!this.gsap) return;
    const track = this.track()?.nativeElement;
    if (!track) return;
    const x = -i * this.width;
    this.gsap.to(track, {
      x,
      duration,
      ease: 'power3.out',
    });
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.stopTimer();
  }
}
