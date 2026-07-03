// and-gsap-from.directive.ts
import { Directive, ElementRef, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import type { gsap } from 'gsap';
import {
  AND_GSAP_TIMELINE_CTX,
  AndGsapTimelineApi,
  TweenVars,
} from '@shared/and-gsap-tokens';

@Directive({
  selector: '[andGsapFrom]',
  exportAs: 'andGsapFrom',
})
export class AndGsapFromDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  // ✅ Inyecta el token (opcional)
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

    // Dentro de un timeline: solo registro, no creo tween
    if (this.timeline) {
      this.timeline.registerFrom(this.el.nativeElement, vars, at);
      return;
    }

    // Sin timeline: tween autónomo
    const { gsap } = await import('gsap');
    this.tween = gsap.from(this.el.nativeElement, { ...vars });
    if (this.auto() === false) this.tween.pause(0);
  }

  // Controles (modo autónomo)
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
