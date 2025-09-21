import { Directive, inject, input, OnDestroy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';

interface GsapHoverTarget {
  in?: gsap.TweenVars;
  out?: gsap.TweenVars;
}

interface GsapHoverConfig {
  in?: gsap.TweenVars;
  out?: gsap.TweenVars;
  targets?: Record<string, GsapHoverTarget>;
}

@Directive({
  selector: '[gsapHover]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class GsapHoverDirective implements OnDestroy {
  private readonly el = inject(ElementRef);

  readonly gsapHover = input<GsapHoverConfig>({});

  private activeAnimations: gsap.core.Tween[] = [];

  onMouseEnter(): void {
    this.killActiveAnimations();

    const config = this.gsapHover();
    const { in: hoverIn, targets } = config;

    // Animar targets específicos (usando template reference variables)
    if (targets) {
      Object.entries(targets).forEach(([targetRef, targetConfig]) => {
        if (!targetConfig.in) return;

        // Buscar el elemento por template reference o por selector
        const targetElement = this.findTargetElement(targetRef);
        if (targetElement) {
          const tween = gsap.to(targetElement, targetConfig.in);
          this.activeAnimations.push(tween);
        }
      });
    }

    // Animación del elemento principal
    if (hoverIn && Object.keys(hoverIn).length > 0) {
      const tween = gsap.to(this.el.nativeElement, hoverIn);
      this.activeAnimations.push(tween);
    }
  }

  onMouseLeave(): void {
    this.killActiveAnimations();

    const config = this.gsapHover();
    const { out: hoverOut, targets } = config;

    // Animar targets específicos
    if (targets) {
      Object.entries(targets).forEach(([targetRef, targetConfig]) => {
        if (!targetConfig.out) return;

        const targetElement = this.findTargetElement(targetRef);
        if (targetElement) {
          const tween = gsap.to(targetElement, targetConfig.out);
          this.activeAnimations.push(tween);
        }
      });
    }

    // Animación del elemento principal
    if (hoverOut && Object.keys(hoverOut).length > 0) {
      const tween = gsap.to(this.el.nativeElement, hoverOut);
      this.activeAnimations.push(tween);
    }
  }

  private findTargetElement(targetRef: string): Element | null {
    // Si empieza con '#', buscar por template reference
    if (targetRef.startsWith('#')) {
      const refName = targetRef.substring(1);
      // Esto requiere que pasemos referencias desde el componente
      // Por ahora, usar querySelector como fallback
      return this.el.nativeElement.querySelector(`[data-ref="${refName}"]`);
    }

    // Si no, tratar como selector CSS
    return this.el.nativeElement.querySelector(targetRef);
  }

  private killActiveAnimations(): void {
    this.activeAnimations.forEach((animation) => animation.kill());
    this.activeAnimations = [];
  }

  ngOnDestroy(): void {
    this.killActiveAnimations();
  }
}
