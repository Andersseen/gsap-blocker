import { Directive, ElementRef, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[andReveal]',
})
export class AndRevealDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private io?: IntersectionObserver;
  private gsap: any | null = null;
  private ctx: any | null = null;

  // Motion props
  y = input<number>(24);
  opacity = input<number>(0);
  duration = input<number>(0.8);
  delay = input<number>(0);
  once = input<boolean>(true);
  ease = input<string>('power3.out');

  // NEW: how far inside the viewport before firing (e.g. '20%' or 120)
  outset = input<string | number>('20%');

  // NEW: how much of the target must be visible (0..1)
  threshold = input<number>(0.2);

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.default;

    // preset to avoid flash of un-animated content
    if (this.gsap) {
      this.ctx = this.gsap.context(() => {
        this.gsap.set(this.el.nativeElement, {
          y: this.y(),
          opacity: this.opacity(),
        });
      }, this.el.nativeElement);
    } else {
      const style = this.el.nativeElement.style;
      style.transform = `translateY(${this.y()}px)`;
      style.opacity = String(this.opacity());
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const rootMargin = this.computeRootMargin(this.outset());
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.animateIn();
            if (this.once()) this.io?.unobserve(this.el.nativeElement);
          }
        }
      },
      {
        threshold: this.threshold(),
        rootMargin, // e.g. "0px 0px -20% 0px" => requiere 20% dentro del viewport
      }
    );

    this.io.observe(this.el.nativeElement);
  }

  private animateIn() {
    if (!this.gsap) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.gsap.set(this.el.nativeElement, { y: 0, opacity: 1 });
      return;
    }

    this.gsap.fromTo(
      this.el.nativeElement,
      { y: this.y(), opacity: this.opacity() },
      {
        y: 0,
        opacity: 1,
        duration: this.duration(),
        delay: this.delay(),
        ease: this.ease(),
        clearProps: 'transform,opacity',
      }
    );
  }

  private computeRootMargin(offset: string | number): string {
    // bottom negative margin => exige que el target esté "offset" dentro del viewport
    const val = typeof offset === 'number' ? `${offset}px` : offset.trim();
    const normalized = /^\d+(\.\d+)?$/.test(val) ? `${val}px` : val; // "120" -> "120px"
    return `0px 0px -${normalized} 0px`;
  }

  ngOnDestroy() {
    this.io?.disconnect();
    this.ctx?.revert?.();
  }
}
