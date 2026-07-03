# GSAP Blocker

A curated collection of production-ready, animated UI blocks built with **Angular 20**, **AnalogJS**, **Tailwind CSS v4**, and **GSAP**.

Copy, paste, and ship premium landing pages faster — with SSR-safe animations, accessibility in mind, and a unified design system.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular)
![AnalogJS](https://img.shields.io/badge/AnalogJS-1.x-FF6464?logo=analog)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?logo=greensock)
![Tests](https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## ✨ Features

- **AnalogJS meta-framework** — Vite-powered dev server, file-based routing, Nitro SSR/SSG, and Cloudflare Pages deployment.
- **Modern Angular** — standalone components, signals, zoneless change detection, view transitions, `@defer`.
- **Tailwind CSS v4** — CSS-first configuration with semantic design tokens and dark mode.
- **SSR-safe GSAP** — animations are lazy-loaded and guarded with `isPlatformBrowser`.
- **Accessible** — semantic HTML, keyboard navigation, `prefers-reduced-motion` support.
- **Copy-paste ready** — every block is a focused, self-contained component.
- **Performance** — OnPush change detection, lazy-loaded routes, optimized chunks.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+ (recommended by AnalogJS)
- [pnpm](https://pnpm.io/) (recommended)

### Installation

```bash
pnpm install
```

### Development server

```bash
pnpm start
```

Navigate to `http://localhost:5173/`. The app will automatically reload on file changes.

### Build

```bash
pnpm build
```

The build is optimized for **Cloudflare Pages** (`BUILD_PRESET=cloudflare-pages`). Artifacts are written to `dist/analog/public` and include a `_worker.js` for SSR.

### Preview locally on Cloudflare Pages

```bash
pnpm preview
```

This builds the app and runs it through `wrangler pages dev` so you can test the exact Cloudflare Pages runtime locally.

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
├── app/                 # Shell, layout, file-based routes
│   └── pages/           # AnalogJS file-based routes (*.page.ts)
├── blocks/              # Reusable animated blocks
├── components/          # Shared shell components
├── data/                # Static data (categories, features)
├── shared/
│   ├── directives/      # SSR-safe GSAP directives
│   ├── services/        # Theme, smooth scroll
│   ├── interfaces/      # TypeScript models
│   └── tokens/          # Injection tokens
├── main.ts              # Browser bootstrap
├── main.server.ts       # SSR render entry
└── styles.css           # Tailwind entry + design tokens
```

### Routing

This project uses **AnalogJS file-based routing**. Files under `src/app/pages` ending in `.page.ts` become routes automatically:

- `src/app/pages/(home).page.ts` → `/`
- `src/app/pages/docs.page.ts` → `/docs`
- `src/app/pages/blocks.page.ts` → layout for `/blocks/*`
- `src/app/pages/blocks/heroes.page.ts` → `/blocks/heroes`
- `src/app/pages/[...not-found].page.ts` → catch-all 404

Route metadata (title, OG tags) is defined with `RouteMeta` from `@analogjs/router`:

```ts
export const routeMeta: RouteMeta = {
  title: 'My Page',
  meta: [
    { name: 'description', content: 'Page description' },
    { property: 'og:title', content: 'My Page' },
  ],
};
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

## 🌩️ Deployment

### Cloudflare Pages

The project is configured to deploy to **Cloudflare Pages** with SSR via Nitro.

#### Option A: Git integration (recommended)

1. In the Cloudflare dashboard, go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select your repository.
3. Build settings:
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist/analog/public`
4. Add the environment variables from `.env.example` if needed.
5. Save and deploy.

#### Option B: GitHub Actions

A deploy workflow is included at `.github/workflows/deploy.yml`. It builds the site on every push to `main` and deploys it with Wrangler.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN` — Create a token with **Cloudflare Pages:Edit** and **Zone:Read** permissions.
- `CLOUDFLARE_ACCOUNT_ID` — Your Cloudflare account ID.

You can also deploy manually:

```bash
pnpm build
npx wrangler pages deploy ./dist/analog/public --project-name=gsap-blocker
```

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
- [AnalogJS](https://analogjs.org/) for the full-stack Angular meta-framework.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling workflow.
