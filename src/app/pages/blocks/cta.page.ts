import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import Cta2 from '@blocks/cta-2';
import CtaImage from '@blocks/cta-image';
import CtaInput from '@blocks/cta-input';
import SplitCta from '@blocks/split-cta';
import BlockShowcase from '@components/block-showcase';

export const routeMeta: RouteMeta = {
  title: 'CTA Blocks — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content: 'Browse CTA blocks for your Angular landing page.',
    },
    { property: 'og:title', content: 'CTA Blocks — GSAP Blocker' },
    {
      property: 'og:description',
      content: 'Browse CTA blocks for your Angular landing page.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-cta',
  imports: [Cta2, SplitCta, CtaInput, CtaImage, BlockShowcase],
  template: `
    <div class="pt-24 pb-12 px-6 md:px-12 bg-background min-h-screen">
      <div class="max-w-7xl mx-auto space-y-24">
        <div class="max-w-3xl">
          <h1
            class="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6"
          >
            Call to Action
          </h1>
          <p class="text-xl text-muted-foreground">
            Drive conversions with these standout sections.
          </p>
        </div>

        <app-block-showcase
          number="01"
          title="Centered"
          snippet="import Cta2 from '@blocks/cta-2';

<!-- HTML -->
<app-cta-2 />"
        >
          <app-cta-2 />
        </app-block-showcase>

        <app-block-showcase
          number="02"
          title="Split Layout"
          snippet="import SplitCta from '@blocks/split-cta';

<!-- HTML -->
<app-split-cta />"
        >
          <app-split-cta />
        </app-block-showcase>

        <app-block-showcase
          number="03"
          title="Email Capture"
          snippet="import CtaInput from '@blocks/cta-input';

<!-- HTML -->
<app-cta-input />"
        >
          <app-cta-input />
        </app-block-showcase>

        <app-block-showcase
          number="04"
          title="Feature Image"
          snippet="import CtaImage from '@blocks/cta-image';

<!-- HTML -->
<app-cta-image />"
        >
          <app-cta-image />
        </app-block-showcase>
      </div>
    </div>
  `,
})
export default class CtaPage {}
