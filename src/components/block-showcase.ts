import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-block-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2
          class="text-sm font-bold text-muted-foreground uppercase tracking-widest"
        >
          {{ number() }}. {{ title() }}
        </h2>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            [attr.aria-label]="'Copy import snippet for ' + title()"
            (click)="copy()"
          >
            @if (copied()) {
              <svg
                class="size-3.5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Copied</span>
            } @else {
              <svg
                class="size-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy code</span>
            }
          </button>
        </div>
      </div>

      <div
        class="rounded-3xl border border-border overflow-hidden bg-background"
        [class.py-10]="padY()"
      >
        <ng-content />
      </div>

      @if (showCode()) {
        <div
          class="rounded-2xl border border-border bg-secondary/50 p-4 overflow-x-auto"
        >
          <pre
            class="text-xs font-mono text-foreground whitespace-pre"
          ><code>{{ snippet() }}</code></pre>
        </div>
      }
    </section>
  `,
})
export default class BlockShowcase {
  number = input<string>('01');
  title = input.required<string>();
  snippet = input.required<string>();
  padY = input<boolean>(false);
  showCode = input<boolean>(false);

  copied = signal(false);

  async copy() {
    const text = this.snippet();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  }
}
