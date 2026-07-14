# Design Patterns — Art Direction

```yaml
course: design-patterns
status: draft-approved-direction
concept: Design patterns are reusable forms of software judgment.
emotion: craftsmanship, confidence, composure
metaphor: an artisan assembling a strong structure from compatible modular pieces
main_subject: experienced engineer assembling interchangeable components by hand
camera: 50mm editorial, tactile foreground with architectural depth
lighting: warm studio light, amber rim highlights, deep shadows
color: academy-dark, with academy-light variants using solar yellow, ivory and black
composition: left text, right illustration, clear hierarchy and 40% negative space
negative_space: 40%
focus: modularity, compatibility, composition, interfaces, structure
avoid: floating icons, fake UI, random code, puzzle clipart, abstract boxes, generic dashboards
```

## Concepto

Patrones de diseño no son una lista de nombres para memorizar. Son vocabulario
de oficio: maneras probadas de componer piezas para que el sistema sea más
entendible, flexible y sólido.

## Metáfora

Un artesano arma una estructura usando piezas compatibles. Cada pieza fue
diseñada para poder intercambiarse. El resultado final es más sólido que las
piezas individuales.

## Historia Visual

1. Hay piezas separadas sobre una mesa de trabajo: componentes, contratos,
   uniones, formas repetibles.
2. Una mano ensambla las piezas con intención, no como adorno.
3. La estructura toma forma y comunica que el diseño nace de composición,
   límites claros e interfaces compatibles.

## Layout

- Desktop: copy a la izquierda, escena principal a la derecha.
- Mobile: sujeto grande, piezas reconocibles y espacio seguro para título.
- YouTube: una acción clara de ensamblaje, lectura inmediata y contraste alto.

## Copy Aprobado

```yaml
label: OFICIO
code: DP
title: Patrones de diseño
accent: Soluciones que escalan
descriptor: Piezas, composición, interfaces y estructura.
```

## Overlay

Los assets finales de portada deben usar texto compuesto fuera del modelo de
imagen, siguiendo el criterio visual aprobado en Algoritmos. La jerarquía
correcta es: código amarillo solar grande, título blanco/marfil, acento amarillo
solar y descriptor pequeño.

```yaml
course_cover:
  label: arriba izquierda, badge dorado con texto negro
  code: izquierda, muy grande, dorado
  title: izquierda inferior, blanco/marfil en mayúsculas, refluido en dos líneas si hace falta
  accent: debajo del título, amarillo solar, tamaño comparable a Algoritmos
  descriptor: debajo del acento, pequeño y legible
chapter_cover:
  label: arriba izquierda
  code: izquierda grande
  title: izquierda inferior
  accent: debajo del título, amarillo solar
  descriptor: debajo del acento
youtube_thumbnail:
  code: bloque fuerte a la izquierda
  title: grande
  accent: amarillo solar, máximo una línea si el encuadre lo permite
```

## Prompt Seed

Create editorial concept art for a software engineering course about design
patterns. Show an experienced engineer or artisan assembling a durable modular
structure from compatible interchangeable components on a dark technical
workbench. The image should tell the story of composition, interfaces and
reusable design judgment. Warm amber studio light, black and gold academy
palette, tactile materials, premium craftsmanship, clean negative space for
external typography. Avoid puzzle clipart, fake UI, random code and floating
icons.
