import {
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
  template: `
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
  `,
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

    // The trigger grid loses `inert` only after Angular re-renders; a synchronous
    // focus() call here would silently no-op while it's still inert.
    afterNextRender(() => trigger?.focus(), { injector: this.injector });
  }
}
