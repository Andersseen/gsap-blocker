import {
  Component,
  signal,
  inject,
  afterNextRender,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, NgClass } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'space-panels',
  imports: [NgClass],
  host: {
    class: 'block w-full h-full',
  },
  template: `
    <div
      class="fixed inset-0 font-inter font-normal overflow-hidden cursor-grab bg-gray-950 text-gray-100 active:cursor-grabbing"
    >
      <!-- Left Menu -->
      <div
        class="fixed left-0 top-0 h-screen bg-gray-900 z-[100] flex flex-col justify-between border-r border-white/5 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        [ngClass]="
          menuExpanded()
            ? 'w-64 shadow-[0_0_25px_rgba(0,0,0,0.25)]'
            : 'w-[60px]'
        "
      >
        <!-- Menu Button -->
        <div class="absolute top-6 left-0 w-full flex justify-center z-[101]">
          <button
            class="w-6 h-5 flex flex-col justify-between cursor-pointer z-[200] bg-transparent border-none p-0"
            (click)="toggleMenu()"
            aria-label="Toggle menu"
          >
            <span
              class="block w-full h-0.5 bg-gray-100 transition-all duration-300"
              [ngClass]="
                menuExpanded() ? 'transform translate-y-[9px] rotate-45' : ''
              "
            ></span>
            <span
              class="block w-full h-0.5 bg-gray-100 transition-all duration-300"
              [ngClass]="menuExpanded() ? 'opacity-0' : ''"
            ></span>
            <span
              class="block w-full h-0.5 bg-gray-100 transition-all duration-300"
              [ngClass]="
                menuExpanded() ? 'transform -translate-y-[9px] -rotate-45' : ''
              "
            ></span>
          </button>
        </div>

        <!-- Logo -->
        <div
          class="absolute top-1/2 left-0 w-full flex justify-center -translate-y-1/2"
        >
          <div
            class="font-bold tracking-[2px] text-lg text-gray-100 whitespace-nowrap transform -rotate-90 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            [ngClass]="menuExpanded() ? 'opacity-0 translate-y-5' : ''"
          >
            SPACE
          </div>
        </div>

        <!-- Navigation -->
        <div
          class="absolute left-0 top-0 w-full h-full flex flex-col items-start justify-center pl-[60px] pr-8 bg-gray-900 transition-all duration-300"
          [ngClass]="
            menuExpanded() ? 'opacity-100 visible' : 'opacity-0 invisible'
          "
        >
          @for (nav of navigationItems(); track nav.index; let i = $index) {
          <a
            class="font-semibold text-gray-100 no-underline my-3 text-sm cursor-pointer flex items-center w-full transform -translate-x-5 opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:opacity-100 hover:text-red-600"
            [ngClass]="getNavItemClasses(nav.index, i)"
            (click)="navigateToPanel(nav.index)"
            [attr.data-index]="nav.index"
          >
            <span
              class="font-bold text-xs opacity-60 mr-3 min-w-[20px] transform -translate-x-2.5 transition-all duration-300"
            >
              {{ nav.number }}
            </span>
            <span>{{ nav.title }}</span>
          </a>
          }
        </div>
      </div>

      <!-- Page Container -->
      <div
        class="fixed top-0 right-0 bottom-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        [ngClass]="menuExpanded() ? 'left-64' : 'left-[60px]'"
        #pageContainer
      >
        <div class="absolute top-0 left-0 w-full h-full" #horizontalContainer>
          <div
            class="absolute top-0 left-0 h-full flex will-change-transform"
            #panelsContainer
          >
            <!-- Panel 1: Editorial split -->
            <section
              class="relative h-screen overflow-hidden w-screen grid grid-cols-[1.2fr_0.8fr]"
            >
              <div class="p-[5%] flex flex-col justify-center bg-gray-950">
                <div
                  class="w-[90%] opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible panel-content"
                >
                  <div
                    class="uppercase mb-6 text-sm tracking-tight text-red-600"
                  >
                    The Conversation
                  </div>
                  <h1
                    class="text-5xl lg:text-6xl mb-6 tracking-tight leading-[1.3] font-bold text-gray-100 w-full split-text"
                  >
                    When you look up at the stars, you're really looking at the
                    past. Our time here is brief, but our gaze is eternal
                  </h1>
                  <div
                    class="text-base lg:text-lg leading-relaxed text-gray-100 w-full"
                  >
                    <p class="mb-6 split-text">
                      The vast emptiness of space offers us perspective. It
                      reminds us how small we are in the grand scheme of things.
                      Yet somehow, that doesn't diminish us – it elevates our
                      existence into something miraculous.
                    </p>
                  </div>
                </div>
              </div>
              <div class="h-full relative overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                  <img
                    src="https://cdn.cosmos.so/996569d5-2f19-40e9-9504-af3009286f9f.jpeg"
                    alt="Space perspective"
                    class="w-[110%] h-[110%] object-cover brightness-75 will-change-transform opacity-0 transition-opacity duration-300 parallax loaded"
                    data-speed="0.3"
                  />
                </div>
              </div>
            </section>

            <!-- Panel 2: Full background -->
            <section
              class="relative h-screen overflow-hidden w-screen flex items-center justify-center"
            >
              <div class="absolute inset-0 overflow-hidden">
                <img
                  src="https://cdn.cosmos.so/6828e15d-6b7e-4116-ba62-99493fa821cf.jpeg"
                  alt="Cave opening"
                  class="absolute w-[110%] h-[110%] object-cover z-[1] will-change-transform brightness-[0.7] opacity-0 transition-opacity duration-300 parallax loaded"
                  data-speed="0.2"
                />
              </div>
              <div class="absolute inset-0 bg-black/50 z-[2]"></div>
              <div
                class="relative z-[3] w-4/5 max-w-[800px] text-gray-100 opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] panel-content"
              >
                <div class="uppercase mb-6 text-sm tracking-tight text-red-600">
                  Matthew
                </div>
                <h2
                  class="text-4xl lg:text-5xl mb-6 tracking-tight leading-[1.3] font-bold text-gray-100 w-full split-text"
                >
                  The universe doesn't care about our plans. It only rewards our
                  presence
                </h2>
                <div
                  class="text-base lg:text-lg leading-relaxed text-gray-100 w-full"
                >
                  <p class="mb-6 split-text">
                    We think we know what's out there, but man, we've barely
                    scratched the surface. It's like we're children opening our
                    eyes for the first time. Every discovery is just the
                    beginning of ten thousand more questions.
                  </p>
                </div>
              </div>
            </section>

            <!-- Panel 3: Fixed panel -->
            <section class="relative h-screen overflow-hidden w-screen">
              <div class="absolute inset-0 overflow-hidden">
                <img
                  src="https://cdn.cosmos.so/47895928-9611-45a3-b94d-0d8ef8ac02dc.jpeg"
                  alt="Galaxy view"
                  class="w-[110%] h-[110%] object-cover brightness-[0.7] will-change-transform opacity-0 transition-opacity duration-300 parallax loaded"
                  data-speed="0.25"
                />
              </div>
              <div
                class="absolute inset-0 flex flex-col justify-center items-center bg-black/50 text-white z-[2] p-0"
              >
                <div
                  class="text-[clamp(6rem,15vw,10rem)] leading-none font-black uppercase mb-6 text-red-600 tracking-tighter"
                >
                  BEYOND
                </div>
              </div>
            </section>

            <!-- Panel 4: Editorial split reversed -->
            <section
              class="relative h-screen overflow-hidden w-screen grid grid-cols-[0.8fr_1.2fr]"
            >
              <div class="h-full relative overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                  <img
                    src="https://cdn.cosmos.so/a28a9abc-6d7a-4160-a44b-2d9968c689c6.jpeg"
                    alt="Space explorer"
                    class="w-[110%] h-[110%] object-cover brightness-75 will-change-transform opacity-0 transition-opacity duration-300 parallax loaded"
                    data-speed="0.3"
                  />
                </div>
              </div>
              <div class="p-[5%] flex flex-col justify-center bg-gray-950">
                <div
                  class="w-[90%] opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible panel-content"
                >
                  <div
                    class="uppercase mb-6 text-sm tracking-tight text-red-600"
                  >
                    Rick
                  </div>
                  <h2
                    class="text-4xl lg:text-5xl mb-6 tracking-tight leading-[1.3] font-bold text-gray-100 w-full split-text"
                  >
                    Silence is the canvas where the universe reveals itself
                  </h2>
                  <div
                    class="text-base lg:text-lg leading-relaxed text-gray-100 w-full"
                  >
                    <p class="mb-6 split-text">
                      There's something profound about the emptiness. It's not
                      empty at all. It's full of potential. The space between
                      things – that's where the magic happens. We're drawn to
                      explore not because we want to conquer, but because we
                      yearn to understand.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Panel 5: Full background with COSMOS -->
            <section
              class="relative h-screen overflow-hidden w-screen flex items-center justify-center"
            >
              <div class="absolute inset-0 overflow-hidden">
                <img
                  src="https://cdn.cosmos.so/e3817e25-3312-43ea-b666-75aa0bc4b5ae.jpeg"
                  alt="Deep space"
                  class="absolute w-[110%] h-[110%] object-cover z-[1] will-change-transform brightness-[0.7] opacity-0 transition-opacity duration-300 parallax loaded"
                  data-speed="0.2"
                />
              </div>
              <div class="absolute inset-0 bg-black/50 z-[2]"></div>
              <div
                class="relative z-[3] w-4/5 max-w-[800px] text-gray-100 opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] panel-content"
              >
                <div
                  class="text-[clamp(6rem,15vw,10rem)] leading-none font-black uppercase text-red-600 mb-6 tracking-tighter"
                >
                  COSMOS
                </div>
                <div
                  class="text-base lg:text-lg leading-relaxed text-gray-100 w-full"
                >
                  <p class="mb-6 split-text">
                    Sometimes I think about how every atom in our bodies was
                    forged in the heart of a dying star. We're not just in the
                    universe – the universe is in us. That connection, that's
                    what drives us forward.
                  </p>
                </div>
              </div>
            </section>

            <!-- Panel 6: Split with quotes -->
            <section class="relative h-screen overflow-hidden w-screen flex">
              <div
                class="w-1/2 h-full relative overflow-hidden flex flex-col justify-center p-[5%] bg-gray-800 text-gray-100"
              >
                <div
                  class="w-[90%] opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible panel-content"
                >
                  <div
                    class="uppercase text-xs tracking-wider mb-2 text-red-600"
                  >
                    Matthew
                  </div>
                  <div
                    class="relative mt-4 pl-4 border-l-2 border-red-600 w-full"
                  >
                    <div
                      class="text-lg mb-6 leading-relaxed relative italic text-gray-100 tracking-tight w-full"
                    >
                      "I've always approached the cosmos with a sense of wonder.
                      It's like looking at your reflection in a mirror that
                      stretches into infinity. You see yourself, but you also
                      see beyond yourself."
                    </div>
                    <div class="text-sm mb-6 text-red-600">
                      INTERSTELLAR, 2014
                    </div>
                  </div>
                  <div
                    class="w-full max-w-[450px] h-[300px] mb-6 relative overflow-hidden transform-gpu shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded"
                  >
                    <div class="relative w-full h-full overflow-hidden">
                      <img
                        src="https://cdn.cosmos.so/f22462ad-b33d-448d-aa08-cfbbbe79ef42.jpeg"
                        alt="Space journey"
                        class="w-[110%] h-[110%] object-cover will-change-transform opacity-0 transition-opacity duration-300 parallax loaded"
                        data-speed="0.15"
                      />
                    </div>
                  </div>
                  <div
                    class="mt-6 p-6 bg-red-600/8 border-l-2 border-red-600 w-full rounded-r"
                  >
                    <p class="mb-6 split-text">
                      Looking out there is really looking in here. The questions
                      we ask about the stars are really questions about
                      ourselves.
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="w-1/2 h-full relative overflow-hidden flex flex-col justify-center p-[5%] bg-gray-700 text-gray-100"
              >
                <div
                  class="w-[90%] opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible panel-content"
                >
                  <div
                    class="uppercase text-xs tracking-wider mb-2 text-red-600"
                  >
                    Rick
                  </div>
                  <div
                    class="relative mt-4 pl-4 border-l-2 border-red-600 w-full"
                  >
                    <div
                      class="text-lg mb-6 leading-relaxed relative italic text-gray-100 tracking-tight w-full"
                    >
                      "Great art creates space. Great space creates perspective.
                      When we stand at the edge of the known, that's where true
                      creativity begins."
                    </div>
                    <div class="text-sm mb-6 text-red-600">
                      CREATIVE PROCESS, 2022
                    </div>
                  </div>
                  <div
                    class="font-serif italic text-base leading-relaxed mb-6 w-full"
                  >
                    "The universe doesn't rush, yet everything gets done. That's
                    the paradox we're trying to understand – infinite patience
                    paired with constant evolution."
                  </div>
                  <div
                    class="text-base lg:text-lg leading-relaxed text-gray-100 w-full"
                  >
                    <p class="mb-6 split-text">
                      What we discover out there transforms everything down
                      here. Each revelation about a distant galaxy reshapes how
                      we see ourselves on this pale blue dot.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Panel 7: New big text with image -->
            <section
              class="relative h-screen overflow-hidden w-screen flex items-center justify-center"
            >
              <div class="absolute inset-0 overflow-hidden">
                <img
                  src="https://cdn.cosmos.so/ee8be9fb-15f6-4f3b-a13f-309cbf5453c2.jpeg"
                  alt="Space infinite"
                  class="absolute w-[110%] h-[110%] object-cover z-[1] will-change-transform brightness-[0.7] opacity-0 transition-opacity duration-300 parallax loaded"
                  data-speed="0.3"
                />
              </div>
              <div class="absolute inset-0 bg-black/50 z-[2]"></div>
              <div
                class="relative z-[3] w-4/5 max-w-[800px] text-gray-100 text-center opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] panel-content"
              >
                <div
                  class="text-[clamp(7rem,15vw,12rem)] leading-[0.9] font-black uppercase text-red-600 mb-6 tracking-[-0.05em] drop-shadow-[0_0_20px_rgba(255,44,44,0.3)]"
                >
                  INFINITE
                </div>
                <div
                  class="text-base lg:text-lg leading-relaxed text-gray-100 w-full"
                >
                  <p class="mb-6 split-text">
                    The universe expands in all directions at once, infinitely
                    complex and infinitely simple. We are but a momentary
                    gathering of stardust, witnessing the cosmic dance.
                  </p>
                </div>
              </div>
            </section>

            <!-- Panel 8: Video with text -->
            <section
              class="relative h-screen overflow-hidden w-screen flex items-center justify-center"
            >
              <div class="absolute inset-0 bg-black/60 z-[2]"></div>
              <div
                class="relative z-[3] w-4/5 max-w-[800px] text-gray-100 text-center opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] panel-content"
              >
                <div
                  class="text-[clamp(7rem,15vw,12rem)] leading-[0.9] font-black uppercase text-red-600 mb-6 tracking-[-0.05em] drop-shadow-[0_0_20px_rgba(255,44,44,0.3)]"
                >
                  VISION
                </div>
              </div>
            </section>

            <!-- Panel 9: Contact -->
            <section
              class="relative h-screen overflow-hidden w-screen bg-gray-950 flex items-center justify-center"
            >
              <div class="w-4/5 max-w-[800px] text-center">
                <div
                  class="relative opacity-0 transform translate-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] panel-content"
                >
                  <div
                    class="text-[clamp(6rem,15vw,10rem)] text-gray-100 mb-12 lg:mb-24 leading-none font-black uppercase tracking-tight"
                  >
                    GET IN TOUCH
                  </div>
                  <div
                    class="relative inline-flex items-center gap-3 bg-white/5 px-6 py-4 rounded-[30px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-white/8 hover:-translate-y-0.5"
                  >
                    <a
                      href="mailto:hi@filip.fyi"
                      class="font-bold text-2xl text-gray-100 no-underline transition-colors duration-200 hover:text-red-600"
                    >
                      hi@filip.fyi
                    </a>

                    <span
                      class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded text-xs transition-all duration-300"
                      [ngClass]="
                        showCopyTooltip()
                          ? 'opacity-100 visible'
                          : 'opacity-0 invisible'
                      "
                    >
                      Copied!
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-[100] text-white mix-blend-difference"
      >
        <div class="text-xs uppercase tracking-wider">SCROLL</div>
        <div
          class="w-[150px] h-0.5 bg-white/30 relative overflow-hidden rounded-sm"
        >
          <div
            class="absolute top-0 left-0 h-full w-full bg-white origin-left will-change-transform transform scale-x-0"
            #progressFill
          ></div>
        </div>
        <div class="text-xs uppercase tracking-wider">
          {{ currentPanelDisplay() }} / 09
        </div>
      </div>
    </div>
  `,
})
export default class SpacePanelsComponent {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('pageContainer') pageContainer!: ElementRef;
  @ViewChild('horizontalContainer') horizontalContainer!: ElementRef;
  @ViewChild('panelsContainer') panelsContainer!: ElementRef;
  @ViewChild('progressFill') progressFill!: ElementRef;

  // State signals
  menuExpanded = signal(false);
  currentPanel = signal(0);
  showCopyTooltip = signal(false);

  // Computed
  currentPanelDisplay = signal('01');

  // Navigation items
  navigationItems = signal([
    { index: 0, number: '01', title: 'Introduction' },
    { index: 1, number: '02', title: 'Matthew' },
    { index: 2, number: '03', title: 'Beyond' },
    { index: 3, number: '04', title: 'Rick' },
    { index: 4, number: '05', title: 'Cosmos' },
    { index: 5, number: '06', title: 'Dialogue' },
    { index: 6, number: '07', title: 'Infinite' },
    { index: 7, number: '08', title: 'Vision' },
    { index: 8, number: '09', title: 'Contact' },
  ]);

  // Animation properties
  private readonly SMOOTH_FACTOR = 0.065;
  private readonly WHEEL_SENSITIVITY = 1.0;
  private readonly PANEL_COUNT = 9;
  private readonly PARALLAX_INTENSITY = 0.2;

  private targetX = 0;
  private currentX = 0;
  private currentProgress = 0;
  private targetProgress = 0;
  private panelWidth = 0;
  private maxScroll = 0;
  private isAnimating = false;
  private lastPanel = -1;

  // Touch/drag state
  private isDragging = false;
  private startX = 0;
  private startScrollX = 0;
  private velocityX = 0;
  private lastTouchX = 0;
  private lastTouchTime = 0;

  constructor() {
    afterNextRender(() => {
      this.initializeComponent();
    });
  }

  // Helper method for navigation item classes
  getNavItemClasses(index: number, arrayIndex: number): string {
    const baseClasses = 'transform translate-x-0 opacity-70';
    const activeClasses =
      this.currentPanel() === index ? 'opacity-100 text-red-600' : '';
    const expandedClasses = this.menuExpanded() ? baseClasses : '';
    const delayClass = this.menuExpanded()
      ? `transition-delay-[${50 + arrayIndex * 30}ms]`
      : '';

    return `${activeClasses} ${expandedClasses} ${delayClass}`;
  }

  private initializeComponent(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setupEventListeners();
    this.splitTextElements();
    this.updateDimensions();
    this.initializeParallaxElements();

    // Set initial active states
    setTimeout(() => {
      const panels = this.document.querySelectorAll('section');
      panels[0]?.classList.add('active');
      this.startAnimation();
    }, 100);
  }

  private setupEventListeners(): void {
    const horizontalContainer = this.horizontalContainer.nativeElement;

    // Wheel event
    horizontalContainer.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault();
        this.targetX = this.clamp(
          this.targetX + e.deltaY * this.WHEEL_SENSITIVITY,
          0,
          this.maxScroll
        );
        this.startAnimation();
      },
      { passive: false }
    );

    // Mouse events
    horizontalContainer.addEventListener('mousedown', (e: MouseEvent) =>
      this.handleMouseDown(e)
    );
    window.addEventListener('mousemove', (e: MouseEvent) =>
      this.handleMouseMove(e)
    );
    window.addEventListener('mouseup', () => this.handleMouseUp());

    // Touch events
    horizontalContainer.addEventListener(
      'touchstart',
      (e: TouchEvent) => this.handleTouchStart(e),
      { passive: true }
    );
    horizontalContainer.addEventListener(
      'touchmove',
      (e: TouchEvent) => this.handleTouchMove(e),
      { passive: false }
    );
    horizontalContainer.addEventListener(
      'touchend',
      () => this.handleTouchEnd(),
      { passive: true }
    );

    // Resize event
    window.addEventListener('resize', () => this.updateDimensions());
  }

  // Helper methods
  private lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  private clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  private updateDimensions(): void {
    this.panelWidth = window.innerWidth;
    this.maxScroll = (this.PANEL_COUNT - 1) * this.panelWidth;

    const panels = this.document.querySelectorAll('section');
    panels.forEach((panel: Element) => {
      (panel as HTMLElement).style.width = `${this.panelWidth}px`;
    });

    this.targetX = this.currentPanel() * this.panelWidth;
    this.currentX = this.targetX;

    if (this.panelsContainer) {
      this.panelsContainer.nativeElement.style.transform = `translateX(-${this.currentX}px)`;
    }

    this.updateParallax();
  }

  private startAnimation(): void {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }

  private animate(): void {
    this.currentX = this.lerp(this.currentX, this.targetX, this.SMOOTH_FACTOR);

    if (this.panelsContainer) {
      this.panelsContainer.nativeElement.style.transform = `translateX(-${this.currentX}px)`;
    }

    this.updateProgress();
    this.updatePageCount();
    this.updateActivePanel();
    this.updateParallax();

    if (Math.abs(this.targetX - this.currentX) > 0.1 || this.isAnimating) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isAnimating = false;
    }
  }

  private updateProgress(): void {
    this.targetProgress = this.currentX / this.maxScroll;
    this.currentProgress = this.lerp(
      this.currentProgress,
      this.targetProgress,
      this.SMOOTH_FACTOR * 1.5
    );

    if (this.progressFill) {
      this.progressFill.nativeElement.style.transform = `scaleX(${this.currentProgress})`;
    }
  }

  private updatePageCount(): void {
    const currentPanelIndex = Math.round(this.currentX / this.panelWidth) + 1;
    const formattedIndex = currentPanelIndex.toString().padStart(2, '0');
    this.currentPanelDisplay.set(formattedIndex);
  }

  private updateActivePanel(): void {
    const newPanel = Math.round(this.currentX / this.panelWidth);

    if (newPanel !== this.lastPanel) {
      const panels = this.document.querySelectorAll('section');

      if (this.lastPanel >= 0 && panels[this.lastPanel]) {
        panels[this.lastPanel].classList.remove('active');
      }

      if (panels[newPanel]) {
        panels[newPanel].classList.add('active');
      }

      for (let i = 0; i < panels.length; i++) {
        if (i < newPanel) {
          panels[i].classList.add('visited');
        } else {
          panels[i].classList.remove('visited');
        }
      }

      this.currentPanel.set(newPanel);
      this.lastPanel = newPanel;
    }
  }

  private updateParallax(): void {
    const parallaxElements = this.document.querySelectorAll('.parallax');
    parallaxElements.forEach((element: Element) => {
      const speed = Number.parseFloat(
        (element as HTMLElement).dataset['speed'] || '0.2'
      );
      const moveX = -this.currentX * speed * this.PARALLAX_INTENSITY;
      (element as HTMLElement).style.transform = `translateX(${moveX}px)`;
    });
  }

  private splitTextElements(): void {
    const splitTexts = this.document.querySelectorAll('.split-text');
    splitTexts.forEach((text: Element) => {
      const words = (text.textContent || '').split(' ');
      text.innerHTML = words
        .map(
          (word) =>
            `<span class="inline-block opacity-0 transform translate-y-4 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">${word}</span>`
        )
        .join(' ');

      const wordElements = text.querySelectorAll('span');
      wordElements.forEach((word: Element, index: number) => {
        (word as HTMLElement).style.transitionDelay = `${index * 0.02}s`;
      });
    });
  }

  private initializeParallaxElements(): void {
    const parallaxElements = this.document.querySelectorAll('.parallax');
    parallaxElements.forEach((img: Element) => {
      if ((img as HTMLImageElement).tagName === 'IMG') {
        const imgElement = img as HTMLImageElement;
        if (imgElement.complete) {
          imgElement.classList.add('loaded');
          imgElement.classList.remove('opacity-0');
          imgElement.classList.add('opacity-100');
        } else {
          imgElement.addEventListener('load', () => {
            imgElement.classList.add('loaded');
            imgElement.classList.remove('opacity-0');
            imgElement.classList.add('opacity-100');
          });
        }
      }
    });
  }

  // Event handlers
  private handleMouseDown(e: MouseEvent): void {
    if (
      e.target &&
      ((e.target as Element).closest('.left-menu') ||
        (e.target as Element).closest('button'))
    )
      return;

    this.isDragging = true;
    this.startX = e.clientX;
    this.startScrollX = this.currentX;
    this.lastTouchX = e.clientX;
    this.lastTouchTime = Date.now();
    e.preventDefault();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    const dx = e.clientX - this.startX;
    this.targetX = this.clamp(this.startScrollX - dx, 0, this.maxScroll);

    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastTouchTime;
    if (timeDelta > 0) {
      const touchDelta = this.lastTouchX - e.clientX;
      this.velocityX = (touchDelta / timeDelta) * 15;
    }

    this.lastTouchX = e.clientX;
    this.lastTouchTime = currentTime;
    this.startAnimation();
  }

  private handleMouseUp(): void {
    if (!this.isDragging) return;

    this.isDragging = false;

    if (Math.abs(this.velocityX) > 0.5) {
      this.targetX = this.clamp(
        this.targetX + this.velocityX * 8,
        0,
        this.maxScroll
      );
    }

    const nearestPanel = Math.round(this.targetX / this.panelWidth);
    this.targetX = nearestPanel * this.panelWidth;
    this.startAnimation();
  }

  private handleTouchStart(e: TouchEvent): void {
    if (
      e.target &&
      ((e.target as Element).closest('.left-menu') ||
        (e.target as Element).closest('button'))
    )
      return;

    this.isDragging = true;
    this.startX = e.touches[0].clientX;
    this.startScrollX = this.currentX;
    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchTime = Date.now();
  }

  private handleTouchMove(e: TouchEvent): void {
    if (!this.isDragging) return;

    const dx = e.touches[0].clientX - this.startX;
    this.targetX = this.clamp(this.startScrollX - dx, 0, this.maxScroll);

    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastTouchTime;
    if (timeDelta > 0) {
      const touchDelta = this.lastTouchX - e.touches[0].clientX;
      this.velocityX = (touchDelta / timeDelta) * 12;
    }

    this.lastTouchX = e.touches[0].clientX;
    this.lastTouchTime = currentTime;
    e.preventDefault();
    this.startAnimation();
  }

  private handleTouchEnd(): void {
    if (!this.isDragging) return;

    this.isDragging = false;

    if (Math.abs(this.velocityX) > 0.5) {
      this.targetX = this.clamp(
        this.targetX + this.velocityX * 6,
        0,
        this.maxScroll
      );
    }

    const nearestPanel = Math.round(this.targetX / this.panelWidth);
    this.targetX = nearestPanel * this.panelWidth;
    this.startAnimation();
  }

  // Component methods
  toggleMenu(): void {
    this.menuExpanded.update((expanded) => !expanded);

    setTimeout(() => {
      this.updateDimensions();
    }, 400);
  }

  navigateToPanel(index: number): void {
    this.targetX = index * this.panelWidth;
    this.startAnimation();

    if (window.innerWidth < 768 && this.menuExpanded()) {
      this.menuExpanded.set(false);
      setTimeout(() => this.updateDimensions(), 400);
    }
  }
}
