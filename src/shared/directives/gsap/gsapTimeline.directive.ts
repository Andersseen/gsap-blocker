import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapTimeline]',
  standalone: true,
})
export class GsapTimelineDirective implements AfterViewInit {
  @Input() gsapTimeline: any[] = [];
  @Input() gsapTimelineVars: any = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const tl = gsap.timeline(this.gsapTimelineVars);

    this.gsapTimeline.forEach((animation: any) => {
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
