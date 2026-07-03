# Contributing to GSAP Blocker

Thank you for your interest in contributing to **GSAP Blocker**! This document will guide you through our workflow and standards so we can keep the project clean, consistent and welcoming for the Angular community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Conventions](#project-conventions)
- [Submitting Changes](#submitting-changes)
- [Release Notes](#release-notes)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before opening a bug report, please search existing issues to avoid duplicates. When reporting, include:

- A clear title and description.
- Steps to reproduce the problem.
- Expected vs actual behavior.
- Angular, GSAP and browser versions.
- A minimal reproduction (StackBlitz, GitHub repo or code snippet).

### Suggesting Features

We love new ideas! Open a feature request and describe:

- The problem you are trying to solve.
- The proposed API or behavior.
- Any prior art from other libraries or frameworks.

### Pull Requests

1. Fork the repository and create a feature branch (`feat/my-feature`, `fix/my-bug`, `docs/my-docs`).
2. Follow the [Project Conventions](#project-conventions).
3. Make sure `pnpm lint`, `pnpm test` and `pnpm build` pass locally.
4. Update `CHANGELOG.md` under the `## Unreleased` section.
5. Open a pull request using our PR template.

## Development Setup

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm start

# Run tests
pnpm test

# Run linter
pnpm lint

# Format code
pnpm format
```

We recommend enabling the recommended VS Code extensions; they are listed in `.vscode/extensions.json`.

## Project Conventions

### Architecture

```text
src/
  app/              # Application shell, routing, pages and layout
  blocks/           # Self-contained, copy-pasteable block components
  components/       # Reusable UI components used by pages/blocks
  data/             # Static data (features, categories)
  shared/
    directives/     # Angular directives wrapping GSAP APIs
    interfaces/     # Shared TypeScript interfaces
    services/       # Angular services (theme, smooth-scroll, seo)
    tokens/         # Injection tokens
  styles/           # Global styles and Tailwind layers
```

### Naming

- **Directives**: `andXxx` selector + `AndXxxDirective` class.
- **Components**: `app-xxx` or semantic selector (e.g. `hero-section`).
- **Files**: lowercase, dot-separated (`and-gsap-from.ts`, `hero-section.ts`).
- **InjectionTokens**: `AND_GSAP_*` prefix, uppercase snake-case.
- **Imports**: prefer path aliases (`@app/*`, `@shared/*`, `@blocks/*`, `@components/*`, `@data/*`).

### Code Style

- Standalone components/directives with `OnPush` change detection.
- Prefer `input()`, `output()` and `inject()` signals/DI APIs.
- TypeScript `strict` mode is mandatory.
- Run GSAP animations in lifecycle hooks (`AfterViewInit`, `afterNextRender`, `effect()`), never in constructors.
- Always clean up GSAP instances on destroy (`gsap.killTweensOf`, `ScrollTrigger.getAll().forEach(st => st.kill())`).
- Respect `prefers-reduced-motion`.

### Testing

- Add unit tests for new directives and services.
- Prefer testing public behavior over implementation details.
- Run `pnpm test` before pushing.

## Submitting Changes

- Keep the diff minimal and focused.
- Do not remove existing blocks or directives unless explicitly agreed.
- Update documentation (`README.md`, `docs/`, inline comments) when the public API changes.
- Squash or rebase your branch if requested by a maintainer.

## Release Notes

`CHANGELOG.md` follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format and [Semantic Versioning](https://semver.org/).

---

If you have any questions, open a [GitHub Discussion](https://github.com/andriipap/gsap-blocker/discussions) or reach out in an issue.
