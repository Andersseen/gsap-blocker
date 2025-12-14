import {
  Component,
  signal,
  AfterViewInit,
  ElementRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GsapHoverDirective,
  GsapTargetDirective,
} from '@shared/directives/gsap/gsapHover.directive';
import CATEGORIES from '@data/categories';
import Category from '@shared/interfaces/category.interface';

@Component({
  selector: 'categories-section',
  imports: [GsapHoverDirective, GsapTargetDirective],
  template: `
    <section #sectionRef class="container mx-auto px-6 md:px-8 py-16">
      <div #headerRef class="flex items-end justify-between">
        <h2 class="text-2xl md:text-3xl font-bold opacity-0 translate-y-8">
          Block categories
        </h2>
        <a
          class="text-sm underline underline-offset-4 opacity-0 translate-y-8"
          href="/blocks"
        >
          View all
        </a>
      </div>

      <div #gridRef class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (c of categories(); track c.name;let i = $index) {
        <a
          class="category-card rounded-2xl shadow-sm hover:shadow-lg p-6 transition-shadow duration-300 ease-in-out opacity-0 translate-y-12 scale-95"
          href="#"
          [attr.data-index]="i"
          [gsapHover]="{
            in: {
              y: -6,

              duration: 0.3,
              ease: 'power2.out'
            },
            out: {
              y: 0,

              duration: 0.3,
              ease: 'power2.out'
            },
            targets: {
              emoji: {
                in: {
                  scale: 1.1,
                  rotation: 5,
                  duration: 0.4,
                  ease: 'back.out(2)'
                },
                out: {
                  scale: 1,
                  rotation: 0,
                  duration: 0.3,
                  ease: 'power2.out'
                }
              },
              name: {
                in: { color: '#3b82f6', duration: 0.2 },
                out: { color: 'inherit', duration: 0.2 }
              }
            }
          }"
        >
          <div class="text-3xl" gsapTarget="emoji">{{ c.emoji }}</div>
          <div class="mt-4 flex items-center justify-between">
            <h3 class="font-semibold" gsapTarget="name">{{ c.name }}</h3>
            <span
              class="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {{ c.count }} blocks
            </span>
          </div>
          <div class="mt-4 h-24 rounded-xl bg-card border border-border"></div>
        </a>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoriesSection implements AfterViewInit {
  private headerRef = viewChild.required<ElementRef>('headerRef');
  private gridRef = viewChild.required<ElementRef>('gridRef');

  categories = signal<Category[]>(CATEGORIES);

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    this.animateHeader();
    this.animateGridCards();
  }

  private animateHeader(): void {
    const headerElement = this.headerRef().nativeElement;
    const title = headerElement.querySelector('h2');
    const viewAllLink = headerElement.querySelector('a');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headerElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }).to(
      viewAllLink,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.6'
    );
  }

  private animateGridCards(): void {
    const cards =
      this.gridRef().nativeElement.querySelectorAll('.category-card');

    cards.forEach((card: Element, index: number) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }
}
