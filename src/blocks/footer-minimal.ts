import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-minimal',
  template: `
    <footer class="bg-background py-12 border-t border-border">
      <div
        class="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="flex items-center gap-2 font-bold text-foreground">
          <div class="size-6 bg-foreground rounded-full"></div>
          Blocker.
        </div>

        <nav class="flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" class="hover:text-foreground transition-colors">Home</a>
          <a href="#" class="hover:text-foreground transition-colors">About</a>
          <a href="#" class="hover:text-foreground transition-colors">Work</a>
          <a href="#" class="hover:text-foreground transition-colors"
            >Contact</a
          >
        </nav>

        <div class="text-sm text-muted-foreground opacity-60">© 2024</div>
      </div>
    </footer>
  `,
})
export default class FooterMinimal {}
