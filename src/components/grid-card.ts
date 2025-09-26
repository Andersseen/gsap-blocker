import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

type Category = {
  id: number | string;
  emoji: string;
  name: string;
  count: number;
};

@Component({
  selector: 'grid-card',
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
          rgba(255, 255, 255, 0.35) 12%,
          transparent 24%
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
    <div #root class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (category of categories(); track category.name; let i = $index) {
      <a
        #card
        class="group relative rounded-2xl border p-5 card-tilt gpu overflow-hidden
               border-[color:color-mix(in_srgb,var(--color-foreground) 10%,transparent)]
               bg-[color:color-mix(in_srgb,var(--color-background) 96%,white)]
               shadow-[0_1px_0_0_rgba(0,0,0,0.02)]
               transition-[box-shadow,transform] duration-300 ease-out"
        [routerLink]="category.name.toLowerCase()"
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
        <div
          class="pointer-events-none absolute -inset-12 opacity-0 gpu"
          style="filter: blur(28px)"
          data-blob
        ></div>

        <div class="shine absolute inset-0 rounded-2xl"></div>

        <div class="flex items-center justify-between">
          <span
            class="text-xs px-2 py-1 rounded-full
                       bg-[color:color-mix(in_srgb,var(--color-secondary) 12%,transparent)]
                       text-[color:var(--color-foreground)]/80"
          >
            #{{ category.id }}
          </span>

          <span
            class="text-xs px-2 py-1 rounded-full
                       bg-[color:color-mix(in_srgb,var(--color-foreground) 8%,transparent)]"
          >
            {{ category.count }} blocks
          </span>
        </div>

        <div class="mt-3 text-[2rem] leading-none select-none gpu" data-emoji>
          {{ category.emoji }}
        </div>

        <div class="mt-4 flex items-center justify-between">
          <h3 class="font-semibold text-[color:var(--color-foreground)]">
            {{ category.name }}
          </h3>
          <svg
            class="size-5 opacity-60 group-hover:opacity-100 transition"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>

        <div class="mt-4 h-24 rounded-xl relative overflow-hidden gpu" data-bg>
          <div class="absolute inset-0 opacity-70" data-gradient></div>
          <div class="absolute inset-0" data-grid></div>
        </div>

        <span
          class="absolute inset-0 rounded-2xl ring-0 ring-[color:var(--color-primary)]/50
                     group-focus-visible:ring-4 transition pointer-events-none"
        ></span>
      </a>
      }
    </div>
  `,
})
export default class GridCard {
  categories = input<Category[]>([]);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly root = viewChild<ElementRef<HTMLDivElement>>('root');

  private hoverLoops = new WeakMap<
    HTMLElement,
    gsap.core.Tween | gsap.core.Timeline
  >();
  private ctx: gsap.Context | null = null;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

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
          const el = shine;

          const ratio = (this as any).ratio ?? 1;
          el.style.setProperty('opacity', String(ratio * 0.55));
          el.style.setProperty(
            'background-position',
            `${-50 + ratio * 100}% 0%`
          );
        },
      });
    }

    if (emoji) {
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

    const blob = card.querySelector<HTMLElement>('[data-blob]');
    const shine = card.querySelector<HTMLElement>(
      '.shine'
    ) as HTMLElement | null;

    // Vuelve a reposo
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

    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ev.clientX - cx;
    const dy = ev.clientY - cy;

    // Tilt (limitado)
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
      const px = gsap.utils.clamp(-30, 30, (dx / rect.width) * 40);
      const py = gsap.utils.clamp(-30, 30, (dy / rect.height) * 40);
      grad.style.backgroundPosition = `${50 - px}% ${50 - py}%`;
    }
  }

  onPress(card: HTMLElement) {
    gsap.to(card, { scale: 0.985, duration: 0.08, ease: 'power1.out' });
  }
  onRelease(card: HTMLElement) {
    gsap.to(card, { scale: 1.01, duration: 0.12, ease: 'power1.out' });
  }

  private initBackground(card: HTMLElement) {
    const grad = card.querySelector<HTMLElement>('[data-gradient]');
    const grid = card.querySelector<HTMLElement>('[data-grid]');
    if (!grad || !grid) return;

    // Gradiente radial mixto con tu paleta
    grad.style.background = `radial-gradient(120% 150% at 30% 0%,
        color-mix(in srgb, var(--color-primary) 16%, transparent) 0%,
        transparent 60%),
       radial-gradient(120% 150% at 80% 120%,
        color-mix(in srgb, var(--color-secondary) 16%, transparent) 0%,
        transparent 60%),
       linear-gradient(180deg,
        color-mix(in srgb, var(--color-background) 96%, white) 0%,
        color-mix(in srgb, var(--color-background) 92%, white) 100%)`;
    grad.style.backgroundSize = '120% 120%, 120% 120%, 100% 100%';
    grad.style.backgroundPosition = '50% 50%, 50% 50%, 50% 50%';

    // Grid de puntos suave
    grid.style.background = `radial-gradient(circle at 1px 1px,
        color-mix(in srgb, var(--color-foreground) 10%, transparent) 1px,
        transparent 1.5px)`;
    grid.style.backgroundSize = '12px 12px';
    grid.style.opacity = '0.35';
  }

  private animateBackground(card: HTMLElement, active: boolean) {
    const grad = card.querySelector<HTMLElement>('[data-gradient]');
    const grid = card.querySelector<HTMLElement>('[data-grid]');
    if (!grad || !grid) return;

    if (active) {
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
