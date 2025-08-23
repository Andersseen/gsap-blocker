import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '@components/navbar';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  host: { class: 'block' },
  template: `
    <navbar />
    <main>
      <router-outlet />
    </main>
  `,
})
export default class Layout {}
