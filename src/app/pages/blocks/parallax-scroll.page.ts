import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import ParallaxScroll from '@blocks/parallax-scroll';

export const routeMeta: RouteMeta = {
  title: 'Parallax Blocks — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content: 'Browse parallax blocks for your Angular landing page.',
    },
    { property: 'og:title', content: 'Parallax Blocks — GSAP Blocker' },
    {
      property: 'og:description',
      content: 'Browse parallax blocks for your Angular landing page.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-parallax-scroll',
  imports: [ParallaxScroll],
  template: `
    <div class="pt-24 bg-background min-h-screen">
      <app-parallax-scroll />
    </div>
  `,
})
export default class ParallaxScrollPage {}
