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

  y = input<number>(24);
  opacity = input<number>(0);
  duration = input<number>(0.8);
  delay = input<number>(0);
  once = input<boolean>(true);
  ease = input<string>('power3.out');

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mod = await import('gsap');
    this.gsap = mod.default;
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            this.animateIn();
            if (this.once()) this.io?.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.2 }
    );
    this.io.observe(this.el.nativeElement);
  }

  private animateIn() {
    if (!this.gsap) return;
    this.gsap.fromTo(
      this.el.nativeElement,
      { y: this.y(), opacity: this.opacity() },
      {
        y: 0,
        opacity: 1,
        duration: this.duration(),
        delay: this.delay(),
        ease: this.ease(),
      }
    );
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }
}
