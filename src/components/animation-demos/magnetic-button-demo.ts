import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-magnetic-button-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #magnet
      type="button"
      class="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-base font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Hover me
    </button>
  `,
})
export default class MagneticButtonDemo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>('magnet');

  private cleanup: (() => void) | null = null;

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => this.cleanup?.());
  }

  private async setup() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { gsap } = await import('gsap');
    const button = this.buttonRef().nativeElement;

    const setX = gsap.quickTo(button, 'x', { duration: 0.5, ease: 'power3' });
    const setY = gsap.quickTo(button, 'y', { duration: 0.5, ease: 'power3' });

    const onMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      setX(relX * 0.35);
      setY(relY * 0.35);
    };

    const onLeave = () => {
      setX(0);
      setY(0);
    };

    button.addEventListener('pointermove', onMove);
    button.addEventListener('pointerleave', onLeave);

    this.cleanup = () => {
      button.removeEventListener('pointermove', onMove);
      button.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(button);
    };
  }
}
