import { NgModule } from '@angular/core';
import {
  ɵgetCleanupHook as getCleanupHook,
  getTestBed,
} from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { afterEach, beforeEach } from 'vitest';

const providers: NgModule['providers'] = [];

beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));

// Browser API mocks for SSR-safe services
const createMatchMedia = () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: () => {
    /* no-op */
  },
  removeListener: () => {
    /* no-op */
  },
  addEventListener: () => {
    /* no-op */
  },
  removeEventListener: () => {
    /* no-op */
  },
  dispatchEvent: () => false,
});

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = createMatchMedia as typeof window.matchMedia;
  }

  if (!window.localStorage) {
    const store: Record<string, string> = {};
    window.localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      length: 0,
    } as Storage;
  }
}

@NgModule({ providers })
export class TestModule {}

getTestBed().initTestEnvironment(
  [BrowserTestingModule, TestModule],
  platformBrowserTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
);
