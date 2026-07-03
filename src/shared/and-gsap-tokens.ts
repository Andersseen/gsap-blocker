// and-gsap-tokens.ts
import { InjectionToken } from '@angular/core';

export type TweenVars = Record<string, unknown>;

export interface AndGsapTimelineApi {
  registerFrom(
    target: HTMLElement,
    vars: TweenVars,
    at?: string | number
  ): void;

  // añade los métodos que usarás (mínimo play)
  play(): void;
  pause(): void;
  restart(): void;
  reverse(): void;
  seek(t: number | string): void;
  timeScale(v: number): void;
}

export const AND_GSAP_TIMELINE_CTX = new InjectionToken<AndGsapTimelineApi>(
  'AND_GSAP_TIMELINE_CTX'
);
