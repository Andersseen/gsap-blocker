import { Component, ElementRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'reveal-demo',
  template: `
    <div class="max-w-[1240px] mx-auto p-4">
      <div class="min-h-[40vh] flex items-center justify-center">
        <h1 class="text-center text-3xl md:text-5xl gs_reveal">
          Reveal animations based on scroll direction
        </h1>
      </div>

      <div class="flex flex-col gap-12">
        <!-- item left -->
        <div
          class="flex flex-wrap items-center gap-8 h-screen border-t-2 border-dashed border-gray-400 gs_reveal gs_reveal_fromLeft"
        >
          <div class="basis-[40%] grow relative">
            <div class="rounded-lg overflow-hidden relative aspect-square">
              <img
                class="absolute inset-0 w-full h-full object-cover"
                src="https://assets.codepen.io/16327/portrait-image-14.jpg"
                alt=""
              />
            </div>
          </div>
          <div class="basis-[55%] grow text-right">
            <h2 class="text-[1.8em] mb-4 gs_reveal">Highway Vinyl Nights</h2>
            <p class="leading-7 gs_reveal">
              The headlights hum along the painted lines<br />
              We twist the dial till static turns to choir<br />
              Your hand keeps time on the wheel and the night leans in<br />
              Every mile is a chorus we have not written yet
            </p>
          </div>
        </div>

        <!-- item right -->
        <div
          class="flex flex-wrap items-center gap-8 h-screen border-t-2 border-dashed border-gray-400 flex-row-reverse gs_reveal gs_reveal_fromRight"
        >
          <div class="basis-[40%] grow relative">
            <div class="rounded-lg overflow-hidden relative aspect-square">
              <img
                class="absolute inset-0 w-full h-full object-cover"
                src="https://assets.codepen.io/16327/portrait-image-4.jpg"
                alt=""
              />
            </div>
          </div>
          <div class="basis-[55%] grow">
            <h2 class="text-[1.8em] mb-4 gs_reveal">Last Diner on Route 9</h2>
            <p class="leading-7 gs_reveal">
              The coffee tastes like rainwater and luck<br />
              Neon flickers slow while the jukebox spins a waltz<br />
              We carve our names in steam on the window glass<br />
              Stay till sunrise and the road will wait its turn
            </p>
          </div>
        </div>

        <!-- item left -->
        <div
          class="flex flex-wrap items-center gap-8 h-screen border-t-2 border-dashed border-gray-400 gs_reveal gs_reveal_fromLeft"
        >
          <div class="basis-[40%] grow relative">
            <div class="rounded-lg overflow-hidden relative aspect-square">
              <img
                class="absolute inset-0 w-full h-full object-cover"
                src="https://assets.codepen.io/16327/portrait-image-3.jpg"
                alt=""
              />
            </div>
          </div>
          <div class="basis-[55%] grow text-right">
            <h2 class="text-[1.8em] mb-4 gs_reveal">Stardust Ballroom</h2>
            <p class="leading-7 gs_reveal">
              Mirror tiles catch every hopeful face<br />
              Records spin thin silver threads through the dark<br />
              We move like planets pulled by quiet drums<br />
              Hold the beat and the night will never close
            </p>
          </div>
        </div>

        <!-- item right -->
        <div
          class="flex flex-wrap items-center gap-8 h-screen border-t-2 border-dashed border-gray-400 flex-row-reverse gs_reveal gs_reveal_fromRight"
        >
          <div class="basis-[40%] grow relative">
            <div class="rounded-lg overflow-hidden relative aspect-square">
              <img
                class="absolute inset-0 w-full h-full object-cover"
                src="https://assets.codepen.io/16327/portrait-image-1.jpg"
                alt=""
              />
            </div>
          </div>
          <div class="basis-[55%] grow">
            <h2 class="text-[1.8em] mb-4 gs_reveal">Sky Without Borders</h2>
            <p class="leading-7 gs_reveal">
              Lay your worries down beneath the porchlight glow<br />
              The crickets stitch soft rhythm in the grass<br />
              We trade small dreams and make them loud together<br />
              A sky without borders is waiting past the trees
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="h-screen"></div>
  `,
  styles: [
    `
      .gs_reveal {
        opacity: 0;
        visibility: hidden;
        will-change: transform, opacity;
      }
    `,
  ],
})
export default class RevealDemoComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private triggers: Array<import('gsap/ScrollTrigger').ScrollTrigger> = [];

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const root = this.host.nativeElement;
    const elements = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('.gs_reveal')
    );

    // Asegura oculto
    const hide = (elem: HTMLElement) => gsap.set(elem, { autoAlpha: 0 });

    // Animación dependiente de dirección / clase
    const animateFrom = (elem: HTMLElement, direction = 1) => {
      let x = 0,
        y = direction * 100;
      if (elem.classList.contains('gs_reveal_fromLeft')) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains('gs_reveal_fromRight')) {
        x = 100;
        y = 0;
      }
      gsap.fromTo(
        elem,
        { x, y, autoAlpha: 0 },
        {
          duration: 1.25,
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: 'expo',
          overwrite: 'auto',
        }
      );
    };

    elements.forEach((elem) => {
      hide(elem);

      const t = ScrollTrigger.create({
        trigger: elem,
        onEnter: () => animateFrom(elem, 1),
        onEnterBack: () => animateFrom(elem, -1),
        onLeave: () => hide(elem),
        // markers: true, // descomenta para depurar
      });

      this.triggers.push(t);
    });
  }

  ngOnDestroy() {
    // Limpia solo lo creado por este componente
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];
  }
}
