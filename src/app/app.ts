import { Component, signal } from '@angular/core';

import Layout from './layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app',
  imports: [Layout, RouterOutlet],

  template: `
    <layout>
      <router-outlet />
    </layout>
  `,
})
export default class App {}
