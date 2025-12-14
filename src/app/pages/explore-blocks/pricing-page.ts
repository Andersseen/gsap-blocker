import { Component } from '@angular/core';
import PricingSection from '@blocks/pricing'; // "Pricing Table"
import PricingSimple from '@blocks/pricing-simple';
import PricingCompare from '@blocks/pricing-compare';
import PricingEnterprise from '@blocks/pricing-enterprise';

@Component({
  selector: 'pricing-page',
  imports: [PricingSection, PricingSimple, PricingCompare, PricingEnterprise],
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

        <!-- Block 1: Table -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            01. Standard Table
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background py-10"
          >
            <and-pricing-section />
          </div>
        </section>

        <!-- Block 2: Simple -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            02. Simple Cards
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <app-pricing-simple />
          </div>
        </section>

        <!-- Block 3: Comparison -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            03. Feature Comparison
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <app-pricing-compare />
          </div>
        </section>

        <!-- Block 4: Enterprise -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            04. Enterprise Focus
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-pricing-enterprise />
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class PricingPage {}
