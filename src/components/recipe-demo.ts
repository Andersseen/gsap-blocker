import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-recipe-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="recipe-demo relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm"
    >
      <!-- Header -->
      <div
        class="relative flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-6 py-4"
      >
        <div class="flex items-center gap-3">
          @if (number()) {
            <span class="text-xs font-mono text-muted-foreground">{{
              number()
            }}</span>
          }
          <h3
            class="text-sm font-bold uppercase tracking-widest text-muted-foreground"
          >
            {{ title() }}
          </h3>
        </div>
        <a
          href="#source"
          class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          Get the code →
        </a>
      </div>

      <!-- Demo area with subtle grid pattern -->
      <div
        class="relative flex min-h-[24rem] items-center justify-center overflow-hidden p-6 md:min-h-[28rem] md:p-10"
      >
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.03]"
          style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 24px 24px;"
          aria-hidden="true"
        ></div>
        <ng-content />
      </div>
    </div>
  `,
})
export default class RecipeDemo {
  number = input<string>('');
  title = input.required<string>();
}
