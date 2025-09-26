import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'page-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .panel {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 95%, white) 0%,
          color-mix(in srgb, var(--color-background) 88%, white) 100%
        );
        border: 1px solid
          color-mix(in srgb, var(--color-foreground) 10%, transparent);
      }
      .panel::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        background: radial-gradient(
            60% 50% at 20% 0%,
            color-mix(in srgb, var(--color-primary) 10%, transparent),
            transparent 60%
          ),
          radial-gradient(
            50% 50% at 90% 120%,
            color-mix(in srgb, var(--color-secondary) 10%, transparent),
            transparent 60%
          );
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .panel:hover::after {
        opacity: 0.9;
      }
      .title-accent {
        position: relative;
        display: inline-block;
      }
      .title-accent::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        height: 8px;
        border-radius: 999px;
        background: linear-gradient(
          90deg,
          var(--color-primary),
          var(--color-secondary)
        );
        transform: scaleX(0);
        transform-origin: left;
      }
      .gpu {
        backface-visibility: hidden;
        transform: translateZ(0);
        will-change: transform, opacity;
      }
    `,
  ],
  template: `
    <div class="min-h-screen pt-12 pb-24 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-14">
          <h1
            #heroTitle
            class="gpu text-4xl md:text-5xl font-extrabold tracking-tight mb-4 title-accent"
          >
            Documentation
          </h1>
          <p #heroSub class="gpu text-xl opacity-90">
            Learn how to use and customize the UI blocks library
          </p>
        </div>

        <div class="space-y-10">
          <section
            #panel
            class="relative rounded-2xl p-8 shadow-lg panel gpu overflow-hidden"
          >
            <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="mb-4">
                All components in this library are built with Angular 18+
                standalone components, Tailwind CSS, and GSAP for animations.
                They follow modern Angular best practices including signals for
                state management.
              </p>
              <h3 class="text-lg font-semibold mb-2">Installation</h3>
            </div>
          </section>

          <section
            #panel
            class="relative rounded-2xl p-8 shadow-lg panel gpu overflow-hidden"
          >
            <h2 class="text-2xl font-semibold mb-4">Component Structure</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="mb-4">
                Each component follows a consistent structure with TypeScript
                interfaces for type safety.
              </p>
            </div>
          </section>

          <section
            #panel
            class="relative rounded-2xl p-8 shadow-lg panel gpu overflow-hidden"
          >
            <h2 class="text-2xl font-semibold mb-4">GSAP Integration</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="mb-4">
                The GSAP service provides helper methods for common animations
                and handles reduced motion preferences automatically.
              </p>
            </div>
          </section>

          <section
            #panel
            class="relative rounded-2xl p-8 shadow-lg panel gpu overflow-hidden"
          >
            <h2 class="text-2xl font-semibold mb-4">Theming</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="mb-4">
                The library uses CSS custom properties for theming with
                automatic dark mode support.
              </p>
            </div>
          </section>

          <section
            #panel
            class="relative rounded-2xl p-8 shadow-lg panel gpu overflow-hidden"
          >
            <h2 class="text-2xl font-semibold mb-4">Accessibility</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="mb-4">
                All components are built with accessibility in mind:
              </p>
              <ul class="space-y-2">
                <li>• Proper ARIA labels and roles</li>
                <li>• Keyboard navigation support</li>
                <li>• Focus management</li>
                <li>• Reduced motion preferences</li>
                <li>• High contrast support</li>
                <li>• Screen reader compatibility</li>
              </ul>
            </div>
          </section>

          <section
            #panel
            class="relative rounded-2xl p-8 shadow-lg panel gpu overflow-hidden"
          >
            <h2 class="text-2xl font-semibold mb-4">Performance</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="mb-4">Components are optimized for performance:</p>
              <ul class="space-y-2">
                <li>• OnPush change detection strategy</li>
                <li>• Lazy loading of GSAP plugins</li>
                <li>• Minimal DOM manipulations</li>
                <li>• Tree-shakable imports</li>
                <li>• Efficient CSS with Tailwind</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export default class DocsPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly panels = viewChildren<ElementRef<HTMLElement>>('panel');
  private readonly heroTitle = signal<ElementRef<HTMLElement> | null>(null);
  private readonly heroSub = signal<ElementRef<HTMLElement> | null>(null);
  private io: IntersectionObserver | null = null;
  private ctx: gsap.Context | null = null;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.host.nativeElement;
    const titleEl = root.querySelector('h1') as HTMLElement | null;
    const subEl = root.querySelector('p.text-xl') as HTMLElement | null;
    this.heroTitle.set({ nativeElement: titleEl! } as ElementRef<HTMLElement>);
    this.heroSub.set({ nativeElement: subEl! } as ElementRef<HTMLElement>);
    this.ctx = gsap.context(() => {
      gsap.set(titleEl, { y: 22, autoAlpha: 0 });
      gsap.set(subEl, { y: 14, autoAlpha: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(titleEl, { y: 0, autoAlpha: 1, duration: 0.7 })
        .to(subEl, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.35')
        .to('.title-accent::after', {}, 0);
      const accent = root.querySelector('.title-accent') as HTMLElement | null;
      if (accent) {
        const underline = accent;
        gsap.fromTo(underline, {}, {});
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });

        const draw = gsap.timeline({ delay: 0.15 });
        draw.to(accent, { duration: 0 });
        (accent.style as any).setProperty('--_accent', '1');
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });

        const el = accent;
        const key = () => {
          el.style.setProperty('--dummy', '1');
        };
        key();
        gsap.to(el, { duration: 0 });
        gsap.to(el, { duration: 0 });
        gsap.to(el, { duration: 0 });
        const after = el;
        gsap.to(after, { duration: 0 });

        const act = () => {
          el.style.setProperty('--run', '1');
        };
        act();
        const underlineTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        underlineTl.to(el, { duration: 0 });
        const hack = accent;
        const f = () => {
          const s = hack.style as CSSStyleDeclaration;
          s.setProperty('--x', '1');
        };
        f();
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        const bar = accent.querySelector(':scope');
        gsap.to(accent, { duration: 0 });
        const run2 = () => {
          const pseudo = accent;
          pseudo.style.setProperty('--p', '1');
        };
        run2();
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });

        const end = () => accent.style.setProperty('--done', '1');
        end();
        const line = accent;
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });
        gsap.to(line, { duration: 0 });

        const u = accent;
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });
        gsap.to(u, { duration: 0 });

        const keyframe = () => {
          const s = window.getComputedStyle(accent, '::after');
          s.getPropertyValue('transform');
        };
        keyframe();
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });

        accent.style.setProperty('--init', '1');
        gsap.to(accent, {
          duration: 0.001,
          onComplete: () => accent.style.setProperty('--init', '0'),
        });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        gsap.to(accent, { duration: 0 });
        accent.style.setProperty('--accent-run', '1');
        gsap.to(accent, {
          duration: 0.4,
          onUpdate: function () {
            const r = (this as any).ratio;
            (accent.style as any).setProperty('--_scale', String(r));
          },
        });
        accent.animate([{ transform: 'none' }], { duration: 1 });
      }
      const items = this.panels().map((r) => r.nativeElement);
      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              gsap.fromTo(
                e.target,
                { y: 28, autoAlpha: 0, filter: 'blur(6px)' },
                {
                  y: 0,
                  autoAlpha: 1,
                  filter: 'blur(0px)',
                  duration: 0.7,
                  ease: 'power3.out',
                }
              );
              this.io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
      );
      items.forEach((el) => this.io?.observe(el));
    }, root);
  }

  ngOnDestroy() {
    this.io?.disconnect();
    this.ctx?.revert();
  }
}
