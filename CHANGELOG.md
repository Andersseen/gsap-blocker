# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open-source governance documentation: `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` and `CHANGELOG.md`.
- Enhanced `README.md` with badges, quick-start and architecture overview.
- GitHub issue and pull-request templates.
- CI/CD workflow improvements (Node 20/22 matrix, format check).
- VS Code recommended extensions and workspace settings.
- Optional MCP configuration for GSAP reference (`.cursor/mcp.json`, `.opencode/opencode.json`).
- Husky pre-commit hook with lint-staged.
- `.nvmrc` for deterministic Node version.

## [0.0.0] - 2026-07-03

### Added

- Angular 20 application scaffold with SSR (`@angular/ssr`), zoneless change detection and hydration.
- SSR-safe GSAP directive collection (`andGsapFrom`, `andGsapScroll`, `andGsapTimeline`, `andReveal`, `andWhenVisible`).
- Pre-built animation blocks (hero, CTA, pricing, features, testimonials, footer, marquee, parallax-scroll).
- Explore-blocks routing and docs page.
- Tailwind CSS v4 theming with semantic design tokens and dark mode.
- `ThemeService`, `SmoothScrollService` and `SeoService`.
- Vitest unit-test setup with jsdom.
