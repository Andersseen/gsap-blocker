import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapTo]',
})
export class GsapToDirective implements AfterViewInit {
  readonly gsapTo = input.required<gsap.TweenVars>();
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    gsap.to(this.el.nativeElement, this.gsapTo());
  }
}
