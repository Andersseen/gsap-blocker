import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-cta-input',
  template: `
    <div class="py-24 bg-foreground text-background">
      <div class="container mx-auto px-6 md:px-12 text-center">
        <div class="max-w-2xl mx-auto space-y-8">
          <h2 class="text-3xl md:text-5xl font-black tracking-tighter">
            Join the waitlist
          </h2>
          <p class="text-lg md:text-xl opacity-80 leading-relaxed">
            Be the first to know when we launch. No spam, just updates.
          </p>

          <form
            class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            (submit)="onSubmit($event)"
          >
            <input
              type="email"
              placeholder="Enter your email"
              class="flex-1 px-5 py-4 rounded-xl bg-background text-foreground border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
            <button
              type="submit"
              class="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all active:scale-95"
            >
              Subscribe
            </button>
          </form>

          @if (submitted()) {
          <p class="text-green-400 font-medium animate-pulse">
            Thanks for subscribing! 🚀
          </p>
          }
        </div>
      </div>
    </div>
  `,
})
export default class CtaInput {
  submitted = signal(false);

  onSubmit(e: Event) {
    e.preventDefault();
    this.submitted.set(true);
    setTimeout(() => this.submitted.set(false), 3000);
  }
}
