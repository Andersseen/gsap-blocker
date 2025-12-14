import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing-enterprise',
  template: `
    <div class="py-24 bg-foreground text-background">
      <div class="container mx-auto px-6 md:px-12">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto"
        >
          <div class="flex-1 space-y-6">
            <h2 class="text-4xl md:text-6xl font-black tracking-tighter">
              Enterprise
            </h2>
            <p class="text-xl opacity-80 leading-relaxed max-w-md">
              Secure, scalable, and customizable. The infrastructure you need to
              power next-generation applications.
            </p>
            <ul class="space-y-3 pt-4 text-lg">
              <li class="flex items-center gap-3">
                <span
                  class="text-background bg-foreground rounded-full border border-background size-5 flex items-center justify-center text-xs"
                  >✓</span
                >
                SSO & SAML Integration
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="text-background bg-foreground rounded-full border border-background size-5 flex items-center justify-center text-xs"
                  >✓</span
                >
                Dedicated Success Manager
              </li>
              <li class="flex items-center gap-3">
                <span
                  class="text-background bg-foreground rounded-full border border-background size-5 flex items-center justify-center text-xs"
                  >✓</span
                >
                99.99% Uptime SLA
              </li>
            </ul>
          </div>

          <div
            class="w-full md:w-auto p-8 rounded-3xl bg-background text-foreground max-w-sm"
          >
            <div
              class="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground"
            >
              Starting at
            </div>
            <div class="text-5xl font-black mb-6">
              $499<span class="text-lg font-normal text-muted-foreground"
                >/mo</span
              >
            </div>
            <button
              class="w-full py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:scale-105 transition-transform"
            >
              Contact Sales
            </button>
            <p class="mt-4 text-center text-xs text-muted-foreground">
              No credit card required for demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class PricingEnterprise {}
