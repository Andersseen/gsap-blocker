import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-animation-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-3xl border border-border overflow-hidden bg-background">
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-6 py-4"
      >
        <div class="flex items-center gap-3">
          @if (number()) {
            <span class="text-xs font-mono text-muted-foreground">{{
              number()
            }}</span>
          }
          <h3
            class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            {{ title() }}
          </h3>
        </div>
        <ng-content select="[showcaseActions]" />
      </div>

      <div class="flex min-h-[22rem] items-center justify-center p-8 md:p-12">
        <ng-content />
      </div>
    </div>
  `,
})
export default class AnimationShowcase {
  number = input<string>('');
  title = input.required<string>();
}
