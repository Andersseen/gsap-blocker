import {
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import Navbar from '@components/navbar';
import Footer from '@components/footer';

@Component({
  selector: 'layout',
  imports: [Navbar, Footer],
  host: {
    class: 'flex min-h-screen flex-col overflow-hidden',
  },
  template: `
    <navbar [(open)]="open" />

    <main class="flex-1 mt-14" #main>
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

      main {
        view-transition-name: main-router;
      }
    `,
  ],
})
export default class Layout {
  open = signal(false);

  main = viewChild<ElementRef<HTMLElement>>('main');

  constructor() {
    effect(() => {
      const mainEl = this.main();
      if (mainEl) {
        mainEl.nativeElement.style.filter = this.open() ? 'blur(5px)' : '';
      }
    });
  }
}
