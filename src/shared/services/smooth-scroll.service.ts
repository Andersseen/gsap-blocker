import { Injectable } from '@angular/core';

type ScrollToOpts = { offset?: number; immediate?: boolean };

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private rafId = 0;
  private started = false;

  private current = 0;
  private target = 0;
  private lerp = 0.1;
  private wheelMult = 1;
  private max = 0;
  private reduceMotion = false;

  start() {
    if (this.started) return;
    this.started = true;

    this.reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.current = window.scrollY || window.pageYOffset;
    this.target = this.current;
    this.computeMax();

    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, {
      passive: true,
    });
    window.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });

    this.loop();
  }

  stop() {
    if (!this.started) return;
    this.started = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('wheel', this.onWheel as EventListener);
    window.removeEventListener(
      'touchstart',
      this.onTouchStart as EventListener
    );
    window.removeEventListener('touchmove', this.onTouchMove as EventListener);
  }

  scrollTo(y: number, opts: ScrollToOpts = {}) {
    const offset = opts.offset ?? 0;
    const clamped = Math.max(0, Math.min(y + offset, this.max));
    this.target = clamped;

    if (opts.immediate || this.reduceMotion) {
      this.current = clamped;
      window.scrollTo(0, clamped);
    }
  }

  setLerp(value: number) {
    this.lerp = Math.min(Math.max(value, 0.01), 0.5);
  }

  // ===== privados =====
  private loop = () => {
    if (!this.started) return;

    // si reduce motion, usar scroll nativo
    if (this.reduceMotion) {
      this.rafId = requestAnimationFrame(this.loop);
      return;
    }

    this.computeMax();

    this.current += (this.target - this.current) * this.lerp;

    if (Math.abs(this.target - this.current) < 0.1) this.current = this.target;

    window.scrollTo(0, this.current);
    this.rafId = requestAnimationFrame(this.loop);
  };

  private onResize = () => this.computeMax();

  private onWheel = (e: WheelEvent) => {
    if (this.reduceMotion) return; // permitir comportamiento nativo
    e.preventDefault();
    const delta = e.deltaY * this.wheelMult;
    this.target = this.clamp(this.target + delta, 0, this.max);
  };

  // Soporte táctil básico (opcional)
  private touchStartY = 0;
  private onTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0]?.clientY ?? 0;
  };
  private onTouchMove = (e: TouchEvent) => {
    if (this.reduceMotion) return;
    const y = e.touches[0]?.clientY ?? 0;
    const delta = this.touchStartY - y;
    if (Math.abs(delta) > 0) {
      e.preventDefault();
      this.target = this.clamp(this.target + delta, 0, this.max);
      this.touchStartY = y;
    }
  };

  private computeMax() {
    const doc = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      doc.clientHeight,
      doc.scrollHeight,
      doc.offsetHeight
    );
    this.max = Math.max(0, scrollHeight - window.innerHeight);
  }

  private clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
  }
}
