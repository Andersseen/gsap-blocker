import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapSet]',
})
export class GsapSetDirective implements AfterViewInit {
  readonly gsapSet = input.required<gsap.TweenVars>();
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    gsap.set(this.el.nativeElement, this.gsapSet());
  }
}
