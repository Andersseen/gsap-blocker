import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import InfiniteMarquee from '@blocks/infinite-marquee';

export const routeMeta: RouteMeta = {
  title: 'Marquee Blocks — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content: 'Browse marquee blocks for your Angular landing page.',
    },
    { property: 'og:title', content: 'Marquee Blocks — GSAP Blocker' },
    {
      property: 'og:description',
      content: 'Browse marquee blocks for your Angular landing page.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-infinite-marquee',
  imports: [InfiniteMarquee],
  template: `
    <div class="pt-24 bg-background min-h-screen">
      <app-infinite-marquee />
    </div>
  `,
})
export default class InfiniteMarqueePage {}
