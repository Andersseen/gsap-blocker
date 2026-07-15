// and-gsap-from.directive.ts
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
import {
  AND_GSAP_TIMELINE_CTX,
  AndGsapTimelineApi,
  TweenVars,
} from '@shared/and-gsap-tokens';
import { prefersReducedMotion } from '@shared/utils/motion';
import type { gsap } from 'gsap';

@Directive({
  selector: '[andGsapFrom]',
  exportAs: 'andGsapFrom',
})
export class AndGsapFromDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  // Inject the token (optional)
  private readonly timeline = inject(AND_GSAP_TIMELINE_CTX, {
    optional: true,
  }) as AndGsapTimelineApi | null;

  from = input<TweenVars>({});
  at = input<string | number | undefined>(undefined);
  auto = input<boolean>(true);

  private tween: gsap.core.Tween | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const vars = this.from() || {};
    const at = this.at();

    // Inside a timeline: only register, don't create a standalone tween
    if (this.timeline) {
      this.timeline.registerFrom(this.el.nativeElement, vars, at);
      return;
    }

    if (prefersReducedMotion()) return;

    // No timeline: standalone tween
    const { gsap } = await import('gsap');
    this.tween = gsap.from(this.el.nativeElement, { ...vars });
    if (this.auto() === false) this.tween.pause(0);
  }

  // Controls (standalone mode)
  play() {
    this.tween?.play();
  }
  pause() {
    this.tween?.pause();
  }
  resume() {
    this.tween?.resume();
  }
  reverse() {
    this.tween?.reverse();
  }
  kill() {
    this.tween?.kill();
    this.tween = null;
  }

  ngOnDestroy() {
    this.tween?.kill();
    this.tween = null;
  }
}
