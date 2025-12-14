import { Component, input } from '@angular/core';

@Component({
  selector: 'app-testimonials-focus',
  template: `
    <div class="py-32 bg-secondary/20 border-y border-border">
      <div class="container mx-auto px-6 md:px-12 text-center max-w-4xl">
        <div class="text-6xl text-primary/20 font-serif mb-8 mx-auto">“</div>
        <h2
          class="text-2xl md:text-4xl font-medium text-foreground leading-tight mb-12"
        >
          {{ review().text }}
        </h2>
        <div class="flex flex-col items-center">
          <div
            class="size-16 rounded-full bg-gradient-to-tr from-primary to-accent mb-4"
          ></div>
          <div class="font-bold text-lg text-foreground">
            {{ review().author }}
          </div>
          <div class="text-muted-foreground">{{ review().role }}</div>
        </div>
      </div>
    </div>
  `,
})
export default class TestimonialsFocus {
  review = input({
    text: "I've never used a UI kit that felt this premium and well-thought-out. It's not just code; it's a design education.",
    author: 'Alex Chen',
    role: 'Staff Engineer @ Google',
  });
}
