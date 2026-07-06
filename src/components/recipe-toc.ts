import { ChangeDetectionStrategy, Component } from '@angular/core';

interface TocItem {
  id: string;
  label: string;
}

const ITEMS: TocItem[] = [
  { id: 'demo', label: 'Demo' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'angular-way', label: 'The Angular way' },
  { id: 'source', label: 'Source code' },
  { id: 'recipe', label: 'Implementation recipe' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'performance', label: 'Performance' },
  { id: 'pitfalls', label: 'Common pitfalls' },
];

@Component({
  selector: 'app-recipe-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="recipe-toc sticky top-24 hidden rounded-2xl border border-border bg-secondary/20 p-5 lg:block"
      aria-label="Recipe sections"
    >
      <h4
        class="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground"
      >
        On this page
      </h4>
      <ul class="space-y-1.5">
        @for (item of items; track item.id) {
          <li>
            <a
              [href]="'#' + item.id"
              class="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export default class RecipeToc {
  items = ITEMS;
}
