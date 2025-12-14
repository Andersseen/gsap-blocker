import { Component } from '@angular/core';
import Hero from '@blocks/hero';
import HeroModern from '@blocks/hero-modern';
import HeroSection from '@components/hero-section'; // "Hero Glow"
import HeroVideo from '@blocks/hero-video';

@Component({
  selector: 'heroes-page',
  imports: [Hero, HeroModern, HeroSection, HeroVideo],
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

        <!-- Block 1: Glow -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            01. Glow Effect
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <hero-section />
          </div>
        </section>

        <!-- Block 2: Simple/Split -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            02. Split Layout
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <app-hero />
          </div>
        </section>

        <!-- Block 3: Modern -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            03. Modern Stagger
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-hero-modern />
          </div>
        </section>

        <!-- Block 4: Video -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            04. Video Background
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-hero-video />
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class HeroesPage {}
