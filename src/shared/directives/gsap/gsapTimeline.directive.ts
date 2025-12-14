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
  readonly gsapTimeline = input.required<any[]>();
  readonly gsapTimelineVars = input<gsap.TimelineVars>({});

  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const tl = gsap.timeline(this.gsapTimelineVars());

    this.gsapTimeline().forEach((animation: any) => {
      const { method, target, vars, position } = animation;
      const targetElement = target || this.el.nativeElement;

      if (method === 'to') {
        tl.to(targetElement, vars, position);
      } else if (method === 'from') {
        tl.from(targetElement, vars, position);
      } else if (method === 'fromTo') {
        tl.fromTo(targetElement, vars.from, vars.to, position);
      } else if (method === 'set') {
        tl.set(targetElement, vars, position);
      }
    });
  }
}
