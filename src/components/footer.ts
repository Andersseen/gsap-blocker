import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>© {{ year() }} GSAP Blocker. All rights reserved.</footer>
  `,
  host: { class: 'py-12 text-center text-sm text-muted-foreground' },
})
export default class Footer {
  year = signal(new Date().getFullYear());
}
