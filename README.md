# GSAP Blocker

A curated collection of production-ready, animated UI blocks built with **Angular 20**, **Tailwind CSS v4**, and **GSAP**.

Copy, paste, and ship premium landing pages faster — with SSR-safe animations, accessibility in mind, and a unified design system.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?logo=greensock)
![Tests](https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## ✨ Features

- **Modern Angular** — standalone components, signals, zoneless change detection, hydration, view transitions, `@defer`.
- **Tailwind CSS v4** — CSS-first configuration with semantic design tokens and dark mode.
- **SSR-safe GSAP** — animations are lazy-loaded and guarded with `isPlatformBrowser`.
- **Accessible** — semantic HTML, keyboard navigation, `prefers-reduced-motion` support.
- **Copy-paste ready** — every block is a focused, self-contained component.
- **Performance** — OnPush change detection, lazy-loaded routes, optimized chunks.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (recommended)

### Installation

```bash
pnpm install
```

### Development server

```bash
pnpm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload on file changes.

### Build

```bash
pnpm build
```

Artifacts are written to `dist/gsap-blocker`.

### Tests

```bash
pnpm test
```

### Lint & format

```bash
pnpm lint        # check code quality
pnpm lint:fix    # auto-fix ESLint issues
pnpm format      # format with Prettier
pnpm format:check
```

---

## 🧱 Block Categories

| Category     | Blocks                                         |
| ------------ | ---------------------------------------------- |
| Heroes       | Glow, Split, Modern, Video                     |
| Features     | Classic Grid, Bento, Zig-Zag List, Cards       |
| Pricing      | Table, Simple Cards, Comparison, Enterprise    |
| Testimonials | Infinite Marquee, Masonry Grid, Focus, Avatars |
| CTA          | Centered, Split, Email Capture, Feature Image  |
| Footers      | Multi-column, Interactive Hover, Mega, Minimal |

Browse them at `/blocks`.

---

## 📐 Architecture

```text
src/
├── app/                 # Shell, layout, routing
├── blocks/              # Reusable animated blocks
├── components/          # Shared shell components
├── data/                # Static data (categories, features)
├── shared/
│   ├── directives/      # SSR-safe GSAP directives
│   ├── services/        # Theme, smooth scroll
│   ├── interfaces/      # TypeScript models
│   └── tokens/          # Injection tokens
└── styles.css           # Tailwind entry + design tokens
```

### GSAP directives

Instead of importing GSAP eagerly, use the lazy-loaded directives:

```html
<div andGsapFrom [from]="{ y: 24, opacity: 0, duration: 0.8 }">
  Animated content
</div>
```

Or reveal on scroll with `andReveal`:

```html
<section andReveal>Fades in when entering the viewport</section>
```

---

## 🎨 Theming

The project uses CSS custom properties compatible with Tailwind v4:

```css
@theme {
  --color-background: #ffffff;
  --color-foreground: #09090b;
  --color-primary: #18181b;
  /* ... */
}

html.dark {
  --color-background: #09090b;
  --color-foreground: #fafafa;
}
```

Toggle dark mode via the navbar button or the `ThemeService`.

---

## 🤝 Contributing

We welcome contributions from the Angular community!

Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before opening an issue or pull request.

## 🛡️ Security

If you discover a security vulnerability, please follow the instructions in [SECURITY.md](SECURITY.md).

## 🤖 Agent & MCP Setup

This repository includes an [`AGENTS.md`](AGENTS.md) file and optional MCP configurations for Cursor (`.cursor/mcp.json`) and OpenCode (`.opencode/opencode.json`).

> There is no official GSAP MCP server. The configs reference the community package `@vinhnguyen/gsap-mcp` as an optional, disabled reference tool.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- [GSAP](https://gsap.com/) by GreenSock — the industry-standard JavaScript animation library.
- [Angular](https://angular.dev/) team for the modern standalone components and signals APIs.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling workflow.
