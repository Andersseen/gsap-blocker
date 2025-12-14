import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapFromTo]',
})
export class GsapFromToDirective implements AfterViewInit {
  readonly gsapFromTo = input<any>({});
  readonly gsapFromToFrom = input<gsap.TweenVars>({});
  readonly gsapFromToTo = input<gsap.TweenVars>({});

  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const fromProps = { ...this.gsapFromToFrom(), ...this.gsapFromTo().from };
    const toProps = { ...this.gsapFromToTo(), ...this.gsapFromTo().to };

    gsap.fromTo(this.el.nativeElement, fromProps, toProps);
  }
}
