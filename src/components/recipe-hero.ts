import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import MetaPill from '@components/meta-pill';
import type AnimationRecipe from '@shared/interfaces/animation-recipe.interface';

@Component({
  selector: 'app-recipe-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetaPill],
  template: `
    <section
      class="recipe-hero relative mb-12 overflow-hidden rounded-3xl border border-border bg-secondary/20 p-8 md:p-12"
    >
      <!-- Decorative glows -->
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div class="relative">
        <div class="mb-5 flex flex-wrap items-center gap-2">
          <app-meta-pill [label]="recipe().difficulty" variant="difficulty" />
          <app-meta-pill [label]="recipe().category" variant="neutral" />
        </div>

        <h1
          class="text-4xl font-black tracking-tighter text-foreground md:text-6xl lg:text-7xl"
        >
          {{ recipe().title }}
        </h1>

        <p
          class="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          {{ recipe().description }}
        </p>

        <div class="mt-6 flex flex-wrap gap-1.5">
          @for (c of recipe().angularConcepts; track c) {
            <app-meta-pill [label]="c" variant="angular" />
          }
          @for (c of recipe().gsapConcepts; track c) {
            <app-meta-pill [label]="c" variant="gsap" />
          }
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#source"
            class="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Get the code
            <svg
              class="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
          <a
            href="https://github.com/Andersseen/gsap-blocker"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            View on GitHub
            <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.76-1.604-2.665-.303-5.467-1.334-5.467-5.932 0-1.31.467-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.242 2.873.12 3.176.77.84 1.232 1.912 1.232 3.222 0 4.61-2.807 5.625-5.48 5.922.43.372.814 1.103.814 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  `,
})
export default class RecipeHero {
  recipe = input.required<AnimationRecipe>();
}
