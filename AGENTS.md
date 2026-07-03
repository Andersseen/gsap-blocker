# Agent Instructions

This file contains the context and rules that AI agents (OpenCode, Cursor, Claude Code, GitHub Copilot, etc.) should follow when working with this repository.

## Project Overview

**GSAP Blocker** is an open-source Angular project that provides reusable GSAP-powered directives, components and pre-built animation blocks for the Angular community. It is built as an Angular 20 application powered by **AnalogJS** and deployed to **Cloudflare Pages**.

- **Stack**: Angular 20, AnalogJS 1.x, TypeScript 5.8, Tailwind CSS 4, GSAP 3, Vitest, SSR via AnalogJS/Nitro.
- **Package manager**: `pnpm` (preferred). Use `pnpm-lock.yaml` as the source of truth.
- **Node version**: see `.nvmrc`.

## Architecture Conventions

### Directory Layout

```text
src/
  app/              # Application shell, layout, file-based routes
    pages/          # AnalogJS file-based routes (*.page.ts)
  blocks/           # Self-contained, copy-pasteable block components
  components/       # Reusable UI components used by pages/blocks
  data/             # Static data (features, categories)
  shared/
    directives/     # SSR-safe Angular directives wrapping GSAP APIs
    interfaces/     # Shared TypeScript interfaces
    services/       # Angular services (theme, smooth-scroll)
    tokens/         # Injection tokens (e.g. date token)
  styles/           # Global styles and Tailwind layers
```

### Naming Rules

- **Directives**: `andXxx` selector + `AndXxxDirective` class (camelCase selector, PascalCase class).
- **Components**: `app-xxx` or semantic selector (e.g. `hero-section`). Pages use the `page-` prefix.
- **Pages (AnalogJS)**: files under `src/app/pages` ending with `.page.ts`. Use parenthesis for index routes, e.g. `(home).page.ts`.
- **Files**: lowercase, dot-separated (`and-gsap-from.ts`, `hero-section.ts`).
- **InjectionTokens**: `AND_GSAP_*` prefix, uppercase snake-case.
- **Imports**: prefer path aliases (`@app/*`, `@shared/*`, `@blocks/*`, `@components/*`, `@data/*`).

### Code Style

- Use **standalone components/directives** with `OnPush` change detection.
- Prefer `input()`, `output()` and `inject()` signals/DI APIs over decorators.
- Use TypeScript `strict` mode; all public APIs must be typed.
- Keep directives side-effect free on construction; run GSAP animations in lifecycle hooks (`AfterViewInit`, `afterNextRender`, `effect()`).
- Always guard browser-only APIs with `isPlatformBrowser` (SSR safety).
- Always clean up GSAP instances on destroy (`gsap.killTweensOf`, `ScrollTrigger.getAll().forEach(st => st.kill())`).
- Use `@angular/core`'s `DestroyRef` or `takeUntilDestroyed()` for automatic cleanup.
- Prefer CSS custom properties for theming. Tailwind classes should be readable and grouped logically.
- Prefer `interface` over `type` for object shapes.

### Routing & SEO

- Routes are discovered automatically from `src/app/pages/*.page.ts`.
- Use `RouteMeta` from `@analogjs/router` for `title`, `meta`, `canActivate`, and redirects.
- Keep route metadata in the same file as the page component.

## How Agents Should Work

1. **Read before writing**: check this file, `README.md`, `CONTRIBUTING.md` and existing code patterns before making changes.
2. **Make minimal changes**: solve the task with the smallest diff possible; avoid refactoring unrelated code.
3. **Preserve existing behavior**: do not remove demos, blocks or directives unless explicitly asked.
4. **Test what you change**:
   - Run `pnpm lint` and `pnpm test` before finishing.
   - Run `pnpm build` for structural/library changes.
   - Run `pnpm start` only when explicitly requested or needed for manual verification.
5. **Document changes**:
   - Update `CHANGELOG.md` for user-facing changes.
   - Update `README.md` if the public API or setup instructions change.
6. **Security**:
   - Do not commit secrets, API keys or tokens.
   - Avoid installing untrusted dependencies; prefer packages with a large user base and recent updates.
7. **Accessibility**:
   - Animations should respect `prefers-reduced-motion`.
   - Avoid triggering motion sickness (no excessive parallax without user opt-in).
   - Interactive elements must be focusable and keyboard accessible.

## MCP Configuration

This repository includes optional MCP (Model Context Protocol) configurations:

- `.cursor/mcp.json` – Cursor editor integration.
- `.opencode/opencode.json` – OpenCode agent integration.

These configs reference the **unofficial** GSAP MCP server (`@vinhnguyen/gsap-mcp`) as an optional reference tool. It is not installed by default; install it only when you need GSAP API reference assistance.

## Common Tasks

### Add a new GSAP directive

1. Create the directive in `src/shared/directives/`.
2. Export it from the closest index barrel if one exists.
3. Add a minimal unit test in `src/shared/directives/*.spec.ts`.
4. Add a usage example in `src/blocks/` or `src/app/pages/docs.page.ts`.
5. Document the selector and inputs in `README.md`.

### Add a new block

1. Create a standalone component in `src/blocks/`.
2. Keep it self-contained (own styles, no external state unless via inputs).
3. Guard browser-only code with `isPlatformBrowser`.
4. If it should be browsable, create a wrapper page under `src/app/pages/blocks/*.page.ts`.
5. Add a usage snippet to `README.md` or `docs/`.

### Update dependencies

- Use `pnpm update --interactive`.
- Regenerate the lockfile only when necessary.
- Verify `pnpm build && pnpm test && pnpm lint` after major updates.

## Questions?

If the task is ambiguous, ask the user for clarification rather than guessing. When in doubt, prefer simplicity and consistency with existing code.
