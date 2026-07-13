# AGENTS.md

Este repositorio es parte de la colección **sitio web** de Jeresoft Academy
y se rige por la RFC-0001 (manual fundacional).

## Objetivo

Crear el mejor recurso educativo posible sobre **el sitio web de la academia**:
el frontend abierto del plan de estudios (RFC-0001 §6).

Todo cambio debe mejorar simultáneamente:

- calidad técnica
- claridad
- documentación
- mantenibilidad

## Antes de escribir código

Siempre, en este orden (RFC-0001 §2, §13):

1. Explicar el concepto.
2. Explicar el problema.
3. Comparar alternativas.
4. Justificar la implementación.

## Código

Este repositorio es JS/TS (Astro + Vue), no Rust. Por RFC-0001 §13, cada
curso en otro lenguaje adopta el equivalente de los estándares en su propio
ecosistema:

- `pnpm format:check` (Prettier) y `pnpm lint` (ESLint) sin diffs/advertencias.
- TypeScript estricto — `pnpm check` (`astro check`) sin errores.
- Astro estático por defecto; Vue solo en las islas que necesitan interactividad.
- Sin dependencias innecesarias, sin duplicación, sin optimización prematura
  (los mismos "nunca" de RFC-0001 §2, aplicados aquí).

## Documentación

Toda nueva funcionalidad incluye:

- README actualizado si cambia el stack, la estructura o cómo correr el proyecto.
- Diagramas Mermaid (RFC-0001 §12) cuando ayuden a explicar arquitectura o flujo.
- Tests de Playwright para todo flujo de usuario visible.

## Nunca

- Agregar dependencias innecesarias.
- Optimizar prematuramente.
- Duplicar código.
- Omitir documentación.
- Publicar funcionalidad a medias.

## Filosofía

Este repositorio debe poder utilizarse como un libro de ingeniería. Nunca
sacrificar claridad por ingenio. Explicar el porqué, no solo el cómo. Es
también, como todo el ecosistema, un proyecto de legado sin prisa (RFC-0001 §1):
la calidad siempre gana sobre la velocidad.

## Desarrollo

Servidor de desarrollo en segundo plano: `astro dev --background`
(gestionar con `astro dev stop`, `astro dev status`, `astro dev logs`).
