import { Component, signal } from '@angular/core';
import {
  GSAPFromDirective,
  GSAPFromOptions,
} from '@shared/directives/gsap-from';
import { GSAPToDirective, GSAPToOptions } from '@shared/directives/gsap-to';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

@Component({
  selector: 'hero-wave',
  imports: [GSAPToDirective, GSAPFromDirective],
  host: {
    class: 'block',
  },
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Hero Section -->
      <section class="flex items-center justify-center min-h-screen px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h1
            class="font-['Quicksand'] text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            [gsapFrom]="titleAnimation()"
          >
            Welcome to
            <span
              class="block text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2"
              [gsapFrom]="brandAnimation()"
            >
              Squiggles
            </span>
          </h1>

          <p
            class="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed"
            [gsapFrom]="textAnimation()"
          >
            Experience the fluid beauty of animated waves and modern design.
            Built with cutting-edge technology for seamless interactions.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
            [gsapFrom]="buttonsAnimation()"
          >
            <button
              class="px-8 py-4 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>

            <button
              class="px-8 py-4 border-2 border-primary text-primary rounded-full text-lg font-medium hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
            >
              Learn More
            </button>
          </div>

          <!-- Decorative elements -->
          <div
            class="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl"
            [gsapFrom]="floatingElement1()"
          ></div>

          <div
            class="absolute top-40 right-20 w-32 h-32 bg-primary/20 rounded-full blur-xl"
            [gsapFrom]="floatingElement2()"
          ></div>

          <div
            class="absolute bottom-40 left-20 w-16 h-16 bg-secondary/30 rounded-full blur-lg"
            [gsapFrom]="floatingElement3()"
          ></div>
        </div>
      </section>

      <!-- Wave Divider -->
      <div
        class="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          class="relative block w-[calc(147%+1.3px)] h-[200px]"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7a28bd" stop-opacity="0.8" />
              <stop offset="50%" stop-color="#26d988" />
              <stop offset="100%" stop-color="#7a28bd" stop-opacity="0.6" />
            </linearGradient>
          </defs>

          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity="0.4"
            fill="url(#waveGradient)"
            id="squiggle"
            [gsapTo]="waveAnimation()"
          />

          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#waveGradient)"
            id="squiggleAlt"
            class="invisible"
          />
        </svg>
      </div>
    </div>
  `,
})
export class HeroWaveComponent {
  // Hero animations usando gsapFrom - ahora funcionan correctamente
  titleAnimation = signal<GSAPFromOptions>({
    y: -100,
    opacity: 0, // Esto ahora funciona porque establecemos opacity: 1 antes de animar
    duration: 1.2,
    delay: 0.2,
    ease: 'power3.out',
  });

  brandAnimation = signal<GSAPFromOptions>({
    scale: 0.5,
    rotation: -10,
    opacity: 0,
    duration: 1.5,
    delay: 0.6,
    ease: 'elastic.out(1, 0.8)',
  });

  textAnimation = signal<GSAPFromOptions>({
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1,
    ease: 'power2.out',
  });

  buttonsAnimation = signal<GSAPFromOptions>({
    y: 100,
    opacity: 0,
    duration: 1,
    delay: 1.3,
    ease: 'power2.out',
  });

  floatingElement1 = signal<GSAPFromOptions>({
    x: -200,
    y: -100,
    opacity: 0,
    scale: 0,
    duration: 2,
    delay: 1.5,
    ease: 'power2.out',
  });

  floatingElement2 = signal<GSAPFromOptions>({
    x: 200,
    y: -150,
    opacity: 0,
    scale: 0,
    duration: 2.5,
    delay: 1.8,
    ease: 'power2.out',
  });

  floatingElement3 = signal<GSAPFromOptions>({
    x: -150,
    y: 100,
    opacity: 0,
    scale: 0,
    duration: 2,
    delay: 2.1,
    ease: 'power2.out',
  });

  // Wave animation usando gsapTo
  waveAnimation = signal<GSAPToOptions>({
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    morphSVG: '#squiggleAlt',
  });

  constructor() {
    gsap.registerPlugin(MorphSVGPlugin);
  }
}
