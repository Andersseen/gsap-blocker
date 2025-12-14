import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pricing-simple',
  template: `
    <div class="py-24 bg-background">
      <div class="container mx-auto px-6 md:px-12">
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          @for (plan of plans(); track plan.name) {
          <div
            class="p-8 rounded-3xl border border-border bg-card flex flex-col hover:border-primary/50 transition-colors"
          >
            <h3 class="text-xl font-bold text-foreground mb-4">
              {{ plan.name }}
            </h3>
            <div class="mb-6">
              <span class="text-4xl font-bold text-foreground">{{
                plan.price
              }}</span>
              <span class="text-muted-foreground">/mo</span>
            </div>
            <p class="text-muted-foreground mb-8 text-sm leading-relaxed">
              {{ plan.description }}
            </p>
            <button
              class="mt-auto w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Choose Plan
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export default class PricingSimple {
  plans = input([
    {
      name: 'Starter',
      price: '$0',
      description:
        'Perfect for hobbyists and side projects. Includes all essential features to get you started.',
    },
    {
      name: 'Pro',
      price: '$29',
      description:
        'For growing businesses that need more power. automated workflows and advanced analytics included.',
    },
    {
      name: 'Enterprise',
      price: '$99',
      description:
        'Custom solutions for large scale organizations. Dedicated support and unlimited access.',
    },
  ]);
}
