import { RouteMeta } from '@analogjs/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import AnimationCard from '@components/animation-card';
import ANIMATIONS from '@data/animations';

export const routeMeta: RouteMeta = {
  title: 'Motion Recipes — GSAP Blocker',
  meta: [
    {
      name: 'description',
      content:
        'A catalog of reusable GSAP animation patterns built the Angular way — live demos, source code and step-by-step recipes.',
    },
    { property: 'og:title', content: 'Motion Recipes — GSAP Blocker' },
    {
      property: 'og:description',
      content:
        'A catalog of reusable GSAP animation patterns built the Angular way — live demos, source code and step-by-step recipes.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/favicon.svg' },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-animations-index',
  imports: [AnimationCard, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div class="max-w-7xl mx-auto">
        <div class="mb-16 max-w-3xl">
          <h1
            class="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6"
          >
            Motion Recipes
          </h1>
          <p class="text-xl md:text-2xl text-muted-foreground">
            Angular-first GSAP animation patterns with live demos, source code
            and implementation recipes.
          </p>
        </div>

        <!-- Blocks vs Motion Recipes -->
        <div
          class="mb-16 grid gap-6 rounded-3xl border border-border bg-secondary/30 p-8 md:grid-cols-2"
        >
          <div>
            <h2
              class="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2"
            >
              Blocks
            </h2>
            <p class="text-foreground">
              Complete UI sections ready to copy: Hero, Pricing, CTA, Footer,
              Features, Testimonials.
            </p>
            <a
              routerLink="/blocks"
              class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              Explore Blocks →
            </a>
          </div>
          <div>
            <h2
              class="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2"
            >
              Motion Recipes
            </h2>
            <p class="text-foreground">
              Reusable animation patterns — Stagger Reveal, Scroll Reveal, Text
              Split, Magnetic Button, Spotlight Card, Card to Modal — built the
              Angular way so you can copy and adapt them.
            </p>
          </div>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <label for="recipe-search" class="sr-only">Search recipes</label>
          <div class="relative max-w-md">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="recipe-search"
              type="search"
              [(ngModel)]="query"
              placeholder="Search recipes, concepts, GSAP APIs..."
              class="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Category filters -->
        <div
          class="mb-10 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          @for (cat of categories(); track cat) {
            <button
              type="button"
              class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
              [class.border-primary]="category() === cat"
              [class.bg-primary]="category() === cat"
              [class.text-primary-foreground]="category() === cat"
              [class.border-border]="category() !== cat"
              [class.text-muted-foreground]="category() !== cat"
              [attr.aria-pressed]="category() === cat"
              (click)="category.set(cat)"
            >
              {{ cat === 'all' ? 'All' : cat }}
            </button>
          }
        </div>

        @if (filtered().length > 0) {
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (recipe of filtered(); track recipe.slug) {
              <app-animation-card [recipe]="recipe" />
            }
          </div>
        } @else {
          <p class="text-muted-foreground">No recipes match "{{ query() }}".</p>
        }

        <!-- CTA -->
        <div
          class="mt-20 flex flex-col items-start gap-4 rounded-3xl border border-border bg-secondary/30 p-8 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="text-2xl font-bold text-foreground">
              Want the full picture?
            </h2>
            <p class="mt-1 text-muted-foreground">
              Read the docs or browse the source on GitHub.
            </p>
          </div>
          <div class="flex gap-3">
            <a
              routerLink="/docs"
              class="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Read the Docs
            </a>
            <a
              href="https://github.com/Andersseen/gsap-blocker"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class AnimationsIndexPage {
  query = signal('');
  category = signal('all');
  recipes = signal(ANIMATIONS);

  categories = computed(() => [
    'all',
    ...new Set(this.recipes().map((r) => r.category)),
  ]);

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();

    return this.recipes().filter((r) => {
      if (cat !== 'all' && r.category !== cat) return false;
      if (!q) return true;

      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.angularConcepts.some((c) => c.toLowerCase().includes(q)) ||
        r.gsapConcepts.some((c) => c.toLowerCase().includes(q))
      );
    });
  });
}
