import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'page-docs',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-background">
      <!-- Docs Sidebar -->
      <aside
        class="w-full md:w-64 shrink-0 border-r border-border bg-secondary/30 md:h-screen sticky top-0 overflow-y-auto"
      >
        <div class="p-6">
          <h2
            class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4"
          >
            Documentation
          </h2>
          <nav class="space-y-1">
            <a
              routerLink="."
              fragment="introduction"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Introduction</a
            >
            <a
              routerLink="."
              fragment="installation"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Installation</a
            >
            <a
              routerLink="."
              fragment="theming"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Theming</a
            >
          </nav>

          <h2
            class="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-8 mb-4"
          >
            Blocks
          </h2>
          <nav class="space-y-1">
            <a
              routerLink="/blocks/heroes"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Heroes</a
            >
            <a
              routerLink="/blocks/features"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Features</a
            >
            <a
              routerLink="/blocks/bento-grid"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Bento Grid</a
            >
            <a
              routerLink="/blocks/cta"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >CTA</a
            >
            <a
              routerLink="/blocks/footers"
              class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >Footers</a
            >
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <div class="max-w-4xl mx-auto px-6 py-12 md:py-20">
          <!-- Header -->
          <div class="mb-16 border-b border-border pb-10">
            <h1
              class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6"
            >
              Documentation
            </h1>
            <p class="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Everything you need to build stunning, animated interfaces with
              Angular and GSAP. Copy-paste ready blocks optimized for
              performance and accessibility.
            </p>
          </div>

          <!-- Content Sections -->
          <div class="prose prose-zinc dark:prose-invert max-w-none">
            <section id="introduction" class="scroll-mt-24 mb-16">
              <h2>Introduction</h2>
              <p>
                GSAP Blocker is a curated collection of high-quality, animated
                UI blocks built with Angular 20 and Tailwind CSS v4. We enable
                you to ship premium experiences faster by providing
                production-ready components.
              </p>
              <div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div class="p-4 rounded-xl border border-border bg-card">
                  <h3 class="font-bold text-foreground mb-2">
                    ⚡️ Angular Signals
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Built with the latest reactivity primitives for optimal
                    performance.
                  </p>
                </div>
                <div class="p-4 rounded-xl border border-border bg-card">
                  <h3 class="font-bold text-foreground mb-2">
                    🎭 GSAP Animations
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Smooth, complex animations powered by the industry standard
                    library.
                  </p>
                </div>
              </div>
            </section>

            <section id="installation" class="scroll-mt-24 mb-16">
              <h2>Installation</h2>
              <p>
                To get started, ensuring you have the necessary dependencies
                installed in your Angular project:
              </p>
              <pre
                class="bg-primary text-primary-foreground p-4 rounded-lg overflow-x-auto"
              ><code>npm install gsap tailwindcss postcss autoprefixer</code></pre>
              <p>
                Ensure gsap is correctly configured for SSR if you are using
                Angular Universal / SSR.
              </p>
            </section>

            <section id="theming" class="scroll-mt-24 mb-16">
              <h2>Theming</h2>
              <p>
                We use usage semantic CSS variables compatible with Tailwind CSS
                v4.
              </p>
              <div
                class="not-prose p-6 rounded-xl bg-muted border border-border"
              >
                <div class="flex gap-4 mb-4">
                  <div
                    class="size-10 rounded bg-background border border-border"
                  ></div>
                  <div class="size-10 rounded bg-foreground"></div>
                  <div class="size-10 rounded bg-primary"></div>
                  <div class="size-10 rounded bg-muted"></div>
                </div>
                <p class="text-sm text-muted-foreground">
                  The theme adapts automatically to light and dark modes.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  `,
})
export default class DocsPage {}
