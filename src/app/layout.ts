import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import Footer from '@components/footer';
import Navbar from '@components/navbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout',
  imports: [Navbar, Footer],
  host: {
    class: 'flex min-h-screen flex-col overflow-x-clip',
  },
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground"
    >
      Skip to main content
    </a>

    <app-navbar [(open)]="open" />

    <main id="main-content" class="flex-1 mt-16" #main tabindex="-1">
      <ng-content />
    </main>

    <app-footer />
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
})
export default class Layout {
  private readonly platformId = inject(PLATFORM_ID);
  open = signal(false);

  main = viewChild<ElementRef<HTMLElement>>('main');

  constructor() {
    effect(() => {
      const mainEl = this.main();
      if (mainEl && isPlatformBrowser(this.platformId)) {
        mainEl.nativeElement.style.filter = this.open() ? 'blur(5px)' : '';
      }
    });
  }
}
