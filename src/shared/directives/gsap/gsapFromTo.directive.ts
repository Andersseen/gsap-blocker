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
  readonly gsapFromTo = input<unknown>({});
  readonly gsapFromToFrom = input<gsap.TweenVars>({});
  readonly gsapFromToTo = input<gsap.TweenVars>({});

  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const inputObj = this.gsapFromTo() as {
      from?: gsap.TweenVars;
      to?: gsap.TweenVars;
    };
    const fromProps = { ...this.gsapFromToFrom(), ...inputObj.from };
    const toProps = { ...this.gsapFromToTo(), ...inputObj.to };

    gsap.fromTo(this.el.nativeElement, fromProps, toProps);
  }
}
