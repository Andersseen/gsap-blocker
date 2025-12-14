import {
  Directive,
  ElementRef,
  inject,
  input,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[gsapStagger]',
})
export class GsapStaggerDirective implements AfterViewInit {
  readonly gsapStagger = input<any>({});
  readonly gsapStaggerSelector = input<string>('');

  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const targets = this.gsapStaggerSelector()
      ? this.el.nativeElement.querySelectorAll(this.gsapStaggerSelector())
      : this.el.nativeElement.children;

    // Determinar método
    const staggerConfig = this.gsapStagger();
    if (staggerConfig.from && staggerConfig.to) {
      gsap.fromTo(targets, staggerConfig.from, staggerConfig.to);
    } else if (staggerConfig.from) {
      gsap.from(targets, staggerConfig);
    } else {
      gsap.to(targets, staggerConfig);
    }
  }
}
