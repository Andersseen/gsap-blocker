import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AndGsapScrollDirective } from '@shared/directives/and-gsap-scroll.directive';

interface ScrollSection {
  id: number;
  title: string;
  body: string;
}

const SECTIONS: ScrollSection[] = [
  {
    id: 1,
    title: 'Scroll down ↓',
    body: 'Each card fades and slides in as it crosses this container — not the page.',
  },
  {
    id: 2,
    title: 'Scoped ScrollTrigger',
    body: 'andGsapScroll points its ScrollTrigger at this box through the scroller input.',
  },
  {
    id: 3,
    title: 'Cleaned up on destroy',
    body: 'Every ScrollTrigger created here is killed in ngOnDestroy, so nothing leaks on route change.',
  },
];

@Component({
  selector: 'app-scroll-reveal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AndGsapScrollDirective],
  template: `
    <div
      data-scroll-demo-viewport
      class="h-80 w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card/50 p-6"
    >
      <p class="mb-32 text-sm text-muted-foreground">
        Scroll inside this box ↓
      </p>
      @for (section of sections; track section.id) {
        <div
          andGsapScroll
          scroller="[data-scroll-demo-viewport]"
          start="top 85%"
          [from]="{ opacity: 0, y: 40, duration: 0.6, ease: 'power3.out' }"
          class="mb-32 rounded-2xl border border-border bg-background p-6 last:mb-0"
        >
          <h4 class="font-semibold text-foreground">{{ section.title }}</h4>
          <p class="mt-2 text-sm text-muted-foreground">{{ section.body }}</p>
        </div>
      }
    </div>
  `,
})
export default class ScrollRevealDemo {
  sections = SECTIONS;
}
