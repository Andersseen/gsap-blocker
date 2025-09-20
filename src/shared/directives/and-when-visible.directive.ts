// and-when-visible.directive.ts
import {
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  AND_GSAP_TIMELINE_CTX,
  AndGsapTimelineApi,
} from '@shared/and-gsap-tokens';

@Directive({
  selector: '[andWhenVisible]',
  exportAs: 'andWhenVisible',
})
export class AndWhenVisibleDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly timeline = inject(AND_GSAP_TIMELINE_CTX, {
    optional: true,
  }) as AndGsapTimelineApi | null;

  offset = input<string | number>('20%');
  once = input(true);

  // Estado legible desde la plantilla
  isVisible = signal(false);

  // Evento opcional
  becameVisible = output<void>();

  private io?: IntersectionObserver;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const rootMargin = this.computeRootMargin(this.offset());
    const threshold = 0.15;

    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!this.isVisible()) {
              this.isVisible.set(true); // <-- estado

              this.timeline?.play(); // play si hay timeline
              this.becameVisible.emit();
            }
            if (this.once()) this.io?.unobserve(this.el.nativeElement);
          }
        }
      },
      { rootMargin, threshold }
    );

    this.io.observe(this.el.nativeElement);
  }

  private computeRootMargin(val: string | number) {
    const v = typeof val === 'number' ? `${val}px` : val.trim();
    const normalized = /^\d+(\.\d+)?(%|px)$/.test(v) ? v : `${v}px`;
    return `0px 0px -${normalized} 0px`;
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }
}
