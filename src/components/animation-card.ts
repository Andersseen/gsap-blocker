import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import MetaPill from '@components/meta-pill';
import type AnimationRecipe from '@shared/interfaces/animation-recipe.interface';

@Component({
  selector: 'app-animation-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MetaPill],
  template: `
    <a
      [routerLink]="['/animations', recipe().slug]"
      class="card group flex h-full flex-col"
    >
      <div class="flex items-center justify-between gap-2">
        <app-meta-pill [label]="recipe().difficulty" variant="difficulty" />
        <span class="text-xs font-medium text-muted-foreground">{{
          recipe().category
        }}</span>
      </div>

      <h3
        class="mt-4 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors"
      >
        {{ recipe().title }}
      </h3>
      <p class="mt-2 flex-1 text-sm text-muted-foreground">
        {{ recipe().description }}
      </p>

      <div class="mt-6 flex flex-wrap gap-1.5">
        @for (concept of recipe().angularConcepts.slice(0, 2); track concept) {
          <app-meta-pill [label]="concept" variant="angular" />
        }
        @for (concept of recipe().gsapConcepts.slice(0, 2); track concept) {
          <app-meta-pill [label]="concept" variant="gsap" />
        }
      </div>
    </a>
  `,
})
export default class AnimationCard {
  recipe = input.required<AnimationRecipe>();
}
