import { InjectionToken } from '@angular/core';

export const CURRENT_YEAR = new InjectionToken<number>('CURRENT_YEAR', {
  providedIn: 'root',
  factory: () => new Date().getFullYear(),
});
