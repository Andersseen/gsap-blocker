import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapTo]',
  standalone: true,
})
export class GsapToDirective implements AfterViewInit {
  @Input() gsapTo: any = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    gsap.to(this.el.nativeElement, this.gsapTo);
  }
}
