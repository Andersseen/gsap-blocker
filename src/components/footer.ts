import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';;
import { CURRENT_YEAR } from '@shared/tokens/date.token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  template: `
    <footer>© {{ year() }} GSAP Blocker. All rights reserved.</footer>
  `,
  host: { class: 'py-12 text-center text-sm text-muted-foreground' },
})
export default class Footer {
  year = signal(inject(CURRENT_YEAR));
}
