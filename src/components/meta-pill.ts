import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type MetaPillVariant = 'difficulty' | 'angular' | 'gsap' | 'neutral';

@Component({
  selector: 'app-meta-pill',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()">{{ label() }}</span>`,
})
export default class MetaPill {
  label = input.required<string>();
  variant = input<MetaPillVariant>('neutral');

  classes = computed(() => {
    const base =
      'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium';

    switch (this.variant()) {
      case 'difficulty':
        return `${base} capitalize border-primary/30 bg-primary/10 text-primary`;
      case 'angular':
        return `${base} border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400`;
      case 'gsap':
        return `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`;
      default:
        return `${base} border-border bg-secondary/50 text-muted-foreground`;
    }
  });
}
