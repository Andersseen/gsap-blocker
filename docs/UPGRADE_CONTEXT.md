# GSAP Blocker — Contexto del repo para el upgrade a nivel pro

> **Qué es este documento:** todo el conocimiento del repo necesario para ejecutar cualquier fase de `UPGRADE_PLAN.md` sin re-explorar el proyecto. Léelo COMPLETO antes de empezar una fase. Los hallazgos aquí listados fueron verificados leyendo el código fuente real (del repo y de las dependencias instaladas) — no son suposiciones. Aun así, si una fase depende de un detalle concreto (nombre de un input, forma de un tipo), re-verifica ese detalle puntual en el archivo actual antes de escribir encima: el repo puede haber cambiado desde que se escribió esto.

## 1. Qué es el proyecto

**GSAP Blocker** es un showcase de 26 bloques de UI animados ("Blocks") y 9 recetas de animación ("Motion Recipes"). El modelo de distribución es **copy-paste**: el usuario ve un bloque, copia el código, lo pega en su proyecto.

**Objetivo del upgrade:** llevarlo a nivel "pro" (tipo shadcn/ui, Aceternity, Magic UI). El gap principal: los bloques **no muestran su código fuente real** — solo un snippet de import/uso — lo cual rompe la propuesta de valor central. El resto de gaps son de pulido: CSS muerto, utilidades rotas, footer pobre, sin tipografía/color de marca, contadores de categorías inventados, docs de una sola página, sin sitemap/robots/OG reales.

## 2. Stack y comandos

- **Framework:** AnalogJS (file-based routing) sobre Angular 20 zoneless, componentes standalone.
- **Estilos:** Tailwind CSS v4 (config CSS-first en `src/styles.css` vía `@theme`, sin `tailwind.config`).
- **Animación:** GSAP 3.13 (con ScrollTrigger en algunos bloques).
- **SSR/prerender:** Nitro (vía `@analogjs/platform`), deploy en **Cloudflare Pages** (preset `cloudflare-pages` en build).
- **Package manager:** **pnpm** (importante: ver nota de rutas de node_modules abajo).
- **Tests:** Vitest + jsdom, ya configurado (`src/test-setup.ts`, include `src/**/*.{test,spec}.ts`).

Comandos:

```bash
pnpm start         # vite dev
pnpm build         # BUILD_PRESET=cloudflare-pages vite build → dist/analog/public
pnpm preview       # build + wrangler pages dev ./dist/analog/public (runtime real de CF)
pnpm test          # vitest run
pnpm lint          # eslint .
pnpm format:check  # prettier --check .
```

CI (`.github/workflows/ci.yml`) corre lint/format/test/build en Node 20 y 22 — no necesita cambios en este upgrade.

> **Nota sobre rutas de `node_modules`:** el repo usa pnpm, así que rutas tipo `node_modules/@analogjs/vite-plugin-angular/...` no existen literalmente — los paquetes reales viven bajo `node_modules/.pnpm/@analogjs+<paquete>@<versión>_*/node_modules/@analogjs/...`. Para re-verificar cualquier hallazgo: `grep -rn <patrón> node_modules/.pnpm/@analogjs+*/`. Los hallazgos de abajo fueron verificados contra `@analogjs/vite-plugin-angular@1.22.5` y `@analogjs/vite-plugin-nitro@1.22.5`.

## 3. Mapa del repo (lo relevante para el upgrade)

```
src/
  blocks/                     # 26 componentes de bloque, uno por archivo:
                              # bento-grid, cta, cta-2, cta-image, cta-input,
                              # features, features-cards, features-list,
                              # footer, footer-mega, footer-minimal, interactive-footer,
                              # hero, hero-modern, hero-video,
                              # infinite-marquee, parallax-scroll,
                              # pricing, pricing-compare, pricing-enterprise, pricing-simple,
                              # split-cta, testimonials, testimonials-avatars,
                              # testimonials-focus, testimonials-grid
                              # AUTOCONTENIDOS: solo importan Angular y gsap, nada de @shared
  components/
    block-showcase.ts         # frame de preview + snippet por bloque (se rediseña en Fase 3)
    code-tabs.ts              # tabs de código con botón copiar; texto plano <pre><code>
    navbar.ts                 # navbar con caja "B." (se rediseña en Fase 2)
    footer.ts                 # footer de una línea (se reconstruye en Fase 2)
    hero-section.ts           # hero de la home; TIENE BUGS (hallazgos 5 y 6)
    grid-card.ts              # cards de categoría en home/índice (hallazgos 5 y 10)
    meta-pill.ts              # pill con variantes vía computed() — REFERENCIA de patrón
    recipe-section.ts         # sección titulada reutilizable (docs/recetas)
    recipe-demo.ts            # frame con borde para demos — REFERENCIA de estilo
    animation-card.ts, animation-showcase.ts, features-section.ts,
    recipe-hero.ts, recipe-nav.ts, recipe-toc.ts
    animation-demos/          # 9 demos: card-to-modal, disappearing-features,
                              # magnetic-button, scroll-reveal, spotlight-card,
                              # stagger-reveal, sticky-cards, swap-column-features,
                              # text-split-reveal (sufijo -demo.ts)
  shared/
    directives/               # 6 directivas GSAP públicas:
                              # and-gsap-from.ts        (andGsapFrom)
                              # and-gsap-scroll.directive.ts (andGsapScroll)
                              # and-gsap-timeline.ts    (andGsapTimeline)
                              # and-reveal.directive.ts (andReveal) — REFERENCIA de reduced-motion
                              # and-when-visible.directive.ts (andWhenVisible)
                              # smooth-scroll.directive.ts (appSmoothScroll)
    services/theme.service.ts # dark mode; aplica .dark en afterNextRender (hallazgo 11)
    interfaces/               # category.interface.ts, etc.
    tokens/date.token.ts      # token de año actual (reusar en el footer nuevo)
  app/
    pages/                    # rutas file-based de Analog:
      (home).page.ts          # home (ojo: existe también un home.page.ts — revisar cuál está activo antes de tocar)
      [...not-found].page.ts  # 404
      blocks.page.ts          # LAYOUT (sidebar/outlet) de /blocks — REFERENCIA de patrón layout
      blocks/                 # (blocks-index).page.ts + 8 páginas de categoría:
                              # heroes, features, pricing, cta, footers, testimonials,
                              # infinite-marquee, parallax-scroll
      animations.page.ts      # layout de /animations
      animations/             # (animations-index).page.ts + 9 páginas de receta
      docs.page.ts            # docs de UNA sola página (se convierte en layout en Fase 4)
  data/
    categories.ts             # contadores INVENTADOS (hallazgo 9); se deriva del registro en Fase 3
    animations.ts             # registro de las 9 recetas (tiene slug por receta)
    features.ts
  styles.css                  # ÚNICO stylesheet linkado en index.html; tokens @theme zinc/shadcn
index.html                    # entry HTML (anti-FOUC va aquí, Fase 1)
vite.config.ts                # analog() config: nitro/prerender/vite (Fases 3a y 5c)
public/                       # favicon.svg; og.png y robots.txt se crean en Fase 5
```

Aliases de tsconfig en uso: `@blocks/*`, `@components/*`, `@shared/*`, `@data/*` (resueltos por `vite-tsconfig-paths`). `tsconfig.app.json` ya incluye `"vite/client"` en `types`, así que los imports `?raw` tipan como `string` sin `.d.ts` adicional.

## 4. Decisiones ya tomadas por el usuario (NO relitigar)

1. **Distribución = copy-paste mejorado.** Cada bloque debe mostrar su **código fuente completo** (no solo snippet de uso), con pestañas Source/Usage, botón de copiar y nota de dependencias ("requires gsap"). **Explícitamente NO**: CLI tipo shadcn, registry JSON, ni paquete npm.
2. **Visual = pulir lo actual + marca ligera.** Mantener tokens zinc/shadcn, añadiendo: tipografía self-hosted (Inter UI + JetBrains Mono código — NO vía CDN), acento de marca (verde GSAP adaptado), logo/wordmark mejorado, footer real.
3. **Alcance incluido:** (a) código fuente real por bloque, (b) docs serias (getting started, guía por directiva con demo en vivo, theming), (c) calidad técnica/SEO: sitemap, robots.txt, OG real, CSS muerto fuera, utilidades arregladas, reduced-motion en loops decorativos, contadores con fuente única de verdad, CHANGELOG.
4. **Explícitamente fuera de alcance:** añadir bloques o recetas nuevas (contenido). Este trabajo es arquitectura/calidad, no contenido.

## 5. Hallazgos técnicos verificados

1. **`?raw` sobre `.ts` está roto con Analog por defecto.** `@analogjs/vite-plugin-angular` tiene `TS_EXT_REGEX = /\.[cm]?(ts|analog|ag)[^x]?\??/` que matchea `hero.ts?raw`; su hook `transform` quita el query y devuelve el JS compilado por Angular (`ɵɵdefineComponent`), machacando el texto crudo.
   - **Solución verificada:** el plugin comprueba `options?.transformFilter(code, id)` **antes** del manejo de TS. Es opción pública de `PluginOptions`, pasable vía `analog({ vite: { transformFilter } })`:
     ```ts
     analog({
       vite: {
         inlineStylesExtension: 'css',
         transformFilter: (_code, id) => !id.includes('?raw'),
       },
     })
     ```
     Con eso, `import src from '../../blocks/hero.ts?raw'` devuelve texto plano, y el mismo archivo sin `?raw` compila normal (module ids distintos, sin conflicto).
   - **Fallback si dejara de funcionar:** plugin de Vite propio con `enforce: 'pre'` sirviendo ids virtuales que NO contengan `.ts` literal (ej. `virtual:source/blocks/hero`), leyendo el archivo con `fs.readFileSync` en el hook `load`.
2. **`tsconfig.app.json` ya incluye `"vite/client"`** — imports `?raw` tipan como `string` sin añadir nada.
3. **Analog trae sitemap integrado:** `analog({ prerender: { sitemap: { host }, routes } })` (tipo `PrerenderOptions.sitemap?: SitemapConfig` en `@analogjs/vite-plugin-nitro`). Cubre las rutas prerenderizadas listadas en `routes`.
4. **`--color-accent` / `--color-accent-foreground` existen en `src/styles.css` pero no se usan en ningún template** (verificado con grep: cero `bg-accent`/`text-accent`/`border-accent` en `src/**/*.ts`). Seguros de repropósito como color de marca.
5. **`src/components/hero-section.ts` y `src/components/grid-card.ts` importan GSAP estáticamente** (`import { gsap } from 'gsap'` en el top), mientras que el resto usa `await import('gsap')` en hooks guardados con `isPlatformBrowser`. hero-section está en la home → GSAP entra en el bundle inicial de la ruta más visitada.
6. **`hero-section.ts` tiene un `setInterval(sweep, 5500)` (~línea 217) que nunca se limpia** — sigue tras salir de la ruta (leak).
7. **`src/blocks/cta.ts` es huérfano** — ninguna página lo importa (`cta.page.ts` usa solo `cta-2`, `split-cta`, `cta-input`, `cta-image`). Contenido real sin mostrar.
8. **`prerender.routes` en `vite.config.ts` no cubre 3 de las 9 recetas** (`sticky-cards`, `disappearing-features`, `swap-column-features`) — solo llegan vía ISR (60s).
9. **Contadores de `src/data/categories.ts` inventados** (Heroes 8, Features 12, Pricing 6, Testimonials 7, CTA 5, Footers 4) y la lista **omite dos categorías existentes** (`infinite-marquee`, `parallax-scroll`) que sí tienen página bajo `/blocks/`.
10. **`grid-card.ts` construye la URL de categoría con `category.name.toLowerCase()`** — funciona por casualidad con nombres de una palabra. Necesita campo `slug` explícito.
11. **FOUC de dark mode:** `ThemeService` aplica `.dark` en `afterNextRender` (después del primer pintado) — flash claro en cada carga dura con preferencia dark. Se arregla con script inline en `<head>` de `index.html`.
12. **Link muerto en docs:** `src/app/pages/docs.page.ts` enlaza a `/blocks/bento-grid`, ruta inexistente.
13. **Comentarios en español** en `grid-card.ts`, `and-gsap-from.ts`, `and-reveal.directive.ts`, `and-when-visible.directive.ts`, `and-gsap-timeline.ts` — inconsistente para repo open-source en inglés.
14. **`layout.ts` fija `view-transition-name: main-router`** pero `app.config.ts` no llama a `withViewTransitions(...)` — propiedad colgante sin efecto.
15. **Home usa `<a href="/blocks">` / `<a href="/docs">`** en algunos sitios en vez de `routerLink` → full page reload innecesario.
16. **`@utility glass` en `styles.css` referenciaba `oklch(var(--fg)/0.2)`** pero `--fg` no existe (los tokens son `--color-foreground`, etc.) — utilidad rota. `link`, `mobile-link`, `link-active`, `mobile-link-active`, `link-hover` también muertas (cero usos). *(Puede estar ya arreglado — ver §7.)*
17. **`src/styles/base.css` y `src/styles/tailwind-base.css` no se importan en ningún sitio** (solo `src/styles.css` está linkado). Paleta púrpura/verde en conflicto, inactivos. *(Puede estar ya borrado — ver §7.)*
18. **Los bloques de `src/blocks/` son autocontenidos:** solo importan de `@angular/*` y `gsap` — nada de `@shared`. Mostrar su fuente completa produce código copy-paste que funciona standalone (verificado con grep).

## 6. Archivos de referencia de patrones (leer antes de escribir código nuevo)

| Para… | Leer primero |
|---|---|
| Variantes de clases vía `computed()` (directivas/primitivas UI) | `src/components/meta-pill.ts` |
| Tabs de código + botón copiar | `src/components/code-tabs.ts` |
| Guard de `prefers-reduced-motion` en GSAP | `src/shared/directives/and-reveal.directive.ts` y `src/components/animation-demos/stagger-reveal-demo.ts` |
| Lazy-import de GSAP SSR-safe | `src/blocks/hero.ts` |
| Layout con sidebar + `<router-outlet/>` | `src/app/pages/blocks.page.ts` |
| Frame con borde para demos | `src/components/recipe-demo.ts` |
| Secciones tituladas de docs/recetas | `src/components/recipe-section.ts` |
| Forma actual de `routeMeta` | cualquier `src/app/pages/**/*.page.ts` existente |

## 7. Estado del working tree al escribir este documento (2026-07-15)

Cambios ya aplicados sin comitear (parte de la Fase 1):
- Borrado `src/styles/` completo (los dos archivos muertos del hallazgo 17).
- `src/styles.css`: eliminadas las utilidades rotas/muertas del hallazgo 16; añadida versión funcional de `@utility glass` (`bg-background/70 backdrop-blur-md backdrop-saturate-150 border-b border-border`); añadido bloque `@media (prefers-reduced-motion: reduce)` que neutraliza `.animate-in`/`.fade-in`/`.slide-in-from-bottom-8`.

**No asumas este estado:** al empezar cualquier fase, comprueba el estado real con `git status` / `git log --oneline -5` y mirando los archivos — estos cambios pueden estar ya comiteados, o puede haber fases posteriores ya ejecutadas. `UPGRADE_PLAN.md` tiene una tabla de estado por fase que el ejecutor debe mantener al día.

## 8. Reglas globales (aplican a TODAS las fases)

1. **No añadir bloques ni recetas nuevas** — fuera de alcance.
2. **No introducir CLI ni registry JSON** — la distribución sigue siendo copy-paste manual con fuente real visible.
3. Código y comentarios nuevos **en inglés**; seguir los patrones del repo (§6) en vez de inventar convenciones.
4. Cada fase debe dejar `main` **desplegable**: `pnpm lint && pnpm test && pnpm build` en verde, sin regresiones visuales.
5. Al terminar una fase: correr su bloque de verificación, **actualizar la tabla de estado en `UPGRADE_PLAN.md`**, y comitear (mensaje convencional, ej. `feat: add full source viewer to block pages`).
6. Si un hallazgo de §5 no coincide con el código actual (algo cambió desde que se escribió), re-verificar leyendo el archivo antes de aplicar el paso que dependa de él — y anotar la discrepancia en la tabla de estado.

## 9. Riesgos conocidos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| `?raw` deja de funcionar por cambio interno de Analog | Baja (verificado contra 1.22.5) | Fallback de plugin virtual (hallazgo 1); el spike de la Fase 3a lo detecta antes de construir encima |
| `vite-tsconfig-paths` no resuelve alias + query (`@blocks/hero.ts?raw`) | Media | Usar imports relativos explícitos (`../../../blocks/hero.ts?raw`) — siempre funcionan |
| Prettier `organize-imports` reordena imports `?raw` raro | Cosmético | Ignorar; los sources se mapean por key explícita |
| Alguien añade un import de alias/Angular a los módulos de `src/data/` que importa `vite.config.ts` | Media | Comentario de cabecera en cada archivo pure-data; el build falla ruidosamente en CI |
| Repropósito de `--color-accent` choca con futuro uso semantic-hover estilo shadcn | Baja (cero uso actual) | Documentar en `/docs/theming`: "accent = color de marca, no semantic hover token" |
| Quitar ISR cambia el servido en Cloudflare Pages | Baja | El HTML prerenderizado ya tenía precedencia; validar con `pnpm preview` |
| Shiki (Fase 3i) complica build o SSR | Media | Es opcional para v1: diferir sin bloquear — el visor funciona con texto plano |
