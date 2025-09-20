import { Component } from '@angular/core';
import { HeroWaveComponent } from '../demo/hero-wave';

@Component({
  selector: 'app',
  imports: [HeroWaveComponent],

  template: ` <hero-wave /> `,
})
export default class App {}
