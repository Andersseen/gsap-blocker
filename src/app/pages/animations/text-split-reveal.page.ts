import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import TextSplitRevealDemo from '@components/animation-demos/text-split-reveal-demo';
import AnimationShowcase from '@components/animation-showcase';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import MetaPill from '@components/meta-pill';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const TEXT_SPLIT_REVEAL_DEMO_SOURCE = `import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import type { gsap } from 'gsap';

@Component({
  selector: 'app-text-split-reveal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="w-full max-w-xl text-center">
      <h2
        class="text-3xl md:text-5xl font-black tracking-tight text-foreground"
        [attr.aria-label]="text()"
      >
        @for (word of words(); track $index) {
          <span #word class="inline-block" aria-hidden="true"
            >{{ word }}&nbsp;</span
          >
        }
      </h2>

      <button
        type="button"
        class="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
        (click)="replay()"
      >
        <span aria-hidden="true">↻</span> Replay
      </button>
    </div>
  \`,
})
export default class TextSplitRevealDemo {
  text = input('Build motion the Angular way.');
  words = computed(() => this.text().split(' '));

  private readonly destroyRef = inject(DestroyRef);
  private readonly wordRefs = viewChildren<ElementRef<HTMLElement>>('word');

  private gsapInstance: typeof import('gsap').default | null = null;
  private tween: gsap.core.Tween | null = null;

  constructor() {
    afterNextRender(async () => {
      const { gsap } = await import('gsap');
      this.gsapInstance = gsap;
      this.play();
    });

    this.destroyRef.onDestroy(() => this.tween?.kill());
  }

  private play() {
    if (!this.gsapInstance) return;

    const targets = this.wordRefs().map((ref) => ref.nativeElement);
    if (!targets.length) return;

    this.tween?.kill();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.gsapInstance.set(targets, { opacity: 1, y: 0 });
      return;
    }

    this.tween = this.gsapInstance.from(targets, {
      opacity: 0,
      y: '100%',
      duration: 0.7,
      ease: 'power4.out',
      stagger: 0.06,
    });
  }

  replay() {
    this.play();
  }
}
`;

export const routeMeta: RouteMeta = {
  title: 'Text Split Reveal — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Reveal a heading word-by-word with GSAP stagger while keeping the sentence accessible.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-text-split-reveal',
  imports: [
    AnimationShowcase,
    TextSplitRevealDemo,
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
      <app-animation-showcase number="03" title="Demo">
        <app-text-split-reveal-demo />
      </app-animation-showcase>

      <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
        <p>
          The heading text is split into words with a
          <code>computed()</code> signal — <code>text().split(' ')</code> — and
          each word is rendered by its own <code>&#64;for</code> loop iteration
          wrapped in an <code>inline-block</code> span. A
          <code>viewChildren</code> query collects those spans, and a single
          <code>gsap.from()</code> call animates them all with a small stagger,
          sliding each word up from below its own baseline.
        </p>
        <p>
          The split only ever happens once per input string, because it's
          derived from a signal rather than recomputed inside the template on
          every change detection cycle.
        </p>
      </app-recipe-section>

      <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
        <ul>
          <li>
            <code>words</code> is a <code>computed()</code> signal over the
            <code>text</code> input, so splitting stays declarative and re-runs
            automatically if the input ever changes.
          </li>
          <li>
            <code>&#64;for (word of words(); track $index)</code> renders one
            span per word; <code>viewChildren&lt;ElementRef&gt;('word')</code>
            reads them back as a signal once the view exists.
          </li>
          <li>
            GSAP loads lazily inside <code>afterNextRender()</code>. Because
            this project's SSR setup still runs <code>afterRender</code> hooks
            while prerendering, the callback also checks
            <code>isPlatformBrowser()</code> before calling
            <code>matchMedia</code> or importing GSAP.
          </li>
          <li>
            <code>DestroyRef.onDestroy()</code> kills the tween so replaying the
            animation, or navigating away mid-animation, never leaves two tweens
            fighting over the same spans.
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
            Add the static markup: an outer heading with
            <code>[attr.aria-label]</code> set to the full sentence, and an
            <code>&#64;for</code> loop over the split words inside it.
          </li>
          <li>
            Query the animated elements with
            <code>viewChildren&lt;ElementRef&gt;('word')</code>.
          </li>
          <li>
            Lazy-load GSAP with <code>await import('gsap')</code> inside
            <code>afterNextRender()</code>.
          </li>
          <li>
            Build the animation:
            <code
              >gsap.from(words, &#123; opacity: 0, y: '100%', stagger: 0.06
              &#125;)</code
            >.
          </li>
          <li>
            Add cleanup: kill the tween in
            <code>destroyRef.onDestroy()</code>.
          </li>
          <li>
            Add reduced motion: fall back to <code>gsap.set()</code> with the
            resting values when the user prefers reduced motion.
          </li>
          <li>
            Test keyboard/accessibility: a screen reader should announce the
            full sentence once, not once per word — verify with
            <code>aria-hidden</code> on every split span.
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
            Splitting text into spans without <code>aria-hidden</code> and an
            <code>aria-label</code> on the container — screen readers will read
            the sentence one word (or letter) at a time.
          </li>
          <li>
            Splitting on every render instead of via a <code>computed()</code>
            — recomputing the word array on unrelated change detection runs can
            tear down and rebuild the DOM nodes GSAP is animating.
          </li>
          <li>
            Animating with percentage-based <code>y</code> values on an element
            that isn't <code>display: inline-block</code> (or block) —
            percentages resolve against the element's own box, so it needs an
            explicit height to move against.
          </li>
        </ul>
      </app-recipe-section>

      <app-recipe-nav [prev]="nav.prev" [next]="nav.next" />
    </div>
  `,
})
export default class TextSplitRevealPage {
  recipe = getRecipe('text-split-reveal');
  nav = getAdjacentRecipes('text-split-reveal');

  codeTabs: CodeTab[] = [
    { label: 'Component', code: TEXT_SPLIT_REVEAL_DEMO_SOURCE },
  ];
}
