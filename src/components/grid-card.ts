import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { prefersReducedMotion } from '@shared/utils/motion';
import type { gsap } from 'gsap';

interface Category {
  id: number | string;
  emoji: string;
  name: string;
  count: number;
}

@Component({
  selector: 'app-grid-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: [
    `
      .gpu {
        transform: translateZ(0);
        backface-visibility: hidden;
        will-change: transform, opacity;
      }
      .card-tilt {
        transform-style: preserve-3d;
      }
      .shine::before {
        content: '';
        position: absolute;
        inset: -1px;
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(255, 255, 255, 0.4) 10%,
          transparent 20%
        );
        background-size: 200% 200%;
        mix-blend-mode: overlay;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
      }
    `,
  ],
  template: `
    <div #root class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      @for (category of categories(); track category.name; let i = $index) {
        <a
          #card
          class="group relative rounded-3xl p-[1px] flex flex-col card-tilt gpu overflow-hidden shadow-2xl hover:shadow-[0_0_40px_-10px_rgba(var(--color-primary),0.3)] transition-shadow duration-500 ease-out"
          [routerLink]="['/blocks', category.name.toLowerCase()]"
          (mouseenter)="onEnter(card)"
          (mouseleave)="onLeave(card)"
          (mousemove)="onMove(card, $event)"
          (pointerdown)="onPress(card)"
          (pointerup)="onRelease(card)"
          (keydown.enter)="onPress(card)"
          (keyup.enter)="onRelease(card)"
          tabindex="0"
          [attr.aria-label]="category.name + ' (' + category.count + ' blocks)'"
        >
          <!-- Animated gradient border backing -->
          <div
            class="absolute inset-0 z-0 bg-gradient-to-br from-border/50 via-border/10 to-transparent group-hover:from-primary/50 group-hover:via-primary/20 group-hover:to-transparent transition-colors duration-500"
          ></div>

          <!-- Main Card Body (Glass) -->
          <div
            class="relative z-10 flex flex-col h-full bg-background/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[calc(1.5rem-1px)] p-6 overflow-hidden"
          >
            <!-- Radial glow from mouse -->
            <div
              class="pointer-events-none absolute inset-0 opacity-0 gpu transition-opacity duration-500 ease-out z-0 mix-blend-screen"
              data-blob
            ></div>

            <!-- Foreground Content -->
            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-start justify-between">
                <!-- Emoji Container (Floating effect) -->
                <div
                  class="relative flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)] text-[2rem] leading-none gpu overflow-hidden group-hover:border-primary/30 transition-colors duration-500"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"
                  ></div>
                  <span data-emoji class="relative z-10 drop-shadow-md">{{
                    category.emoji
                  }}</span>
                </div>

                <!-- Badge (Neon style) -->
                <span
                  class="inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-3 py-1.5 font-mono uppercase tracking-widest rounded-full bg-black/40 text-muted-foreground border border-white/5 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300 shadow-inner"
                >
                  <span class="text-foreground group-hover:text-primary">{{
                    category.count
                  }}</span>
                  <span class="opacity-60">blocks</span>
                </span>
              </div>

              <div class="mt-8 flex items-end justify-between">
                <div>
                  <h3
                    class="font-extrabold text-2xl text-foreground tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 transition-all duration-500"
                  >
                    {{ category.name }}
                  </h3>
                  <p
                    class="text-sm text-muted-foreground mt-2 font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <span>Explore collection</span>
                    <span
                      class="tracking-tighter opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                      >-></span
                    >
                  </p>
                </div>

                <!-- Arrow Icon (Refined) -->
                <div
                  class="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground text-foreground transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-[0_0_20px_-5px_var(--color-primary)]"
                >
                  <svg
                    class="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <!-- Thumbnail Grid Pattern (Deep space look) -->
              <div
                class="mt-8 h-32 rounded-[1.25rem] relative overflow-hidden gpu border border-white/5 bg-black/40 group-hover:border-primary/20 transition-colors duration-500 shadow-inner"
                data-bg
              >
                <div
                  class="absolute inset-0 opacity-40 mix-blend-screen"
                  data-gradient
                ></div>
                <div
                  class="absolute inset-0 opacity-[0.2]"
                  data-grid
                  style="background-image: radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 16px 16px;"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                ></div>
              </div>
            </div>
          </div>
        </a>
      }
    </div>
  `,
})
export default class GridCard implements AfterViewInit, OnDestroy {
  categories = input<Category[]>([]);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly root = viewChild<ElementRef<HTMLDivElement>>('root');

  private hoverLoops = new WeakMap<
    HTMLElement,
    gsap.core.Tween | gsap.core.Timeline
  >();
  private ctx: gsap.Context | null = null;
  private gsap: typeof import('gsap').default | null = null;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const mod = await import('gsap');
    const gsap = mod.default;
    this.gsap = gsap;

    this.ctx = gsap.context(() => {
      const rootEl = this.root()?.nativeElement;
      if (!rootEl) return;

      const cards = Array.from(
        rootEl.querySelectorAll<HTMLElement>('a[routerLink]')
      );

      gsap.from(cards, {
        y: 18,
        autoAlpha: 0,
        filter: 'blur(6px)',
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.07,
        clearProps: 'filter',
      });

      cards.forEach((card) => this.initBackground(card));
    }, this.host.nativeElement);
  }

  ngOnDestroy() {
    this.ctx?.revert();
    this.ctx = null;
  }

  onEnter(card: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    const gsap = this.gsap;
    if (!gsap) return;

    const blob = card.querySelector<HTMLElement>('[data-blob]');
    const emoji = card.querySelector<HTMLElement>('[data-emoji]');
    const shine = card.querySelector<HTMLElement>(
      '.shine'
    ) as HTMLElement | null;

    gsap.to(card, { z: 0.001, translateZ: 0.001, duration: 0 });
    gsap.to(card, {
      y: -4,
      rotationX: 0,
      rotationY: 0,
      scale: 1.01,
      transformPerspective: 800,
      duration: 0.35,
      ease: 'power2.out',
    });

    if (blob) {
      blob.style.background = `radial-gradient(120px 120px at center,
        color-mix(in srgb,var(--color-primary) 22%, transparent) 0%,
        color-mix(in srgb,var(--color-primary) 0%, transparent) 60%)`;
      gsap.to(blob, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    }

    if (shine) {
      gsap.to(shine, {
        '--tw': 1,
        duration: 0.35,
        onUpdate: function () {
          const ratio = (this as { ratio?: number }).ratio ?? 1;
          shine.style.setProperty('opacity', String(ratio * 0.55));
          shine.style.setProperty(
            'background-position',
            `${-50 + ratio * 100}% 0%`
          );
        },
      });
    }

    if (emoji && !prefersReducedMotion()) {
      const loop = gsap.to(emoji, {
        y: -6,
        rotate: 6,
        duration: 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      this.hoverLoops.set(card, loop);
    }

    this.animateBackground(card, true);
  }

  onLeave(card: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    const gsap = this.gsap;
    if (!gsap) return;

    const blob = card.querySelector<HTMLElement>('[data-blob]');
    const shine = card.querySelector<HTMLElement>(
      '.shine'
    ) as HTMLElement | null;

    // Return to rest
    gsap.to(card, {
      y: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
    });

    if (blob) gsap.to(blob, { opacity: 0, duration: 0.25, ease: 'power1.out' });

    if (shine) gsap.to(shine, { opacity: 0, duration: 0.25 });

    const loop = this.hoverLoops.get(card);
    loop?.kill();
    this.hoverLoops.delete(card);

    this.animateBackground(card, false);
  }

  onMove(card: HTMLElement, ev: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const gsap = this.gsap;
    if (!gsap) return;

    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ev.clientX - cx;
    const dy = ev.clientY - cy;

    // Limited tilt
    const rotY = gsap.utils.clamp(-10, 10, (dx / rect.width) * 16);
    const rotX = gsap.utils.clamp(-10, 10, (-dy / rect.height) * 16);

    gsap.to(card, {
      rotationX: rotX,
      rotationY: rotY,
      duration: 0.25,
      ease: 'power2.out',
    });

    const blob = card.querySelector<HTMLElement>('[data-blob]');
    if (blob) {
      const localX = ev.clientX - rect.left;
      const localY = ev.clientY - rect.top;
      gsap.to(blob, {
        x: localX - rect.width / 2,
        y: localY - rect.height / 2,
        duration: 0.25,
        ease: 'power2.out',
      });
    }

    const grad = card.querySelector<HTMLElement>('[data-gradient]');
    if (grad) {
      const px = gsap.utils.clamp(-40, 40, (dx / rect.width) * 50);
      const py = gsap.utils.clamp(-40, 40, (dy / rect.height) * 50);
      gsap.to(grad, {
        backgroundPosition: `${50 - px}% ${50 - py}%`,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }

  onPress(card: HTMLElement) {
    this.gsap?.to(card, { scale: 0.985, duration: 0.08, ease: 'power1.out' });
  }
  onRelease(card: HTMLElement) {
    this.gsap?.to(card, { scale: 1.01, duration: 0.12, ease: 'power1.out' });
  }

  private initBackground(card: HTMLElement) {
    const grad = card.querySelector<HTMLElement>('[data-gradient]');
    if (!grad) return;

    // A softer, more premium glow that doesn't muddy the block
    grad.style.background = `radial-gradient(100% 100% at 50% 0%,
        color-mix(in srgb, var(--color-primary) 8%, transparent) 0%,
        transparent 70%),
       radial-gradient(120% 120% at 80% 100%,
        color-mix(in srgb, var(--color-foreground) 4%, transparent) 0%,
        transparent 60%)`;
    grad.style.backgroundSize = '120% 120%, 150% 150%';
    grad.style.backgroundPosition = '50% 50%, 50% 50%';
  }

  private animateBackground(card: HTMLElement, active: boolean) {
    const gsap = this.gsap;
    if (!gsap) return;

    const grad = card.querySelector<HTMLElement>('[data-gradient]');
    const grid = card.querySelector<HTMLElement>('[data-grid]');
    if (!grad || !grid) return;

    if (active) {
      if (prefersReducedMotion()) return;

      gsap.to(grid, {
        x: 6,
        y: -6,
        duration: 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to(grad, {
        scale: 1.04,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: 'center',
      });
    } else {
      gsap.killTweensOf(grid);
      gsap.killTweensOf(grad);
      gsap.to([grid, grad], {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }
}
