import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

@Component({
  selector: 'visual-silence-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: [
    `
      :host {
        --color-foreground: #1f2e27;
        --color-background: #f9fafa;
        --color-primary: #7a28bd;
        --color-secondary: #26d988;

        --grid-padding: 2rem;
        --grid-gutter: 1rem;
        --card-size: min(
          calc((100vh - 6 * var(--grid-padding)) / 3),
          calc((100vw - 6 * var(--grid-padding)) / 3)
        );

        display: block;
        background: var(--color-background);
        color: var(--color-foreground);
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        letter-spacing: -0.02em;
      }

      .abs-fill {
        position: absolute;
        inset: 0;
      }

      .card {
        position: absolute;
        width: var(--card-size);
        height: var(--card-size);
        border-radius: 0.5rem;
        overflow: hidden;
        background: #000;
        cursor: pointer;
        top: 50%;
        left: 50%;
        opacity: 0;
        visibility: hidden;
        will-change: transform, opacity;
      }
      .card-5 {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
        visibility: visible;
        z-index: 10;
      }

      .card-content {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 1.5rem;
        color: white;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.9),
          rgba(0, 0, 0, 0.1) 90%,
          rgba(0, 0, 0, 0)
        );
      }

      .logo .char {
        display: inline-block;
        transition: opacity 0.4s, filter 0.4s;
        filter: blur(0);
      }
      .logo .spacer {
        width: 0.5em;
        display: inline-block;
      }

      .flip-persp {
        perspective: 1000px;
      }
      .card-inner {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
      }
      .card-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        border-radius: 8px;
        overflow: hidden;
      }
      .card-back {
        transform: rotateY(180deg);
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .vis-hidden {
        visibility: hidden;
      }
      .vis-visible {
        visibility: visible;
      }
    `,
  ],
  template: `
    <!-- GRID -->
    <div
      #gridContainer
      class="relative p-4"
      [style.width]="gridSize()"
      [style.height]="gridSize()"
    >
      <!-- 1 -->
      <div class="card card-1">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/a19c3dc6-c82a-4301-b7a8-9f72faa09a74?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            THE SPACE BETWEEN
          </h2>
          <p class="text-[0.825rem] opacity-100">
            Where movement reveals truth
          </p>
        </div>
      </div>

      <!-- 2 -->
      <div class="card card-2">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/c3aa56e7-ac0c-47aa-ab1d-26d4b5ee8948?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            CAPTURED STILLNESS
          </h2>
          <p class="text-[0.825rem] opacity-100">Motion suspended in time</p>
        </div>
      </div>

      <!-- 3 -->
      <div class="card card-3">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/0b0960ef-5e0a-4df5-8a08-44aa57b4cabc.?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            NEGATIVE PRESENCE
          </h2>
          <p class="text-[0.825rem] opacity-100">Finding meaning in absence</p>
        </div>
      </div>

      <!-- 4 -->
      <div class="card card-4">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/60509a1f-769c-4d50-bf6d-04e7de80c369?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            TEXTURE OF LIGHT
          </h2>
          <p class="text-[0.825rem] opacity-100">
            When shadows become tangible
          </p>
        </div>
      </div>

      <!-- 5 (center) -->
      <div #centerCard class="card card-5" (click)="expand()">
        <img
          #centerImage
          [ngSrc]="
            'https://cdn.cosmos.so/a4131540-1ed8-41a8-84de-580b1327cbfd?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            MONOCHROME MEDITATION
          </h2>
          <p class="text-[0.825rem] opacity-100">Beyond what eyes perceive</p>
        </div>
      </div>

      <!-- 6 -->
      <div class="card card-6">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/49037a37-144f-4d11-8466-22e9e1c71797.?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            FORMLESS FORM
          </h2>
          <p class="text-[0.825rem] opacity-100">The geometry of feeling</p>
        </div>
      </div>

      <!-- 7 (flip) -->
      <div
        #flipCard
        class="card card-7 flip-persp"
        (mouseenter)="onFlipEnter()"
        (mouseleave)="onFlipLeave()"
        (click)="onFlipClick()"
      >
        <div #cardInner class="card-inner">
          <div class="card-face card-front">
            <img
              [ngSrc]="
                'https://cdn.cosmos.so/fddfc757-d9c3-44f1-af6e-a607c3746738?format=jpeg'
              "
              width="800"
              height="800"
              class="abs-fill object-cover"
              alt=""
            />
            <div class="card-content">
              <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
                SPATIAL SILENCE
              </h2>
              <p class="text-[0.825rem] opacity-100">
                Presence within emptiness
              </p>
            </div>
          </div>
          <div class="card-face card-back">
            <div class="text-white text-left max-w-[90%]">
              <p class="text-[1rem] leading-[1.5] mb-4 font-light">
                “In the spaces between light and shadow, the unseen reveals
                itself. The photograph captures not just what is visible, but
                the mystery that lies beyond perception.”
              </p>
              <span class="block text-[1rem] font-medium">VS</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 8 -->
      <div class="card card-8">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/b0c8552f-2acf-4206-9086-a14e7ebcc0d2?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            LIMINAL THRESHOLD
          </h2>
          <p class="text-[0.825rem] opacity-100">Between known and unknown</p>
        </div>
      </div>

      <!-- 9 -->
      <div class="card card-9">
        <img
          [ngSrc]="
            'https://cdn.cosmos.so/d15e33c9-6306-4e93-9fc3-a11bca3be70a?format=jpeg'
          "
          width="800"
          height="800"
          class="abs-fill object-cover"
          alt=""
        />
        <div class="card-content">
          <h2 class="text-[1.25rem] font-semibold uppercase mb-1">
            ESSENTIAL HARMONY
          </h2>
          <p class="text-[0.825rem] opacity-100">The beauty of reduction</p>
        </div>
      </div>
    </div>

    <!-- CATEGORIES (right) -->
    <div
      #categoriesMenu
      class="fixed right-7 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[200]"
    >
      @for (cat of categories; track cat; let i = $index) {
      <button
        class="rounded-full px-3.5 py-2 text-[0.825rem] transition-opacity duration-300 will-change"
        [style.background]="categoryBg(i)"
        [style.color]="'white'"
        (mouseenter)="catHoverIn($event)"
        (mouseleave)="catHoverOut($event)"
      >
        {{ cat }}
      </button>
      }
    </div>

    <!-- LOGO (left) -->
    <div
      #logoContainer
      class="fixed left-7 top-1/2 -translate-y-1/2 z-[100] uppercase"
    >
      <div
        class="logo-wrapper relative flex logo select-none"
        [style.color]="'white'"
      >
        <span class="char v-char" data-index="0">V</span>
        <span class="char" data-index="1">I</span>
        <span class="char" data-index="2">S</span>
        <span class="char" data-index="3">U</span>
        <span class="char" data-index="4">A</span>
        <span class="char" data-index="5">L</span>
        <span class="char spacer" data-index="6"> </span>
        <span class="char s-char" data-index="7">S</span>
        <span class="char" data-index="8">I</span>
        <span class="char" data-index="9">L</span>
        <span class="char" data-index="10">E</span>
        <span class="char" data-index="11">N</span>
        <span class="char" data-index="12">C</span>
        <span class="char" data-index="13">E</span>
      </div>
    </div>

    <!-- Message -->
    <span
      #mysteriousMessage
      class="fixed left-7 bottom-7 text-[0.75rem] z-[100] opacity-0 transition-opacity duration-500 select-none"
      [style.color]="
        'color-mix(in srgb, var(--color-foreground) 85%, transparent)'
      "
    >
      The magic lies within the seventh frame...
    </span>
  `,
})
export class VisualSilenceGridComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);

  // Refs
  private readonly gridContainer =
    viewChild<ElementRef<HTMLDivElement>>('gridContainer');
  private readonly centerCard =
    viewChild<ElementRef<HTMLDivElement>>('centerCard');
  private readonly centerImage =
    viewChild<ElementRef<HTMLImageElement>>('centerImage');
  private readonly categoriesMenu =
    viewChild<ElementRef<HTMLDivElement>>('categoriesMenu');
  private readonly logoContainer =
    viewChild<ElementRef<HTMLDivElement>>('logoContainer');
  private readonly flipCard = viewChild<ElementRef<HTMLDivElement>>('flipCard');
  private readonly cardInner =
    viewChild<ElementRef<HTMLDivElement>>('cardInner');
  private readonly mysteriousMessage =
    viewChild<ElementRef<HTMLSpanElement>>('mysteriousMessage');

  // State
  isExpanded = signal(false);
  private isFlipping = false;
  private isFlipped = false;

  // Timelines
  private expandTl: gsap.core.Timeline | null = null;
  private centerZoomTl: gsap.core.Timeline | null = null;
  private logoTl: gsap.core.Timeline | null = null;
  private flipTl: gsap.core.Timeline | null = null;
  private flipBackTl: gsap.core.Timeline | null = null;
  private menuTl: gsap.core.Timeline | null = null;

  // Data
  categories = [
    'Movement',
    'Stillness',
    'Minimalism',
    'Negative Space',
    'Monochrome',
    'Essence',
    'Contrast',
    'Silence',
  ];

  // Sizes
  gridSize = signal('calc(3 * var(--card-size) + 2 * var(--grid-gutter))');

  // Eases & timings
  private readonly easeName = 'customEase';
  private readonly duration = 0.64;
  private readonly menuIn = 0.64;
  private readonly menuOut = 0.48;
  private readonly charDur = 0.15;
  private readonly finalMerge = 0.5;
  private readonly flipDur = 0.8;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(CustomEase);
      CustomEase.create(this.easeName, '0.86,0,0.07,1');
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Setup base states
    this.setupTimelines();
    this.setupMenuBase();
    this.setupLogoBase();
    this.setupMessageBase();

    // Recompute logo anim on resize
    window.addEventListener('resize', this.updateLogoAnimation, {
      passive: true,
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateLogoAnimation);
    this.killAll();
  }

  // ---------- UI events ----------
  onGridEnter() {
    this.expand();
  }
  onGridLeave() {
    this.collapse();
  }

  catHoverIn(ev: Event) {
    const el = ev.currentTarget as HTMLElement | null;
    if (!el) return;
    gsap.to(el, { opacity: 1, duration: 0.3, ease: 'power2.out' });
  }
  catHoverOut(ev: Event) {
    if (!this.isExpanded()) {
      const el = ev.currentTarget as HTMLElement | null;
      if (!el) return;
      gsap.to(el, { opacity: 0.8, duration: 0.3, ease: 'power2.out' });
    }
  }

  onFlipEnter() {
    if (!this.isExpanded() || this.isFlipping || this.isFlipped) return;
    this.isFlipping = true;
    this.flipTl?.restart();
  }
  onFlipLeave() {
    if (!this.isExpanded()) return;
    if (this.isFlipped || this.isFlipping) {
      this.flipTl?.kill();
      this.isFlipping = true;
      this.flipBackTl?.restart();
    }
  }
  onFlipClick() {
    if (!this.isExpanded() || this.isFlipping) return;
    this.isFlipping = true;
    if (!this.isFlipped) this.flipTl?.restart();
    else this.flipBackTl?.restart();
  }

  toggleTouch() {
    // Para touch: tap en la carta central alterna expand/colapse
    if (window.matchMedia('(hover: none)').matches) {
      this.isExpanded() ? this.collapse() : this.expand();
    }
  }

  // ---------- Colors ----------
  categoryBg(i: number): string {
    // Degradado de primaria hacia foreground para 8 items
    const pct = 15 + i * 10; // 15%, 25%, ... 85%
    return `color-mix(in srgb, var(--color-primary) ${pct}%, var(--color-foreground))`;
    // Texto blanco para contraste (ya aplicado)
  }

  // ---------- Animations setup ----------
  private setupTimelines() {
    const grid = this.gridContainer()?.nativeElement;
    const centerImg = this.centerImage()?.nativeElement;
    const flipCard = this.flipCard()?.nativeElement;
    const cardInner = this.cardInner()?.nativeElement;
    const msg = this.mysteriousMessage()?.nativeElement;

    if (!grid || !centerImg || !flipCard || !cardInner || !msg) return;

    // Expand grid positions (por filas 3x3, con delays)
    const tl = gsap.timeline({ paused: true });
    const d = this.duration;
    const ease = this.easeName;

    tl.to(
      '.card-1',
      {
        top: 0,
        left: 0,
        xPercent: 0,
        yPercent: 0,
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        ease,
        duration: d,
        delay: 0.05,
      },
      0
    )
      .to(
        '.card-2',
        {
          top: 0,
          left: '50%',
          xPercent: -50,
          yPercent: 0,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.1,
        },
        0
      )
      .to(
        '.card-3',
        {
          top: 0,
          left: '100%',
          xPercent: -100,
          yPercent: 0,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.15,
        },
        0
      )
      .to(
        '.card-4',
        {
          top: '50%',
          left: 0,
          xPercent: 0,
          yPercent: -50,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.2,
        },
        0
      )
      .to(
        '.card-6',
        {
          top: '50%',
          left: '100%',
          xPercent: -100,
          yPercent: -50,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.25,
        },
        0
      )
      .to(
        '.card-7',
        {
          top: '100%',
          left: 0,
          xPercent: 0,
          yPercent: -100,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.3,
        },
        0
      )
      .to(
        '.card-8',
        {
          top: '100%',
          left: '50%',
          xPercent: -50,
          yPercent: -100,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.35,
        },
        0
      )
      .to(
        '.card-9',
        {
          top: '100%',
          left: '100%',
          xPercent: -100,
          yPercent: -100,
          opacity: 1,
          scale: 1,
          visibility: 'visible',
          ease,
          duration: d,
          delay: 0.4,
        },
        0
      )
      .to(msg, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.6);

    this.expandTl = tl;

    // Center zoom
    this.centerZoomTl = gsap
      .timeline({ paused: true })
      .to(centerImg, { scale: 1.08, duration: d, ease });

    // Flip timelines (con blur en contenedor)
    this.flipTl = gsap
      .timeline({
        paused: true,
        onComplete: () => {
          this.isFlipping = false;
          this.isFlipped = true;
        },
      })
      .to(
        cardInner,
        {
          rotationY: 900,
          duration: this.flipDur,
          ease: 'power2.inOut',
          onStart: () => {
            gsap.set(flipCard, { filter: 'blur(0px)' });
          },
        },
        0
      )
      .to(
        flipCard,
        { filter: 'blur(8px)', duration: 0.2, ease: 'power1.in' },
        0
      )
      .to(
        flipCard,
        { filter: 'blur(0px)', duration: 0.2, ease: 'power1.out' },
        this.flipDur - 0.2
      );

    this.flipBackTl = gsap
      .timeline({
        paused: true,
        onComplete: () => {
          this.isFlipping = false;
          this.isFlipped = false;
        },
      })
      .to(
        cardInner,
        {
          rotationY: 0,
          duration: this.flipDur,
          ease: 'power2.inOut',
          onStart: () => {
            gsap.set(flipCard, { filter: 'blur(0px)' });
          },
        },
        0
      )
      .to(
        flipCard,
        { filter: 'blur(8px)', duration: 0.2, ease: 'power1.in' },
        0
      )
      .to(
        flipCard,
        { filter: 'blur(0px)', duration: 0.2, ease: 'power1.out' },
        this.flipDur - 0.2
      );
  }

  private setupMenuBase() {
    const menu = this.categoriesMenu()?.nativeElement;
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('button')) as HTMLElement[];
    gsap.set(items, { opacity: 0, y: 20, visibility: 'hidden' });
  }

  private setupLogoBase() {
    const container = this.logoContainer()?.nativeElement;
    if (!container) return;
    const chars = container.querySelectorAll('.logo .char');
    gsap.set(chars, { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' });

    this.buildLogoTimeline(); // crea timeline pausada
  }

  private setupMessageBase() {
    const msg = this.mysteriousMessage()?.nativeElement;
    if (msg) gsap.set(msg, { opacity: 0 });
  }

  private buildLogoTimeline() {
    const container = this.logoContainer()?.nativeElement;
    if (!container) return;

    const vChar = container.querySelector(
      '.logo .v-char'
    ) as HTMLElement | null;
    const sChar = container.querySelector(
      '.logo .s-char'
    ) as HTMLElement | null;
    const spacer = container.querySelector(
      '.logo .spacer'
    ) as HTMLElement | null;

    const hideSeq = [13, 5, 12, 4, 11, 3, 10, 2, 9, 1, 8];
    const tl = gsap.timeline({ paused: true });

    hideSeq.forEach((idx, i) => {
      const el = container.querySelector(
        `.logo .char[data-index="${idx}"]`
      ) as HTMLElement | null;
      if (!el) return;
      tl.to(
        el,
        {
          opacity: 0,
          filter: 'blur(8px)',
          duration: this.charDur,
          ease: this.easeName,
        },
        i * 0.05
      );
    });

    if (spacer) {
      tl.to(
        spacer,
        {
          opacity: 0,
          filter: 'blur(8px)',
          duration: this.charDur,
          ease: this.easeName,
        },
        hideSeq.length * 0.05
      );
    }

    if (vChar && sChar) {
      const vRect = vChar.getBoundingClientRect();
      const sRect = sChar.getBoundingClientRect();
      tl.to(
        sChar,
        {
          x: -(sRect.left - vRect.right),
          duration: this.finalMerge,
          ease: this.easeName,
        },
        hideSeq.length * 0.05 + 0.05
      );
    }

    this.logoTl = tl;
  }

  private updateLogoAnimation = () => {
    // reconstruye el timeline para recalcular posiciones
    this.buildLogoTimeline();
    if (this.isExpanded()) this.logoTl?.play(0);
    else this.logoTl?.pause(0).progress(0);
  };

  // ---------- Public actions ----------
  expand() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isExpanded()) return;
    this.isExpanded.set(true);

    // Grid out
    this.expandTl?.play();
    // Menu in
    this.showMenu();
    // Center zoom
    this.centerZoomTl?.play();
    // Logo fuse
    this.logoTl?.play(0);
  }

  collapse() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.isExpanded()) return;

    this.isExpanded.set(false);
    this.expandTl?.reverse();
    this.hideMenu();
    this.centerZoomTl?.reverse();
    this.logoTl?.reverse();

    // reset flip si estaba en medio
    if (this.isFlipped || this.isFlipping) {
      this.flipTl?.kill();
      this.flipBackTl?.kill();
      const inner = this.cardInner()?.nativeElement;
      const card = this.flipCard()?.nativeElement;
      if (inner)
        gsap.to(inner, { rotationY: 0, duration: 0.3, ease: 'power2.out' });
      if (card) gsap.to(card, { filter: 'blur(0px)', duration: 0.1 });
      this.isFlipped = false;
      this.isFlipping = false;
    }
  }

  // ---------- Menu show/hide ----------
  private showMenu() {
    const menu = this.categoriesMenu()?.nativeElement;
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('button')) as HTMLElement[];

    this.menuTl?.kill();
    this.menuTl = gsap.timeline();
    this.menuTl!.to([...items].reverse(), {
      opacity: 1,
      y: 0,
      visibility: 'visible',
      ease: this.easeName,
      duration: this.menuIn,
      stagger: 0.08,
    });
  }

  private hideMenu() {
    const menu = this.categoriesMenu()?.nativeElement;
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('button')) as HTMLElement[];

    this.menuTl?.kill();
    this.menuTl = gsap.timeline();
    this.menuTl!.to(items, {
      opacity: 0,
      y: 20,
      visibility: 'hidden',
      ease: this.easeName,
      duration: this.menuOut,
      stagger: 0.05,
    });
  }

  // ---------- Utils ----------
  private killAll() {
    this.expandTl?.kill();
    this.expandTl = null;
    this.centerZoomTl?.kill();
    this.centerZoomTl = null;
    this.logoTl?.kill();
    this.logoTl = null;
    this.flipTl?.kill();
    this.flipTl = null;
    this.flipBackTl?.kill();
    this.flipBackTl = null;
    this.menuTl?.kill();
    this.menuTl = null;
  }
}
