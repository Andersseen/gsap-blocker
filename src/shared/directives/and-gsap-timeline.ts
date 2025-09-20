// and-gsap-timeline.directive.ts
import {
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  Provider,
  effect,
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AND_GSAP_TIMELINE_CTX,
  AndGsapTimelineApi,
  TweenVars,
} from '@shared/and-gsap-tokens';

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
export class AndGsapTimelineDirective implements AndGsapTimelineApi {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  private gsap: any | null = null;
  private tl: any | null = null;
  private pending: Array<{
    el: HTMLElement;
    vars: TweenVars;
    at?: string | number;
  }> = [];

  defaults = input<Record<string, unknown>>({});
  paused = input<boolean>(false); // <— señal de input

  constructor() {
    // Reacciona a cambios en `paused`
    effect(() => {
      console.log(this.tl);

      if (!this.tl) return;
      const p = this.paused();
      console.log(p);

      if (p) this.tl.pause();
      else this.tl.play();
    });
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.gsap ?? mod.default ?? mod;

    this.tl = this.gsap.timeline({
      defaults: this.defaults(),
      paused: this.paused(),
    });

    for (const p of this.pending) this.tl.from(p.el, p.vars, p.at as any);
    this.pending = [];
    if (!this.paused()) this.tl.play(0);
  }

  registerFrom(
    target: HTMLElement,
    vars: TweenVars,
    at?: string | number
  ): void {
    if (this.tl) this.tl.from(target, vars, at as any);
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
    this.tl?.seek(t as any);
  }
  timeScale(v: number) {
    this.tl?.timeScale?.(v);
  }

  ngOnDestroy() {
    this.tl?.kill();
    this.tl = null;
  }
}
