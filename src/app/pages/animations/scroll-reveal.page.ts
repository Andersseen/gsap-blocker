import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import ScrollRevealDemo from '@components/animation-demos/scroll-reveal-demo';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import RecipeDemo from '@components/recipe-demo';
import RecipeHero from '@components/recipe-hero';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import RecipeToc from '@components/recipe-toc';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const SCROLL_REVEAL_DEMO_SOURCE = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AndGsapScrollDirective } from '@shared/directives/and-gsap-scroll.directive';

interface ScrollSection {
  id: number;
  title: string;
  body: string;
}

const SECTIONS: ScrollSection[] = [
  {
    id: 1,
    title: 'Scroll down ↓',
    body: 'Each card fades and slides in as it crosses this container — not the page.',
  },
  {
    id: 2,
    title: 'Scoped ScrollTrigger',
    body: 'andGsapScroll points its ScrollTrigger at this box through the scroller input.',
  },
  {
    id: 3,
    title: 'Cleaned up on destroy',
    body: 'Every ScrollTrigger created here is killed in ngOnDestroy, so nothing leaks on route change.',
  },
];

@Component({
  selector: 'app-scroll-reveal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AndGsapScrollDirective],
  template: \`
    <div
      data-scroll-demo-viewport
      class="h-80 w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card/50 p-6"
    >
      <p class="mb-32 text-sm text-muted-foreground">
        Scroll inside this box ↓
      </p>
      @for (section of sections; track section.id) {
        <div
          andGsapScroll
          scroller="[data-scroll-demo-viewport]"
          start="top 85%"
          [from]="{ opacity: 0, y: 40, duration: 0.6, ease: 'power3.out' }"
          class="mb-32 rounded-2xl border border-border bg-background p-6 last:mb-0"
        >
          <h4 class="font-semibold text-foreground">{{ section.title }}</h4>
          <p class="mt-2 text-sm text-muted-foreground">{{ section.body }}</p>
        </div>
      }
    </div>
  \`,
})
export default class ScrollRevealDemo {
  sections = SECTIONS;
}
`;

const AND_GSAP_SCROLL_SOURCE = `import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import type { gsap } from 'gsap';

@Directive({
  selector: '[andGsapScroll]',
})
export class AndGsapScrollDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** ScrollTrigger options */
  start = input<string>('top bottom');
  end = input<string | undefined>(undefined);
  scrub = input<boolean | number>(1);
  markers = input<boolean | undefined>(undefined);
  pin = input<boolean | undefined>(undefined);
  /** Element (or selector) that owns the scrollbar; defaults to the window */
  scroller = input<HTMLElement | string | undefined>(undefined);

  /** Simple API: animate the host element */
  from = input<gsap.TweenVars | undefined>(undefined);
  to = input<gsap.TweenVars | undefined>(undefined);

  /** Advanced API: build your own timeline */
  timeline = input<
    ((tl: gsap.core.Timeline, el: HTMLElement) => void) | undefined
  >(undefined);

  private tl: gsap.core.Timeline | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const host = this.el.nativeElement;
    const from = this.from();
    const to = this.to();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Land directly on the resting state instead of animating on scroll.
      if (to) {
        const { gsap } = await import('gsap');
        gsap.set(host, to);
      }
      return;
    }

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: host,
        scroller: this.scroller(),
        start: this.start(),
        end: this.end(),
        scrub: this.scrub(),
        markers: this.markers(),
        pin: this.pin(),
      },
    });

    const buildTimeline = this.timeline();
    if (buildTimeline) {
      buildTimeline(this.tl, host);
    } else {
      if (from) this.tl.from(host, from);
      if (to) this.tl.to(host, to);
    }
  }

  ngOnDestroy(): void {
    this.tl?.scrollTrigger?.kill();
    this.tl?.kill();
    this.tl = null;
  }
}
`;

export const routeMeta: RouteMeta = {
  title: 'Scroll Reveal — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Reveal an element as it enters the viewport with an SSR-safe ScrollTrigger directive.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-scroll-reveal',
  imports: [
    RecipeHero,
    RecipeDemo,
    RecipeToc,
    ScrollRevealDemo,
    RecipeSection,
    CodeTabs,
    RecipeNav,
  ],
  template: `
    <app-recipe-hero [recipe]="recipe" />

    <div class="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div class="space-y-16">
        <div id="demo" class="scroll-mt-28">
          <app-recipe-demo number="02" title="Demo">
            <app-scroll-reveal-demo />
          </app-recipe-demo>
        </div>

        <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
          <p>
            <code>andGsapScroll</code> is an attribute directive: drop it on any
            element with a <code>from</code> or <code>to</code> input and it
            creates a GSAP timeline driven by a
            <code>ScrollTrigger</code> scoped to that one element. The demo box
            scrolls independently of the page, so the directive's
            <code>scroller</code> input points <code>ScrollTrigger</code> at the
            box itself (via a CSS selector) instead of the window.
          </p>
          <p>
            Each card gets its own <code>ScrollTrigger</code> instance, created
            in <code>ngAfterViewInit</code> and destroyed in
            <code>ngOnDestroy</code> — so scrolling the container, resizing the
            window, or navigating away never leaves a stale trigger listening in
            the background.
          </p>
        </app-recipe-section>

        <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
          <ul>
            <li>
              Both <code>gsap</code> and <code>gsap/ScrollTrigger</code> are
              imported with
              <code
                >await Promise.all([import('gsap'),
                import('gsap/ScrollTrigger')])</code
              >
              inside <code>ngAfterViewInit</code>, guarded by
              <code>isPlatformBrowser(this.platformId)</code> — so the plugin is
              never registered during SSR or prerendering.
            </li>
            <li>
              All directive options — <code>start</code>, <code>end</code>,
              <code>scrub</code>, <code>scroller</code>, <code>from</code>,
              <code>to</code> — are <code>input()</code> signals, matching the
              other <code>andGsap*</code> directives in this project.
            </li>
            <li>
              <code>ngOnDestroy</code> calls
              <code>this.tl?.scrollTrigger?.kill()</code> before
              <code>this.tl?.kill()</code> — killing the trigger first prevents
              it from firing once more during teardown.
            </li>
          </ul>
        </app-recipe-section>

        <app-recipe-section title="Source code" icon="💻" id="source">
          <app-code-tabs [tabs]="codeTabs" />
        </app-recipe-section>

        <app-recipe-section title="Implementation recipe" icon="📋" id="recipe">
          <ol>
            <li>
              Create the directive as a standalone
              <code
                >&#64;Directive(&#123; selector: '[andGsapScroll]' &#125;)</code
              >.
            </li>
            <li>
              Add the static markup: any element with the attribute and a
              <code>from</code>/<code>to</code> object.
            </li>
            <li>
              Query the animated element with <code>ElementRef</code> via
              <code>inject()</code> — the directive's host is the trigger.
            </li>
            <li>
              Lazy-load GSAP and <code>ScrollTrigger</code> together inside
              <code>ngAfterViewInit</code>, behind an
              <code>isPlatformBrowser</code> guard.
            </li>
            <li>
              Build the animation: a
              <code
                >gsap.timeline(&#123; scrollTrigger: &#123; trigger, scroller,
                start, scrub &#125; &#125;)</code
              >.
            </li>
            <li>
              Add cleanup: kill the <code>scrollTrigger</code> and the timeline
              in <code>ngOnDestroy</code>.
            </li>
            <li>
              Add reduced motion: skip the scroll-linked animation entirely and
              jump straight to the resting state when
              <code>prefers-reduced-motion: reduce</code> matches.
            </li>
            <li>
              Test keyboard/accessibility: the content must already be present
              and readable in the DOM — scroll-triggered reveals should never
              gate content behind JavaScript execution.
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
              Importing <code>gsap/ScrollTrigger</code> at the top of the file
              and calling <code>gsap.registerPlugin()</code> in the constructor
              — constructors run during SSR too, so this can execute
              browser-only plugin code on the server. Always lazy-load it inside
              a browser-guarded lifecycle hook.
            </li>
            <li>
              Forgetting to pass <code>scroller</code> when the trigger lives
              inside a scrollable container instead of the page — without it,
              <code>ScrollTrigger</code> watches the wrong scroll position.
            </li>
            <li>
              Leaving a <code>ScrollTrigger</code> alive after a route change —
              always kill it in <code>ngOnDestroy</code>, not just the timeline.
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
export default class ScrollRevealPage {
  recipe = getRecipe('scroll-reveal');
  nav = getAdjacentRecipes('scroll-reveal');

  codeTabs: CodeTab[] = [
    { label: 'Component', code: SCROLL_REVEAL_DEMO_SOURCE },
    { label: 'andGsapScroll directive', code: AND_GSAP_SCROLL_SOURCE },
  ];
}
