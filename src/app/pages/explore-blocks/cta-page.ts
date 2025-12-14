import { Component } from '@angular/core';
import Cta2 from '@blocks/cta-2';
import SplitCta from '@blocks/split-cta';
import CtaInput from '@blocks/cta-input';
import CtaImage from '@blocks/cta-image';

@Component({
  selector: 'cta-page',
  imports: [Cta2, SplitCta, CtaInput, CtaImage],
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

        <!-- Block 1: Centered -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            01. Centered
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <and-cta />
          </div>
        </section>

        <!-- Block 2: Split -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            02. Split Layout
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <app-split-cta />
          </div>
        </section>

        <!-- Block 3: Input -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            03. Email Capture
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-cta-input />
          </div>
        </section>

        <!-- Block 4: Image -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            04. Feature Image
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-cta-image />
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class CtaPage {}
