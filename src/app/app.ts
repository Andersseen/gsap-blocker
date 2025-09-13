import { Component, signal } from '@angular/core';

import Layout from './layout';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from '@shared/services/smooth-scroll.service';
import { SmoothScrollDirective } from '@shared/directives/smooth-scroll.directive';

@Component({
  selector: 'app',
  imports: [Layout, RouterOutlet, SmoothScrollDirective],

  template: `
    <layout smoothScroll>
      <router-outlet />
    </layout>
  `,
})
export default class App {
  constructor(private smooth: SmoothScrollService) {}

  ngAfterViewInit() {
    this.smooth.start();
  }

  ngOnDestroy() {
    this.smooth.stop();
  }
}
