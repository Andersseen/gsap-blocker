import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapFrom]',
})
export class GsapFromDirective implements AfterViewInit {
  readonly gsapFrom = input.required<gsap.TweenVars>();
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    gsap.from(this.el.nativeElement, this.gsapFrom());
  }
}
