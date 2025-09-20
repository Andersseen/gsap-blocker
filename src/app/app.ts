import { Component } from '@angular/core';
import { SpacePanelsComponent } from '../demo/space-panels';

@Component({
  selector: 'app',
  imports: [SpacePanelsComponent],

  template: ` <space-panels /> `,
})
export default class App {}
