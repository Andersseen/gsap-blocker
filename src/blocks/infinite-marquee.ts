import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-infinite-marquee',
  host: {
    class: 'block w-full overflow-hidden bg-zinc-900 text-white py-24',
  },
  template: `
    <section #root class="w-full">
      <div class="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p
          class="text-sm font-semibold uppercase tracking-widest text-zinc-500"
        >
          Trusted by top companies
        </p>
      </div>

      <div class="marquee-wrapper flex overflow-hidden w-full mask-gradient">
        <div class="marquee-track flex gap-12 items-center flex-nowrap py-4">
          @for (item of items; track $index) {
          <div
            class="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer whitespace-nowrap"
          >
            <span class="text-3xl md:text-4xl font-bold tracking-tight">{{
              item.name
            }}</span>
          </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .mask-gradient {
        mask-image: linear-gradient(
          to right,
          transparent,
          black 10%,
          black 90%,
          transparent
        );
      }
    `,
  ],
})
export default class InfiniteMarquee implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  readonly logos = [
    { name: 'Acme Corp' },
    { name: 'Globex' },
    { name: 'Soylent' },
    { name: 'Initech' },
    { name: 'Umbrella' },
    { name: 'Cyberdyne' },
    { name: 'Massive Dynamic' },
    { name: 'Stark Ind' },
    { name: 'Wayne Ent' },
  ];

  // duplicate logos to ensure seamless loop
  readonly items = [...this.logos, ...this.logos, ...this.logos];

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');

    const el = this.root().nativeElement;
    const track = el.querySelector('.marquee-track');

    if (!track) return;

    const oneSetCount = this.logos.length;
    // We just scroll endlessly.
    // For a truly seamless loop we often use the modifiers plugin or duplicate content enough to fill screen + scroll.

    const wrapperWidth = track.scrollWidth;
    const duration = 20;

    gsap.to(track, {
      x: -(wrapperWidth / 3), // Move by 1/3 (one set)
      duration: duration,
      ease: 'none',
      repeat: -1,
    });
  }
}
