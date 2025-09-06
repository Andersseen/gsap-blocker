import { Component } from '@angular/core';

@Component({
  selector: 'app-docs',
  imports: [],
  template: `
    <div class="min-h-screen pt-8 pb-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <h1
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Documentation
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Learn how to use and customize the UI blocks library
          </p>
        </div>

        <div class="space-y-12">
          <!-- Getting Started -->
          <section class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Getting Started
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                All components in this library are built with Angular 18+
                standalone components, Tailwind CSS, and GSAP for animations.
                They follow modern Angular best practices including signals for
                state management.
              </p>

              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Installation
              </h3>
              <!-- <app-code-block
                [code]="installationCode"
                language="bash"
                fileName="terminal"
              /> -->
            </div>
          </section>

          <!-- Component Structure -->
          <section class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Component Structure
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Each component follows a consistent structure with TypeScript
                interfaces for type safety.
              </p>

              <!-- <app-code-block
                [code]="componentStructureCode"
                language="typescript"
                fileName="example.component.ts"
              /> -->
            </div>
          </section>

          <!-- GSAP Integration -->
          <section class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              GSAP Integration
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                The GSAP service provides helper methods for common animations
                and handles reduced motion preferences automatically.
              </p>

              <!-- <app-code-block
                [code]="gsapIntegrationCode"
                language="typescript"
                fileName="component.ts"
              /> -->
            </div>
          </section>

          <!-- Theming -->
          <section class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Theming
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                The library uses CSS custom properties for theming with
                automatic dark mode support.
              </p>

              <!-- <app-code-block
                [code]="themingCode"
                language="css"
                fileName="global_styles.css"
              /> -->
            </div>
          </section>

          <!-- Accessibility -->
          <section class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Accessibility
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                All components are built with accessibility in mind:
              </p>
              <ul class="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Proper ARIA labels and roles</li>
                <li>• Keyboard navigation support</li>
                <li>• Focus management</li>
                <li>• Reduced motion preferences</li>
                <li>• High contrast support</li>
                <li>• Screen reader compatibility</li>
              </ul>
            </div>
          </section>

          <!-- Performance -->
          <section class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Performance
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Components are optimized for performance:
              </p>
              <ul class="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• OnPush change detection strategy</li>
                <li>• Lazy loading of GSAP plugins</li>
                <li>• Minimal DOM manipulations</li>
                <li>• Tree-shakable imports</li>
                <li>• Efficient CSS with Tailwind</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export default class DocsComponent {
  installationCode = `# Install dependencies
npm install @angular/core@latest @angular/common@latest
npm install tailwindcss@latest gsap@latest
npm install @angular/cdk@latest

# Install dev dependencies
npm install -D @tailwindcss/typography prettier eslint`;

  componentStructureCode = `import { Component, input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapService } from '../services/gsap.service';

@Component({
  selector: 'app-example',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="component-container">
      <h1>{{ title() }}</h1>
      <p>{{ description() }}</p>
    </div>
  \`
})
export class ExampleComponent implements OnInit {
  private gsapService = inject(GsapService);
  
  // Inputs using new function syntax
  title = input.required<string>();
  description = input<string>('Default description');
  
  // State using signals
  isVisible = signal(false);
  
  async ngOnInit() {
    // Initialize animations
    await this.gsapService.enterStagger('.component-container', {
      duration: 0.6,
      stagger: 0.1
    });
  }
}`;

  gsapIntegrationCode = `import { Component, inject, OnInit, ElementRef, viewChild } from '@angular/core';
import { GsapService } from '../services/gsap.service';

@Component({
  selector: 'app-animated',
  template: \`
    <div #container class="container">
      <div #element class="animated-element">Content</div>
    </div>
  \`
})
export class AnimatedComponent implements OnInit {
  private gsapService = inject(GsapService);
  
  container = viewChild.required<ElementRef>('container');
  element = viewChild.required<ElementRef>('element');

  async ngOnInit() {
    // Entrance animation
    await this.gsapService.enterStagger(this.element().nativeElement, {
      y: 30,
      opacity: 0,
      duration: 0.8
    });
    
    // Scroll-triggered animation
    await this.gsapService.revealOnScroll(this.container().nativeElement, {
      y: 50,
      duration: 1.2
    });
    
    // Parallax effect
    await this.gsapService.parallax(this.element().nativeElement, -50);
  }
}`;

  themingCode = `:root {
  --bg-primary: theme('colors.white');
  --bg-secondary: theme('colors.gray.50');
  --text-primary: theme('colors.gray.900');
  --text-secondary: theme('colors.gray.600');
  --border-color: theme('colors.gray.200');
}

.dark {
  --bg-primary: theme('colors.gray.900');
  --bg-secondary: theme('colors.gray.800');
  --text-primary: theme('colors.white');
  --text-secondary: theme('colors.gray.300');
  --border-color: theme('colors.gray.700');
}

/* Usage in components */
.custom-element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}`;
}
