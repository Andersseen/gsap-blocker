// and-when-visible.directive.ts
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  AND_GSAP_TIMELINE_CTX,
  AndGsapTimelineApi,
} from '@shared/and-gsap-tokens';

@Directive({
  selector: '[andWhenVisible]',
  exportAs: 'andWhenVisible',
})
export class AndWhenVisibleDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly timeline = inject(AND_GSAP_TIMELINE_CTX, {
    optional: true,
  }) as AndGsapTimelineApi | null;

  offset = input<string | number>('20%');
  once = input(true);

  // State readable from the template
  isVisible = signal(false);

  // Optional event
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
              this.isVisible.set(true); // <-- state

              this.timeline?.play(); // play if a timeline is present
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
