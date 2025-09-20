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
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

type Slide = { url: string; title: string; paragraph: string };

@Component({
  selector: 'mono-grid-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: [
    `
      :host {
        --color-foreground: #1f2e27;
        --color-background: #f9fafa;
        --color-primary: #7a28bd;
        --color-secondary: #26d988;
        display: block;
        background: var(--color-background);
        color: var(--color-foreground);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
          Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }
      .will-change {
        will-change: transform, opacity;
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
    <!-- PRELOADER -->
    <div
      class="fixed inset-0 z-[9999] grid place-items-center transition-opacity duration-500"
      [class.opacity-0]="!preloaderVisible()"
      [class.pointer-events-none]="!preloaderVisible()"
      [class.vis-hidden]="!preloaderVisible()"
      style="background: var(--color-foreground); color: var(--color-background)"
    >
      <div class="text-5xl font-mono select-none">{{ preCounter() }}</div>
    </div>

    <!-- MAIN WRAPPER -->
    <div class="relative w-full h-screen overflow-hidden">
      <!-- GRID -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          #grid
          class="grid grid-cols-3 grid-rows-2 w-full h-full will-change"
        >
          @for (s of slides; track s.url; let i = $index) {
          <div class="relative overflow-hidden">
            <img
              [ngSrc]="s.url"
              width="1200"
              height="800"
              class="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
          </div>
          }
        </div>
      </div>

      <!-- SLIDER LAYERS -->
      <!-- Base layer (current) -->
      <div
        #sliderImage
        class="fixed inset-0 z-[80] opacity-0 vis-hidden will-change"
        style="background-size: cover; background-position: center"
      ></div>
      <!-- Background parallax -->
      <div
        #sliderImageBg
        class="fixed inset-0 z-[85] opacity-0 vis-hidden will-change"
        style="background-size: cover; background-position: center"
      ></div>
      <!-- Next layer (top) -->
      <div
        #sliderImageNext
        class="fixed inset-0 z-[90] opacity-0 vis-hidden will-change"
        style="background-size: cover; background-position: center"
      ></div>
      <!-- Transition overlay -->
      <div
        #transitionOverlay
        class="fixed inset-0 z-[95] opacity-0 vis-hidden will-change"
        style="background: var(--color-foreground)"
      ></div>

      <!-- CONTENT -->
      <div
        #content
        class="fixed inset-0 z-[100] opacity-0 pointer-events-none flex flex-col justify-end p-[10%]"
      >
        <h1 class="text-left uppercase tracking-tight mb-6 overflow-hidden">
          <span
            #titleSpan
            class="block text-[clamp(2rem,6vw,5rem)] leading-none font-semibold"
            style="transform: translateY(100%)"
          >
            {{ slides[activeIndex()].title }}
          </span>
        </h1>
        <p
          #paragraph
          class="max-w-[60ch] font-mono text-[1rem] leading-snug opacity-0"
          style="color: var(--color-foreground)"
        >
          {{ slides[activeIndex()].paragraph }}
        </p>
      </div>

      <!-- THUMBNAILS -->
      <div class="fixed bottom-5 right-5 z-[200] flex gap-2">
        @for (s of slides; track s.url; let i = $index) {
        <button
          class="relative w-[60px] h-[40px] rounded overflow-hidden will-change transition-[border] duration-300"
          [class.border-2]="activeIndex() === i"
          [style.borderColor]="
            activeIndex() === i ? 'var(--color-primary)' : 'transparent'
          "
          (click)="onThumbClick(i)"
          [attr.aria-current]="activeIndex() === i"
        >
          <img
            [ngSrc]="s.url"
            width="120"
            height="80"
            class="w-full h-full object-cover"
            alt=""
          />
        </button>
        }
      </div>

      <!-- SWITCH -->
      <div
        #switchWrap
        class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex gap-5 rounded bg-[color:var(--color-foreground)] text-[color:var(--color-background)] px-5 py-2 transition-[padding] duration-300"
      >
        <button
          class="relative font-mono text-sm px-2 py-1"
          (mouseenter)="padSwitch('left', true)"
          (mouseleave)="padSwitch('left', false)"
          (click)="toggleMode('grid')"
          [class.text-[color:var(--color-secondary)]]="mode() === 'grid'"
        >
          <span
            class="absolute w-[6px] h-[6px] rounded-full opacity-0 top-1/2 -translate-y-1/2 -left-2"
            [class.opacity-100]="mode() === 'grid'"
            style="background: var(--color-secondary)"
          ></span>
          GRID
        </button>

        <button
          class="relative font-mono text-sm px-2 py-1"
          (mouseenter)="padSwitch('right', true)"
          (mouseleave)="padSwitch('right', false)"
          (click)="toggleMode('slider')"
          [class.text-[color:var(--color-secondary)]]="mode() === 'slider'"
        >
          <span
            class="absolute w-[6px] h-[6px] rounded-full opacity-0 top-1/2 -translate-y-1/2 -right-2"
            [class.opacity-100]="mode() === 'slider'"
            style="background: var(--color-secondary)"
          ></span>
          SLIDER
        </button>
      </div>
    </div>
  `,
})
export class MonoGridSliderComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // Refs
  private readonly grid = viewChild<ElementRef<HTMLDivElement>>('grid');
  private readonly sliderImage =
    viewChild<ElementRef<HTMLDivElement>>('sliderImage');
  private readonly sliderImageNext =
    viewChild<ElementRef<HTMLDivElement>>('sliderImageNext');
  private readonly sliderImageBg =
    viewChild<ElementRef<HTMLDivElement>>('sliderImageBg');
  private readonly transitionOverlay =
    viewChild<ElementRef<HTMLDivElement>>('transitionOverlay');
  private readonly content = viewChild<ElementRef<HTMLDivElement>>('content');
  private readonly titleSpan =
    viewChild<ElementRef<HTMLSpanElement>>('titleSpan');
  private readonly paragraph =
    viewChild<ElementRef<HTMLParagraphElement>>('paragraph');
  private readonly switchWrap =
    viewChild<ElementRef<HTMLDivElement>>('switchWrap');

  // State
  preloaderVisible = signal(true);
  preCounter = signal(0);
  mode = signal<'grid' | 'slider'>('grid');
  activeIndex = signal(4);
  private animating = false;

  readonly slides: Slide[] = [
    {
      url: 'https://cdn.cosmos.so/dfff1381-f09c-454b-b98d-8a79161c3d25?format=jpeg',
      title: 'URBAN GEOMETRY',
      paragraph:
        'The city speaks in angles and lines. What appears chaotic is actually ordered. When we slow down enough to truly see, patterns emerge from noise...',
    },
    {
      url: 'https://cdn.cosmos.so/c7af8b26-313a-40e4-9081-85f7fde00c22?format=jpeg',
      title: 'NATURAL ABSTRACTIONS',
      paragraph:
        "Nature doesn't try to be beautiful. It simply is. These patterns exist whether we observe them or not...",
    },
    {
      url: 'https://cdn.cosmos.so/03a36d87-af8c-4cfe-bfed-7a3dd502404b.?format=jpeg',
      title: 'SHADOW PLAY',
      paragraph:
        'Light creates shadow. Shadow defines light. Neither exists without the other. This duality mirrors our own inner landscape...',
    },
    {
      url: 'https://cdn.cosmos.so/bdb2a659-2838-4055-a82e-f145c3fd4467?format=jpeg',
      title: 'MINIMALIST FORMS',
      paragraph:
        "When we strip away the unnecessary, what remains? The essence. The truth. These images aren't about what's there, but what isn’t...",
    },
    {
      url: 'https://cdn.cosmos.so/fddfc757-d9c3-44f1-af6e-a607c3746738?format=jpeg',
      title: 'MONOCHROME SERIES',
      paragraph:
        'Without color, we see differently. Form and texture speak louder. The world simplified to light and dark reveals truths...',
    },
    {
      url: 'https://cdn.cosmos.so/51a307de-a9ba-4c9e-ad24-beff1ce023d0?format=jpeg',
      title: 'TEXTURAL STUDIES',
      paragraph:
        'Touch with your eyes. Feel the rough and smooth. These surfaces tell stories of time and transformation...',
    },
  ];

  // GSAP timings (s)
  private readonly T = {
    BASE: 0.512,
    SHORTEST: 0.256,
    SHORT: 0.384,
    LONG: 0.768,
    LONGEST: 1.024,
    ST_TINY: 0.032,
    ST_SMALL: 0.064,
    ST_MED: 0.128,
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(Flip, CustomEase);
      CustomEase.create('mainEase', 'M0,0 C0.65,0.05 0.36,1 1,1');
      CustomEase.create('sideEase', 'M0,0 C0.86,0 0.07,1 1,1');
      CustomEase.create('natural', 'M0,0 C0.34,0.01 0.2,1 1,1');
      CustomEase.create('naturalOut', 'M0,0 C0.43,0.13 0.23,0.96 1,1');
      CustomEase.create('cinematic', 'M0,0 C0.645,0.045 0.355,1 1,1');
      gsap.defaults({ ease: 'mainEase', duration: this.T.BASE });
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.runPreloader();
    // Keyboard navigation (document-level)
    document.addEventListener('keydown', this.onKey);
    // Resize to keep slider full-screen
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onResize);
  }

  // -------- PRELOADER ----------
  private runPreloader() {
    let count = 0;
    const interval = 128; // ms
    const inc = 5;
    const id = window.setInterval(() => {
      count += inc;
      if (count <= 100) this.preCounter.set(count);
      else {
        this.preCounter.set(100);
        window.clearInterval(id);
        // fade out
        gsap.to(this.host.nativeElement.querySelector('[class*="z-[9999]"]'), {
          opacity: 0,
          duration: this.T.SHORTEST,
          onComplete: () => {
            this.preloaderVisible.set(false);
            // small delay then init app state
            window.setTimeout(() => this.initApp(), 256);
          },
        });
      }
    }, interval);
  }

  // -------- INIT / HELPERS ----------
  private initApp() {
    // Prepare initial content visible state when entering slider
    const title = this.titleSpan()?.nativeElement;
    const para = this.paragraph()?.nativeElement;
    if (title && para) {
      gsap.set(title, { y: '100%' });
      gsap.set(para, { opacity: 0 });
    }
  }

  private elGrid(): HTMLDivElement | null {
    return this.grid()?.nativeElement ?? null;
  }
  private elSlider(): HTMLDivElement | null {
    return this.sliderImage()?.nativeElement ?? null;
  }
  private elNext(): HTMLDivElement | null {
    return this.sliderImageNext()?.nativeElement ?? null;
  }
  private elBg(): HTMLDivElement | null {
    return this.sliderImageBg()?.nativeElement ?? null;
  }
  private elOverlay(): HTMLDivElement | null {
    return this.transitionOverlay()?.nativeElement ?? null;
  }
  private elTitle(): HTMLSpanElement | null {
    return this.titleSpan()?.nativeElement ?? null;
  }
  private elPara(): HTMLParagraphElement | null {
    return this.paragraph()?.nativeElement ?? null;
  }

  // -------- UI actions ----------
  padSwitch(side: 'left' | 'right', over: boolean) {
    const wrap = this.switchWrap()?.nativeElement;
    if (!wrap) return;
    const prop = side === 'left' ? 'paddingLeft' : 'paddingRight';
    wrap.style[prop as 'paddingLeft' | 'paddingRight'] = over ? '30px' : '20px';
  }

  toggleMode(target: 'grid' | 'slider') {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.animating || this.mode() === target) return;
    this.animating = true;

    if (target === 'slider') {
      this.showSliderView().then(() => {
        this.mode.set('slider');
        this.animating = false;
      });
    } else {
      this.showGridView().then(() => {
        this.mode.set('grid');
        this.animating = false;
      });
    }
  }

  onThumbClick(index: number) {
    if (
      this.mode() !== 'slider' ||
      this.animating ||
      index === this.activeIndex()
    )
      return;
    this.transitionToSlide(index);
  }

  // -------- Animations (GSAP) ----------
  private showSliderView(): Promise<void> {
    return new Promise((resolve) => {
      const grid = this.elGrid();
      const slider = this.elSlider();
      const bg = this.elBg();
      const title = this.elTitle();
      const para = this.elPara();

      if (!grid || !slider || !bg || !title || !para) return resolve();

      // Active grid item rect (center cell index = 4 por defecto)
      const cell = grid.children.item(this.activeIndex()) as HTMLElement | null;
      if (!cell) return resolve();
      const rect = cell.getBoundingClientRect();

      const url = this.slides[this.activeIndex()].url;
      slider.style.backgroundImage = `url("${url}")`;
      bg.style.backgroundImage = `url("${url}")`;

      // Position slider over the grid cell
      gsap.set(slider, {
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
        opacity: 1,
        visibility: 'visible',
      });

      // Step 1: expand height to full
      const hState = Flip.getState(slider);
      gsap.set(slider, {
        height: '100vh',
        y: 0,
        width: rect.width,
        x: rect.left,
      });
      Flip.from(hState, {
        duration: this.T.BASE,
        ease: 'mainEase',
        onComplete: () => {
          // Step 2: expand width to full
          const wState = Flip.getState(slider);
          gsap.set(slider, { width: '100vw', x: 0 });
          Flip.from(wState, {
            duration: this.T.BASE,
            ease: 'mainEase',
            onComplete: () => {
              // hide grid
              gsap.to(grid, {
                opacity: 0,
                duration: this.T.SHORTEST,
                ease: 'power2.inOut',
              });

              // content & thumbs in
              gsap.set([bg], { visibility: 'hidden', opacity: 0 });
              const tl = gsap.timeline({ onComplete: resolve });
              const contentEl = this.content()?.nativeElement;
              if (contentEl) {
                tl.to(contentEl, { opacity: 1, duration: this.T.SHORT }, 0);
              }
              tl.to(
                title,
                { y: 0, duration: this.T.BASE, ease: 'sideEase' },
                this.T.ST_TINY
              ).to(
                para,
                { opacity: 1, duration: this.T.BASE, ease: 'mainEase' },
                this.T.ST_SMALL
              );
            },
          });
        },
      });
    });
  }

  private showGridView(): Promise<void> {
    return new Promise((resolve) => {
      const grid = this.elGrid();
      const slider = this.elSlider();
      const title = this.elTitle();
      const para = this.elPara();

      if (!grid || !slider || !title || !para) return resolve();

      // Fade out content
      const tl = gsap.timeline({
        onComplete: () => {
          // show grid
          gsap.to(grid, {
            opacity: 1,
            duration: this.T.SHORTEST,
            ease: 'power2.inOut',
          });

          // Shrink width back to active cell width
          const cell = grid.children.item(
            this.activeIndex()
          ) as HTMLElement | null;
          if (!cell) return resolve();
          const rect = cell.getBoundingClientRect();

          const wState = Flip.getState(slider);
          gsap.set(slider, {
            width: rect.width,
            x: rect.left,
            height: '100vh',
            y: 0,
          });
          Flip.from(wState, {
            duration: this.T.BASE,
            ease: 'mainEase',
            onComplete: () => {
              // Shrink height back to cell height
              const hState = Flip.getState(slider);
              gsap.set(slider, { height: rect.height, y: rect.top });
              Flip.from(hState, {
                duration: this.T.BASE,
                ease: 'mainEase',
                onComplete: () => {
                  gsap.to(slider, {
                    opacity: 0,
                    duration: this.T.SHORTEST,
                    onComplete: () => {
                      slider.style.visibility = 'hidden';
                      resolve();
                    },
                  });
                },
              });
            },
          });
        },
      });

      const contentEl = this.content()?.nativeElement;
      if (contentEl) {
        tl.to(contentEl, { opacity: 0, duration: this.T.SHORT }, 0);
      }
      tl.to(para, { opacity: 0, duration: this.T.SHORT }, this.T.ST_TINY).to(
        title,
        { y: '100%', duration: this.T.SHORT, ease: 'sideEase' },
        this.T.ST_SMALL
      );
    });
  }

  private transitionToSlide(index: number) {
    const slider = this.elSlider();
    const next = this.elNext();
    const bg = this.elBg();
    const overlay = this.elOverlay();
    const title = this.elTitle();
    const para = this.elPara();
    if (!slider || !next || !bg || !overlay || !title || !para) return;

    this.animating = true;

    const dir = index > this.activeIndex() ? 'right' : 'left';
    const xOffset = dir === 'right' ? '100%' : '-100%';

    const newUrl = this.slides[index].url;
    next.style.backgroundImage = `url("${newUrl}")`;
    bg.style.backgroundImage = `url("${newUrl}")`;

    gsap.set([next, bg], { visibility: 'visible' });
    gsap.set(next, {
      x: xOffset,
      y: 0,
      opacity: 1,
      width: '100vw',
      height: '100vh',
    });
    gsap.set(bg, {
      x: xOffset,
      y: 0,
      opacity: 0.9,
      width: '100vw',
      height: '100vh',
      scale: 1,
    });

    const master = gsap.timeline({
      onComplete: () => {
        // commit new slide
        slider.style.backgroundImage = `url("${newUrl}")`;
        gsap.set([next, bg, overlay], {
          opacity: 0,
          x: 0,
          y: 0,
          visibility: 'hidden',
        });
        gsap.set(slider, { x: 0, opacity: 1 });

        // update content text
        this.activeIndex.set(index);
        // reset content states then show
        gsap.set(title, { y: 0 });
        gsap.set(para, { opacity: 1 });
        this.animating = false;
      },
    });

    // hide content
    master.to(para, { opacity: 0, duration: this.T.SHORT }, 0);
    master.to(
      title,
      { y: '100%', duration: this.T.SHORT, ease: 'sideEase' },
      this.T.ST_TINY
    );

    // flash overlay (use primary with alpha)
    overlay.style.background =
      'color-mix(in srgb, var(--color-primary) 20%, transparent)';
    master.to(
      overlay,
      { visibility: 'visible', opacity: 0.15, duration: this.T.SHORTEST },
      this.T.ST_SMALL
    );
    master.to(overlay, { opacity: 0, duration: this.T.SHORT }, this.T.ST_MED);

    // push current
    master.to(
      slider,
      {
        x: dir === 'right' ? '-35%' : '35%',
        opacity: 1,
        duration: this.T.LONG,
      },
      0
    );

    // bring bg first
    master.to(
      bg,
      {
        x: dir === 'right' ? '-10%' : '10%',
        y: 0,
        opacity: 0.95,
        scale: 1,
        duration: this.T.LONG,
        ease: 'sideEase',
      },
      this.T.ST_TINY
    );

    // then main next
    master.to(
      next,
      { x: 0, opacity: 1, duration: this.T.LONG, ease: 'sideEase' },
      this.T.ST_SMALL
    );

    // show content again with new text
    master.add(() => {
      const s = this.slides[index];
      if (title && para) {
        title.textContent = s.title;
        para.textContent = s.paragraph;
      }
    });
    master.to(title, { y: 0, duration: this.T.BASE, ease: 'sideEase' }, 0.0);
    master.to(
      para,
      { opacity: 1, duration: this.T.BASE, ease: 'mainEase' },
      this.T.ST_SMALL
    );
  }

  // -------- Global events ----------
  private onKey = (e: KeyboardEvent) => {
    if (this.mode() !== 'slider' || this.animating) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const next = (this.activeIndex() + 1) % this.slides.length;
      this.transitionToSlide(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const prev =
        (this.activeIndex() - 1 + this.slides.length) % this.slides.length;
      this.transitionToSlide(prev);
    }
  };

  private onResize = () => {
    if (this.mode() !== 'slider') return;
    const slider = this.elSlider();
    if (!slider) return;
    gsap.set(slider, { width: '100vw', height: '100vh', x: 0, y: 0 });
  };
}
