import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import DisappearingFeaturesDemo from '@components/animation-demos/disappearing-features-demo';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import RecipeDemo from '@components/recipe-demo';
import RecipeHero from '@components/recipe-hero';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import RecipeToc from '@components/recipe-toc';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const TEMPLATE_SOURCE = `<div
  class="disappearing-viewport relative h-[28rem] w-full overflow-y-auto rounded-2xl border border-border bg-sky-50 dark:bg-sky-950/30"
  [class.reduced-motion]="reducedMotion()"
>
  <div #track class="disappearing-track relative min-h-[250%] w-full px-6 py-10">
    <div class="grid min-h-[24rem] grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
      <div class="disappearing-text space-y-4">
        <span class="pill">Features</span>
        <h2>Learn and grow with Angular motion</h2>
        <p>
          Build scroll-driven experiences that feel premium without sacrificing
          accessibility or performance.
        </p>
      </div>

      <div class="relative h-64 md:h-80">
        <div class="disappearing-panel-top absolute inset-x-0 top-0 z-10 ...">
          Top panel fades away as the section scrolls.
        </div>
        <div class="disappearing-panel-bottom absolute inset-x-0 bottom-0 z-20 ...">
          Bottom panel rises and takes the spotlight.
        </div>
      </div>
    </div>
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
  selector: 'app-disappearing-features-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disappearing-features-demo.html',
  styleUrl: './disappearing-features-demo.css',
})
export default class DisappearingFeaturesDemo implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

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

    const viewport = this.el.nativeElement.querySelector('.disappearing-viewport');
    const track = this.el.nativeElement.querySelector('.disappearing-track');
    const text = this.el.nativeElement.querySelector('.disappearing-text');
    const panelTop = this.el.nativeElement.querySelector('.disappearing-panel-top');
    const panelBottom = this.el.nativeElement.querySelector('.disappearing-panel-bottom');

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

      tl.fromTo(text, { y: 0, opacity: 1 }, { y: -60, opacity: 0.15 }, 0);
      tl.fromTo(panelTop, { y: 0, opacity: 1 }, { y: -30, opacity: 0 }, 0);
      tl.fromTo(
        panelBottom,
        { y: 60, opacity: 0.4, scale: 0.96 },
        { y: -40, opacity: 1, scale: 1 },
        0
      );
    }, this.el.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.ctx?.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });
  }
}`;

const STYLES_SOURCE = `.disappearing-text,
.disappearing-panel-top,
.disappearing-panel-bottom {
  will-change: transform, opacity;
}

.disappearing-viewport.reduced-motion .disappearing-text,
.disappearing-viewport.reduced-motion .disappearing-panel-top,
.disappearing-viewport.reduced-motion .disappearing-panel-bottom {
  will-change: auto;
  opacity: 1 !important;
  transform: none !important;
}`;

export const routeMeta: RouteMeta = {
  title: 'Disappearing Features — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Guide attention by fading, moving and replacing feature content as the user scrolls through the section.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-disappearing-features',
  imports: [
    RecipeHero,
    RecipeDemo,
    DisappearingFeaturesDemo,
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
          <app-recipe-demo number="08" title="Demo">
            <app-disappearing-features-demo />
          </app-recipe-demo>
        </div>

        <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
          <p>
            A two-column feature section is placed inside a scrollable viewport.
            A single scrubbed GSAP timeline is linked to the scroll position of
            that viewport. As the user scrolls:
          </p>
          <ul>
            <li>
              the left text drifts up and fades to keep it readable but
              de-emphasized;
            </li>
            <li>the top visual panel fades out and moves up;</li>
            <li>
              the bottom panel rises and scales into focus, becoming the hero
              element.
            </li>
          </ul>
          <p>
            All motion is driven by <code>transform</code> and
            <code>opacity</code>, so it stays smooth even on lower-end devices.
          </p>
        </app-recipe-section>

        <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
          <ul>
            <li>
              The component has no per-frame signal writes. Scroll progress is
              handled entirely by GSAP's scrubbed timeline.
            </li>
            <li>
              Browser-only GSAP code is lazy-loaded behind
              <code>isPlatformBrowser</code>.
            </li>
            <li>
              <code>gsap.context()</code> keeps selectors scoped to the
              component host.
            </li>
            <li>
              Cleanup happens through <code>DestroyRef</code> so it works even
              if the component is destroyed before the animation finishes.
            </li>
          </ul>
        </app-recipe-section>

        <app-recipe-section title="Source code" icon="💻" id="source">
          <app-code-tabs [tabs]="codeTabs" />
        </app-recipe-section>

        <app-recipe-section title="Implementation recipe" icon="📋" id="recipe">
          <ol>
            <li>
              Build a two-column feature section with a pill, headline, body and
              two stacked visual panels.
            </li>
            <li>
              Wrap it in a scrollable viewport with a tall track so there is
              enough scroll distance to scrub through.
            </li>
            <li>
              Lazy-load <code>gsap</code> and <code>ScrollTrigger</code> inside
              <code>ngAfterViewInit</code>.
            </li>
            <li>
              Create a
              <code
                >gsap.timeline(&#123; scrollTrigger: &#123; scrub: 1 &#125;
                &#125;)</code
              >.
            </li>
            <li>
              Animate the text and panels together from time 0 so they respond
              to the same scroll progress.
            </li>
            <li>
              Add a reduced-motion fallback that leaves all content visible and
              static.
            </li>
            <li>Revert the GSAP context and kill ScrollTriggers on destroy.</li>
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
              Hiding content permanently when the animation finishes. In a
              scroll-driven demo the resting state should still expose all
              content.
            </li>
            <li>
              Using <code>filter: blur()</code> or heavy shaders during scroll;
              stick to <code>transform</code> and <code>opacity</code>.
            </li>
            <li>
              Forgetting to scope the ScrollTrigger to the local viewport when
              the demo is embedded in a page.
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
export default class DisappearingFeaturesPage {
  recipe = getRecipe('disappearing-features');
  nav = getAdjacentRecipes('disappearing-features');

  codeTabs: CodeTab[] = [
    { label: 'Template', code: TEMPLATE_SOURCE },
    { label: 'Component', code: COMPONENT_SOURCE },
    { label: 'Styles', code: STYLES_SOURCE },
  ];
}
