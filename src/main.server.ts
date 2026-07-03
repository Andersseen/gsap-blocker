import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import App from './app/app';
import { appConfig } from './app/app.config';

// Minimal browser API mocks for SSR prerendering of @defer(on viewport) and
// other browser-only APIs that may be accessed during server rendering.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserverMock {
    observe() {
      /* no-op */
    }
    unobserve() {
      /* no-op */
    }
    disconnect() {
      /* no-op */
    }
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

const bootstrap = () => bootstrapApplication(App, appConfig);

export default async function render(url: string, document: string) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
  });
  return html;
}
