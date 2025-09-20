import { Directive, ElementRef, inject, input } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

type TweenVars = Record<string, unknown>;

@Directive({
  selector: '[andGsapFrom]',
  exportAs: 'andGsapFrom',
})
export class AndGsapFromDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  andGsapFrom = input<TweenVars>({});

  auto = input<boolean>(true);

  private tween: any | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const vars = this.andGsapFrom() || {};
    const startPaused = this.auto() === false;

    this.tween = gsap.from(this.el.nativeElement, { ...vars });
    if (startPaused) this.tween.pause(0);
  }

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
