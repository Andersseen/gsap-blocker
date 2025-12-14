import { Component } from '@angular/core';
import Footer from '@blocks/footer';
import InteractiveFooter from '@blocks/interactive-footer';
import FooterMega from '@blocks/footer-mega';
import FooterMinimal from '@blocks/footer-minimal';

@Component({
  selector: 'footers-page',
  imports: [Footer, InteractiveFooter, FooterMega, FooterMinimal],
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

        <!-- Block 1: Simple -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            01. Simple multi-column
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <bk-footer />
          </div>
        </section>

        <!-- Block 2: Interactive -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            02. Interactive Hover
          </h2>
          <div
            class="rounded-3xl border border-border overflow-hidden bg-background"
          >
            <app-interactive-footer />
          </div>
        </section>

        <!-- Block 3: Mega -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            03. Mega Footer
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-footer-mega />
          </div>
        </section>

        <!-- Block 4: Minimal -->
        <section class="space-y-4">
          <h2
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            04. Minimal
          </h2>
          <div class="rounded-3xl border border-border overflow-hidden">
            <app-footer-minimal />
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class FootersPage {}
