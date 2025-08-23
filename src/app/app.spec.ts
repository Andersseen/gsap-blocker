import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import App from './app';

describe('App', () => {
  beforeAll(async () => {
    try {
      if (typeof process !== 'undefined' && process.versions?.node) {
        const { readFileSync } = await import('node:fs');
        const { ɵresolveComponentResources: resolveComponentResources } =
          await import('@angular/core');

        await resolveComponentResources((url) =>
          Promise.resolve(readFileSync(new URL(url, import.meta.url), 'utf-8'))
        );
      }
    } catch {
      return;
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
