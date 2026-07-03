import { Component, ChangeDetectionStrategy } from '@angular/core';
import Layout from './layout';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollDirective } from '@shared/directives/smooth-scroll.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [Layout, RouterOutlet, SmoothScrollDirective],

  template: `
    <app-layout appSmoothScroll class="bg-background text-foreground">
      <router-outlet />
    </app-layout>
  `,
})
export default class App {}
