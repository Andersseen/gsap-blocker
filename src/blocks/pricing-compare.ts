import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pricing-compare',
  template: `
    <div class="py-24 bg-background">
      <div class="container mx-auto px-6 md:px-12 max-w-4xl">
        <div class="space-y-4">
          @for (feature of features(); track feature.name) {
          <div
            class="flex items-center justify-between p-4 border-b border-border hover:bg-muted/30 transition-colors"
          >
            <span class="text-foreground font-medium">{{ feature.name }}</span>
            <div class="flex items-center gap-12 text-sm">
              <div class="text-center w-24">
                @if(feature.starter) { <span class="text-green-500">✓</span> }
                @else { <span class="text-muted-foreground">-</span> }
              </div>
              <div class="text-center w-24">
                @if(feature.pro) { <span class="text-green-500">✓</span> } @else
                { <span class="text-muted-foreground">-</span> }
              </div>
              <div class="text-center w-24">
                @if(feature.ent) { <span class="text-green-500">✓</span> } @else
                { <span class="text-muted-foreground">-</span> }
              </div>
            </div>
          </div>
          }

          <!-- Column Headers (visually handy to have at bottom too or top) -->
          <div
            class="flex justify-end gap-12 pt-4 font-bold text-foreground text-sm"
          >
            <div class="w-24 text-center">Starter</div>
            <div class="w-24 text-center">Pro</div>
            <div class="w-24 text-center">Enterprise</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class PricingCompare {
  features = input([
    { name: 'Unlimited Projects', starter: true, pro: true, ent: true },
    { name: 'Custom Domains', starter: false, pro: true, ent: true },
    { name: 'Advanced Analytics', starter: false, pro: true, ent: true },
    { name: 'Dedicated Support', starter: false, pro: false, ent: true },
    { name: 'SLA Guarantee', starter: false, pro: false, ent: true },
  ]);
}
