import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import SwapColumnFeaturesDemo from '@components/animation-demos/swap-column-features-demo';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import RecipeDemo from '@components/recipe-demo';
import RecipeHero from '@components/recipe-hero';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import RecipeToc from '@components/recipe-toc';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const TEMPLATE_SOURCE = `<div class="flex w-full max-w-3xl flex-col gap-4">
  <div class="toolbar ...">
    <span>Swap layout with GSAP</span>
    <button
      type="button"
      [attr.aria-pressed]="swapped()"
      (click)="toggleSwap()"
    >
      {{ swapped() ? 'Reset columns' : 'Swap columns' }}
    </button>
  </div>

  <div #stage class="swap-stage ...">
    <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
      <div #textCol class="swap-text space-y-3">
        <h3>They're all here</h3>
        <p>...</p>
        <span class="badge">Angular + GSAP</span>
      </div>

      <div #visualCol class="swap-visual ...">
        <pre><code>...</code></pre>
      </div>
    </div>
  </div>
</div>`;

const COMPONENT_SOURCE = `import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { gsap } from 'gsap';

@Component({
  selector: 'app-swap-column-features-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './swap-column-features-demo.html',
})
export default class SwapColumnFeaturesDemo {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  swapped = signal(false);
  private reducedMotion = false;
  private gsapInstance: typeof import('gsap').default | null = null;
  private activeTimeline: gsap.core.Timeline | null = null;
  private firstEffect = true;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.reducedMotion = matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    effect(() => {
      const isSwapped = this.swapped();
      void this.animate(isSwapped);
    });

    this.destroyRef.onDestroy(() => {
      this.activeTimeline?.kill();
      this.gsapInstance?.killTweensOf([
        this.el.nativeElement.querySelector('.swap-text'),
        this.el.nativeElement.querySelector('.swap-visual'),
      ]);
    });
  }

  private async animate(isSwapped: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.firstEffect) {
      this.firstEffect = false;
      return;
    }

    if (!this.gsapInstance) {
      const mod = await import('gsap');
      this.gsapInstance = mod.default;
    }

    const gsap = this.gsapInstance;
    const textCol = this.el.nativeElement.querySelector('.swap-text');
    const visualCol = this.el.nativeElement.querySelector('.swap-visual');

    this.activeTimeline?.kill();
    gsap.killTweensOf([textCol, visualCol]);

    if (this.reducedMotion) {
      gsap.set([textCol, visualCol], { clearProps: 'all' });
      textCol.style.order = isSwapped ? '2' : '1';
      visualCol.style.order = isSwapped ? '1' : '2';
      return;
    }

    const xMove = 100;
    const duration = 0.7;
    const ease = 'power3.inOut';
    const tl = gsap.timeline({ defaults: { ease } });
    this.activeTimeline = tl;

    const textOut = isSwapped ? xMove : -xMove;
    const visualOut = isSwapped ? -xMove : xMove;

    tl.to(textCol, { xPercent: textOut, opacity: 0.5, scale: 0.96, duration }, 0);
    tl.to(visualCol, { xPercent: visualOut, opacity: 0.5, scale: 0.96, duration }, 0);
    tl.set(textCol, { order: isSwapped ? 2 : 1 });
    tl.set(visualCol, { order: isSwapped ? 1 : 2 });
    tl.fromTo(textCol, { xPercent: -textOut, opacity: 0.5, scale: 0.96 }, { xPercent: 0, opacity: 1, scale: 1, duration });
    tl.fromTo(visualCol, { xPercent: -visualOut, opacity: 0.5, scale: 0.96 }, { xPercent: 0, opacity: 1, scale: 1, duration }, '<');
  }

  toggleSwap() {
    this.swapped.update((v) => !v);
  }
}`;

const STYLES_SOURCE = `.swap-text,
.swap-visual {
  will-change: transform, opacity;
}

.swap-visual {
  background: var(--color-foreground);
  color: var(--color-background);
}

button[aria-pressed] {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}`;

export const routeMeta: RouteMeta = {
  title: 'Swap Column Features — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Animate text and visual columns between states to explain product features with a polished editorial rhythm.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-swap-column-features',
  imports: [
    RecipeHero,
    RecipeDemo,
    SwapColumnFeaturesDemo,
    RecipeSection,
    CodeTabs,
    RecipeNav,
    RecipeToc,
  ],
  template: `
    <app-recipe-hero [recipe]="recipe" />

    <div class="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div class="space-y-16">
        <div id="demo" class="scroll-mt-28">
          <app-recipe-demo number="09" title="Demo">
            <app-swap-column-features-demo />
          </app-recipe-demo>
        </div>

        <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
          <p>
            A signal called <code>swapped</code> tracks which column is on the
            left. When the user clicks the toggle, an Angular
            <code>effect()</code> reacts to the signal change and runs a GSAP
            timeline that animates both columns out, swaps their CSS
            <code>order</code>, then animates them back in.
          </p>
          <p>
            The animation uses <code>xPercent</code> for the lateral movement,
            <code>opacity</code> for the cross-fade, and <code>scale</code> for
            a subtle zoom. Because the motion is handled by GSAP, Angular change
            detection only runs once per toggle, not on every animation frame.
          </p>
          <p>
            The first effect run is skipped so the demo loads in its resting
            state without an unwanted entrance animation.
          </p>
        </app-recipe-section>

        <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
          <ul>
            <li>
              State is a plain <code>signal(false)</code>. The template binds
              the button label and <code>aria-pressed</code> to it.
            </li>
            <li>
              The animation is triggered inside an <code>effect()</code>, so it
              responds to state changes without manual subscription management.
            </li>
            <li>GSAP is lazy-loaded once and reused for subsequent toggles.</li>
            <li>
              <code>prefers-reduced-motion</code> skips the timeline and applies
              the <code>order</code> change instantly.
            </li>
            <li>
              <code>DestroyRef</code> kills any active tweens when the component
              is destroyed.
            </li>
          </ul>
        </app-recipe-section>

        <app-recipe-section title="Source code" icon="💻" id="source">
          <app-code-tabs [tabs]="codeTabs" />
        </app-recipe-section>

        <app-recipe-section title="Implementation recipe" icon="📋" id="recipe">
          <ol>
            <li>
              Create a standalone component with a two-column grid and a toggle
              button.
            </li>
            <li>
              Add a <code>swapped = signal(false)</code> and a
              <code>toggleSwap()</code> method.
            </li>
            <li>
              Lazy-load GSAP in an <code>effect()</code> that reads
              <code>swapped()</code>.
            </li>
            <li>
              Skip the first effect run to avoid an entrance animation on load.
            </li>
            <li>
              Query the two columns and animate them out with
              <code>xPercent</code>, <code>opacity</code> and
              <code>scale</code>.
            </li>
            <li>
              Swap the CSS <code>order</code> at the midpoint of the timeline.
            </li>
            <li>Animate the columns back in to their new positions.</li>
            <li>
              Handle <code>prefers-reduced-motion</code> by applying the order
              change instantly.
            </li>
            <li>Kill tweens on destroy to avoid orphan animations.</li>
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
              Writing to a signal inside the GSAP tween — this would trigger
              Angular change detection on every frame. Let GSAP own the DOM
              transforms.
            </li>
            <li>
              Forgetting to kill the previous timeline before starting a new
              one, causing conflicting tweens when the user clicks rapidly.
            </li>
            <li>
              Relying on <code>flex-direction: row-reverse</code> instead of
              <code>order</code>; <code>order</code> works better with CSS Grid
              and keeps the source order stable for screen readers.
            </li>
            <li>
              Running an entrance animation on load because the effect fires
              immediately. Use a flag to skip the first run.
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
export default class SwapColumnFeaturesPage {
  recipe = getRecipe('swap-column-features');
  nav = getAdjacentRecipes('swap-column-features');

  codeTabs: CodeTab[] = [
    { label: 'Template', code: TEMPLATE_SOURCE },
    { label: 'Component', code: COMPONENT_SOURCE },
    { label: 'Styles', code: STYLES_SOURCE },
  ];
}
