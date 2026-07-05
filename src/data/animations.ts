import type AnimationRecipe from '@shared/interfaces/animation-recipe.interface';

const ANIMATIONS: AnimationRecipe[] = [
  {
    slug: 'stagger-reveal',
    title: 'Stagger Reveal',
    description:
      'Reveal a list of elements one after another using gsap.from and stagger.',
    category: 'Reveal',
    difficulty: 'beginner',
    angularConcepts: [
      'standalone component',
      'signals',
      '@for',
      'viewChildren',
      'DestroyRef',
    ],
    gsapConcepts: ['gsap.from', 'stagger', 'easing'],
    accessibility: [
      'prefers-reduced-motion',
      'content is in the DOM and readable before it animates',
    ],
    performance: [
      'animate transform and opacity only',
      'one tween for the whole list instead of one per item',
    ],
  },
  {
    slug: 'scroll-reveal',
    title: 'Scroll Reveal',
    description:
      'Reveal an element as it enters the viewport using an SSR-safe ScrollTrigger directive.',
    category: 'Scroll',
    difficulty: 'intermediate',
    angularConcepts: [
      'attribute directive',
      'input() signals',
      'DestroyRef',
      'isPlatformBrowser',
    ],
    gsapConcepts: ['ScrollTrigger', 'timeline', 'scrub', 'custom scroller'],
    accessibility: [
      'prefers-reduced-motion',
      'content readable without JavaScript',
    ],
    performance: [
      'kill the ScrollTrigger and timeline on destroy',
      'animate transform and opacity, never layout properties',
    ],
  },
  {
    slug: 'text-split-reveal',
    title: 'Text Split Reveal',
    description:
      'Reveal a heading word-by-word with GSAP stagger while keeping the sentence accessible.',
    category: 'Text',
    difficulty: 'intermediate',
    angularConcepts: [
      'computed signal',
      '@for with track',
      'viewChildren',
      'DestroyRef',
    ],
    gsapConcepts: ['gsap.from', 'stagger', 'easing'],
    accessibility: [
      'aria-hidden on the split spans',
      'aria-label with the full sentence on the container',
      'prefers-reduced-motion',
    ],
    performance: [
      'split the text once via a computed(), not on every render',
      'animate transform and opacity only',
    ],
  },
  {
    slug: 'magnetic-button',
    title: 'Magnetic Button',
    description:
      'A button that gently follows the cursor using gsap.quickTo, without touching Angular state.',
    category: 'Interaction',
    difficulty: 'intermediate',
    angularConcepts: [
      'standalone component',
      'viewChild',
      'DestroyRef',
      'no signal writes on pointermove',
    ],
    gsapConcepts: ['gsap.quickTo', 'easing', 'clamping'],
    accessibility: [
      'stays a real, keyboard-focusable button',
      'visible focus ring',
      'prefers-reduced-motion disables the follow effect',
    ],
    performance: [
      'gsap.quickTo instead of a new tween per pointermove event',
      'no Angular change detection triggered by pointer movement',
    ],
  },
  {
    slug: 'spotlight-card',
    title: 'Spotlight Card',
    description:
      'A card with a radial glow that follows the pointer, positioned with CSS variables and smoothed with GSAP.',
    category: 'Interaction',
    difficulty: 'beginner',
    angularConcepts: [
      'standalone component',
      'viewChild',
      'DestroyRef',
      'CSS custom properties',
    ],
    gsapConcepts: ['gsap.to on CSS variables', 'easing', 'overwrite'],
    accessibility: [
      'the glow is decorative and marked aria-hidden',
      'visible focus-within state',
      'prefers-reduced-motion',
    ],
    performance: [
      'a single radial-gradient driven by CSS variables',
      'no layout reads inside the pointermove handler',
    ],
  },
  {
    slug: 'card-to-modal',
    title: 'Card to Modal',
    description:
      'Expand a compact card into an accessible modal using the FLIP technique and GSAP.',
    category: 'Shared Element',
    difficulty: 'advanced',
    angularConcepts: [
      'signals',
      'DestroyRef',
      'standalone component',
      'focus management',
      '@if',
    ],
    gsapConcepts: ['fromTo', 'timeline', 'FLIP', 'easing'],
    accessibility: [
      'role="dialog"',
      'aria-modal="true"',
      'Escape closes the modal',
      'focus returns to the trigger card',
      'prefers-reduced-motion',
    ],
    performance: [
      'animate transform and opacity only',
      'read layout once per transition, not per frame',
    ],
  },
];

export function getRecipe(slug: string): AnimationRecipe {
  const recipe = ANIMATIONS.find((r) => r.slug === slug);
  if (!recipe) throw new Error(`Unknown animation recipe: ${slug}`);
  return recipe;
}

export function getAdjacentRecipes(slug: string): {
  prev: AnimationRecipe | null;
  next: AnimationRecipe | null;
} {
  const index = ANIMATIONS.findIndex((r) => r.slug === slug);
  return {
    prev: index > 0 ? ANIMATIONS[index - 1] : null,
    next:
      index >= 0 && index < ANIMATIONS.length - 1
        ? ANIMATIONS[index + 1]
        : null,
  };
}

export default ANIMATIONS;
