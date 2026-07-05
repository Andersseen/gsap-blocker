import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type AnimationRecipe from '@shared/interfaces/animation-recipe.interface';

@Component({
  selector: 'app-recipe-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav
      class="mt-4 flex items-center justify-between gap-4 border-t border-border pt-8"
      aria-label="More recipes"
    >
      @if (prev(); as recipe) {
        <a
          [routerLink]="['/animations', recipe.slug]"
          class="group flex flex-col items-start"
        >
          <span class="text-xs font-medium text-muted-foreground"
            >← Previous</span
          >
          <span
            class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
            >{{ recipe.title }}</span
          >
        </a>
      } @else {
        <span></span>
      }

      @if (next(); as recipe) {
        <a
          [routerLink]="['/animations', recipe.slug]"
          class="group flex flex-col items-end text-right"
        >
          <span class="text-xs font-medium text-muted-foreground">Next →</span>
          <span
            class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
            >{{ recipe.title }}</span
          >
        </a>
      }
    </nav>
  `,
})
export default class RecipeNav {
  prev = input<AnimationRecipe | null>(null);
  next = input<AnimationRecipe | null>(null);
}
