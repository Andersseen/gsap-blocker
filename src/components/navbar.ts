import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [RouterLink],
  host: {
    class:
      'sticky top-0 z-50 w-full bg-white/70 dark:bg-zinc-950/50 backdrop-blur border-b border-zinc-200/50 dark:border-zinc-800/50',
  },
  template: `
    <nav
      class="container mx-auto px-6 md:px-8 h-14 flex items-center justify-between"
    >
      <a
        class="text-sm hover:underline"
        href="https://github.com/Andersseen/material-blocks"
        target="_blank"
        rel="noreferrer"
        >GitHub</a
      >
      <a class="inline-flex items-center gap-2" routerLink="/">
        <div
          class="size-6 rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-500"
        ></div>
        <span class="font-semibold">GSAP Blocker</span>
      </a>
      <div class="flex items-center gap-3">
        <a class="text-sm hover:underline" routerLink="/docs">Docs</a>

        <a
          class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          routerLink="/blocks"
        >
          Explore Blocks
        </a>
      </div>
    </nav>
  `,
})
export class Navbar {}
