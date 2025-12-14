import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  model,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgClass } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="fixed inset-x-0 top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 backdrop-blur-md bg-background/70 border-b border-border transition-all duration-300"
    >
      <!-- Logo -->
      <a class="inline-flex items-center gap-2 group" routerLink="/">
        <div
          class="size-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform"
        >
          B.
        </div>
        <span class="font-bold text-lg tracking-tight">GSAP Blocker</span>
      </a>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-8">
        <a
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          routerLink="/home"
          routerLinkActive="text-foreground font-semibold"
          [routerLinkActiveOptions]="{ exact: true }"
          >Home</a
        >
        <a
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          routerLink="/docs"
          routerLinkActive="text-foreground font-semibold"
          [routerLinkActiveOptions]="{ exact: true }"
          >Docs</a
        >
        <a
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          routerLink="/blocks"
          routerLinkActive="text-foreground font-semibold"
          >Explore Blocks</a
        >
        <a
          class="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border rounded-full px-4 py-2 hover:bg-secondary transition-colors"
          href="https://github.com/Andersseen/gsap-blocker"
          target="_blank"
          rel="noreferrer"
        >
          <span>GitHub</span>
          <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.76-1.604-2.665-.303-5.467-1.334-5.467-5.932 0-1.31.467-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.242 2.873.12 3.176.77.84 1.232 1.912 1.232 3.222 0 4.61-2.807 5.625-5.48 5.922.43.372.814 1.103.814 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
      </div>

      <!-- Mobile Trigger -->
      <button
        class="md:hidden relative z-[60] size-10 flex flex-col justify-center items-center gap-1.5 group"
        type="button"
        [attr.aria-expanded]="open()"
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        (click)="toggle()"
      >
        <span
          class="w-6 h-0.5 bg-foreground transition-all duration-300 origin-center"
          [ngClass]="{ 'rotate-45 translate-y-2': open() }"
        ></span>
        <span
          class="w-6 h-0.5 bg-foreground transition-all duration-300"
          [ngClass]="{ 'opacity-0': open() }"
        ></span>
        <span
          class="w-6 h-0.5 bg-foreground transition-all duration-300 origin-center"
          [ngClass]="{ '-rotate-45 -translate-y-2': open() }"
        ></span>
      </button>
    </nav>

    <!-- Mobile Overlay -->
    @if (open()) {
    <div
      class="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl flex flex-col justify-center px-8 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <nav class="flex flex-col gap-6">
        <a
          class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground hover:text-primary transition-colors animate-in slide-in-from-bottom-8 fade-in duration-500 delay-100"
          routerLink="/home"
          (click)="close()"
          >Home</a
        >
        <a
          class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground hover:text-primary transition-colors animate-in slide-in-from-bottom-8 fade-in duration-500 delay-200"
          routerLink="/docs"
          (click)="close()"
          >Docs</a
        >
        <a
          class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground hover:text-primary transition-colors animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300"
          routerLink="/blocks"
          (click)="close()"
          >Explore Blocks</a
        >
      </nav>

      <div
        class="mt-12 pt-8 border-t border-border animate-in slide-in-from-bottom-8 fade-in duration-500 delay-500"
      >
        <div class="flex items-center justify-between text-muted-foreground">
          <span class="text-sm">© {{ year }} Blocker.</span>
          <div class="flex gap-4">
            <a href="#" class="hover:text-foreground transition-colors"
              >Twitter</a
            >
            <a href="#" class="hover:text-foreground transition-colors"
              >GitHub</a
            >
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export default class Navbar {
  private router = inject(Router);

  year = new Date().getFullYear();
  open = model(false);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.open.set(false));

    effect(() => {
      document.documentElement.style.overflow = this.open() ? 'hidden' : '';
    });
  }

  toggle() {
    this.open.update((v) => !v);
  }
  close() {
    this.open.set(false);
  }
}
