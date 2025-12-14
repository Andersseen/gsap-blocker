import { Component } from '@angular/core';
import Features from '@blocks/features';
import BentoGrid from '@blocks/bento-grid';
import FeaturesList from '@blocks/features-list';
import FeaturesCards from '@blocks/features-cards';

@Component({
  selector: 'features-page',
  imports: [Features, BentoGrid, FeaturesList, FeaturesCards],
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

        <!-- Block 1: Grid -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            01. Classic Grid
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background py-10"
          >
            <features />
          </div>
        </section>

        <!-- Block 2: Bento -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            02. Bento Grid
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-bento-grid />
          </div>
        </section>

        <!-- Block 3: List (Zig-Zag) -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            03. Zig-Zag List
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-features-list />
          </div>
        </section>

        <!-- Block 4: Cards -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            04. Feature Cards
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-features-cards />
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class FeaturesPage {}
