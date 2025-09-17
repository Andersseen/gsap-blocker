import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  input,
  output,
  computed,
  viewChild,
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'and-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    class: 'block',
    role: 'region',
    '[attr.aria-label]': 'ariaLabel()',
  },
  styles: [
    `
      :host {
        display: block;
      }

      /* Surface uses palette variables with safe fallbacks */
      .cta-card {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--bg, #ffffff), var(--fg, #111111) 4%),
          var(--bg, #ffffff)
        );
        color: var(--fg, #111111);
        border-radius: 1.5rem;
        border: 1px solid
          color-mix(in srgb, var(--fg, #111111), transparent 85%);
        box-shadow: 0 10px 20px -10px color-mix(in srgb, var(--fg, #111111), transparent
              90%);
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      /* Decorative blob driven by primary/secondary */
      .blob {
        position: absolute;
        inset: auto -6rem auto auto;
        top: -6rem;
        width: 18rem;
        height: 18rem;
        border-radius: 9999px;
        filter: blur(40px);
        opacity: 0.45;
        pointer-events: none;
        background: radial-gradient(
          60% 60% at 30% 30%,
          color-mix(in srgb, var(--primary, #3b82f6), transparent 30%),
          color-mix(in srgb, var(--secondary, #10b981), transparent 85%)
        );
        z-index: -1;
      }

      /* Buttons (palette-based, no Tailwind colors) */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-radius: 0.75rem;
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 600;
        transition: transform 0.12s ease, filter 0.15s ease,
          background-color 0.15s ease;
        will-change: transform;
      }

      .btn:active {
        transform: translateY(1px);
      }

      .btn-primary {
        background: var(--primary, #3b82f6);
        color: var(--bg, #ffffff);
      }
      .btn-primary:hover {
        filter: brightness(0.96);
      }

      .btn-secondary {
        background: transparent;
        color: var(--fg, #111111);
        border: 1px solid
          color-mix(in srgb, var(--fg, #111111), transparent 75%);
      }
      .btn-secondary:hover {
        background: color-mix(in srgb, var(--fg, #111111), transparent 94%);
      }

      /* Typography bound to palette */
      .title {
        color: var(--fg, #111111);
        letter-spacing: -0.02em;
        font-weight: 600;
      }
      .desc {
        color: color-mix(in srgb, var(--fg, #111111), transparent 30%);
      }
    `,
  ],
  template: `
    <section #root class="cta-card p-8 md:p-12">
      <div aria-hidden="true" class="blob"></div>

      <div class="mx-auto max-w-3xl">
        <h2 data-anim class="title text-3xl md:text-4xl">
          {{ title() }}
        </h2>

        @if (description()) {
        <p data-anim class="desc mt-3 text-base md:text-lg">
          {{ description() }}
        </p>
        }

        <div class="mt-6 flex flex-wrap items-center gap-3">
          @if (ctaHref(); as href) {
          <a
            data-anim
            [href]="href"
            [attr.target]="target()"
            [attr.rel]="relAttr()"
            class="btn btn-primary"
            (click)="onPrimaryClick()"
          >
            {{ ctaLabel() }}
          </a>
          } @else {
          <button
            data-anim
            type="button"
            class="btn btn-primary"
            (click)="onPrimaryClick()"
          >
            {{ ctaLabel() }}
          </button>
          } @if (secondaryLabel()) {
          <button
            data-anim
            type="button"
            class="btn btn-secondary"
            (click)="secondary.emit()"
          >
            {{ secondaryLabel() }}
          </button>
          }
        </div>
      </div>
    </section>
  `,
})
export default class Cta2 implements AfterViewInit {
  // Defaults (no required inputs)
  title = input<string>('Ship UI faster with GSAP blocks');
  description = input<string>(
    'Prebuilt, accessible, animated blocks for Angular. Drop-in, customize, ship.'
  );
  ctaLabel = input<string>('Get started');
  ctaHref = input<string | undefined>(undefined);
  target = input<'_self' | '_blank'>('_self');
  ariaLabel = input<string>('Call to action');
  secondaryLabel = input<string | undefined>(undefined);

  // Derived
  relAttr = computed(() =>
    this.target() === '_blank' ? 'noopener noreferrer' : null
  );

  // Refs
  root = viewChild<ElementRef<HTMLElement>>('root');

  ngAfterViewInit(): void {
    const el = this.root()?.nativeElement;
    if (!el) return;

    gsap.context(() => {
      const items = Array.from(el.querySelectorAll<HTMLElement>('[data-anim]'));
      gsap.from(items, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.06,
        clearProps: 'all',
      });
    });
  }

  onPrimaryClick(): void {
    this.primary.emit();
  }

  // Outputs
  primary = output<void>();
  secondary = output<void>();
}
