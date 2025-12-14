import {
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  input,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

type Plan = {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
};

@Component({
  selector: 'and-pricing-section',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'block' },
  template: `
    <section #root class="container mx-auto px-6 md:px-8 py-16 md:py-24">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold">Pricing</h2>
          <p class="mt-2 text-muted-foreground">Simple, transparent plans.</p>
        </div>

        <!-- Billing cycle toggle -->
        <div class="inline-flex rounded-lg bg-muted p-1">
          <button
            class="px-3 py-1.5 text-sm rounded-md transition"
            [class.bg-card]="cycle() === 'month'"
            [attr.aria-pressed]="cycle() === 'month'"
            (click)="setCycle('month')"
          >
            Monthly
          </button>
          <button
            class="px-3 py-1.5 text-sm rounded-md transition"
            [class.bg-card]="cycle() === 'year'"
            [attr.aria-pressed]="cycle() === 'year'"
            (click)="setCycle('year')"
          >
            Yearly
          </button>
        </div>
      </div>

      <div class="mt-10 grid md:grid-cols-3 gap-6">
        @for (p of plans(); track p.name) {
        <article
          class="price-card relative rounded-2xl border border-border bg-card/70 p-6 hover:shadow-xl transition"
        >
          @if (p.popular) {
          <div
            class="absolute -top-3 right-4 text-xs rounded-full px-2 py-1 bg-emerald-500  shadow"
          >
            Most popular
          </div>
          }
          <h3 class="text-lg font-semibold">{{ p.name }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ p.description }}
          </p>

          <div class="mt-5 flex items-baseline gap-1">
            <span class="text-3xl md:text-4xl font-extrabold tracking-tight">{{
              priceOf(p)
            }}</span>
            <span class="text-sm text-muted-foreground"
              >/{{ cycle() === 'month' ? 'mo' : 'yr' }}</span
            >
          </div>

          <ul class="mt-5 space-y-2 text-sm">
            @for (f of p.features; track f) {
            <li class="flex items-start gap-2">
              <span
                class="mt-1 inline-block size-1.5 rounded-full bg-emerald-500"
              ></span>
              <span>{{ f }}</span>
            </li>
            }
          </ul>

          <a
            class="mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
            [href]="p.ctaHref"
            >{{ p.ctaText }}</a
          >
        </article>
        }
      </div>
    </section>
  `,
})
export default class AndPricingSection {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');

  cycle = signal<'month' | 'year'>('month');
  setCycle = (v: 'month' | 'year') => this.cycle.set(v);

  plans = input<Plan[]>([
    {
      name: 'Starter',
      description: 'Everything to get going.',
      monthly: 9,
      yearly: 90,
      features: ['1 project', 'Basic blocks', 'Community support'],
      ctaText: 'Choose Starter',
      ctaHref: '#',
    },
    {
      name: 'Pro',
      description: 'For growing teams.',
      monthly: 29,
      yearly: 290,
      features: ['Unlimited projects', 'All blocks', 'Priority support'],
      ctaText: 'Choose Pro',
      ctaHref: '#',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Custom needs at scale.',
      monthly: 99,
      yearly: 990,
      features: ['SLA', 'Design tokens', 'Onboarding session'],
      ctaText: 'Contact sales',
      ctaHref: '#',
    },
  ]);

  priceOf = (p: Plan) =>
    this.cycle() === 'month' ? `$${p.monthly}` : `$${p.yearly}`;

  private gsap: any | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.default;

    const el = this.root()?.nativeElement;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.price-card'));
    this.gsap.from(cards, {
      y: 24,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
    });
  }
}
