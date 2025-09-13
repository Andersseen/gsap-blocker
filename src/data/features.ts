import Feature from '@shared/interfaces/features.interface';

const FEATURES: Feature[] = [
  {
    title: 'Modern Angular patterns',
    desc: 'Signals, control flow, defer, optimized images.',
    icon: '⚡️',
  },
  {
    title: 'Tailwind 4 friendly',
    desc: 'Utilities for layout and theming; minimal custom CSS.',
    icon: '🎨',
  },
  {
    title: 'Material compatible',
    desc: 'Designed to sit nicely alongside Angular Material.',
    icon: '🧩',
  },
  {
    title: 'A11y minded',
    desc: 'Good semantics and keyboard focus by default.',
    icon: '♿',
  },
  {
    title: 'SSR-safe animations',
    desc: 'Lazy-loaded GSAP + IntersectionObserver triggers.',
    icon: '🛡️',
  },
  {
    title: 'Copy-paste ready',
    desc: 'Sections as focused, composable components.',
    icon: '📦',
  },
];

export default FEATURES;
