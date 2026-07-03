import { RouteMeta } from '@analogjs/router';
import { injectResponse } from '@analogjs/router/tokens';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  title: 'Page Not Found — GSAP Blocker',
  canActivate: [
    () => {
      const response = injectResponse();
      if (import.meta.env.SSR && response) {
        response.statusCode = 404;
        response.end();
      }
      return true;
    },
  ],
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-not-found',
  imports: [RouterLink],
  template: `
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6"
    >
      <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6">404</h1>
      <p class="text-xl text-muted-foreground mb-10 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        routerLink="/"
        class="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
      >
        Go back home
      </a>
    </div>
  `,
})
export default class NotFoundPage {}
