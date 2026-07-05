import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-recipe-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="scroll-mt-24" [attr.id]="id() || null">
      <h2
        class="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground mb-4"
      >
        @if (icon()) {
          <span aria-hidden="true">{{ icon() }}</span>
        }
        {{ title() }}
      </h2>
      <div class="prose prose-zinc dark:prose-invert max-w-none">
        <ng-content />
      </div>
    </section>
  `,
})
export default class RecipeSection {
  title = input.required<string>();
  icon = input<string>('');
  id = input<string>('');
}
