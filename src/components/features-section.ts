import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';

import FEATURES from '@data/features';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-features-section',
  imports: [],
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
            class="feature-card group rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 ease-in-out opacity-0 translate-y-12 scale-95 hover:-translate-y-1"
            [attr.data-index]="i"
          >
            <div
              class="text-2xl feature-icon transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-3"
            >
              {{ f.icon }}
            </div>
            <h3
              class="mt-3 font-semibold feature-title transition-colors duration-200 group-hover:text-blue-500"
            >
              {{ f.title }}
            </h3>
            <p class="mt-1 text-sm feature-desc">{{ f.desc }}</p>
          </article>
        }
      </div>
    </section>
  `,
})
export default class FeaturesSection implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sectionRef =
    viewChild.required<ElementRef<HTMLElement>>('sectionRef');
  private readonly headerRef =
    viewChild.required<ElementRef<HTMLElement>>('headerRef');
  private readonly gridRef =
    viewChild.required<ElementRef<HTMLElement>>('gridRef');

  private ctx: gsap.Context | null = null;

  features = signal(FEATURES);

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    this.ctx = gsap.context(() => this.initAnimations(gsap));
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }

  private initAnimations(gsap: typeof import('gsap').default) {
    const header = this.headerRef().nativeElement;
    const title = header.querySelector('h2');
    const description = header.querySelector('p');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
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

    const cards =
      this.gridRef().nativeElement.querySelectorAll('.feature-card');
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
