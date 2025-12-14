import { Directive, OnDestroy, OnInit, inject, input } from '@angular/core';
import { SmoothScrollService } from '@shared/services/smooth-scroll.service';

@Directive({
  selector: '[smoothScroll]',
  host: {
    style:
      'scroll-behavior:auto; overscroll-behavior-y:none; -webkit-overflow-scrolling:auto',
  },
})
export class SmoothScrollDirective implements OnInit, OnDestroy {
  private readonly smooth = inject(SmoothScrollService);

  lerp = input<number>(0.12);
  wheelMult = input<number>(1);
  touchMult = input<number>(1.1);
  flingGain = input<number>(0.25);
  enabled = input<boolean>(true);

  private abort?: AbortController;
  private resizeObs?: ResizeObserver;
  private mqlReduced?: MediaQueryList;
  private mqlCoarse?: MediaQueryList;

  ngOnInit(): void {
    if (!this.enabled()) return;

    this.smooth.setLerp(this.lerp());
    this.smooth.setWheelMultiplier(this.wheelMult());
    this.smooth.setTouchMultiplier(this.touchMult());
    this.smooth.setFlingGain(this.flingGain());

    this.abort = new AbortController();
    const { signal } = this.abort;

    this.mqlReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.mqlCoarse = window.matchMedia('(pointer: coarse)');
    const updateReduced = () =>
      this.smooth.setReducedMotion(!!this.mqlReduced?.matches);
    const updateCoarse = () => this.smooth.setCoarse(!!this.mqlCoarse?.matches);
    this.mqlReduced.addEventListener('change', updateReduced, { signal });
    this.mqlCoarse.addEventListener('change', updateCoarse, { signal });
    updateReduced();
    updateCoarse();

    this.resizeObs = new ResizeObserver(() => this.smooth.onResize());
    this.resizeObs.observe(document.documentElement);

    window.addEventListener('wheel', this.smooth.onWheel, {
      passive: false,
      signal,
    });
    window.addEventListener('touchstart', this.smooth.onTouchStart, {
      passive: true,
      signal,
    });
    window.addEventListener('touchmove', this.smooth.onTouchMove, {
      passive: false,
      signal,
    });
    window.addEventListener('touchend', this.smooth.onTouchEnd, {
      passive: true,
      signal,
    });
    window.addEventListener('resize', this.smooth.onResize, {
      passive: true,
      signal,
    });
    document.addEventListener('keydown', this.smooth.onKeyDown, { signal });
    document.addEventListener('visibilitychange', this.smooth.onVisibility, {
      signal,
    });

    this.smooth.start();
  }

  ngOnDestroy(): void {
    this.abort?.abort();
    this.abort = undefined;
    this.resizeObs?.disconnect();
    this.resizeObs = undefined;
    this.smooth.stop();
  }
}
