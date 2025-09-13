import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { SmoothScrollService } from '@shared/services/smooth-scroll.service';

@Directive({
  selector: '[smoothScroll]',
  host: { style: 'scroll-behavior:auto; overscroll-behavior-y:none' },
})
export class SmoothScrollDirective implements OnInit, OnDestroy {
  private smooth = inject(SmoothScrollService);

  private onWheel = (e: WheelEvent) => this.smooth.onWheel(e);
  private onTouchStart = (e: TouchEvent) => this.smooth.onTouchStart(e);
  private onTouchMove = (e: TouchEvent) => this.smooth.onTouchMove(e);
  private onResize = () => this.smooth.onResize();

  ngOnInit() {
    this.smooth.start();
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('wheel', this.onWheel as EventListener);
    window.removeEventListener(
      'touchstart',
      this.onTouchStart as EventListener
    );
    window.removeEventListener('touchmove', this.onTouchMove as EventListener);
    window.removeEventListener('resize', this.onResize as EventListener);
    this.smooth.stop();
  }
}
