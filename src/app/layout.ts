import { Component, signal } from '@angular/core';
import { Navbar } from '@components/navbar';

@Component({
  selector: 'layout',
  imports: [Navbar],
  host: {
    class: 'flex min-h-screen flex-col',
  },
  template: `
    <navbar />

    <main class="flex-1">
      <ng-content />
    </main>

    <footer class="py-12 text-center text-sm text-zinc-500">
      © {{ year() }} GSAP Blocker. All rights reserved.
    </footer>
  `,
})
export default class Layout {
  year = signal(new Date().getFullYear());
}
