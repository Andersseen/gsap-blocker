import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import StaggerRevealDemo from '@components/animation-demos/stagger-reveal-demo';
import AnimationShowcase from '@components/animation-showcase';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import MetaPill from '@components/meta-pill';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const STAGGER_REVEAL_DEMO_SOURCE = `import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import type { gsap } from 'gsap';

interface StaggerItem {
  id: number;
  label: string;
  emoji: string;
}

const ITEMS: StaggerItem[] = [
  { id: 1, label: 'Design', emoji: '🎨' },
  { id: 2, label: 'Build', emoji: '🛠️' },
  { id: 3, label: 'Animate', emoji: '✨' },
  { id: 4, label: 'Test', emoji: '🧪' },
  { id: 5, label: 'Ship', emoji: '🚀' },
  { id: 6, label: 'Measure', emoji: '📈' },
];

@Component({
  selector: 'app-stagger-reveal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="w-full max-w-2xl">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        @for (item of items(); track item.id) {
          <div
            #item
            class="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center"
          >
            <span class="text-3xl" aria-hidden="true">{{ item.emoji }}</span>
            <span class="text-sm font-semibold text-foreground">{{
              item.label
            }}</span>
          </div>
        }
      </div>

      <button
        type="button"
        class="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
        (click)="replay()"
      >
        <span aria-hidden="true">↻</span> Replay
      </button>
    </div>
  \`,
})
export default class StaggerRevealDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly itemRefs = viewChildren<ElementRef<HTMLElement>>('item');

  private gsapInstance: typeof import('gsap').default | null = null;
  private tween: gsap.core.Tween | null = null;

  items = signal(ITEMS);

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { gsap } = await import('gsap');
      this.gsapInstance = gsap;
      this.play();
    });

    this.destroyRef.onDestroy(() => this.tween?.kill());
  }

  private play() {
    if (!this.gsapInstance) return;

    const targets = this.itemRefs().map((ref) => ref.nativeElement);
    if (!targets.length) return;

    this.tween?.kill();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.gsapInstance.set(targets, { opacity: 1, y: 0 });
      return;
    }

    this.tween = this.gsapInstance.from(targets, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
    });
  }

  replay() {
    this.play();
  }
}
`;

export const routeMeta: RouteMeta = {
  title: 'Stagger Reveal — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Reveal a list of elements one after another using gsap.from and stagger, the Angular way.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-stagger-reveal',
  imports: [
    AnimationShowcase,
    StaggerRevealDemo,
    MetaPill,
    RecipeSection,
    CodeTabs,
    RecipeNav,
  ],
  template: `
    <div class="max-w-3xl mb-12">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <app-meta-pill [label]="recipe.difficulty" variant="difficulty" />
        <app-meta-pill [label]="recipe.category" variant="neutral" />
      </div>
      <h1
        class="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4"
      >
        {{ recipe.title }}
      </h1>
      <p class="text-xl text-muted-foreground">{{ recipe.description }}</p>

      <div class="mt-6 flex flex-wrap gap-1.5">
        @for (c of recipe.angularConcepts; track c) {
          <app-meta-pill [label]="c" variant="angular" />
        }
        @for (c of recipe.gsapConcepts; track c) {
          <app-meta-pill [label]="c" variant="gsap" />
        }
      </div>
    </div>

    <div class="space-y-16">
      <app-animation-showcase number="01" title="Demo">
        <app-stagger-reveal-demo />
      </app-animation-showcase>

      <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
        <p>
          The demo renders six cards with a plain <code>&#64;for</code> loop and
          a template reference variable, <code>#item</code>, on each one. A
          signal query, <code>viewChildren&lt;ElementRef&gt;('item')</code>,
          collects those elements once the view has rendered. A single
          <code>gsap.from()</code> call then animates all of them together —
          fading in and sliding up — with the <code>stagger</code> option
          spacing out each element's start time by 80ms.
        </p>
        <p>
          Because it's one tween targeting an array of elements rather than one
          tween per card, GSAP only has to manage a single timeline internally,
          which is both simpler to clean up and cheaper to run.
        </p>
      </app-recipe-section>

      <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
        <ul>
          <li>
            The component is <strong>standalone</strong> with
            <strong>OnPush</strong> change detection — GSAP mutates the DOM
            directly, so there's no reactive state for Angular to track once the
            animation starts.
          </li>
          <li>
            <code>viewChildren('item')</code> is a signal-based query, so the
            list of elements is always read fresh from
            <code>itemRefs()</code> instead of being cached as a mutable field.
          </li>
          <li>
            GSAP is imported lazily with
            <code>await import('gsap')</code> inside
            <code>afterNextRender()</code>. This project's SSR setup still runs
            <code>afterRender</code> hooks during prerendering, so the callback
            also checks <code>isPlatformBrowser()</code> before touching
            <code>matchMedia</code> or GSAP — the same guard used everywhere
            else in this codebase.
          </li>
          <li>
            <code>DestroyRef.onDestroy()</code> kills the tween when the
            component is torn down, so nothing keeps animating (or keeps a
            reference alive) after a route change.
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
            Add the static markup: a <code>&#64;for</code> loop over your data,
            with a <code>#item</code> template reference on each element.
          </li>
          <li>
            Query the animated elements with
            <code>viewChildren&lt;ElementRef&gt;('item')</code>.
          </li>
          <li>
            Lazy-load GSAP with <code>await import('gsap')</code> inside
            <code>afterNextRender()</code>.
          </li>
          <li>
            Build the animation:
            <code
              >gsap.from(targets, &#123; opacity: 0, y: 24, stagger: 0.08
              &#125;)</code
            >.
          </li>
          <li>
            Add cleanup: kill the tween in
            <code>destroyRef.onDestroy()</code>.
          </li>
          <li>
            Add reduced motion: check
            <code>matchMedia('(prefers-reduced-motion: reduce)')</code> and call
            <code>gsap.set()</code> to the resting state instead of animating.
          </li>
          <li>
            Test keyboard/accessibility: confirm the cards are readable and in
            the DOM before the animation runs, and that reduced motion leaves
            them fully visible immediately.
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

      <app-recipe-section title="Performance notes" icon="⚡" id="performance">
        <ul>
          @for (item of recipe.performance; track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </app-recipe-section>

      <app-recipe-section title="Common pitfalls" icon="⚠️" id="pitfalls">
        <ul>
          <li>
            Animating one card per tween instead of passing the whole array to a
            single <code>gsap.from()</code> call — it works, but it's harder to
            stagger consistently and harder to clean up.
          </li>
          <li>
            Reading <code>itemRefs()</code> before the view has rendered —
            always trigger the first animation from inside
            <code>afterNextRender()</code>, not the constructor.
          </li>
          <li>
            Forgetting <code>stagger</code>'s unit is seconds between starts,
            not total duration — a large list with a large stagger can take
            longer to finish than expected.
          </li>
        </ul>
      </app-recipe-section>

      <app-recipe-nav [prev]="nav.prev" [next]="nav.next" />
    </div>
  `,
})
export default class StaggerRevealPage {
  recipe = getRecipe('stagger-reveal');
  nav = getAdjacentRecipes('stagger-reveal');

  codeTabs: CodeTab[] = [
    { label: 'Component', code: STAGGER_REVEAL_DEMO_SOURCE },
  ];
}
