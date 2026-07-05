import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

export interface CodeTab {
  label: string;
  code: string;
}

@Component({
  selector: 'app-code-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-2xl border border-border overflow-hidden bg-secondary/30"
    >
      <div
        class="flex items-center gap-1 border-b border-border bg-secondary/40 px-2 py-2 overflow-x-auto"
      >
        @for (tab of tabs(); track tab.label; let i = $index) {
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
            [class.bg-card]="active() === i"
            [class.text-foreground]="active() === i"
            [class.text-muted-foreground]="active() !== i"
            [attr.aria-pressed]="active() === i"
            (click)="active.set(i)"
          >
            {{ tab.label }}
          </button>
        }
        <button
          type="button"
          class="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          [attr.aria-label]="'Copy ' + tabs()[active()].label + ' code'"
          (click)="copy()"
        >
          {{ copied() ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <pre
        class="overflow-x-auto p-4 text-xs font-mono text-foreground whitespace-pre"
      ><code>{{ tabs()[active()].code }}</code></pre>
    </div>
  `,
})
export default class CodeTabs {
  tabs = input.required<CodeTab[]>();
  active = signal(0);
  copied = signal(false);

  async copy() {
    const tab = this.tabs()[this.active()];
    if (!tab) return;

    try {
      await navigator.clipboard.writeText(tab.code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  }
}
