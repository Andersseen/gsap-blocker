import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-features-list',
  imports: [NgOptimizedImage],
  template: `
    <div class="py-24 bg-background">
      <div class="container mx-auto px-6 md:px-12 space-y-24">
        @for (feature of features(); track feature.title; let i = $index) {
        <div
          class="flex flex-col md:flex-row items-center gap-12 md:gap-24"
          [class.md:flex-row-reverse]="i % 2 !== 0"
        >
          <!-- Text -->
          <div class="flex-1 space-y-6">
            <div
              class="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl"
            >
              {{ feature.icon }}
            </div>
            <h3
              class="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            >
              {{ feature.title }}
            </h3>
            <p class="text-lg text-muted-foreground leading-relaxed">
              {{ feature.description }}
            </p>
            <ul class="space-y-3 pt-4">
              @for (item of feature.list; track item) {
              <li class="flex items-center gap-3 text-foreground font-medium">
                <span class="text-green-500">✓</span> {{ item }}
              </li>
              }
            </ul>
          </div>

          <!-- Image -->
          <div class="flex-1 relative group">
            <div
              class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"
            ></div>
            <div
              class="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-card"
            >
              <img
                [ngSrc]="feature.image"
                width="600"
                height="400"
                class="w-full h-auto object-cover"
                [alt]="feature.title"
              />
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export default class FeaturesList {
  features = input([
    {
      title: 'Seamless Integration',
      description:
        'Connect your favorite tools with just a few clicks. Our platform supports over 50+ integrations out of the box, making your workflow smoother than ever.',
      icon: '🔌',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      list: ['One-click setup', 'Secure API handling', 'Real-time sync'],
    },
    {
      title: 'Advanced Analytics',
      description:
        'Gain deep insights into your performance. Track metrics that matter and make data-driven decisions to grow your business.',
      icon: '📊',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      list: ['Custom dashboards', 'Export to CSV/PDF', 'Predictive modeling'],
    },
  ]);
}
