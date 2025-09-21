import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapSet]',
  standalone: true,
})
export class GsapSetDirective implements AfterViewInit {
  @Input() gsapSet: any = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    gsap.set(this.el.nativeElement, this.gsapSet);
  }
}
