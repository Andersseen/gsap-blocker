import {
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-interactive-footer',
  imports: [],
  host: {
    class: 'block w-full bg-black text-white',
  },
  template: `
    <footer
      #root
      class="relative pt-24 pb-12 px-6 overflow-hidden min-h-[500px] flex flex-col justify-between"
    >
      <!-- Big Text -->
      <div class="relative z-10">
        <h2
          class="text-6xl md:text-[10rem] font-bold leading-none tracking-tighter mb-12 mix-blend-difference"
        >
          <span class="block hover-reveal cursor-default">Let's</span>
          <span class="block hover-reveal cursor-default pl-12 md:pl-24"
            >Work</span
          >
          <span class="block hover-reveal cursor-default">Together.</span>
        </h2>
      </div>

      <!-- Links & Info -->
      <div
        class="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-white/20 pt-8 mt-auto"
      >
        <div class="md:col-span-2">
          <p class="text-xl max-w-md text-zinc-400">
            We craft digital experiences that redefine what's possible on the
            web.
          </p>
        </div>
        <div>
          <h3 class="font-bold mb-4">Socials</h3>
          <ul class="space-y-2 text-zinc-400">
            <li>
              <a href="#" class="hover:text-white transition-colors">Twitter</a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors"
                >Instagram</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors"
                >LinkedIn</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold mb-4">Contact</h3>
          <a
            href="mailto:hello@example.com"
            class="text-zinc-400 hover:text-white transition-colors"
            >hello@example.com</a
          >
        </div>
      </div>

      <!-- Floating Background Circle -->
      <div
        class="cursor-follower pointer-events-none fixed top-0 left-0 size-64 bg-white rounded-full mix-blend-difference z-20 opacity-0 md:block hidden"
      ></div>
    </footer>
  `,
  styles: [
    `
      .hover-reveal {
        width: fit-content;
        transition: color 0.3s;
      }
    `,
  ],
})
export default class InteractiveFooter implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');

    const el = this.root().nativeElement;
    const follower = el.querySelector('.cursor-follower');
    const links = el.querySelectorAll('.hover-reveal');

    // Simple cursor follower
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.6, ease: 'power3' });

    // Only active when mouse is inside footer
    el.addEventListener('mouseenter', () =>
      gsap.to(follower, { scale: 1, autoAlpha: 1 })
    );
    el.addEventListener('mouseleave', () =>
      gsap.to(follower, { scale: 0, autoAlpha: 0 })
    );

    el.addEventListener('mousemove', (e) => {
      // Adjust for fixed position or relative
      // If fixed, use clientX/Y. If we want it confined to footer, better use absolute and offset.
      // But fixed mix-blend-difference is cool.
      xTo(e.clientX - 128); // center it (256px / 2)
      yTo(e.clientY - 128);
    });

    // Hover effect on text
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 1.5 });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1 });
      });
    });
  }
}
