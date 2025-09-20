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

type Tab = {
  label: string;
  heading: string;
  text: string;
  img: string;
};

@Component({
  selector: 'osmo-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <section class="min-h-screen flex items-center w-full bg0background text-foreground">
      <div class="w-full max-w-[1240px] mx-auto p-4">
        <div class="flex gap-12 min-h-[37em]">
          <!-- Left column -->
          <div class="w-full lg:w-1/2">
            <div class="w-full max-w-[36em] ml-auto lg:mr-0 py-4">
              <div class="flex flex-col gap-8 justify-between min-h-full pr-10">
                <!-- Top -->
                <div class="flex flex-col gap-6">
                  <h1 class="text-[clamp(2rem,4vw,4em)] leading-[1] font-medium">
                    Explore the Layers of Abstract Design and Depth
                  </h1>

                  <!-- Filter / Tabs nav -->
                  <div
                    #nav
                    class="relative inline-flex rounded-lg p-2"
                  >
                    <!-- moving bg -->
                    <div
                      #bg
                      class="absolute inset-0 rounded-md border border-white/20 pointer-events-none"
                      style="z-index:0"
                    ></div>

                    @for (t of tabs; track t.label; let i = $index) {
                      <button
                        #btn
                        type="button"
                        (click)="onTabClick(i, btn)"
                        (mouseenter)="onBtnEnter(btn)"
                        (mouseleave)="onBtnLeave()"
                        (focus)="onBtnEnter(btn)"
                        (blur)="onBtnLeave()"
                        class="relative z-[1] px-6 py-3 text-[1.125em] rounded-md border transition-colors"
                        [class.border-transparent]="active() !== i"
                        [class.border-white/30]="active() === i"
                        [attr.aria-selected]="active() === i"
                        role="tab"
                      >
                        <span class="relative">{{ t.label }}</span>
                      </button>
                    }
                  </div>
                </div>

                <!-- Bottom: content + CTA -->
                <div class="flex flex-col gap-6 mt-24">
                  <!-- content wrap -->
                  <div #contentWrap class="relative w-full min-w-[24em]">
                    @for (t of tabs; track t.label; let i = $index) {
                      <div
                        class="absolute inset-x-0 bottom-0 flex flex-col gap-3"
                        [class.invisible]="active() !== i"
                        [class.visible]="active() === i"
                        data-content-item
                      >
                        <h2 class="text-[1.75em] leading-none font-medium m-0" data-tabs-fade>
                          {{ t.heading }}
                        </h2>
                        <p class="m-0 text-[1.25em] leading-snug opacity-80" data-tabs-fade>
                          {{ t.text }}
                        </p>
                      </div>
                    }
                  </div>

                  <a
                    href="#"
                    class="relative inline-flex items-center justify-center h-[4em] px-6"
                  >
                    <p class="m-0 text-[1.25em] leading-snug">Become a member</p>
                    <div class="absolute inset-0 rounded -z-10"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="w-full lg:w-1/2">
            <div #visualWrap class="relative w-full h-[42em] max-h-[80vh] rounded-lg overflow-hidden">
              @for (t of tabs; track t.label; let i = $index) {
                <div
                  class="absolute inset-0 flex items-center"
                  [class.invisible]="active() !== i"
                  [class.visible]="active() === i"
                  data-visual-item
                >
                  <img
                    [ngSrc]="t.img"
                    priority
                    width="1200"
                    height="800"
                    class="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- spacer -->
      <div class="h-screen"></div>
    </section>

    <!-- Credits (opcionales) -->
    <div class="fixed bottom-0 left-0 w-full h-16 p-4 flex items-center justify-center pointer-events-none z-[999]">
      <p class="pointer-events-auto text-center font-medium">
        Resource by
        <a target="_blank" href="https://www.osmo.supply/" class="underline">Osmo</a>
      </p>
    </div>
  `,
  styles: [
    `
      :host {
        color: var(--fg, #efeeec);
        background: var(--bg, #131313);
        font-family: Arial, sans-serif;
      }
    `,
  ],
})
export class OsmoTabsComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // Refs
  private readonly nav = viewChild<ElementRef<HTMLElement>>('nav');
  private readonly bg = viewChild<ElementRef<HTMLElement>>('bg');
  private readonly contentWrap =
    viewChild<ElementRef<HTMLElement>>('contentWrap');
  private readonly visualWrap =
    viewChild<ElementRef<HTMLElement>>('visualWrap');

  // State
  readonly tabs = [
    {
      label: 'Shapes',
      heading: 'Shifting Perspectives',
      text: 'A dynamic exploration of structure, balance, and creative symmetry.',
      img: 'https://cdn.prod.website-files.com/67726722d415dc401ae23cf6/677289e14dd4dbca1d8e5930_philip-oroni-IANBrm46bF0-unsplash%20(2).avif',
    },
    {
      label: 'Depth',
      heading: 'Fragments of Motion',
      text: 'Where design meets depth—an abstract dance of light and form.',
      img: 'https://cdn.prod.website-files.com/67726722d415dc401ae23cf6/677289e19e4d013c6a4c5a1b_philip-oroni-Zx_G3LpNnV4-unsplash%20(1).avif',
    },
    {
      label: 'Layers',
      heading: 'Echoes in Orange',
      text: 'A journey through layered geometry and endless possibilities.',
      img: 'https://cdn.prod.website-files.com/67726722d415dc401ae23cf6/677289e1c88b5b4c14d1e6fd_philip-oroni-h9N7bm-HRCo-unsplash.avif',
    },
  ] satisfies Tab[];

  active = signal(0);
  private isAnimating = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(Flip, CustomEase);
      CustomEase.create('osmo-ease', '0.625,0.05,0,1');
      gsap.defaults({ ease: 'osmo-ease', duration: 0.8 });
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Set initial active classes visible
    const contentItems = this._contentItems();
    const visualItems = this._visualItems();
    contentItems[0]?.classList.remove('invisible');
    visualItems[0]?.classList.remove('invisible');

    // Place bg under the first active button
    const firstBtn = this._buttons()[0];
    if (firstBtn && this.bg()) {
      firstBtn.appendChild(this.bg()!.nativeElement);
    }
  }

  // --- UI handlers ---
  onBtnEnter(btn: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    const bg = this.bg()?.nativeElement;
    if (!bg) return;
    const state = Flip.getState(bg);
    btn.appendChild(bg);
    Flip.from(state, { duration: 0.4 });
  }

  onBtnLeave() {
    if (!isPlatformBrowser(this.platformId)) return;
    const bg = this.bg()?.nativeElement;
    const activeBtn = this._buttons()[this.active()];
    if (!bg || !activeBtn) return;
    const state = Flip.getState(bg);
    activeBtn.appendChild(bg);
    Flip.from(state, { duration: 0.4 });
  }

  onTabClick(index: number, btnEl: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isAnimating || index === this.active()) return;
    this.isAnimating = true;

    // move bg to clicked
    this.onBtnEnter(btnEl);

    const contentItems = this._contentItems();
    const visualItems = this._visualItems();

    const outgoingContent = contentItems[this.active()];
    const incomingContent = contentItems[index];
    const outgoingVisual = visualItems[this.active()];
    const incomingVisual = visualItems[index];

    const outgoingLines = (outgoingContent?.querySelectorAll(
      '[data-tabs-fade]'
    ) ?? []) as NodeListOf<HTMLElement>;
    const incomingLines = (incomingContent?.querySelectorAll(
      '[data-tabs-fade]'
    ) ?? []) as NodeListOf<HTMLElement>;

    // incoming visible before anim
    incomingContent?.classList.remove('invisible');
    incomingVisual?.classList.remove('invisible');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        // hide previous after anim
        outgoingContent?.classList.add('invisible');
        outgoingVisual?.classList.add('invisible');
        this.active.set(index);
        this.isAnimating = false;
      },
    });

    tl.to(outgoingLines, { y: '-2em', autoAlpha: 0 }, 0)
      .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
      .fromTo(
        incomingLines,
        { y: '2em', autoAlpha: 0 },
        { y: '0em', autoAlpha: 1, stagger: 0.075 },
        0.4
      )
      .fromTo(
        incomingVisual,
        { autoAlpha: 0, xPercent: 3 },
        { autoAlpha: 1, xPercent: 0 },
        '<'
      );
  }

  // --- DOM helpers ---
  private _buttons(): HTMLElement[] {
    const nav = this.nav()?.nativeElement;
    return nav ? Array.from(nav.querySelectorAll('button')) : [];
  }
  private _contentItems(): HTMLElement[] {
    const el = this.contentWrap()?.nativeElement;
    return el ? Array.from(el.querySelectorAll('[data-content-item]')) : [];
  }
  private _visualItems(): HTMLElement[] {
    const el = this.visualWrap()?.nativeElement;
    return el ? Array.from(el.querySelectorAll('[data-visual-item]')) : [];
  }
}
