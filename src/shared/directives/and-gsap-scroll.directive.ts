import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import type { gsap } from 'gsap';

@Directive({
  selector: '[andGsapScroll]',
})
export class AndGsapScrollDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** ScrollTrigger options */
  start = input<string>('top bottom');
  end = input<string | undefined>(undefined);
  scrub = input<boolean | number>(1);
  markers = input<boolean | undefined>(undefined);
  pin = input<boolean | undefined>(undefined);
  /** Element (or selector) that owns the scrollbar; defaults to the window */
  scroller = input<HTMLElement | string | undefined>(undefined);

  /** Simple API: animate the host element */
  from = input<gsap.TweenVars | undefined>(undefined);
  to = input<gsap.TweenVars | undefined>(undefined);

  /** Advanced API: build your own timeline */
  timeline = input<
    ((tl: gsap.core.Timeline, el: HTMLElement) => void) | undefined
  >(undefined);

  private tl: gsap.core.Timeline | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const host = this.el.nativeElement;
    const from = this.from();
    const to = this.to();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Land directly on the resting state instead of animating on scroll.
      if (to) {
        const { gsap } = await import('gsap');
        gsap.set(host, to);
      }
      return;
    }

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: host,
        scroller: this.scroller(),
        start: this.start(),
        end: this.end(),
        scrub: this.scrub(),
        markers: this.markers(),
        pin: this.pin(),
      },
    });

    const buildTimeline = this.timeline();
    if (buildTimeline) {
      buildTimeline(this.tl, host);
    } else {
      if (from) this.tl.from(host, from);
      if (to) this.tl.to(host, to);
    }
  }

  ngOnDestroy(): void {
    this.tl?.scrollTrigger?.kill();
    this.tl?.kill();
    this.tl = null;
  }
}
