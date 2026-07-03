import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import PricingSection from '@blocks/pricing'; // "Pricing Table"
import PricingCompare from '@blocks/pricing-compare';
import PricingEnterprise from '@blocks/pricing-enterprise';
import PricingSimple from '@blocks/pricing-simple';
import BlockShowcase from '@components/block-showcase';

export const routeMeta: RouteMeta = {
  title: 'Pricing Blocks — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content: 'Browse pricing blocks for your Angular landing page.',
    },
    { property: 'og:title', content: 'Pricing Blocks — GSAP Blocker' },
    {
      property: 'og:description',
      content: 'Browse pricing blocks for your Angular landing page.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-pricing',
  imports: [
    PricingSection,
    PricingSimple,
    PricingCompare,
    PricingEnterprise,
    BlockShowcase,
  ],
  template: `
    <div class="pt-24 pb-12 px-6 md:px-12 bg-background min-h-screen">
      <div class="max-w-7xl mx-auto space-y-24">
        <div class="max-w-3xl">
          <h1
            class="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6"
          >
            Pricing
          </h1>
          <p class="text-xl text-muted-foreground">
            Clear, conversion-focused pricing tables.
          </p>
        </div>

        <app-block-showcase
          number="01"
          title="Standard Table"
          [padY]="true"
          snippet="import PricingSection from '@blocks/pricing';

<!-- HTML -->
<app-pricing-section />"
        >
          <app-pricing-section />
        </app-block-showcase>

        <app-block-showcase
          number="02"
          title="Simple Cards"
          snippet="import PricingSimple from '@blocks/pricing-simple';

<!-- HTML -->
<app-pricing-simple />"
        >
          <app-pricing-simple />
        </app-block-showcase>

        <app-block-showcase
          number="03"
          title="Feature Comparison"
          snippet="import PricingCompare from '@blocks/pricing-compare';

<!-- HTML -->
<app-pricing-compare />"
        >
          <app-pricing-compare />
        </app-block-showcase>

        <app-block-showcase
          number="04"
          title="Enterprise Focus"
          snippet="import PricingEnterprise from '@blocks/pricing-enterprise';

<!-- HTML -->
<app-pricing-enterprise />"
        >
          <app-pricing-enterprise />
        </app-block-showcase>
      </div>
    </div>
  `,
})
export default class PricingPage {}
