import {
  Directive,
  ElementRef,
  inject,
  input,
  afterNextRender,
  effect,
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

export interface GSAPFromOptions {
  duration?: number;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  ease?: string;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  stagger?: number;
  [key: string]: any;
}

@Directive({
  selector: '[gsapFrom]',
})
export class GSAPFromDirective {
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  // Inputs
  gsapFrom = input<GSAPFromOptions>({});
  gsapTrigger = input<boolean>(false);
  gsapAutoStart = input<boolean>(true);

  private animation: gsap.core.Tween | null = null;

  constructor() {
    afterNextRender(() => {
      this.initializeAnimation();
    });

    // Effect para manejar cambios en los inputs
    effect(() => {
      const trigger = this.gsapTrigger();
      const autoStart = this.gsapAutoStart();

      if (isPlatformBrowser(this.platformId)) {
        if (trigger || autoStart) {
          this.startAnimation();
        }
      }
    });
  }

  private initializeAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.gsapAutoStart()) {
      this.startAnimation();
    }
  }

  private startAnimation(): void {
    const options = this.gsapFrom();

    if (Object.keys(options).length === 0) return;

    // Kill previous animation if exists
    if (this.animation) {
      this.animation.kill();
    }

    // Asegurar que el elemento sea visible antes de la animación
    const element = this.elementRef.nativeElement;

    // Si hay opacity en las opciones, establecer el estado inicial
    if (options.opacity !== undefined) {
      gsap.set(element, { opacity: 1 });
    }

    this.animation = gsap.from(element, options);
  }

  // Métodos públicos para control manual
  play(): void {
    if (isPlatformBrowser(this.platformId) && this.animation) {
      this.animation.play();
    }
  }

  pause(): void {
    if (isPlatformBrowser(this.platformId) && this.animation) {
      this.animation.pause();
    }
  }

  reverse(): void {
    if (isPlatformBrowser(this.platformId) && this.animation) {
      this.animation.reverse();
    }
  }

  restart(): void {
    if (isPlatformBrowser(this.platformId) && this.animation) {
      this.animation.restart();
    }
  }

  kill(): void {
    if (isPlatformBrowser(this.platformId) && this.animation) {
      this.animation.kill();
      this.animation = null;
    }
  }
}
