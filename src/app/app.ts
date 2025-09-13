import { Component, signal } from '@angular/core';

import Layout from './layout';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from '@shared/services/smooth-scroll.service';

@Component({
  selector: 'app',
  imports: [Layout, RouterOutlet],

  template: `
    <layout>
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
