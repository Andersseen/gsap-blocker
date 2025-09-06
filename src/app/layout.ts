import { Component, signal } from '@angular/core';
import Navbar from '@components/navbar';
import Footer from '@components/footer';

@Component({
  selector: 'layout',
  imports: [Navbar, Footer],
  host: {
    class: 'flex min-h-screen flex-col',
  },
  template: `
    <navbar />

    <main class="flex-1">
      <ng-content />
    </main>

    <app-footer />
  `,
})
export default class Layout {}
