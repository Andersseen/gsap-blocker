import { Component, ChangeDetectionStrategy } from '@angular/core';
import Footer from '@blocks/footer';
import InteractiveFooter from '@blocks/interactive-footer';
import FooterMega from '@blocks/footer-mega';
import FooterMinimal from '@blocks/footer-minimal';
import BlockShowcase from '@components/block-showcase';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-footers',
  imports: [
    Footer,
    InteractiveFooter,
    FooterMega,
    FooterMinimal,
    BlockShowcase,
  ],
  template: `
    <div class="pt-24 pb-12 px-6 md:px-12 bg-background min-h-screen">
      <div class="max-w-7xl mx-auto space-y-24">
        <div class="max-w-3xl">
          <h1
            class="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6"
          >
            Footers
          </h1>
          <p class="text-xl text-muted-foreground">
            Finish strong with a solid footer.
          </p>
        </div>

        <app-block-showcase
          number="01"
          title="Simple multi-column"
          [padY]="true"
          snippet="import Footer from '@blocks/footer';

<!-- HTML -->
<app-footer-block />"
        >
          <app-footer-block />
        </app-block-showcase>

        <app-block-showcase
          number="02"
          title="Interactive Hover"
          snippet="import InteractiveFooter from '@blocks/interactive-footer';

<!-- HTML -->
<app-interactive-footer />"
        >
          <app-interactive-footer />
        </app-block-showcase>

        <app-block-showcase
          number="03"
          title="Mega Footer"
          snippet="import FooterMega from '@blocks/footer-mega';

<!-- HTML -->
<app-footer-mega />"
        >
          <app-footer-mega />
        </app-block-showcase>

        <app-block-showcase
          number="04"
          title="Minimal"
          snippet="import FooterMinimal from '@blocks/footer-minimal';

<!-- HTML -->
<app-footer-minimal />"
        >
          <app-footer-minimal />
        </app-block-showcase>
      </div>
    </div>
  `,
})
export default class FootersPage {}
