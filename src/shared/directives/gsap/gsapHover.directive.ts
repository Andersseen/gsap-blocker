import {
  Directive,
  inject,
  input,
  OnDestroy,
  ContentChildren,
  QueryList,
  ElementRef,
  AfterContentInit,
} from '@angular/core';
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

// Directiva auxiliar para marcar elementos como targets
@Directive({
  selector: '[gsapTarget]',
})
export class GsapTargetDirective {
  readonly name = input.required<string>({ alias: 'gsapTarget' });
  readonly el = inject(ElementRef);
}

@Directive({
  selector: '[gsapHover]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class GsapHoverDirective implements OnDestroy, AfterContentInit {
  private readonly el = inject(ElementRef);

  readonly gsapHover = input<GsapHoverConfig>({});

  @ContentChildren(GsapTargetDirective, { descendants: true })
  private targets!: QueryList<GsapTargetDirective>;

  private activeAnimations: gsap.core.Tween[] = [];
  private targetMap = new Map<string, ElementRef>();

  ngAfterContentInit(): void {
    // Mapear targets por nombre
    this.targets.forEach((target) => {
      this.targetMap.set(target.name(), target.el);
    });

    // Re-mapear cuando cambien los targets
    this.targets.changes.subscribe(() => {
      this.targetMap.clear();
      this.targets.forEach((target) => {
        this.targetMap.set(target.name(), target.el);
      });
    });
  }

  onMouseEnter(): void {
    this.killActiveAnimations();

    const config = this.gsapHover();
    const { in: hoverIn, targets } = config;

    // Animar targets específicos
    if (targets) {
      Object.entries(targets).forEach(([targetName, targetConfig]) => {
        if (!targetConfig.in) return;

        const targetElement = this.targetMap.get(targetName);
        if (targetElement) {
          const tween = gsap.to(targetElement.nativeElement, targetConfig.in);
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
      Object.entries(targets).forEach(([targetName, targetConfig]) => {
        if (!targetConfig.out) return;

        const targetElement = this.targetMap.get(targetName);
        if (targetElement) {
          const tween = gsap.to(targetElement.nativeElement, targetConfig.out);
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

  private killActiveAnimations(): void {
    this.activeAnimations.forEach((animation) => animation.kill());
    this.activeAnimations = [];
  }

  ngOnDestroy(): void {
    this.killActiveAnimations();
  }
}
