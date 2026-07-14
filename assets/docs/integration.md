# Integración en el sitio Astro

## Ruta sugerida

```text
public/assets/courses/<course>/
├── generated/
├── export/
└── prompts/
```

## Uso en Astro

```astro
---
const course = {
  title: 'Algoritmos',
  hero: '/assets/courses/algorithms/export/hero-desktop.dark.png',
  heroMobile: '/assets/courses/algorithms/export/hero-mobile.dark.png',
  ogImage: '/assets/courses/algorithms/export/og-image.dark.png',
};
---

<picture>
  <source media="(max-width: 767px)" srcset={course.heroMobile} />
  <img src={course.hero} alt="Portada del curso Algoritmos" />
</picture>
```

## Open Graph

```astro
<meta property="og:image" content={new URL(course.ogImage, Astro.site)} />
```
