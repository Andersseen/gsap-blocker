import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import BentoGrid from '@blocks/bento-grid';
import Features from '@blocks/features';
import FeaturesCards from '@blocks/features-cards';
import FeaturesList from '@blocks/features-list';
import BlockShowcase from '@components/block-showcase';

export const routeMeta: RouteMeta = {
  title: 'Feature Blocks — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content: 'Browse feature blocks for your Angular landing page.',
    },
    { property: 'og:title', content: 'Feature Blocks — GSAP Blocker' },
    {
      property: 'og:description',
      content: 'Browse feature blocks for your Angular landing page.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-features',
  imports: [Features, BentoGrid, FeaturesList, FeaturesCards, BlockShowcase],
  template: `
    <div class="pt-24 pb-12 px-6 md:px-12 bg-background min-h-screen">
      <div class="max-w-7xl mx-auto space-y-24">
        <div class="max-w-3xl">
          <h1
            class="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6"
          >
            Features
          </h1>
          <p class="text-xl text-muted-foreground">
            Showcase your product capabilities in style.
          </p>
        </div>

        <app-block-showcase
          number="01"
          title="Classic Grid"
          [padY]="true"
          snippet="import Features from '@blocks/features';

<!-- HTML -->
<app-features />"
        >
          <app-features />
        </app-block-showcase>

        <app-block-showcase
          number="02"
          title="Bento Grid"
          snippet="import BentoGrid from '@blocks/bento-grid';

<!-- HTML -->
<app-bento-grid />"
        >
          <app-bento-grid />
        </app-block-showcase>

        <app-block-showcase
          number="03"
          title="Zig-Zag List"
          snippet="import FeaturesList from '@blocks/features-list';

<!-- HTML -->
<app-features-list />"
        >
          <app-features-list />
        </app-block-showcase>

        <app-block-showcase
          number="04"
          title="Feature Cards"
          snippet="import FeaturesCards from '@blocks/features-cards';

<!-- HTML -->
<app-features-cards />"
        >
          <app-features-cards />
        </app-block-showcase>
      </div>
    </div>
  `,
})
export default class FeaturesPage {}
