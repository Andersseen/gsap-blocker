import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapFromTo]',
  standalone: true,
})
export class GsapFromToDirective implements AfterViewInit {
  @Input() gsapFromTo: any = {};
  @Input() gsapFromToFrom: any = {};
  @Input() gsapFromToTo: any = {};

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const fromProps = { ...this.gsapFromToFrom, ...this.gsapFromTo.from };
    const toProps = { ...this.gsapFromToTo, ...this.gsapFromTo.to };

    gsap.fromTo(this.el.nativeElement, fromProps, toProps);
  }
}
