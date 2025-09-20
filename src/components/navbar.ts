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

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="fixed inset-x-0 top-0 z-50 h-14 flex items-center justify-between px-2 sm:px-4 md:px-8 glass"
    >
      <a class="inline-flex items-center gap-2" routerLink="/">
        <div class="size-6 rounded-md "></div>
        <span class="font-semibold">GSAP Blocker</span>
      </a>

      <button
        class="md:hidden inline-flex items-center justify-center size-9 rounded-md border"
        type="button"
        [attr.aria-expanded]="open()"
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        (click)="toggle()"
      >
        <svg
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            [attr.d]="
              open() ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'
            "
          />
        </svg>
      </button>

      <div class="hidden md:flex px-4 items-center gap-3">
        <a
          class="link link-hover"
          routerLink="/home"
          routerLinkActive="link-active"
          [routerLinkActiveOptions]="{ exact: true }"
          >Home</a
        >
        <a
          class="link link-hover"
          routerLink="/docs"
          routerLinkActive="link-active"
          [routerLinkActiveOptions]="{ exact: true }"
          >Docs</a
        >
        <a
          class="link link-hover"
          routerLink="/blocks"
          routerLinkActive="link-active"
          >Explore Blocks</a
        >
      </div>

      <a
        class="hidden md:inline-flex items-center text-sm"
        href="https://github.com/Andersseen/gsap-blocker"
        target="_blank"
        rel="noreferrer"
      >
        <svg class="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.76-1.604-2.665-.303-5.467-1.334-5.467-5.932 0-1.31.467-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.242 2.873.12 3.176.77.84 1.232 1.912 1.232 3.222 0 4.61-2.807 5.625-5.48 5.922.43.372.814 1.103.814 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>
    </nav>

    @if (open()) {
    <button
      type="button"
      class="fixed inset-0 z-40 md:hidden"
      aria-label="Close menu"
      (click)="close()"
    ></button>

    <div
      id="mobile-menu"
      class="fixed top-14 inset-x-0 z-50 md:hidden border-t bg-foreground/80 text-background"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="container mx-auto px-2 sm:px-4 md:px-8 py-3 flex flex-col gap-2"
      >
        <a
          class="mobile-link"
          routerLink="/home"
          routerLinkActive="mobile-link-active"
          [routerLinkActiveOptions]="{ exact: true }"
          (click)="close()"
          >Home</a
        >
        <a
          class="mobile-link"
          routerLink="/docs"
          routerLinkActive="mobile-link-active"
          [routerLinkActiveOptions]="{ exact: true }"
          (click)="close()"
          >Docs</a
        >
        <a
          class="mobile-link"
          routerLink="/blocks"
          routerLinkActive="mobile-link-active"
          (click)="close()"
          >Explore Blocks</a
        >
        <a
          class="inline-flex items-center gap-2 py-2"
          href="https://github.com/Andersseen/gsap-blocker"
          target="_blank"
          rel="noreferrer"
          (click)="close()"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.76-1.604-2.665-.303-5.467-1.334-5.467-5.932 0-1.31.467-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.242 2.873.12 3.176.77.84 1.232 1.912 1.232 3.222 0 4.61-2.807 5.625-5.48 5.922.43.372.814 1.103.814 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
            />
          </svg>
          <span class="text-sm">GitHub</span>
        </a>
      </div>
    </div>
    }
  `,
})
export default class Navbar {
  private router = inject(Router);
  open = model(false);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.open.set(false));

    effect(() => {
      document.documentElement.style.position = this.open()
        ? 'fixed'
        : 'relative';
    });
  }

  toggle() {
    this.open.update((v) => !v);
  }
  close() {
    this.open.set(false);
  }
}
