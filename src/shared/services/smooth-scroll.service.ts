import { Injectable, signal, effect } from '@angular/core';

type ScrollToOpts = { offset?: number; immediate?: boolean };

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  readonly enabled = signal(false);
  readonly reduceMotion = signal(false);

  private rafId = 0;
  private lastTs = 0;
  private current = 0;
  private target = 0;
  private max = 0;

  private lerp = 0.1;
  private wheelMult = 1;
  private touchMult = 1.1;
  private flingGain = 0.25;

  private isCoarse = false;

  private touchStartY = 0;
  private lastTouchTs = 0;
  private lastTouchY = 0;
  private touchVel = 0;

  constructor() {
    effect(() => {
      const reduced = this.reduceMotion();
      if (reduced) {
        this.stopRAF();
        this.target = this.getNativeY();
        this.current = this.target;
      } else if (this.enabled()) {
        this.kickRAF();
      }
    });
  }

  setReducedMotion(v: boolean) {
    this.reduceMotion.set(!!v);
  }

  setCoarse(v: boolean) {
    this.isCoarse = !!v || window.innerWidth < 768;
    this.applyProfile();
  }

  start() {
    if (this.enabled()) return;
    if (typeof window === 'undefined') return;
    this.current = this.getNativeY();
    this.target = this.current;
    this.computeMax();
    this.lastTs = performance.now();
    this.enabled.set(true);
    if (!this.reduceMotion()) this.kickRAF();
  }

  stop() {
    if (!this.enabled()) return;
    this.enabled.set(false);
    this.stopRAF();
  }

  scrollTo(y: number, opts: ScrollToOpts = {}) {
    if (typeof window === 'undefined') return;
    const clamped = this.clamp(y + (opts.offset ?? 0), 0, this.max);
    this.target = clamped;
    if (opts.immediate || this.reduceMotion()) {
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
  setFlingGain(value: number) {
    this.flingGain = this.clamp(value, 0, 1);
  }

  onResize = () => {
    this.applyProfile();
    this.computeMax();
  };

  onWheel = (e: WheelEvent) => {
    if (!this.enabled() || this.reduceMotion()) return;
    if (e.ctrlKey || e.metaKey) return;
    if (this.isFromScrollable(e.target)) return;
    e.preventDefault();
    const delta = this.normalizeWheel(e) * this.wheelMult;
    this.target = this.clamp(this.target + delta, 0, this.max);
  };

  onTouchStart = (e: TouchEvent) => {
    if (!this.enabled()) return;
    const y = e.touches[0]?.clientY ?? 0;
    this.touchStartY = y;
    this.lastTouchY = y;
    this.lastTouchTs = performance.now();
    this.touchVel = 0;
  };

  onTouchMove = (e: TouchEvent) => {
    if (!this.enabled() || this.reduceMotion()) return;
    if (this.isFromScrollable(e.target)) return;
    const y = e.touches[0]?.clientY ?? 0;
    const now = performance.now();
    const dy = this.lastTouchY - y;
    const dt = Math.max(1, now - this.lastTouchTs);
    this.touchVel = (dy / dt) * 1000;
    const speed = Math.abs(this.touchVel);
    const accel = 1 + Math.min(speed / 900, 2) * 0.6;
    const delta = (this.touchStartY - y) * this.touchMult * accel;
    if (delta !== 0) {
      e.preventDefault();
      this.target = this.clamp(this.target + delta, 0, this.max);
      this.touchStartY = y;
    }
    this.lastTouchY = y;
    this.lastTouchTs = now;
  };

  onTouchEnd = () => {
    if (!this.enabled() || this.reduceMotion()) return;
    const extra = this.touchVel * this.flingGain;
    if (extra !== 0) this.target = this.clamp(this.target + extra, 0, this.max);
    this.touchVel = 0;
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled() || this.reduceMotion()) return;
    const tgt = e.target as Element | null;
    if (this.isEditable(tgt)) return;
    const step = 60;
    const page = window.innerHeight * 0.9;
    let delta = 0;
    switch (e.key) {
      case 'ArrowUp':
        delta = -step;
        break;
      case 'ArrowDown':
        delta = step;
        break;
      case 'PageUp':
        delta = -page;
        break;
      case 'PageDown':
        delta = page;
        break;
      case 'Home':
        this.scrollTo(0);
        e.preventDefault();
        return;
      case 'End':
        this.scrollTo(this.max);
        e.preventDefault();
        return;
      case ' ':
        delta = e.shiftKey ? -page : page;
        break;
      default:
        return;
    }
    e.preventDefault();
    this.target = this.clamp(this.target + delta, 0, this.max);
  };

  onVisibility = () => {
    if (document.hidden) this.stopRAF();
    else if (this.enabled() && !this.reduceMotion()) this.kickRAF();
  };

  private loop = () => {
    if (!this.enabled()) return;
    if (!this.reduceMotion()) {
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
    if (this.isCoarse) {
      this.lerp = 0.22;
      this.wheelMult = 1;
      this.touchMult = 2.0;
      this.flingGain = 0.35;
    } else {
      this.lerp = 0.12;
      this.wheelMult = 1;
      this.touchMult = 1.1;
      this.flingGain = 0.25;
    }
  }

  private computeMax() {
    const se = document.scrollingElement as HTMLElement | null;
    const sh = se ? se.scrollHeight : document.body.scrollHeight;
    this.max = Math.max(0, sh - window.innerHeight);
    this.target = this.clamp(this.target, 0, this.max);
    this.current = this.clamp(this.current, 0, this.max);
  }

  private normalizeWheel(e: WheelEvent) {
    if (e.deltaMode === 1) return e.deltaY * 16;
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
    const scale = Math.max(1, window.devicePixelRatio || 1);
    return e.deltaY * scale;
  }

  private isEditable(el: Element | null): boolean {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (
      tag === 'input' ||
      tag === 'textarea' ||
      (el as HTMLElement).isContentEditable
    )
      return true;
    if ((el as HTMLElement).closest?.('[data-native-scroll]')) return true;
    return false;
  }

  private isFromScrollable(target: EventTarget | null): boolean {
    const el = target as Element | null;
    if (!el) return false;
    if (
      (el as HTMLElement).closest?.(
        '[data-native-scroll], [data-scrollable="true"]'
      )
    )
      return true;
    let cur = (el as HTMLElement).closest?.('*') as HTMLElement | null;
    while (cur && cur !== document.body) {
      const st = window.getComputedStyle(cur);
      const oy = st.overflowY;
      if (
        (oy === 'auto' || oy === 'scroll') &&
        cur.scrollHeight > cur.clientHeight
      )
        return true;
      cur = cur.parentElement;
    }
    return false;
  }

  private clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
  }
  private getNativeY() {
    return window.scrollY || window.pageYOffset || 0;
  }
  private stopRAF() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }
  private kickRAF() {
    if (!this.rafId) this.rafId = requestAnimationFrame(this.loop);
  }
}
