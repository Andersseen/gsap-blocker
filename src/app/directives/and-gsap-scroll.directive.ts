import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[andGsapScroll]',
})
export class AndGsapScrollDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);

  /** ScrollTrigger options */
  @Input() start: string = 'top bottom';
  @Input() end?: string;
  @Input() scrub: boolean | number = 1;
  @Input() markers?: boolean;
  @Input() pin?: boolean;

  /** Simple API: animate host element */
  @Input() from?: gsap.TweenVars;
  @Input() to?: gsap.TweenVars;

  /** Advanced API: build your own timeline */
  @Input() timeline?: (tl: gsap.core.Timeline, el: HTMLElement) => void;

  private tl?: gsap.core.Timeline;
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const triggerEl = host;

    if (!triggerEl) return;

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: this.start,
        end: this.end,
        scrub: this.scrub,
        markers: this.markers,
        pin: this.pin,
      },
    });

    if (this.timeline) {
      this.timeline(this.tl, host);
    } else {
      if (this.from) this.tl.from(host, this.from);
      if (this.to) this.tl.to(host, this.to);
    }
  }

  ngOnDestroy(): void {
    this.tl?.scrollTrigger?.kill();
    this.tl?.kill();
  }
}
