import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapFrom]',
  standalone: true,
})
export class GsapFromDirective implements AfterViewInit {
  @Input() gsapFrom: any = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    gsap.from(this.el.nativeElement, this.gsapFrom);
  }
}
