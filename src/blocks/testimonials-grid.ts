import { Component, input } from '@angular/core';

@Component({
  selector: 'app-testimonials-grid',
  template: `
    <div class="py-24 bg-background">
      <div class="container mx-auto px-6 md:px-12">
        <div class="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          @for (review of reviews(); track review.author) {
          <div
            class="break-inside-avoid p-6 rounded-2xl border border-border bg-card shadow-sm hover:translate-y-[-2px] transition-transform duration-300"
          >
            <div class="flex items-center gap-1 text-yellow-500 mb-4">
              @for (star of [1,2,3,4,5]; track star) { <span>★</span> }
            </div>
            <p class="text-foreground leading-relaxed mb-6 italic">
              "{{ review.text }}"
            </p>
            <div class="flex items-center gap-4">
              <div
                class="size-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground"
              >
                {{ review.author[0] }}
              </div>
              <div>
                <div class="font-bold text-foreground text-sm">
                  {{ review.author }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ review.role }}
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export default class TestimonialsGrid {
  reviews = input([
    {
      author: 'Sarah J.',
      role: 'CTO @ TechCorp',
      text: 'This library saved us weeks of development time. The animations are buttery smooth.',
    },
    {
      author: 'Mike R.',
      role: 'Frontend Dev',
      text: 'Clean code, easy to customize. Exactly what I was looking for.',
    },
    {
      author: 'Emily W.',
      role: 'Product Designer',
      text: 'The attention to detail in these components is outstanding.',
    },
    {
      author: 'David K.',
      role: 'Founder',
      text: 'Shipped my landing page in a day thanks to these blocks.',
    },
    {
      author: 'Lisa M.',
      role: 'Engineer',
      text: 'Top notch accessibility support. A rare find.',
    },
    {
      author: 'James P.',
      role: 'Director',
      text: 'Our conversion rates went up 20% after switching to this design system.',
    },
  ]);
}
