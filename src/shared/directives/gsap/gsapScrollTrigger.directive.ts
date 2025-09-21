import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[gsapScrollTrigger]',
  standalone: true,
})
export class GsapScrollTriggerDirective implements AfterViewInit {
  @Input() gsapScrollTrigger: any = {};
  @Input() gsapScrollTriggerVars: any = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const scrollTriggerConfig = {
      trigger: this.el.nativeElement,
      ...this.gsapScrollTriggerVars,
    };

    const animationVars = {
      ...this.gsapScrollTrigger,
      scrollTrigger: scrollTriggerConfig,
    };

    // Determinar el método según las propiedades
    if (animationVars.from && animationVars.to) {
      gsap.fromTo(this.el.nativeElement, animationVars.from, {
        ...animationVars.to,
        scrollTrigger: scrollTriggerConfig,
      });
    } else if (animationVars.from) {
      gsap.from(this.el.nativeElement, animationVars);
    } else {
      gsap.to(this.el.nativeElement, animationVars);
    }
  }
}
