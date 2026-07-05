import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import MagneticButtonDemo from '@components/animation-demos/magnetic-button-demo';
import AnimationShowcase from '@components/animation-showcase';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import MetaPill from '@components/meta-pill';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const MAGNETIC_BUTTON_DEMO_SOURCE = `import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-magnetic-button-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button
      #magnet
      type="button"
      class="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-base font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Hover me
    </button>
  \`,
})
export default class MagneticButtonDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>('magnet');

  private cleanup: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => this.cleanup?.());
  }

  private async setup() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { gsap } = await import('gsap');
    const button = this.buttonRef().nativeElement;

    const setX = gsap.quickTo(button, 'x', { duration: 0.5, ease: 'power3' });
    const setY = gsap.quickTo(button, 'y', { duration: 0.5, ease: 'power3' });

    const onMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      setX(relX * 0.35);
      setY(relY * 0.35);
    };

    const onLeave = () => {
      setX(0);
      setY(0);
    };

    button.addEventListener('pointermove', onMove);
    button.addEventListener('pointerleave', onLeave);

    this.cleanup = () => {
      button.removeEventListener('pointermove', onMove);
      button.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(button);
    };
  }
}
`;

export const routeMeta: RouteMeta = {
  title: 'Magnetic Button — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'A button that gently follows the cursor using gsap.quickTo, without touching Angular state.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-magnetic-button',
  imports: [
    AnimationShowcase,
    MagneticButtonDemo,
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
      <app-animation-showcase number="04" title="Demo">
        <app-magnetic-button-demo />
      </app-animation-showcase>

      <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
        <p>
          On <code>pointermove</code>, the handler measures the cursor's offset
          from the button's center and calls two
          <code>gsap.quickTo()</code> setters — one for <code>x</code>, one for
          <code>y</code> — with a fraction of that offset. Unlike
          <code>gsap.to()</code>, <code>quickTo()</code> returns a reusable
          function optimized to be called many times per second: it reuses the
          same tween instead of creating a new one on every call.
        </p>
        <p>
          On <code>pointerleave</code>, both setters are called with
          <code>0</code>, so the button eases back to its resting position with
          the same duration and easing.
        </p>
      </app-recipe-section>

      <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
        <ul>
          <li>
            The pointer handlers are plain
            <code>addEventListener</code> calls attached once in
            <code>afterNextRender()</code>, not Angular
            <code>(pointermove)</code> template bindings — that keeps every
            mouse move from going through Angular's binding/read path at all.
          </li>
          <li>
            No signal is written on every pointer event. The button's position
            is owned entirely by GSAP; Angular never re-renders because of it.
          </li>
          <li>
            <code>viewChild.required('magnet')</code> gets the button element;
            setup runs once, in <code>afterNextRender()</code>, guarded by
            <code>isPlatformBrowser()</code> since this project's SSR setup
            still runs <code>afterRender</code> hooks while prerendering.
          </li>
          <li>
            Cleanup removes both listeners and calls
            <code>gsap.killTweensOf(button)</code> from
            <code>DestroyRef.onDestroy()</code>.
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
            Add the static markup: a single real
            <code>&lt;button&gt;</code>, no wrapper element required.
          </li>
          <li>
            Query the button with
            <code>viewChild.required&lt;ElementRef&gt;('magnet')</code>.
          </li>
          <li>
            Lazy-load GSAP with <code>await import('gsap')</code> inside
            <code>afterNextRender()</code>, and bail out early if the user
            prefers reduced motion.
          </li>
          <li>
            Build the animation:
            <code
              >gsap.quickTo(button, 'x', &#123; duration: 0.5, ease: 'power3'
              &#125;)</code
            >, one setter per axis.
          </li>
          <li>
            Add cleanup: remove both listeners and kill tweens of the button in
            <code>destroyRef.onDestroy()</code>.
          </li>
          <li>
            Add reduced motion: skip attaching the listeners entirely instead of
            animating with a zero duration.
          </li>
          <li>
            Test keyboard/accessibility: tab to the button, confirm the focus
            ring is visible, and confirm <kbd>Enter</kbd>/<kbd>Space</kbd>
            still activate it — the magnetic effect only listens for pointer
            events.
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
            Calling <code>gsap.to()</code> directly inside the
            <code>pointermove</code> handler — it works, but creates and tears
            down a tween on every event. <code>quickTo()</code> exists
            specifically to avoid that cost.
          </li>
          <li>
            Writing the pointer offset into a component signal to drive the
            template — this forces change detection on every mouse move for no
            visual benefit, since GSAP is already updating the DOM directly.
          </li>
          <li>
            Leaving the effect active for users who prefer reduced motion — skip
            attaching the listeners rather than reducing the animation duration
            to near-zero.
          </li>
        </ul>
      </app-recipe-section>

      <app-recipe-nav [prev]="nav.prev" [next]="nav.next" />
    </div>
  `,
})
export default class MagneticButtonPage {
  recipe = getRecipe('magnetic-button');
  nav = getAdjacentRecipes('magnetic-button');

  codeTabs: CodeTab[] = [
    { label: 'Component', code: MAGNETIC_BUTTON_DEMO_SOURCE },
  ];
}
