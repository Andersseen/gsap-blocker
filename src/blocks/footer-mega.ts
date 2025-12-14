import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-mega',
  template: `
    <footer class="bg-background border-t border-border pt-24 pb-12">
      <div class="container mx-auto px-6 md:px-12">
        <div
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24"
        >
          <div class="col-span-2 lg:col-span-2 space-y-6">
            <div class="text-2xl font-black tracking-tighter text-foreground">
              BLOCKER.
            </div>
            <p class="text-muted-foreground max-w-sm">
              Premium animated components for Angular developers. Built with
              GSAP and Tailwind CSS.
            </p>
            <div class="flex gap-4">
              <!-- Social icons placeholder -->
              <div
                class="size-10 rounded-full bg-secondary flex items-center justify-center"
              >
                🐦
              </div>
              <div
                class="size-10 rounded-full bg-secondary flex items-center justify-center"
              >
                🐙
              </div>
              <div
                class="size-10 rounded-full bg-secondary flex items-center justify-center"
              >
                💼
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <h4 class="font-bold text-foreground">Product</h4>
            <ul class="space-y-3 text-muted-foreground">
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Features</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Pricing</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Showcase</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Updates</a
                >
              </li>
            </ul>
          </div>

          <div class="space-y-6">
            <h4 class="font-bold text-foreground">Resources</h4>
            <ul class="space-y-3 text-muted-foreground">
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Documentation</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >API Reference</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Community</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Blog</a
                >
              </li>
            </ul>
          </div>

          <div class="space-y-6">
            <h4 class="font-bold text-foreground">Company</h4>
            <ul class="space-y-3 text-muted-foreground">
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >About</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Careers</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Legal</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-primary transition-colors"
                  >Contact</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div
          class="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <div>© 2024 Blocker Inc. All rights reserved.</div>
          <div class="flex gap-8">
            <a href="#" class="hover:text-foreground">Privacy Policy</a>
            <a href="#" class="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export default class FooterMega {}
