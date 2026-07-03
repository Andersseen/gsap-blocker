import { Component, ChangeDetectionStrategy } from '@angular/core';
import Hero from '@blocks/hero';
import HeroModern from '@blocks/hero-modern';
import HeroSection from '@components/hero-section'; // "Hero Glow"
import HeroVideo from '@blocks/hero-video';
import BlockShowcase from '@components/block-showcase';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-heroes',
  imports: [Hero, HeroModern, HeroSection, HeroVideo, BlockShowcase],
  template: `
    <div class="pt-24 pb-12 px-6 md:px-12 bg-background min-h-screen">
      <div class="max-w-7xl mx-auto space-y-24">
        <!-- Header -->
        <div class="max-w-3xl">
          <h1
            class="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6"
          >
            Hero Sections
          </h1>
          <p class="text-xl text-muted-foreground">
            Impactful headers to grab attention immediately.
          </p>
        </div>

        <app-block-showcase
          number="01"
          title="Glow Effect"
          snippet="import HeroSection from '@components/hero-section';

<!-- HTML -->
<app-hero-section />"
        >
          <app-hero-section />
        </app-block-showcase>

        <app-block-showcase
          number="02"
          title="Split Layout"
          snippet="import Hero from '@blocks/hero';

<!-- HTML -->
<app-hero />"
        >
          <app-hero />
        </app-block-showcase>

        <app-block-showcase
          number="03"
          title="Modern Stagger"
          snippet="import HeroModern from '@blocks/hero-modern';

<!-- HTML -->
<app-hero-modern />"
        >
          <app-hero-modern />
        </app-block-showcase>

        <app-block-showcase
          number="04"
          title="Video Background"
          snippet="import HeroVideo from '@blocks/hero-video';

<!-- HTML -->
<app-hero-video />"
        >
          <app-hero-video />
        </app-block-showcase>
      </div>
    </div>
  `,
})
export default class HeroesPage {}
