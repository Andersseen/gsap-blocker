import { Component } from '@angular/core';
import { AndGsapScrollDirective } from '@shared/directives/and-gsap-scroll.directive';

@Component({
  selector: 'app-root',
  imports: [AndGsapScrollDirective],
  styleUrl: './demo.css',
  template: `
    <main>
      <div class="section"><h1>Scroll down 👇</h1></div>
      <div class="container section">
        <div
          class="box"
          andGsapScroll
          start="top bottom"
          end="+=800"
          [scrub]="1"
          [from]="{ backgroundColor: '#28a92b', rotation: 360, scale: 0 }"
        ></div>
      </div>

      <div class="section"></div>
    </main>
  `,
})
export class Demo {}
