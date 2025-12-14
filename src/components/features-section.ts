import {
  Component,
  signal,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import FEATURES from '@data/features';
import {
  GsapHoverDirective,
  GsapTargetDirective,
} from '@shared/directives/gsap/gsapHover.directive';

@Component({
  selector: 'features-section',
  imports: [GsapHoverDirective, GsapTargetDirective],
  template: `
    <section #sectionRef class="container mx-auto px-6 md:px-8 py-20">
      <div #headerRef>
        <h2 class="text-2xl md:text-3xl font-bold opacity-0 translate-y-8">
          Why this library
        </h2>
        <p class="mt-2 max-w-prose opacity-0 translate-y-8">
          Ship faster with opinionated building blocks that play nicely with
          Angular Material and Tailwind.
        </p>
      </div>

      <div #gridRef class="mt-10 grid md:grid-cols-3 gap-6">
        @for (f of features(); track f.title; let i = $index) {
        <article
          class="feature-card rounded-2xl shadow-sm hover:shadow-lg p-6 transition-shadow duration-300 ease-in-out opacity-0 translate-y-12 scale-95"
          [attr.data-index]="i"
          [gsapHover]="{
            in: { y: -4, duration: 0.3, ease: 'power2.out' },
            out: { y: 0, duration: 0.3, ease: 'power2.out' },
            targets: {
              icon: {
                in: {
                  scale: 1.05,
                  rotation: 1.05,
                  duration: 0.3,
                  ease: 'back.out(2)'
                },
                out: {
                  scale: 1,
                  rotation: 0,
                  duration: 0.3,
                  ease: 'power2.out'
                }
              },
              title: {
                in: { color: '#3b82f6', duration: 0.2 },
                out: { color: 'inherit', duration: 0.2 }
              }
            }
          }"
        >
          <div class="text-2xl feature-icon" gsapTarget="icon">
            {{ f.icon }}
          </div>
          <h3 class="mt-3 font-semibold feature-title" gsapTarget="title">
            {{ f.title }}
          </h3>
          <p class="mt-1 text-sm feature-desc">{{ f.desc }}</p>
        </article>
        }
      </div>
    </section>
  `,
})
export default class FeaturesSection implements AfterViewInit {
  @ViewChild('sectionRef', { static: false }) sectionRef!: ElementRef;
  @ViewChild('headerRef', { static: false }) headerRef!: ElementRef;
  @ViewChild('gridRef', { static: false }) gridRef!: ElementRef;

  features = signal(FEATURES);

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    this.animateHeader();
    this.animateFeatureCards();
  }

  private animateHeader(): void {
    const headerElement = this.headerRef.nativeElement;
    const title = headerElement.querySelector('h2');
    const description = headerElement.querySelector('p');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headerElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }).to(
      description,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  private animateFeatureCards(): void {
    const cards = this.gridRef.nativeElement.querySelectorAll('.feature-card');

    cards.forEach((card: Element, index: number) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }
}
