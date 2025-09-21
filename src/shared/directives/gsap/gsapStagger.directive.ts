import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapStagger]',
  standalone: true,
})
export class GsapStaggerDirective implements AfterViewInit {
  @Input() gsapStagger: any = {};
  @Input() gsapStaggerSelector: string = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const targets = this.gsapStaggerSelector
      ? this.el.nativeElement.querySelectorAll(this.gsapStaggerSelector)
      : this.el.nativeElement.children;

    // Determinar método
    if (this.gsapStagger.from && this.gsapStagger.to) {
      gsap.fromTo(targets, this.gsapStagger.from, this.gsapStagger.to);
    } else if (this.gsapStagger.from) {
      gsap.from(targets, this.gsapStagger);
    } else {
      gsap.to(targets, this.gsapStagger);
    }
  }
}
