# Jeresoft Academy Assets

Sistema local para dirigir, generar, validar y empaquetar assets visuales de
Jeresoft Academy.

La intención no es producir imágenes genéricas con prompts largos, sino operar
como un **director de arte IA**: cada curso tiene una historia visual estable y
cada asset se deriva de esa dirección.

## Flujo

```text
concepto
  ↓
metáfora
  ↓
escena
  ↓
storyboard
  ↓
layout
  ↓
prompt
  ↓
GPT Images
  ↓
QA visual
  ↓
export
  ↓
public/assets/illustrations/courses/<course>/
```

## Estructura principal

```text
assets/
├── .agents/skills/jeresoft-visual-designer/SKILL.md
├── config/
│   ├── academy-brand.json
│   └── asset-specs.json
├── courses/
│   └── <course>/
│       ├── art-direction.md
│       ├── prompts/
│       ├── generated/
│       └── export/
├── packages/
└── tools/academy-assets/
```

## Uso con Codex o Claude Code

Pide:

```text
Usa el skill Jeresoft Visual Designer para generar el paquete visual completo
de Algorithms en dark, light y YouTube usando el copy aprobado.
```

O, si la dirección de arte ya existe:

```text
course: design-patterns
asset: hero-mobile
```

El agente debe:

1. leer `courses/<course>/art-direction.md`;
2. derivar la historia visual del asset;
3. generar un prompt individual por formato;
4. guardar prompts, imágenes generadas y exports aprobados;
5. validar nombres y dimensiones;
6. copiar los PNG aprobados a `public/assets/illustrations/courses/<course>/`.

El ZIP es opcional y solo se crea cuando el usuario lo pide explícitamente.

## Regla clave

GPT Images debe producir principalmente **concept art editorial**. El texto
aprobado del curso se coloca preferentemente fuera de la imagen base, mediante
HTML, Canva o una capa determinística. Esto evita tipografía deformada y permite
usar la misma escena en varios formatos.

## Importante

El skill organiza, documenta, valida y empaqueta. La generación real de imágenes
depende de GPT Images, de la herramienta de imagen disponible en el agente o del
flujo manual aprobado por el usuario.
