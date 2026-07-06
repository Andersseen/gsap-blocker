import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import CardToModalDemo from '@components/animation-demos/card-to-modal-demo';
import type { CodeTab } from '@components/code-tabs';
import CodeTabs from '@components/code-tabs';
import RecipeDemo from '@components/recipe-demo';
import RecipeHero from '@components/recipe-hero';
import RecipeNav from '@components/recipe-nav';
import RecipeSection from '@components/recipe-section';
import RecipeToc from '@components/recipe-toc';
import { getAdjacentRecipes, getRecipe } from '@data/animations';

const CARD_TO_MODAL_DEMO_SOURCE = `import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

interface ModalCard {
  id: number;
  emoji: string;
  title: string;
  summary: string;
  body: string;
}

const CARDS: ModalCard[] = [
  {
    id: 1,
    emoji: '🪐',
    title: 'Orbit',
    summary: 'A minimal scheduling app for distributed teams.',
    body: 'Orbit finds overlapping focus hours across timezones automatically, so nobody has to build another spreadsheet to schedule a meeting.',
  },
  {
    id: 2,
    emoji: '🧭',
    title: 'Compass',
    summary: 'Roadmapping that stays in sync with your codebase.',
    body: 'Compass links roadmap items straight to pull requests, so status updates itself the moment code ships.',
  },
];

@Component({
  selector: 'app-card-to-modal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown.escape)': 'close()',
  },
  template: \`
    <div
      class="grid w-full max-w-2xl gap-4 sm:grid-cols-2"
      [attr.inert]="active() ? '' : null"
    >
      @for (card of cards; track card.id) {
        <button
          #trigger
          type="button"
          class="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/50"
          aria-haspopup="dialog"
          (click)="open(card, trigger)"
        >
          <span class="text-3xl" aria-hidden="true">{{ card.emoji }}</span>
          <span class="font-semibold text-foreground">{{ card.title }}</span>
          <span class="text-sm text-muted-foreground">{{ card.summary }}</span>
        </button>
      }
    </div>

    @if (active(); as card) {
      <div class="fixed inset-0 z-70 flex items-center justify-center p-6">
        <button
          type="button"
          tabindex="-1"
          aria-hidden="true"
          class="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
          (click)="close()"
        ></button>

        <div
          #modal
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'modal-title-' + card.id"
          class="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl outline-none"
          tabindex="-1"
        >
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close dialog"
            (click)="close()"
          >
            ✕
          </button>

          <span class="text-4xl" aria-hidden="true">{{ card.emoji }}</span>
          <h3
            [id]="'modal-title-' + card.id"
            class="mt-4 text-2xl font-bold text-foreground"
          >
            {{ card.title }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {{ card.body }}
          </p>
        </div>
      </div>
    }
  \`,
})
export default class CardToModalDemo {
  cards = CARDS;
  active = signal<ModalCard | null>(null);

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalRef = viewChild<ElementRef<HTMLElement>>('modal');

  private firstRect: DOMRect | null = null;
  private triggerEl: HTMLElement | null = null;
  private gsapInstance: typeof import('gsap').default | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      const modal = this.modalRef()?.nativeElement;
      if (modal) this.gsapInstance?.killTweensOf(modal);
    });
  }

  async open(card: ModalCard, trigger: HTMLElement) {
    this.firstRect = trigger.getBoundingClientRect();
    this.triggerEl = trigger;
    this.active.set(card);

    const { gsap } = await import('gsap');
    this.gsapInstance = gsap;

    // Wait for the @if block above to render before measuring the modal.
    afterNextRender(() => this.flipIn(gsap), { injector: this.injector });
  }

  close() {
    const modal = this.modalRef()?.nativeElement;
    const trigger = this.triggerEl;
    const gsap = this.gsapInstance;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!modal || !trigger || !gsap || reduced) {
      this.finishClose(trigger ?? undefined);
      return;
    }

    const target = trigger.getBoundingClientRect();
    const current = modal.getBoundingClientRect();

    gsap.timeline({ onComplete: () => this.finishClose(trigger) }).to(modal, {
      x: target.left - current.left,
      y: target.top - current.top,
      scaleX: target.width / current.width,
      scaleY: target.height / current.height,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.inOut',
    });
  }

  private flipIn(gsap: typeof import('gsap').default) {
    const modal = this.modalRef()?.nativeElement;
    if (!modal || !this.firstRect) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      modal.focus();
      return;
    }

    const last = modal.getBoundingClientRect();
    const first = this.firstRect;

    gsap.timeline().fromTo(
      modal,
      {
        transformOrigin: 'top left',
        x: first.left - last.left,
        y: first.top - last.top,
        scaleX: first.width / last.width,
        scaleY: first.height / last.height,
        opacity: 0.4,
      },
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => modal.focus(),
      }
    );
  }

  private finishClose(trigger?: HTMLElement) {
    this.active.set(null);
    this.triggerEl = null;

    // The trigger grid loses \`inert\` only after Angular re-renders; a synchronous
    // focus() call here would silently no-op while it's still inert.
    afterNextRender(() => trigger?.focus(), { injector: this.injector });
  }
}
`;

export const routeMeta: RouteMeta = {
  title: 'Card to Modal — Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'Expand a compact card into an accessible modal using the FLIP technique and GSAP.',
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-card-to-modal',
  imports: [
    RecipeHero,
    RecipeDemo,
    RecipeToc,
    CardToModalDemo,
    RecipeSection,
    CodeTabs,
    RecipeNav,
  ],
  template: `
    <app-recipe-hero [recipe]="recipe" />

    <div class="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div class="space-y-16">
        <div id="demo" class="scroll-mt-28">
          <app-recipe-demo number="06" title="Demo">
            <app-card-to-modal-demo />
          </app-recipe-demo>
        </div>

        <app-recipe-section title="How it works" icon="🔍" id="how-it-works">
          <p>
            FLIP stands for First, Last, Invert, Play. Before anything changes,
            the demo reads the trigger card's
            <code>getBoundingClientRect()</code> — that's
            <strong>First</strong>. Opening the modal sets a signal, Angular
            renders it in its natural, full-size position via
            <code>&#64;if</code>, and the demo measures that too —
            <strong>Last</strong>. It then computes the delta between the two
            rects and applies it as a transform on the modal so it visually
            starts exactly where the card was — <strong>Invert</strong>.
            Finally, <code>gsap.fromTo()</code>
            animates that transform back to neutral —
            <strong>Play</strong>. Closing the modal runs the same math in
            reverse.
          </p>
          <p>
            The whole sequence only ever reads layout twice per transition (once
            for First, once for Last), never on every animation frame.
          </p>
        </app-recipe-section>

        <app-recipe-section title="The Angular way" icon="🅰️" id="angular-way">
          <ul>
            <li>
              <code>active</code> is a signal holding the open card (or
              <code>null</code>); the modal only exists in the DOM inside an
              <code>&#64;if (active(); as card)</code> block, so there's nothing
              to hide with CSS.
            </li>
            <li>
              Measuring the modal's rect has to happen
              <em>after</em> Angular renders the <code>&#64;if</code> block, so
              the recipe uses <code>afterNextRender()</code> (with an explicit
              <code>Injector</code>, since it's called from a click handler, not
              a constructor) instead of guessing with a <code>setTimeout</code>.
            </li>
            <li>
              The trigger button and the modal's close button both receive focus
              explicitly — <code>modal.focus()</code> when it opens,
              <code>trigger.focus()</code> when it closes — so focus never gets
              silently dropped on <code>&lt;body&gt;</code>.
            </li>
            <li>
              The background grid gets <code>[attr.inert]</code> while the modal
              is open, using the native <code>inert</code> HTML attribute
              instead of manual tabindex management to keep it out of the tab
              order.
            </li>
            <li>
              <code>DestroyRef.onDestroy()</code> kills any tweens still running
              on the modal if the component is destroyed mid-animation.
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
              Add the static markup: a grid of trigger buttons, plus an
              <code>&#64;if</code> block for the dialog with
              <code>role="dialog"</code>, <code>aria-modal="true"</code> and
              <code>aria-labelledby</code>.
            </li>
            <li>
              Query the modal with
              <code>viewChild&lt;ElementRef&gt;('modal')</code> — it only
              resolves once the <code>&#64;if</code> block renders.
            </li>
            <li>
              Lazy-load GSAP with <code>await import('gsap')</code> when a card
              is opened.
            </li>
            <li>
              Build the animation: capture the trigger's rect before opening,
              wait for the next render, measure the modal, then
              <code>gsap.timeline().fromTo(modal, invertState, playState)</code
              >.
            </li>
            <li>
              Add cleanup: kill tweens of the modal in
              <code>destroyRef.onDestroy()</code>, and always resolve the
              closing timeline's <code>onComplete</code> before clearing the
              signal.
            </li>
            <li>
              Add reduced motion: skip the FLIP transform entirely and just move
              focus — the modal appears and disappears instantly.
            </li>
            <li>
              Test keyboard/accessibility: open with <kbd>Enter</kbd>, close
              with <kbd>Escape</kbd> and the close button, confirm focus lands
              on the modal on open and back on the trigger on close, and confirm
              background cards can't be tabbed to while it's open.
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
              Measuring the modal's rect before Angular has actually rendered it
              — reading <code>getBoundingClientRect()</code> synchronously after
              a signal write gets the card's <em>old</em> layout, not the
              modal's. Wait for <code>afterNextRender()</code>.
            </li>
            <li>
              Removing the modal from the DOM before its closing animation
              finishes — always clear the signal in the timeline's
              <code>onComplete</code>, not immediately on click.
            </li>
            <li>
              Leaving background content focusable while the modal is open —
              keyboard and screen reader users can tab straight past the dialog
              into cards behind it without an <code>inert</code> (or equivalent)
              guard.
            </li>
            <li>
              Skipping focus return on close — without
              <code>trigger.focus()</code>, keyboard focus resets to the top of
              the page instead of back to where the user was.
            </li>
            <li>
              Calling <code>trigger.focus()</code> synchronously right after
              <code>active.set(null)</code> — with zoneless change detection,
              the <code>[attr.inert]</code> toggle hasn't reached the DOM yet,
              so the browser silently refuses to focus a still-inert element and
              focus falls back to <code>&lt;body&gt;</code>. Defer it with
              <code>afterNextRender()</code> instead.
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
export default class CardToModalPage {
  recipe = getRecipe('card-to-modal');
  nav = getAdjacentRecipes('card-to-modal');

  codeTabs: CodeTab[] = [
    { label: 'Component', code: CARD_TO_MODAL_DEMO_SOURCE },
  ];
}
