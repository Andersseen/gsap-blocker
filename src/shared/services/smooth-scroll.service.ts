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
  private touchMult = 1.1;
  private max = 0;
  private reduceMotion = false;
  private isCoarse = false;

  private touchStartY = 0;
  private lastTs = 0;

  start() {
    if (this.started) return;
    this.started = true;

    this.reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    this.applyProfile();

    this.current = window.scrollY || window.pageYOffset;
    this.target = this.current;
    this.computeMax();
    this.lastTs = performance.now();
    this.loop();
  }

  stop() {
    if (!this.started) return;
    this.started = false;
    cancelAnimationFrame(this.rafId);
  }

  onResize = () => {
    this.applyProfile();
    this.computeMax();
  };

  onWheel = (e: WheelEvent) => {
    if (this.reduceMotion) return;
    e.preventDefault();
    const delta = this.normalizeWheel(e) * this.wheelMult;
    this.target = this.clamp(this.target + delta, 0, this.max);
  };

  onTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0]?.clientY ?? 0;
  };

  onTouchMove = (e: TouchEvent) => {
    if (this.reduceMotion) return;
    const y = e.touches[0]?.clientY ?? 0;
    const delta = (this.touchStartY - y) * this.touchMult;
    if (delta !== 0) {
      e.preventDefault();
      this.target = this.clamp(this.target + delta, 0, this.max);
      this.touchStartY = y;
    }
  };

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
    this.lerp = this.clamp(value, 0.04, 0.5);
  }

  setWheelMultiplier(value: number) {
    this.wheelMult = this.clamp(value, 0.3, 2.5);
  }

  setTouchMultiplier(value: number) {
    this.touchMult = this.clamp(value, 0.8, 3);
  }

  private loop = () => {
    if (!this.started) return;

    if (!this.reduceMotion) {
      this.computeMax();
      const ts = performance.now();
      const dt = Math.min(0.033, Math.max(0.001, (ts - this.lastTs) / 1000));
      this.lastTs = ts;

      const alpha = 1 - Math.exp(-(this.lerp * 60) * dt);
      this.current += (this.target - this.current) * alpha;
      if (Math.abs(this.target - this.current) < 0.1)
        this.current = this.target;

      window.scrollTo(0, this.current);
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private applyProfile() {
    this.isCoarse =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (this.isCoarse) {
      this.lerp = 0.18;
      this.wheelMult = 1;
      this.touchMult = 1.7;
    } else {
      this.lerp = 0.12;
      this.wheelMult = 1;
      this.touchMult = 1.1;
    }
  }

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
    this.target = this.clamp(this.target, 0, this.max);
    this.current = this.clamp(this.current, 0, this.max);
  }

  private normalizeWheel(e: WheelEvent) {
    if (e.deltaMode === 1) return e.deltaY * 16;
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
    const scale = Math.max(1, window.devicePixelRatio || 1);
    return e.deltaY * scale;
  }

  private clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
  }
}
