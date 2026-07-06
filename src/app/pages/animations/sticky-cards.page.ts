import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import StickyCardsDemo from '@components/animation-demos/sticky-cards-demo';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import RecipeDemo from '@components/recipe-demo';
import RecipeHero from '@components/recipe-hero';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import RecipeToc from '@components/recipe-toc';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const TEMPLATE_SOURCE = `<div
  class="sticky-cards-viewport relative h-[28rem] w-full overflow-y-auto rounded-2xl border border-border bg-card/50"
  [class.reduced-motion]="reducedMotion()"
>
  <div class="sticky-cards-track relative min-h-[400%] w-full">
    @for (card of cards; track card.id) {
      <div
        class="sticky-card absolute inset-0 flex items-center justify-center p-6 md:p-10"
        [class.theme-dark]="card.theme === 'dark'"
        [class.theme-light]="card.theme === 'light'"
        [class.theme-blue]="card.theme === 'blue'"
      >
        <div class="card-inner ...">
          <span class="icon">{{ card.icon }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.body }}</p>
          <button type="button">Learn more</button>
        </div>
      </div>
    }
  </div>
</div>`;

const COMPONENT_SOURCE = `import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { gsap } from 'gsap';

@Component({
  selector: 'app-sticky-cards-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sticky-cards-demo.html',
  styleUrl: './sticky-cards-demo.css',
})
export default class StickyCardsDemo implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  cards = [ /* ... */ ];
  reducedMotion = signal(false);
  private ctx: gsap.Context | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.reducedMotion.set(
      matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    if (this.reducedMotion()) return;

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    const viewport = this.el.nativeElement.querySelector('.sticky-cards-viewport');
    const track = this.el.nativeElement.querySelector('.sticky-cards-track');
    const cardEls = Array.from(
      this.el.nativeElement.querySelectorAll('.sticky-card')
    );

    cardEls.forEach((card, i) => {
      (card as HTMLElement).style.zIndex = String(i + 1);
    });

    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          scroller: viewport,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // Card 1 visible at start, scales down as card 2 enters.
      tl.fromTo(cardEls[0], { scale: 1, opacity: 1 }, { scale: 1, opacity: 1 }, 0);
      tl.to(cardEls[0], { scale: 0.9, opacity: 0.35 }, 0.25);
      tl.to(cardEls[0], { opacity: 0 }, 0.42);

      // Card 2 slides up, then scales down as card 3 enters.
      tl.fromTo(
        cardEls[1],
        { yPercent: 100, opacity: 0, scale: 0.92 },
        { yPercent: 0, opacity: 1, scale: 1 },
        0.2
      );
      tl.to(cardEls[1], { scale: 0.9, opacity: 0.35 }, 0.58);
      tl.to(cardEls[1], { opacity: 0 }, 0.75);

      // Card 3 slides up and stays visible.
      tl.fromTo(
        cardEls[2],
        { yPercent: 100, opacity: 0, scale: 0.92 },
        { yPercent: 0, opacity: 1, scale: 1 },
        0.55
      );
    }, this.el.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.ctx?.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });
  }
}`;

const STYLES_SOURCE = `.sticky-cards-viewport {
  scroll-behavior: smooth;
}

.sticky-cards-viewport.reduced-motion .sticky-card {
  position: relative;
  opacity: 1;
  transform: none;
  inset: auto;
  margin-bottom: 1rem;
}

.theme-dark .card-inner {
  background: #0a0a0a;
  color: #fafafa;
}

.theme-light .card-inner {
  background: #ffffff;
  color: #18181b;
}

.theme-blue .card-inner {
  background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
  color: #ffffff;
}`;

export const routeMeta: RouteMeta = {
  title: 'Sticky Cards — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Stack full-screen feature cards while scrolling with Angular, GSAP and ScrollTrigger.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-sticky-cards',
  imports: [
    RecipeHero,
    RecipeDemo,
    StickyCardsDemo,
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
          <app-recipe-demo number="07" title="Demo">
            <app-sticky-cards-demo />
          </app-recipe-demo>
        </div>

        <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
          <p>
            Each card is absolutely positioned inside a tall scrollable track.
            As the user scrolls, a single GSAP timeline with a
            <code>ScrollTrigger</code> maps scroll progress to the cards'
            <code>yPercent</code>, <code>opacity</code> and <code>scale</code>.
            Earlier cards scale down and fade while the next card slides up from
            below, producing a stacked, sticky feel without relying on CSS
            <code>position: sticky</code>.
          </p>
          <p>
            The first card is visible at scroll position 0 so the demo never
            looks empty. As the user scrolls, the second and third cards slide
            up and take over the viewport.
          </p>
          <p>
            The demo is self-contained: the ScrollTrigger uses the
            <code>scroller</code> option to watch the demo viewport instead of
            the page, so it works inside the showcase without page-level scroll.
          </p>
        </app-recipe-section>

        <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
          <ul>
            <li>
              GSAP and ScrollTrigger are lazy-loaded inside
              <code>ngAfterViewInit</code> and guarded by
              <code>isPlatformBrowser</code> so SSR never runs browser-only
              code.
            </li>
            <li>
              <code>gsap.context()</code> scopes all selectors to the component
              host, making cleanup reliable.
            </li>
            <li>
              <code>DestroyRef</code> tears down the context and kills every
              ScrollTrigger when the route changes.
            </li>
            <li>
              <code>prefers-reduced-motion</code> bypasses the scroll-driven
              animation and renders the cards in a normal stacked layout.
            </li>
          </ul>
        </app-recipe-section>

        <app-recipe-section title="Source code" icon="💻" id="source">
          <app-code-tabs [tabs]="codeTabs" />
        </app-recipe-section>

        <app-recipe-section title="Implementation recipe" icon="📋" id="recipe">
          <ol>
            <li>
              Create a standalone Angular component with a tall scrollable
              container and a track with enough height.
            </li>
            <li>
              Add the card markup. Use absolute positioning and z-index so cards
              can stack visually.
            </li>
            <li>
              Lazy-load <code>gsap</code> and <code>gsap/ScrollTrigger</code>
              only in the browser.
            </li>
            <li>
              Use
              <code
                >gsap.timeline(&#123; scrollTrigger: &#123; ... &#125;
                &#125;)</code
              >
              with <code>scrub: 1</code> and the local viewport as
              <code>scroller</code>.
            </li>
            <li>
              Make the first card visible at scroll 0, then animate subsequent
              cards in while scaling/fading the previous ones.
            </li>
            <li>
              Add a <code>prefers-reduced-motion</code> fallback that shows the
              cards stacked without animation.
            </li>
            <li>
              Clean up with <code>gsap.context().revert()</code> and kill all
              ScrollTriggers on destroy.
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
              Letting ScrollTrigger attach to the window when the demo lives
              inside a scrollable container — always pass the correct
              <code>scroller</code>.
            </li>
            <li>
              Forgetting to kill ScrollTriggers on route change, which causes
              errors and leaked listeners.
            </li>
            <li>
              Animating <code>top</code>, <code>left</code> or layout properties
              instead of <code>transform</code> and <code>opacity</code>.
            </li>
            <li>
              Starting every card with <code>opacity: 0</code> so the demo looks
              empty before the user interacts.
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
export default class StickyCardsPage {
  recipe = getRecipe('sticky-cards');
  nav = getAdjacentRecipes('sticky-cards');

  codeTabs: CodeTab[] = [
    { label: 'Template', code: TEMPLATE_SOURCE },
    { label: 'Component', code: COMPONENT_SOURCE },
    { label: 'Styles', code: STYLES_SOURCE },
  ];
}
