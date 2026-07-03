import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollDirective } from '@shared/directives/smooth-scroll.directive';
import Layout from './layout';

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
