// and-gsap-timeline.directive.ts
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  Provider,
} from '@angular/core';
import {
  AND_GSAP_TIMELINE_CTX,
  AndGsapTimelineApi,
  TweenVars,
} from '@shared/and-gsap-tokens';
import { prefersReducedMotion } from '@shared/utils/motion';
import type { gsap } from 'gsap';

@Directive({
  selector: '[andGsapTimeline]',
  exportAs: 'andGsapTimeline',
  providers: [
    {
      provide: AND_GSAP_TIMELINE_CTX,
      useExisting: forwardRef(() => AndGsapTimelineDirective),
    } as Provider,
  ],
})
export class AndGsapTimelineDirective
  implements AndGsapTimelineApi, AfterViewInit, OnDestroy
{
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  private gsap: typeof import('gsap').default | null = null;
  private tl: gsap.core.Timeline | null = null;
  private pending: {
    el: HTMLElement;
    vars: TweenVars;
    at?: string | number;
  }[] = [];

  defaults = input<Record<string, unknown>>({});
  paused = input<boolean>(false); // <— input signal

  constructor() {
    // React to changes on `paused`
    effect(() => {
      if (!this.tl) return;
      const p = this.paused();

      if (p) this.tl.pause();
      else this.tl.play();
    });
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.gsap ?? mod.default ?? mod;

    if (prefersReducedMotion()) return;

    this.tl = this.gsap.timeline({
      defaults: this.defaults(),
      paused: this.paused(),
    });

    for (const p of this.pending)
      this.tl.from(p.el, p.vars, p.at as number | string);
    this.pending = [];
    if (!this.paused()) this.tl.play(0);
  }

  registerFrom(
    target: HTMLElement,
    vars: TweenVars,
    at?: string | number
  ): void {
    if (this.tl) this.tl.from(target, vars, at as number | string);
    else this.pending.push({ el: target, vars, at });
  }

  play() {
    this.tl?.play();
  }
  pause() {
    this.tl?.pause();
  }
  restart() {
    this.tl?.restart();
  }
  reverse() {
    this.tl?.reverse();
  }
  seek(t: number | string) {
    this.tl?.seek(t as number | string);
  }
  timeScale(v: number) {
    this.tl?.timeScale?.(v);
  }

  ngOnDestroy() {
    this.tl?.kill();
    this.tl = null;
  }
}
