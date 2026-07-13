# academy-web

Sitio web de [Jeresoft Academy](https://github.com/jeresoftx) — el frontend
abierto del plan de estudios. Se rige por el Manual Fundacional
(RFC-0001, §6 y §7).

## Qué es

La cara pública de la academia: presenta el currículum como un camino
navegable, embebe los videos de cada lección y enlaza al código fuente en
GitHub. El contenido pedagógico no vive aquí — vive en Markdown, en cada
repositorio de curso (RFC-0001 §5) —; este repositorio solo lo presenta.

Estado actual: **Fase 1, recién iniciado**. Es un scaffold funcional sin
contenido pedagógico todavía, porque ningún curso está en producción aún
(RFC-0001 §7: "los repositorios se crean solo cuando su curso entra en
producción"). Ver [ROADMAP.md](./ROADMAP.md) para el avance real.

## Arquitectura y stack (RFC-0001 §6)

**Fase 1 — estático:**

- [Astro](https://astro.build) — content-first, HTML estático por defecto,
  islas interactivas donde hacen falta. Descartado un SPA puro: indexa mal y
  da previews pobres al compartir en redes.
- [Vue](https://vuejs.org) — componentes de las islas interactivas.
- [Tailwind CSS](https://tailwindcss.com) + [shadcn-vue](https://www.shadcn-vue.com) — UI.
- [Shiki](https://shiki.style) — resaltado de sintaxis, mismo motor que VS Code.
- [pnpm](https://pnpm.io) — gestor de paquetes.

**Fase 2 — desde el primer curso completo:** backend Rust + GraphQL, MongoDB
manejado, autenticación GitHub OAuth. Ver ROADMAP.

**Temas:** claro, oscuro y system, sobre variables CSS extensibles
(`src/styles/global.css`), persistidos en `localStorage`
(`src/components/ThemeToggle.vue`, `src/layouts/Layout.astro`).

## Estructura

```text
academy-web/
├── AGENTS.md          # instrucciones para agentes de IA (RFC-0001 §20)
├── ROADMAP.md
├── LICENSE.md         # doble licencia: código MIT/Apache-2.0, contenido CC BY-SA 4.0
├── docs/              # documentación técnica propia del sitio
├── diagrams/          # diagramas Mermaid/SVG
├── assets/            # fuentes de animaciones y visualizaciones
├── src/
│   ├── components/    # islas Vue (ui/ contiene los componentes shadcn-vue)
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── tests/             # Playwright (E2E)
```

## Cómo ejecutar

```bash
pnpm install
pnpm dev              # http://localhost:4321
```

## Cómo probar y medir

```bash
pnpm format:check      # Prettier
pnpm lint              # ESLint
pnpm check             # TypeScript estricto (astro check)
pnpm build             # build de producción
pnpm test              # Playwright E2E (usa pnpm build + pnpm preview)
```

`husky` corre `format:check`, `lint` y `check` en cada commit, y `commitlint`
valida el mensaje (conventional commits). CI (`.github/workflows/ci.yml`)
corre lo mismo más la suite completa de Playwright en cada push.

## Referencias

- RFC-0001 — Manual Fundacional de Jeresoft Academy.
- [Documentación de Astro](https://docs.astro.build)
- [shadcn-vue](https://www.shadcn-vue.com)

## Próximos pasos

Ver [ROADMAP.md](./ROADMAP.md).
