import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode = signal<boolean>(false);

  constructor() {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    this.darkMode.set(savedTheme === 'dark' || (!savedTheme && systemDark));

    // Effect to apply theme class
    effect(() => {
      const isDark = this.darkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggle() {
    this.darkMode.update((d) => !d);
  }
}
