# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Motion Recipes** (`/animations`): a catalog of reusable GSAP animation patterns built the Angular way, alongside the existing Blocks library. Includes a searchable/filterable index page and six recipes — Stagger Reveal, Scroll Reveal, Text Split Reveal, Magnetic Button, Spotlight Card, and Card to Modal — each with a live demo, full source code, a step-by-step implementation recipe, and accessibility/performance notes.
- `AnimationRecipe` data model (`src/data/animations.ts`, `src/shared/interfaces/animation-recipe.interface.ts`) and shared presentational components (`app-animation-card`, `app-animation-showcase`, `app-code-tabs`, `app-meta-pill`, `app-recipe-section`, `app-recipe-nav`).
- "Motion Recipes" link in the navbar (desktop and mobile).
- Migrated the application from Angular CLI to **AnalogJS** (Vite, file-based routing, Nitro SSR).
- Cloudflare Pages deployment preset (`BUILD_PRESET=cloudflare-pages`) with SSR via `_worker.js`.
- Local Cloudflare Pages deploy scripts (`pnpm run deploy` and `pnpm run deploy:pages`).
- File-based routing under `src/app/pages/*.page.ts` using `@analogjs/router`.
- Route-level SEO via `RouteMeta` (`title`, `meta`, OpenGraph tags) for SSR-friendly head management.
- `wrangler.jsonc` and GitHub Actions deploy workflow for Cloudflare Pages.
- `src/main.server.ts` SSR render entry with minimal browser API mocks for prerendering.

### Changed

- Replaced Angular CLI builders with Vite/AnalogJS:
  - `angular.json` → `vite.config.ts`
  - `ng serve`/`ng build` → `vite`/`vite build`
  - `ng test` → `vitest run`
  - `ng lint` → `eslint .`
- Moved `src/index.html` to project root to match Vite conventions.
- Updated `tsconfig.json` to use `module: "ESNext"` and `moduleResolution: "bundler"`.
- Bumped `.nvmrc` to Node 22 (AnalogJS recommendation).
- Updated CI workflow to run the new pnpm scripts.

### Removed

- Angular CLI and Angular SSR-specific packages and files (`@angular/cli`, `@angular/ssr`, `@angular/build`, `express`, `app.config.server.ts`, `app.routes.server.ts`).
- Programmatic `app.routes.ts`; routes are now discovered from the file system.
- `SeoService`; replaced by AnalogJS `RouteMeta`.

### Fixed

- Added an explicit GitHub Actions preflight check for required Cloudflare deploy secrets.
- Added `isPlatformBrowser` guards to `SmoothScrollDirective`, `Navbar`, and `Cta2` to prevent SSR errors during prerendering.
- `AndGsapScrollDirective` (`andGsapScroll`) previously imported `gsap`/`gsap/ScrollTrigger` eagerly and registered the plugin in its constructor, which could run during SSR. It now lazy-imports GSAP behind an `isPlatformBrowser` guard, respects `prefers-reduced-motion`, and gained a `scroller` input for embedding it inside a scrollable container.

## [0.0.0] - 2026-07-03

### Added

- Angular 20 application scaffold with SSR (`@angular/ssr`), zoneless change detection and hydration.
- SSR-safe GSAP directive collection (`andGsapFrom`, `andGsapScroll`, `andGsapTimeline`, `andReveal`, `andWhenVisible`).
- Pre-built animation blocks (hero, CTA, pricing, features, testimonials, footer, marquee, parallax-scroll).
- Explore-blocks routing and docs page.
- Tailwind CSS v4 theming with semantic design tokens and dark mode.
- `ThemeService`, `SmoothScrollService` and `SeoService`.
- Vitest unit-test setup with jsdom.
