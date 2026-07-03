import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
  noindex?: boolean;
}

const DEFAULT_SEO: SeoData = {
  title: 'GSAP Blocker — Animated UI blocks for Angular',
  description:
    'A curated collection of production-ready, animated UI blocks built with Angular, Tailwind CSS, and GSAP.',
  image: '/favicon.svg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  init() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        const seo = { ...DEFAULT_SEO, ...(data['seo'] as SeoData | undefined) };
        this.update(seo, this.router.url);
      });
  }

  update(seo: Partial<SeoData>, url: string) {
    const config = { ...DEFAULT_SEO, ...seo };

    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({
      property: 'og:type',
      content: config.ogType ?? 'website',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: config.image ?? '/favicon.svg',
    });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({
      name: 'twitter:card',
      content: config.twitterCard ?? 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: config.image ?? '/favicon.svg',
    });

    if (config.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.removeTag('name="robots"');
    }
  }
}
