# ROADMAP

Estado de avance de `academy-web` (RFC-0001 §6, §7). No hay fechas límite:
este es un proyecto de legado (RFC-0001 §1) y este roadmap se actualiza según
avanza, no según un calendario.

## Fase 1 — Sitio estático

- [x] Scaffold: Astro + Vue (islas) + Tailwind + shadcn-vue + Shiki + pnpm.
- [x] Sistema de temas claro/oscuro/system, extensible, persistido en `localStorage`.
- [x] Calidad desde el día uno: TypeScript estricto, Playwright, husky + commitlint, CI.
- [ ] Home real como "el camino" (§6): ruta completa del currículum, no un placeholder.
- [ ] Mecanismo de contenido: cómo el sitio consume el Markdown de `docs/` de cada
      repositorio del curso (submódulos, sync en build, u otro). Decisión abierta en §6.
- [ ] Progreso por capítulo en `localStorage` (sin cuentas).
- [ ] Búsqueda y navegación secundaria (candidato: Pagefind).
- [ ] Analítica privacy-friendly (Plausible vs. Umami, por decidir).

## Fase 2 — Desde el primer curso completo

No empieza hasta que exista el primer curso en producción (§6):

- [ ] Backend Rust + GraphQL (simple, sin arquitectura limpia, por decisión de §6).
- [ ] MongoDB manejado (progreso e insignias por usuario).
- [ ] Autenticación GitHub OAuth.
- [ ] Sincronización de progreso local → cuenta.

## Fuera de alcance por ahora

Cualquier contenido pedagógico real (no hay cursos en producción todavía);
separar el repo en `academy-web` + `academy-api` (solo si algún día pesa,
por "no compliques prematuramente", §6, §13).
