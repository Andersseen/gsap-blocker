import { Component, input } from '@angular/core';

@Component({
  selector: 'app-features-cards',
  template: `
    <div class="py-24 bg-background">
      <div class="container mx-auto px-6 md:px-12">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-5xl font-black text-foreground mb-6">
            Everything you need
          </h2>
          <p class="text-xl text-muted-foreground">
            Powerful features to help you build faster and better.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          @for (card of cards(); track card.title) {
          <div
            class="group p-8 rounded-3xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
          >
            <div
              class="size-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              {{ card.icon }}
            </div>
            <h3 class="text-xl font-bold text-foreground mb-3">
              {{ card.title }}
            </h3>
            <p class="text-muted-foreground leading-relaxed">
              {{ card.description }}
            </p>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export default class FeaturesCards {
  cards = input([
    {
      title: 'Lightning Fast',
      description:
        'Optimized for speed. Scores 100/100 on Lighthouse with zero config.',
      icon: '⚡️',
    },
    {
      title: 'Secure by Default',
      description:
        'Enterprise-grade security features built-in to protect your data.',
      icon: '🛡️',
    },
    {
      title: 'Accessibility First',
      description:
        'Fully WCAG 2.1 compliant components for inclusive experiences.',
      icon: '♿️',
    },
    {
      title: 'Dark Mode',
      description: 'Automatic dark mode support with semantic color tokens.',
      icon: '🌗',
    },
    {
      title: 'Type Safe',
      description:
        'Written in TypeScript with strict mode enabled for robustness.',
      icon: '📘',
    },
    {
      title: 'SEO Optimized',
      description: 'Meta tags, semantic HTML, and sitemap generation included.',
      icon: '🔍',
    },
  ]);
}
