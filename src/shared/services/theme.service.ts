import {
  Injectable,
  signal,
  effect,
  inject,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark';
const DARK_QUERY = '(prefers-color-scheme: dark)';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  darkMode = signal<boolean>(false);

  constructor() {
    afterNextRender(() => this.initialize());

    effect(() => {
      if (!this.isBrowser) return;

      const isDark = this.darkMode();
      const doc = document.documentElement;
      if (isDark) {
        doc.classList.add(DARK_CLASS);
      } else {
        doc.classList.remove(DARK_CLASS);
      }

      try {
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
      } catch {
        // Ignore private mode / SSR storage errors
      }
    });
  }

  toggle() {
    this.darkMode.update((d) => !d);
  }

  private initialize() {
    if (!this.isBrowser) return;

    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }

    const systemDark = window.matchMedia(DARK_QUERY).matches;
    this.darkMode.set(saved === 'dark' || (!saved && systemDark));
  }
}
