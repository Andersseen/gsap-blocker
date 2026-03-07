import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapTimeline]',
})
export class GsapTimelineDirective implements AfterViewInit {
  readonly gsapTimeline = input.required<unknown[]>();
  readonly gsapTimelineVars = input<gsap.TimelineVars>({});

  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const tl = gsap.timeline(this.gsapTimelineVars());

    this.gsapTimeline().forEach((animation: unknown) => {
      const { method, target, vars, position } = animation as {
        method: string;
        target?: Element | string;
        vars?: gsap.TweenVars & { from?: gsap.TweenVars; to?: gsap.TweenVars };
        position?: number | string;
      };
      const targetElement = target || this.el.nativeElement;

      if (method === 'to') {
        tl.to(targetElement, vars || {}, position);
      } else if (method === 'from') {
        tl.from(targetElement, vars || {}, position);
      } else if (method === 'fromTo' && vars?.from && vars?.to) {
        tl.fromTo(targetElement, vars.from, vars.to, position);
      } else if (method === 'set') {
        tl.set(targetElement, vars || {}, position);
      }
    });
  }
}
