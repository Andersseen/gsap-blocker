import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import SpotlightCardDemo from '@components/animation-demos/spotlight-card-demo';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import RecipeDemo from '@components/recipe-demo';
import RecipeHero from '@components/recipe-hero';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import RecipeToc from '@components/recipe-toc';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const SPOTLIGHT_CARD_DEMO_SOURCE = `import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-spotlight-card-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    \`
      .spotlight {
        --x: 50%;
        --y: 50%;
        background: radial-gradient(
          320px circle at var(--x) var(--y),
          color-mix(in srgb, var(--color-primary) 18%, transparent),
          transparent 70%
        );
      }
    \`,
  ],
  template: \`
    <div
      #card
      class="spotlight relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-10 focus-within:ring-2 focus-within:ring-ring"
    >
      <div class="relative">
        <h3 class="text-xl font-bold text-foreground">Spotlight card</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Move the pointer over this card — the glow follows it, smoothed with
          GSAP.
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
          [attr.aria-pressed]="saved()"
          (click)="saved.set(!saved())"
        >
          <span aria-hidden="true">{{ saved() ? '★' : '☆' }}</span>
          {{ saved() ? 'Saved' : 'Save' }}
        </button>
      </div>
    </div>
  \`,
})
export default class SpotlightCardDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cardRef =
    viewChild.required<ElementRef<HTMLElement>>('card');

  private cleanup: (() => void) | null = null;

  saved = signal(false);

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => this.cleanup?.());
  }

  private async setup() {
    if (!isPlatformBrowser(this.platformId)) return;

    const card = this.cardRef().nativeElement;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
      return;
    }

    const { gsap } = await import('gsap');

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      gsap.to(card, {
        '--x': \`\${x}%\`,
        '--y': \`\${y}%\`,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('pointermove', onMove);

    this.cleanup = () => {
      card.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(card);
    };
  }
}
`;

export const routeMeta: RouteMeta = {
  title: 'Spotlight Card — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'A card with a radial glow that follows the pointer, positioned with CSS variables and smoothed with GSAP.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-spotlight-card',
  imports: [
    RecipeHero,
    RecipeDemo,
    RecipeToc,
    SpotlightCardDemo,
    RecipeSection,
    CodeTabs,
    RecipeNav,
  ],
  template: `
    <app-recipe-hero [recipe]="recipe" />

    <div class="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div class="space-y-16">
        <div id="demo" class="scroll-mt-28">
          <app-recipe-demo number="05" title="Demo">
            <app-spotlight-card-demo />
          </app-recipe-demo>
        </div>

        <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
          <p>
            The card's background is a single
            <code>radial-gradient</code> positioned at two CSS custom
            properties, <code>--x</code> and <code>--y</code>, declared in the
            component's own <code>styles</code>. On <code>pointermove</code>,
            the handler converts the cursor position into a percentage of the
            card's own box and tweens those two variables with
            <code>gsap.to()</code> — GSAP interpolates the percentage value
            directly, so the glow glides to the new position instead of jumping.
          </p>
          <p>
            Because the gradient itself is pure CSS, the browser composites it
            without Angular or GSAP touching layout — only the two custom
            property values change every frame.
          </p>
        </app-recipe-section>

        <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
          <ul>
            <li>
              <code>--x</code>/<code>--y</code> live in component-scoped
              <code>styles</code>, so the spotlight effect ships with the
              component instead of leaking into global CSS.
            </li>
            <li>
              <code>viewChild.required('card')</code> reads the host element;
              setup runs once from <code>afterNextRender()</code>.
            </li>
            <li>
              The <code>saved</code> toggle is the one piece of real UI state
              here, so it's the only thing modeled as a signal — everything
              pointer-driven bypasses Angular entirely.
            </li>
            <li>
              <code>DestroyRef.onDestroy()</code> removes the listener and calls
              <code>gsap.killTweensOf(card)</code>.
            </li>
          </ul>
        </app-recipe-section>

        <app-recipe-section title="Source code" icon="💻" id="source">
          <app-code-tabs [tabs]="codeTabs" />
        </app-recipe-section>

        <app-recipe-section title="Implementation recipe" icon="📋" id="recipe">
          <ol>
            <li>Create the standalone component with <code>OnPush</code>.</li>
            <li>
              Add the static markup: a card with
              <code
                >background: radial-gradient(circle at var(--x) var(--y),
                ...)</code
              >
              declared in <code>styles</code>.
            </li>
            <li>
              Query the card with
              <code>viewChild.required&lt;ElementRef&gt;('card')</code>.
            </li>
            <li>
              Lazy-load GSAP with <code>await import('gsap')</code> inside
              <code>afterNextRender()</code>, unless reduced motion is
              preferred.
            </li>
            <li>
              Build the animation:
              <code
                >gsap.to(card, &#123; '--x': x + '%', '--y': y + '%', overwrite:
                'auto' &#125;)</code
              >.
            </li>
            <li>
              Add cleanup: remove the listener and kill tweens of the card in
              <code>destroyRef.onDestroy()</code>.
            </li>
            <li>
              Add reduced motion: set <code>--x</code>/<code>--y</code> to a
              fixed center value once and skip attaching the pointer listener.
            </li>
            <li>
              Test keyboard/accessibility: tab to the card's button and confirm
              <code>focus-within</code> shows a visible ring even without a
              pointer.
            </li>
          </ol>
        </app-recipe-section>

        <app-recipe-section
          title="Accessibility notes"
          icon="♿"
          id="accessibility"
        >
          <ul>
            @for (item of recipe.accessibility; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </app-recipe-section>

        <app-recipe-section
          title="Performance notes"
          icon="⚡"
          id="performance"
        >
          <ul>
            @for (item of recipe.performance; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </app-recipe-section>

        <app-recipe-section title="Common pitfalls" icon="⚠️" id="pitfalls">
          <ul>
            <li>
              Reading <code>getBoundingClientRect()</code> anywhere other than
              inside the <code>pointermove</code> handler itself — computing it
              up front and caching it breaks as soon as the page scrolls or the
              card resizes.
            </li>
            <li>
              Forgetting <code>overwrite: 'auto'</code> — without it, GSAP
              queues a new tween on every pointer event instead of redirecting
              the existing one, and the glow lags behind the cursor.
            </li>
            <li>
              Making the glow the only focus indicator — it's decorative and
              pointer-only, so keyboard users still need a real
              <code>focus-within</code> ring.
            </li>
          </ul>
        </app-recipe-section>

        <app-recipe-nav [prev]="nav.prev" [next]="nav.next" />
      </div>

      <aside class="hidden lg:block">
        <app-recipe-toc />
      </aside>
    </div>
  `,
})
export default class SpotlightCardPage {
  recipe = getRecipe('spotlight-card');
  nav = getAdjacentRecipes('spotlight-card');

  codeTabs: CodeTab[] = [
    { label: 'Component', code: SPOTLIGHT_CARD_DEMO_SOURCE },
  ];
}
