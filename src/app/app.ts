import { Component } from '@angular/core';
import Layout from './layout';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollDirective } from '@shared/directives/smooth-scroll.directive';

@Component({
  selector: 'app',
  imports: [Layout, RouterOutlet, SmoothScrollDirective],

  template: `
    <layout smoothScroll class="bg-background text-foreground">
      <router-outlet />
    </layout>
  `,
})
export default class App {}
