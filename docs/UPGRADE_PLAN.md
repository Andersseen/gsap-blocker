# GSAP Blocker → Nivel Pro — Plan por fases

> **Cómo usar este documento:** cada fase es autocontenida y puede ejecutarse en una sesión nueva. El prompt mínimo para un agente es:
>
> ```
> Lee UPGRADE_CONTEXT.md y UPGRADE_PLAN.md (raíz del repo) y ejecuta la Fase N.
> ```
>
> También se pueden encadenar varias fases en una sesión ("ejecuta las Fases 1 y 3"): al terminar cada una, correr su bloque de verificación, actualizar la tabla de estado de abajo y comitear antes de empezar la siguiente.
>
> **`UPGRADE_CONTEXT.md` es lectura obligatoria previa** — contiene el mapa del repo, los hallazgos técnicos verificados (referenciados aquí como "hallazgo #N"), los archivos de referencia de patrones y las reglas globales. Este documento solo contiene el QUÉ y el CÓMO de cada fase.

## Tabla de estado (mantener al día al terminar cada fase)

| Fase | Nombre | Tamaño | Estado |
|---|---|---|---|
| 1 | Limpieza de base | S (~0.5 día) | ✅ Completa |
| 3 | Registro de bloques + código fuente completo | M/L (~1–1.5 días) | ⬜ Pendiente |
| 2 | Capa de marca | M (~1–1.5 días) | ⬜ Pendiente |
| 4 | Sección de docs | L (~1.5–2 días) | ⬜ Pendiente |
| 5 | SEO, meta y remate | S/M (~0.5–1 día) | ⬜ Pendiente |
| 6 | Verificación end-to-end | S (~0.5 día) | ⬜ Pendiente |

## Orden y dependencias

**Orden de ejecución: 1 → 3 → 2 → 4 → 5 → 6.** (La numeración es solo referencia del documento; la tabla de arriba ya está en orden de ejecución.)

- La **Fase 3 va antes que la 2** porque arregla la propuesta de valor central (código fuente real por bloque); la 2 es pulido visual. Si el trabajo se interrumpe, mejor tener el visor de código funcionando con un footer pobre que lo contrario.
- La **Fase 4 depende de la 2** (primitivas/tokens de marca) **y de la 3a** (`?raw` habilitado).
- La **Fase 5 depende de la 3 y la 4** (necesita `block-registry.ts` y `docs-nav.ts` para derivar rutas de prerender y sitemap).
- Dentro de la Fase 3, el **spike de 3a es bloqueante**: no escribir 3b en adelante hasta que pase.
- **3i (Shiki) es el único elemento diferible**: puede hacerse dentro de la Fase 3, al final de todo, o dejarse para post-v1.

---

## Fase 1 — Limpieza de base

**Objetivo:** dejar el proyecto sano sin cambiar nada visual todavía.

**Prerrequisitos:** ninguno.

**Detección de estado** (parte puede estar ya aplicada — ver §7 del CONTEXT):

```bash
ls src/styles/ 2>/dev/null            # si no existe → borrado ya hecho
grep -n "glass-strong\|mobile-link" src/styles.css   # sin resultados → limpieza de utilidades ya hecha
grep -n "prefers-reduced-motion" src/styles.css      # con resultado → fallback CSS ya añadido
ls src/shared/utils/motion.ts 2>/dev/null            # si existe → helper ya creado
grep -n "await import('gsap')" src/components/hero-section.ts  # con resultado → lazy-import ya hecho
grep -n "localStorage.getItem" index.html            # con resultado → anti-FOUC ya hecho
```

### Tareas

- [x] Borrar `src/styles/base.css`, `src/styles/tailwind-base.css` y el directorio (hallazgo #17).
- [x] `src/styles.css`: quitar utilidades muertas/rotas (hallazgo #16), dejar `@utility glass` funcional, añadir fallback global de `prefers-reduced-motion`.
- [x] **Nuevo** `src/shared/utils/motion.ts`:
  ```ts
  export const prefersReducedMotion = (): boolean =>
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```
- [x] **Guards de reduced-motion** en loops GSAP infinitos (`repeat: -1`, `setInterval`): usar `prefersReducedMotion()` para saltar el loop y dejar el elemento en estado final vía `gsap.set(...)`. Copiar literalmente el patrón de `stagger-reveal-demo.ts` / `and-reveal.directive.ts` (referencias en §6 del CONTEXT). Archivos:
  - `src/components/hero-section.ts` (blobs flotantes, beam de escaneo) ✅
  - `src/components/grid-card.ts` (loop de emoji flotante, glow de mouse) ✅
  - `src/blocks/hero.ts`, `cta.ts`, `features.ts`, `footer.ts`, `testimonials.ts`, `infinite-marquee.ts` (marquee: si reduced-motion, pausar el loop y mostrar contenido estático) ✅ — en `features.ts`/`testimonials.ts` el "loop" es el autoplay del carrusel (`startTimer`/`resume`), no un tween GSAP infinito; se guardó el arranque del `setInterval`, no el tween de `snapTo` (ese es user-triggered).
  - `src/shared/directives/and-gsap-from.ts`, `and-gsap-timeline.ts` (usar `gsap.set` al estado final en vez de animar, como ya hace `and-reveal.directive.ts`) ✅ — implementado como early-return antes de crear el tween/timeline: como ninguna de las dos directivas pre-oculta el elemento (a diferencia de `and-reveal`), el DOM ya está en su estado final por defecto y no animar es equivalente a `gsap.set` al estado final, sin una llamada extra sin efecto.
- [x] `src/components/hero-section.ts`:
  - `import { gsap } from 'gsap'` → lazy `await import('gsap')` en el hook de ciclo de vida (mismo patrón que `src/blocks/hero.ts`) (hallazgo #5).
  - `setInterval(sweep, 5500)` (~línea 217): guardar el id y limpiarlo con `DestroyRef.onDestroy(() => clearInterval(id))` (hallazgo #6).
- [x] `src/components/grid-card.ts`: lazy-import de GSAP; traducir a inglés todos los comentarios en español (ahí y en `and-when-visible.directive.ts`, `and-reveal.directive.ts`, `and-gsap-from.ts`, `and-gsap-timeline.ts`) (hallazgos #5 y #13). También se tradujo `src/shared/and-gsap-tokens.ts` (comentario en español detectado durante el grep final, no listado explícitamente en el hallazgo #13 pero mismo problema).
- [x] `index.html`: script inline anti-FOUC en `<head>`, **antes** del link a `styles.css` (hallazgo #11). Storage key confirmada en `theme.service.ts`: `'theme'`.
- [x] `src/app/pages/(home).page.ts`: `<a href="/blocks">` / `<a href="/docs">` → `[routerLink]` (hallazgo #15).
- [x] `src/app/layout.ts`: quitar el `view-transition-name: main-router` colgante (hallazgo #14).
- [x] `src/app/pages/docs.page.ts`: quitar el link muerto a `/blocks/bento-grid` (hallazgo #12). No se pospuso a Fase 4; era un cambio trivial de bajo riesgo.

**Nota adicional (no listada originalmente):** se añadió `.pulsing-circle { animation: none; }` al bloque `@media (prefers-reduced-motion: reduce)` de `src/styles.css`, porque el badge del hero de la home usa un `@keyframes pulse ... infinite` puramente CSS (no GSAP) que el DoD #2 de esta fase exige neutralizar y que no estaba cubierto por el fallback existente.

### Verificación (Definition of Done)

1. `pnpm lint && pnpm test && pnpm build` en verde.
2. Cargar `/` con DevTools → Rendering → emular `prefers-reduced-motion: reduce`: los loops decorativos quedan estáticos.
3. Hard-reload con dark mode activo: sin flash claro.
4. Actualizar la tabla de estado y comitear.

---

## Fase 3 — Registro de bloques + código fuente completo

> Se ejecuta **antes** que la Fase 2. Es la fase de mayor valor: resuelve el gap principal (bloques sin código fuente real).

**Objetivo:** cada bloque muestra su código fuente completo (pestañas Source/Usage, copiar, badges de dependencias), con un registro único de bloques como fuente de verdad.

**Prerrequisitos:** Fase 1 recomendada pero no bloqueante.

**Detección de estado:**

```bash
grep -n "transformFilter" vite.config.ts             # con resultado → 3a ya hecho
ls src/data/block-registry.ts 2>/dev/null            # si existe → 3b ya hecho
grep -rn "?raw" src/app/pages/blocks/ | head -3      # con resultados → 3e en marcha/hecho
grep -rn "?raw" src/app/pages/animations/ | head -3  # con resultados → 3f en marcha/hecho
```

### 3a. Habilitar `?raw` en `vite.config.ts` — SPIKE BLOQUEANTE primero

**Antes de escribir nada más de esta fase** (ni registro, ni refactor de páginas), spike de ~15 minutos que valide la técnica de punta a punta (contexto: hallazgo #1):

1. Añadir el `transformFilter`:
   ```ts
   analog({
     nitro: { /* ...existente... */ },
     prerender: { /* ...existente, se amplía en Fase 5... */ },
     vite: {
       inlineStylesExtension: 'css',
       transformFilter: (_code, id) => !id.includes('?raw'),
     },
   }),
   ```
2. En una sola página (ej. `heroes.page.ts`), añadir `import heroSource from '../../../blocks/hero.ts?raw';` y volcarlo temporalmente en el template (`<pre>{{ heroSource }}</pre>` vía una propiedad).
3. `pnpm build` y verificar: `grep -c 'export default class Hero' dist/analog/public/blocks/heroes/index.html` debe dar ≥1. Si aparece `ɵɵdefineComponent` dentro del `<pre>`, el filtro no funciona.
4. Comprobar también en dev (`pnpm start`) que la página carga y el resto compila normal.

**Si pasa:** revertir el volcado temporal y continuar con 3b. **Si falla:** implementar el fallback del plugin virtual (hallazgo #1) y repetir el spike. No construir 3b–3g sobre una técnica no validada.

### 3b. Nuevo `src/data/block-registry.ts`

**Importante:** archivo de datos puros — sin imports de alias (`@blocks/...`) ni de Angular — porque en la Fase 5 `vite.config.ts` lo importa para derivar rutas de prerender. Añadir comentario de cabecera avisándolo.

```ts
export interface BlockCategoryMeta {
  slug: string; // segmento de ruta: 'heroes', 'infinite-marquee', ...
  name: string; // 'Heroes'
  description: string;
  emoji: string;
}

export interface BlockMeta {
  id: string; // basename del archivo en src/blocks (o 'hero-section' para el de src/components)
  name: string; // nombre mostrado, ej. 'Modern Stagger Hero'
  category: string; // debe matchear un BlockCategoryMeta.slug
  description: string;
  selector: string; // 'app-hero-modern'
  importPath: string; // '@blocks/hero-modern' o '@components/hero-section'
  deps: string[]; // ['gsap'] | ['gsap', 'gsap/ScrollTrigger'] | []
  padY?: boolean; // pasa a BlockShowcase.padY
}

export const BLOCK_CATEGORIES: BlockCategoryMeta[] = [
  { slug: 'heroes', name: 'Heroes', description: '...', emoji: '🦸' },
  { slug: 'features', name: 'Features', description: '...', emoji: '✨' },
  { slug: 'pricing', name: 'Pricing', description: '...', emoji: '💳' },
  { slug: 'testimonials', name: 'Testimonials', description: '...', emoji: '💬' },
  { slug: 'cta', name: 'CTA', description: '...', emoji: '▶️' },
  { slug: 'footers', name: 'Footers', description: '...', emoji: '🦶' },
  { slug: 'infinite-marquee', name: 'Infinite Marquee', description: '...', emoji: '🔁' },
  { slug: 'parallax-scroll', name: 'Parallax Scroll', description: '...', emoji: '🌀' },
];

export const BLOCKS: BlockMeta[] = [
  // Enumerar TODOS los archivos reales de src/blocks/*.ts (26) + hero-section (componente "Glow").
  // Incluir el huérfano src/blocks/cta.ts (hallazgo #7) con category: 'cta'.
  // Para cada entrada: abrir el archivo y sacar selector real y deps reales (grep "import.*gsap").
];

export const blocksByCategory = (slug: string) =>
  BLOCKS.filter((b) => b.category === slug);

export const categoryCount = (slug: string) => blocksByCategory(slug).length;

export const usageSnippet = (b: BlockMeta) => {
  const className = /* PascalCase desde b.id: 'hero-modern' -> 'HeroModern' */ '';
  return `import ${className} from '${b.importPath}';\n\n<!-- template -->\n<${b.selector} />`;
};

export const blockRoutes = () => BLOCK_CATEGORIES.map((c) => `/blocks/${c.slug}`);
```

Antes de rellenar `BLOCKS`: `ls src/blocks/*.ts`, y por archivo comprobar selector (`@Component({ selector })`), deps gsap/ScrollTrigger, y categoría según qué página lo usa hoy (`src/app/pages/blocks/*.page.ts`).

### 3c. `src/data/categories.ts` pasa a ser vista derivada

```ts
import { BLOCK_CATEGORIES, categoryCount } from './block-registry';

const CATEGORIES = BLOCK_CATEGORIES.map((c, i) => ({
  id: i + 1,
  slug: c.slug,
  name: c.name,
  emoji: c.emoji,
  count: categoryCount(c.slug),
}));
export default CATEGORIES;
```

- Añadir `slug: string` a `src/shared/interfaces/category.interface.ts`.
- `src/components/grid-card.ts`: link de `category.name.toLowerCase()` → `['/blocks', category.slug]` (hallazgo #10); si tiene interfaz `Category` local duplicada, sustituirla por la compartida.

### 3d. `src/components/block-showcase.ts` — mostrar fuente completa

Leer el archivo actual primero (usa inputs `number`, `title`, `snippet`, `padY`, `showCode`, con copiar del snippet). Cambiar a:

- Nuevos inputs: `block: BlockMeta` (required), `source: string` (required, texto del `?raw`).
- Reemplazar `<pre><code>{{ snippet() }}</code></pre>` por `<app-code-tabs>` (reusar `code-tabs.ts` sin modificarlo — salvo que se haga 3i, ver ahí):
  ```ts
  tabs = computed(() => [
    { label: 'Source', code: this.source() },
    { label: 'Usage', code: usageSnippet(this.block()) },
  ]);
  ```
- Mantener el toggle "View code" (signal boolean) para no saturar la página de categoría.
- Fila de badges de dependencias bajo el header: `@for (dep of block().deps) { <span appBadge variant="outline">requires {{ dep }}</span> }`. **Nota:** `appBadge` se crea en la Fase 2c; si la Fase 2 no está hecha aún, usar un `<span>` con clases Tailwind equivalentes y dejar un `TODO(phase-2)` para migrarlo.

### 3e. Refactor de las 8 páginas de categoría (`src/app/pages/blocks/*.page.ts`)

Para cada página (ejemplo `heroes.page.ts`):

- Mantener los imports estáticos de los componentes de bloque (necesarios para el preview en vivo con prerender).
- Añadir imports `?raw` de cada fuente:
  ```ts
  import heroSource from '../../../blocks/hero.ts?raw';
  import heroModernSource from '../../../blocks/hero-modern.ts?raw';
  ```
  Probar primero con alias (`@blocks/hero.ts?raw`); si `vite-tsconfig-paths` no resuelve alias+query, ruta relativa (fallback garantizado).
- `sources: Record<string, string> = { hero: heroSource, 'hero-modern': heroModernSource, ... }` (keys = `id` del registro).
- `blocks = blocksByCategory('heroes')` desde `@data/block-registry`.
- Título/descripción de la página desde `BLOCK_CATEGORIES.find(...)` en vez de hardcodeado.
- Cada `<app-block-showcase>` recibe `[block]` y `[source]` en vez de `[title]`/`[snippet]`.

Páginas: `heroes`, `features`, `pricing`, `cta` (añadir aquí el huérfano `cta.ts`, hallazgo #7), `footers`, `testimonials`, `infinite-marquee`, `parallax-scroll`.

### 3f. Migrar las 9 páginas de recetas a `?raw`

Cada página de `src/app/pages/animations/*.page.ts` define hoy una constante con el código demo copiado a mano (drift garantizado). Sustituir por:

```ts
import demoSource from '../../../components/animation-demos/stagger-reveal-demo.ts?raw';
```

y usarla en el `code-tabs` de la página. Es seguro: el mismo archivo se importa como módulo normal (demo en vivo) y como `?raw` (código mostrado) — ids de módulo distintos. Las 9: stagger-reveal, scroll-reveal, text-split-reveal, magnetic-button, spotlight-card, card-to-modal, sticky-cards, swap-column-features, disappearing-features.

### 3g. Búsqueda del blocks-index

`src/app/pages/blocks/(blocks-index).page.ts`: ampliar el filtro (hoy solo busca en `CATEGORIES`) para buscar también en `BLOCKS` por `name`/`description`, mostrando cuántos bloques matchean por categoría.

### 3h. Test anti-drift

**Nuevo** `src/data/block-registry.spec.ts` (Vitest ya configurado):

```ts
import { describe, it, expect } from 'vitest';
import { BLOCKS, BLOCK_CATEGORIES } from './block-registry';

describe('block-registry', () => {
  it('every file in src/blocks has exactly one registry entry (except known exceptions)', () => {
    const files = Object.keys(import.meta.glob('../blocks/*.ts'));
    // comparar basenames contra BLOCKS.map(b => b.id), permitiendo la excepción de hero-section
  });
  it('ids are unique', () => {
    const ids = BLOCKS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every block.category matches a real category slug', () => {
    const slugs = new Set(BLOCK_CATEGORIES.map((c) => c.slug));
    for (const b of BLOCKS) expect(slugs.has(b.category)).toBe(true);
  });
});
```

### 3i. Syntax highlighting con Shiki en build-time (recomendado; diferible sin bloquear v1)

`code-tabs.ts` renderiza texto plano. Para archivos de 100+ líneas y el objetivo "sentirse como shadcn/Aceternity", código sin resaltar se queda corto — es lo primero que se le criticará al resultado.

**Enfoque: resaltar en build-time, cero coste en cliente.** No cargar Shiki en el navegador ni resaltar en runtime (bundle pesado, mismatch de hidratación). Plugin de Vite propio con sufijo `?highlight`, simétrico al `?raw`:

- `pnpm add -D shiki`
- Plugin en `vite.config.ts` (o archivo aparte importado desde ahí), `enforce: 'pre'`: en el hook `load`/`transform`, para ids terminados en `?highlight`, leer el archivo, correr `codeToHtml(code, { lang: 'ts'|'html' según extensión, themes: { light: 'github-light', dark: 'github-dark' } })` y devolver `export default <JSON del HTML resaltado>`. Shiki queda como devDependency; el resultado es un string estático.
- Ampliar el `transformFilter` de 3a: `(_code, id) => !id.includes('?raw') && !id.includes('?highlight')`.
- Las páginas importan ambos: `?raw` (botón de copiar — texto plano) y `?highlight` (mostrar). `code-tabs.ts` gana un campo opcional `html` por tab renderizado con `[innerHTML]` (fallback al `code` plano) — ampliación aditiva y retrocompatible, matiza el "sin modificarlo" de 3d.
- Dual theme: Shiki con `themes: {light, dark}` emite CSS variables (`--shiki-dark`, etc.); añadir en `styles.css` el bloque estándar que las activa bajo `html.dark`.
- Validar `?highlight` con el mismo procedimiento del spike de 3a antes de aplicarlo a las 8+9 páginas.

**Si Shiki complica el build o el SSR, diferirlo a post-v1 sin bloquear nada** — el visor funciona con texto plano y nada más depende de esto.

### Verificación (Definition of Done)

1. `pnpm test` en verde (incluye el test anti-drift).
2. `pnpm build`; grep sobre `dist/analog/public/blocks/heroes/index.html` buscando texto legible tipo `export default class Hero` — si aparece `ɵɵdefineComponent` en su lugar, el `transformFilter` no funciona: no seguir hasta resolverlo.
3. En el navegador: cada página de categoría muestra preview en vivo + pestaña Source con código real + botón copiar funcional + badges de deps correctos; contadores de `/blocks` y home coinciden con los bloques visibles (incluyendo `cta.ts` recuperado).
4. Las 9 páginas de recetas: el código de "Source" es idéntico al archivo real de `animation-demos/`.
5. Si se hizo 3i: spans de color en ambos temas, cero requests a Shiki/WASM en Network.
6. Actualizar tabla de estado y comitear.

---

## Fase 2 — Capa de marca

> Se ejecuta **después** de la Fase 3 (la numeración es solo referencia del documento).

**Objetivo:** identidad visual propia — tipografía self-hosted, acento de marca, primitivas UI, navbar y footer reales.

**Prerrequisitos:** ninguno técnico (independiente de la Fase 3); por prioridad de valor va después.

**Detección de estado:**

```bash
grep -n "fontsource" package.json         # con resultado → 2a ya hecho
grep -n "oklch(0.55 0.17 152)" src/styles.css  # con resultado → 2b ya hecho
ls src/components/ui/ 2>/dev/null          # si existe → 2c en marcha/hecho
```

### 2a. Tipografía self-hosted

```bash
pnpm add @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

En `src/styles.css`, después de `@import 'tailwindcss';`:

```css
@import '@fontsource-variable/inter';
@import '@fontsource-variable/jetbrains-mono';

@theme {
  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, 'SF Mono', Menlo, monospace;
  /* ...resto de tokens existentes... */
}
```

Tailwind v4 usa `--font-sans` por defecto vía preflight — no hace falta `body { font-family }`; verificar visualmente tras el build. `font-mono` (ya usada en `code-tabs.ts`, `block-showcase.ts`, `docs.page.ts`) resuelve sola al token nuevo.

Mejora opcional (solo si Lighthouse muestra FOUT/CLS): `.woff2` latin a `public/fonts/`, `@font-face` manual + `<link rel="preload" as="font" crossorigin>`.

### 2b. Acento de marca

Repropósito de `--color-accent` (cero uso actual — hallazgo #4), verde adaptado del branding GSAP:

```css
@theme {
  --color-accent: oklch(0.55 0.17 152); /* light: verde profundo, contraste ≥4.5:1 sobre blanco */
  --color-accent-foreground: #fafafa;
}
html.dark {
  --color-accent: oklch(0.8 0.21 152); /* dark: familia del verde GSAP #0ae448 */
  --color-accent-foreground: #09090b;
}
```

Uso del acento (identidad puntual, NO fondo general): marca/logo en navbar, indicador de link activo, links de prosa en `/docs`, `::selection`, `--color-ring` (focus), texto en gradiente del hero, variante `gsap` de `meta-pill.ts` (hoy emerald hardcodeado — migrar a tokens de acento).

### 2c. Primitivas de UI — `src/components/ui/`

Directivas de atributo sobre elementos nativos (patrón `computed()` de `meta-pill.ts` — leerlo antes):

- `src/components/ui/button.ts` → `[appButton]`, inputs `variant: 'primary' | 'secondary' | 'outline' | 'ghost'` (default `primary`), `size: 'sm' | 'md' | 'lg'` (default `md`); host binding `[class]` computado.
- `src/components/ui/badge.ts` → `[appBadge]`, `variant: 'default' | 'accent' | 'outline'`.
- `src/components/ui/input.ts` → `[appInput]` (sin variantes; unifica las clases duplicadas de los buscadores de `(blocks-index).page.ts` y `(animations-index).page.ts`).

**Rollout** (aplicar directivas, no reescribir layouts): botón GitHub y toggle de tema en `navbar.ts` (usar ahí también la utility `glass` en vez de clases hardcodeadas), CTAs de `hero-section.ts` y de la sección CTA de `(home).page.ts`, filtros de `(animations-index).page.ts`, botones de copiar de `block-showcase.ts` y `code-tabs.ts`, los dos inputs de búsqueda. **Si la Fase 3 dejó `TODO(phase-2)` en los badges de deps de `block-showcase.ts`, migrarlos ahora a `appBadge`.**

### 2d. Navbar y footer

- `navbar.ts`: sustituir la caja "B." por marca real — cuadrado redondeado con gradiente de acento + glifo SVG simple (curva de easing / play triangle), wordmark "GSAP Blocker" con detalle en acento. Link activo: de solo `font-semibold` a subrayado o punto de acento. Consumir la utility `glass`.
- `public/favicon.svg`: recolorear a juego.
- `footer.ts`: reconstruir (hoy una línea) con 4 columnas:
  1. Marca + tagline + "Built with Angular · Tailwind · GSAP"
  2. Explore: `/blocks`, `/animations`, `/docs` (con `routerLink`)
  3. Resources: GitHub, CHANGELOG/release notes, licencia
  4. `©` + año (reusar `src/shared/tokens/date.token.ts`) + versión del proyecto.
  Responsive: columnas apiladas en móvil, borde superior, `text-muted-foreground`.

### Verificación (Definition of Done)

1. `pnpm lint && pnpm test && pnpm build` en verde.
2. Revisar visualmente `/`, `/blocks`, `/animations`, `/docs` en light y dark.
3. Network tab: fuentes desde el mismo origen, cero requests a fonts.googleapis.com u otro CDN.
4. Contraste del acento verificado en ambos temas (herramienta de contraste, objetivo ≥4.5:1 en texto).
5. Actualizar tabla de estado y comitear.

---

## Fase 4 — Sección de docs

**Objetivo:** docs multi-página serias: getting started, theming, y una guía por cada directiva GSAP compartida con demo en vivo, tabla de API y fuente completa.

**Prerrequisitos:** Fase 2 (primitivas/tokens) y Fase 3a (`?raw` habilitado). Verificar:

```bash
grep -n "transformFilter" vite.config.ts   # debe existir (Fase 3a)
ls src/components/ui/ 2>/dev/null          # debe existir (Fase 2c)
ls src/app/pages/docs/ 2>/dev/null         # si existe → esta fase en marcha/hecha
```

### Árbol de rutas (Analog file-based, todo prerenderizable)

```
/docs                           src/app/pages/docs/(docs-index).page.ts    — Getting started
/docs/installation              src/app/pages/docs/installation.page.ts
/docs/theming                   src/app/pages/docs/theming.page.ts         — tokens, dark mode, acento, fuentes
/docs/directives/gsap-from      src/app/pages/docs/directives/gsap-from.page.ts
/docs/directives/gsap-scroll    src/app/pages/docs/directives/gsap-scroll.page.ts
/docs/directives/gsap-timeline  src/app/pages/docs/directives/gsap-timeline.page.ts
/docs/directives/reveal         src/app/pages/docs/directives/reveal.page.ts
/docs/directives/when-visible   src/app/pages/docs/directives/when-visible.page.ts
/docs/directives/smooth-scroll  src/app/pages/docs/directives/smooth-scroll.page.ts
```

- Convertir `src/app/pages/docs.page.ts` en página de **layout** (sidebar + `<router-outlet/>`), replicando el patrón de `blocks.page.ts` (leerlo antes). El contenido actual (Introduction/Installation/Theming) se reparte entre `(docs-index).page.ts` y `theming.page.ts`. Esto resuelve también el link muerto (hallazgo #12) si no se arregló en Fase 1.
- **Nuevo** `src/data/docs-nav.ts` (datos puros, sin imports de Angular — `vite.config.ts` lo importa en Fase 5):
  ```ts
  export interface DocsNavItem { title: string; path: string; }
  export interface DocsNavSection { section: string; items: DocsNavItem[]; }
  export const DOCS_NAV: DocsNavSection[] = [
    { section: 'Guides', items: [
      { title: 'Introduction', path: '/docs' },
      { title: 'Installation', path: '/docs/installation' },
      { title: 'Theming', path: '/docs/theming' },
    ]},
    { section: 'Directives', items: [
      { title: 'andGsapFrom', path: '/docs/directives/gsap-from' },
      { title: 'andGsapScroll', path: '/docs/directives/gsap-scroll' },
      { title: 'andGsapTimeline', path: '/docs/directives/gsap-timeline' },
      { title: 'andReveal', path: '/docs/directives/reveal' },
      { title: 'andWhenVisible', path: '/docs/directives/when-visible' },
      { title: 'appSmoothScroll', path: '/docs/directives/smooth-scroll' },
    ]},
  ];
  export const DOCS_ROUTES = DOCS_NAV.flatMap((s) => s.items.map((i) => i.path));
  ```
- **Nuevo** `src/components/docs/docs-sidebar.ts`: renderiza `DOCS_NAV`, `routerLinkActive`, sticky en desktop, colapsable en móvil (mismo patrón de disclosure que el sidebar actual de docs — revisar `docs.page.ts` tal como está antes de reescribir).

### Anatomía de cada página de directiva (estáticas, sin ruta dinámica `[slug]`)

Para cada una de las 6 directivas de `src/shared/directives/`:

1. Título + línea descriptiva + fila de `app-meta-pill` (reusar tal cual).
2. **Demo en vivo:** componente pequeño nuevo en `src/components/docs/demos/` (`reveal-demo.ts`, `gsap-from-demo.ts`, `gsap-scroll-demo.ts`, `gsap-timeline-demo.ts`, `when-visible-demo.ts`, `smooth-scroll-demo.ts`), ~50 líneas cada uno, usando la **directiva real** importada de `src/shared/directives/`, dentro de un frame con borde (estilo de `recipe-demo.ts`) y botón "Replay".
3. **Tabla de API:** inputs/outputs/defaults escrita leyendo el código fuente real de cada directiva (ejemplos verificados en su día: `andReveal` → `y`, `opacity`, `duration`, `delay`, `once`, `ease`, `outset`, `threshold`; `andGsapScroll` → `start`, `end`, `scrub`, `markers`, `pin`, `scroller`, `from`, `to`, `timeline` — **releer el archivo actual antes de escribir la tabla**).
4. **Fuente completa** vía `?raw` del archivo real (ej. `import src from '../../../../shared/directives/and-reveal.directive.ts?raw'`) en `app-code-tabs`, más segunda pestaña con snippet de uso. Cero drift.
5. Notas de SSR-safety, comportamiento con `prefers-reduced-motion`, y semántica de cleanup (`ngOnDestroy`/`DestroyRef`).

- Reusar `recipe-section.ts` para las secciones.
- Cada página nueva lleva su `routeMeta` (si la Fase 5 aún no existe, usar la forma actual de `routeMeta` del repo; la Fase 5 los migrará al helper `pageMeta`).

### Verificación (Definition of Done)

1. `pnpm lint && pnpm test && pnpm build` en verde.
2. Navegar las 8 páginas nuevas: sidebar marca la sección activa; cada Replay reinicia la demo; el código del tab "Source" es idéntico al archivo real (diff visual).
3. Actualizar tabla de estado y comitear.

---

## Fase 5 — SEO, meta y remate

**Objetivo:** metadatos serios (OG real, sitemap, robots), prerender completo derivado de los registros de datos, y housekeeping (CHANGELOG, versión, README).

**Prerrequisitos:** Fase 3 (`block-registry.ts`) y Fase 4 (`docs-nav.ts`). Verificar:

```bash
ls src/data/block-registry.ts src/data/docs-nav.ts   # ambos deben existir
grep -n "sitemap" vite.config.ts                     # con resultado → 5c ya hecho
```

### 5a. Constantes de sitio y helper de meta

**Nuevo** `src/data/site.ts`:

```ts
export const SITE_URL = 'https://gsap-blocker.pages.dev'; // cambiar si hay dominio propio en CF Pages
export const SITE_NAME = 'GSAP Blocker';
export const SITE_DESCRIPTION = 'A curated collection of production-ready, animated UI blocks built with Angular 20, AnalogJS, Tailwind CSS v4, and GSAP.';
export const OG_IMAGE = `${SITE_URL}/og.png`;
```

**Nuevo** `src/shared/utils/page-meta.ts`:

```ts
import type { RouteMeta } from '@analogjs/router';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, OG_IMAGE } from '@data/site';

interface PageMetaInput {
  title: string;
  description?: string;
  path: string; // ej. '/blocks/heroes'
}

export function pageMeta({ title, description, path }: PageMetaInput): RouteMeta {
  const desc = description ?? SITE_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  return {
    title: `${title} · ${SITE_NAME}`,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: OG_IMAGE },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
  };
}
```

(Verificar la forma exacta de `RouteMeta` leyendo su `.d.ts` o un `routeMeta` existente antes de fijar la interfaz — el formato de `meta` puede variar entre versiones de Analog.)

Refactorizar los ~20 `routeMeta` existentes en `src/app/pages/**/*.page.ts` a `pageMeta({...})`. Esto arregla también el `og:image: '/favicon.svg'` roto (un SVG pequeño no es OG image válido).

### 5b. Asset OG y robots

- **Nuevo** `public/og.png` (1200×630): fondo zinc-950, wordmark "GSAP Blocker" en Inter Bold, motivo de curva de easing en verde de acento. Generable renderizando un HTML/CSS y capturando.
- **Nuevo** `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://gsap-blocker.pages.dev/sitemap.xml
  ```
- `index.html`: `og:image` a URL absoluta de `og.png`; añadir `<meta name="theme-color">` (light y dark con `media` si se soporta).

### 5c. Sitemap + prerender derivado + quitar ISR

En `vite.config.ts`:

```ts
import { BLOCK_CATEGORIES } from './src/data/block-registry'; // import relativo, no alias
import { DOCS_ROUTES } from './src/data/docs-nav';
import ANIMATIONS from './src/data/animations'; // ver prerequisito abajo

// ...
analog({
  nitro: {
    preset: process.env['BUILD_PRESET'] ?? 'node-server',
    // quitar el bloque routeRules de ISR para /blocks/** y /animations/** — todo pasa a prerender
  },
  prerender: {
    sitemap: { host: 'https://gsap-blocker.pages.dev' },
    routes: async () => [
      '/', '/blocks', '/animations',
      ...BLOCK_CATEGORIES.map((c) => `/blocks/${c.slug}`),
      ...ANIMATIONS.map((r) => `/animations/${r.slug}`),
      ...DOCS_ROUTES,
    ],
  },
  vite: { /* ...de la Fase 3a (incluye transformFilter)... */ },
}),
```

- **Prerequisito:** `src/data/animations.ts` probablemente importa su tipo vía alias (`@shared/interfaces/...`). Cambiarlo a import relativo con `import type` explícito, para que `vite.config.ts` pueda cargarlo sin resolución de alias de Angular. Añadir el mismo comentario de cabecera que en `block-registry.ts` / `docs-nav.ts`: "este archivo lo importa vite.config.ts — no añadir imports de alias ni runtime de Angular".
- Quitar las `routeRules` de ISR para `/blocks/**` y `/animations/**` — todo el contenido es estático tras Fases 3/4; prerender completo es más simple y rápido. El HTML prerenderizado ya tenía precedencia sobre el worker en CF Pages.

### 5d. Housekeeping

- `CHANGELOG.md`: promover "Unreleased" a `## [0.2.0] - <fecha>`: viewer de código fuente por bloque, sección de docs, sistema de marca (Inter/JetBrains Mono, acento verde), sitemap/robots/OG, fixes de reduced-motion y lazy-GSAP, limpieza de CSS muerto. Corregir "six recipes" (obsoleto) a "nine recipes".
- `package.json`: versión `0.2.0`.
- `README.md`: refrescar features (9 recetas, docs nuevas, flujo copy-paste con fuente completa).
- Tests: `src/shared/utils/page-meta.spec.ts` (casos básicos) y ampliar `block-registry.spec.ts` con casos de `usageSnippet()`.

### Verificación (Definition of Done)

1. `pnpm lint && pnpm format:check && pnpm test` en verde.
2. `pnpm build` → en `dist/analog/public/`: `sitemap.xml` existe y lista ~28 rutas; `robots.txt` y `og.png` presentes.
3. View-source de una página prerenderizada: OG tags con URLs absolutas.
4. Actualizar tabla de estado y comitear.

---

## Fase 6 — Verificación end-to-end

**Objetivo:** validación completa del producto final antes de dar el upgrade por cerrado.

**Prerrequisitos:** Fases 1–5 completadas (ver tabla de estado).

### Checklist

1. `pnpm lint && pnpm format:check && pnpm test` — incluye y pasa el test anti-drift de `block-registry.spec.ts`.
2. `pnpm build` → inspeccionar `dist/analog/public/`:
   - `sitemap.xml` existe y lista ~28 rutas; `robots.txt` y `og.png` presentes.
   - **Test definitivo de `?raw`:** el HTML de `dist/analog/public/blocks/heroes/index.html` contiene código TS legible (`export default class Hero`), no `ɵɵdefineComponent`.
3. `pnpm preview` (runtime real de Cloudflare) — checklist manual:
   - Home, `/blocks`, `/animations`, `/docs` renderizan; dark mode sin flash en hard-reload.
   - Menú móvil funciona; ruta 404 (`[...not-found]`) funciona.
   - Las 8 páginas de categoría: preview en vivo + tab "Source" con código real + copiar + badges de deps correctos; contadores de `/blocks` y home coinciden con los bloques visibles (incluyendo `cta.ts` recuperado).
   - Las 9 páginas de recetas: código "Source" idéntico al archivo real de `animation-demos/`.
   - Las 8 páginas de `/docs`: sidebar activa, Replay funcional, tabla de API correcta, fuente completa visible.
   - DevTools → Rendering → `prefers-reduced-motion: reduce`: blobs del hero, beam, marquee y loops de `grid-card` estáticos.
   - View-source (HTML servido, no DOM) de `/blocks/heroes`: OG tags absolutas; fuentes del mismo origen (cero CDN externo).
4. Lighthouse en `/` y `/docs` — objetivo: Performance/Accessibility/SEO ≥ 90.
5. Actualizar tabla de estado (todo ✅) y comitear/push. CI corre lint/format/test/build en Node 20 y 22 automáticamente.
