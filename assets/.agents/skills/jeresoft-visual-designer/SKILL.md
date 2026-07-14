---
name: jeresoft-visual-designer
description: Use when producing Jeresoft Academy course visuals, editorial concept art, image prompts, multi-format asset packages, or visual QA for academy course imagery.
---

# Jeresoft Academy Art Director

## Propósito

Dirigir la producción visual de Jeresoft Academy como concept art editorial:
primero se decide la historia visual, luego la composición y al final el prompt.
El objetivo no es pedir "una imagen de un tema", sino contar visualmente la idea
central del curso.

## Cuándo usar este skill

Usar cuando el usuario pida:

- portada de curso;
- hero;
- banner editorial;
- imagen Open Graph;
- portada de capítulo;
- miniatura de YouTube;
- paquete completo dark, light y YouTube;
- prompts para GPT Images;
- revisión o ajuste de assets visuales de la academia.

## Fuente de verdad

Leer antes de trabajar:

1. `config/academy-brand.json`
2. `config/asset-specs.json`
3. `shared/brand/illustration-style.md`
4. `courses/<course>/art-direction.md`
5. assets aprobados existentes en `courses/<course>/export/`, si existen.

Si `courses/<course>/art-direction.md` no existe, créalo antes de escribir
prompts. No inventes una dirección nueva en cada asset.

## Flujo obligatorio

1. **Identificar** `course`, `asset`, tema, copy aprobado y destino.
2. **Story Director:** definir concepto, metáfora, conflicto visual y mensaje.
3. **Art Director:** decidir sujeto principal, cámara, luz, color, composición,
   espacio negativo, foco y elementos prohibidos.
4. **Prompt Builder:** generar un prompt por asset usando la dirección de arte y
   las dimensiones de `config/asset-specs.json`.
5. **Image Generator:** usar GPT Images o la herramienta de imagen disponible
   para crear concept art editorial. No usar SVG, HTML, PIL o composición
   programática como arte final, salvo para overlays o placeholders.
6. **Overlay Builder:** componer el copy aprobado sobre el arte base cuando el
   asset final lo requiera. El texto final debe ser una capa controlada, no
   texto inventado por el modelo de imagen.
7. **QA Visual:** revisar narrativa, marca, contraste, ortografía, composición,
   área segura, relación de aspecto y ausencia de texto falso.
8. **Exporter:** guardar, copiar a `public/` y validar solo assets aprobados.

## Regla de texto

La imagen base debe ser preferentemente text-free. El modelo de imagen cuenta la
escena; el sitio, Canva o una capa determinística colocan el copy aprobado.

Los assets en `generated/` guardan el arte base. Los assets en `export/`
representan la pieza final aprobable y deben incluir el copy cuando el formato
lo pida.

Por defecto, estos formatos deben salir con texto compuesto:

- `course-cover.*.png`
- `chapter-cover.*.png`
- `youtube-thumbnail.*.png`
- `og-image.*.png`, si se usará directamente para compartir en redes

Estos formatos pueden quedarse sin texto si el sitio pondrá el copy por HTML:

- `hero-desktop.*.png`
- `hero-mobile.*.png`
- `editorial-wide.*.png`

Solo permite texto dentro de la imagen cuando el usuario lo pida explícitamente
o cuando el asset sea una miniatura final. En ese caso:

- respetar exactamente el copy aprobado;
- conservar acentos;
- revisar ortografía;
- no agregar claims adicionales;
- garantizar contraste;
- dejar margen suficiente para recortes responsive.

No pedir al modelo de imagen que renderice el copy final salvo que el usuario
lo solicite como experimento. La ruta preferida es: arte base sin texto,
overlay controlado, QA visual y export final.

## Regla canónica de overlay

El overlay aprobado de Algoritmos es la referencia visual. Todo curso debe
mantener esta jerarquía salvo decisión explícita:

```yaml
sun: '#f0b008'
label: badge amarillo solar #f0b008, texto negro
code: amarillo solar #f0b008, muy grande
title: blanco/marfil en dark; negro en light
accent: amarillo solar #f0b008, tamaño fuerte comparable al título
descriptor: texto pequeño, legible, debajo del acento
```

No usar el amarillo solo en una palabra interna del título si el curso tiene un
acento aprobado. Ejemplo: en Patrones de diseño, `SOLUCIONES QUE ESCALAN` es el
acento amarillo; `PATRONES DE DISEÑO` queda como título blanco/marfil. Si el
título no cabe con el tamaño de referencia, se refluye en más líneas antes de
reducirlo de forma agresiva.

## Dirección de arte por curso

Cada curso debe tener:

```text
assets/courses/<course>/art-direction.md
```

Estructura recomendada:

```yaml
course:
status:
concept:
emotion:
metaphor:
main_subject:
story_beats:
camera:
lighting:
color:
composition:
negative_space:
focus:
avoid:
copy:
  label:
  code:
  title:
  accent:
  descriptor:
overlay:
prompt_seed:
```

La dirección de arte debe responder: qué historia cuenta la imagen, por qué esa
metáfora enseña el curso y qué debe evitarse para no caer en decoración genérica.

## Assets estándar

Generar un archivo individual por formato, nunca una hoja con varios tamaños.

- `course-cover.dark.png` — 1600x900
- `course-cover.light.png` — 1600x900
- `chapter-cover.dark.png` — 1200x675
- `chapter-cover.light.png` — 1200x675
- `editorial-wide.dark.png` — 2560x1080
- `editorial-wide.light.png` — 2560x1080
- `hero-desktop.dark.png` — 2560x1440
- `hero-desktop.light.png` — 2560x1440
- `hero-mobile.dark.png` — 1440x1800
- `hero-mobile.light.png` — 1440x1800
- `og-image.dark.png` — 1200x630
- `og-image.light.png` — 1200x630
- `youtube-thumbnail.dark.png` — 1280x720
- `youtube-thumbnail.light.png` — 1280x720

## Rutas

- prompts: `assets/courses/<course>/prompts/`
- originales generados: `assets/courses/<course>/generated/`
- aprobados: `assets/courses/<course>/export/`
- destino final del sitio: `public/assets/illustrations/courses/<course>/`
- ZIP opcional, solo si el usuario lo pide: `assets/packages/<course>.dark-light-youtube.zip`

El sitio consume las imágenes desde `public/assets/illustrations/courses/<course>/`.
Por eso, después de validar `export/`, copia ahí los 14 PNG aprobados. No crear
ZIP por defecto.

## Reglas visuales

- Editorial técnico, sobrio, artesanal y premium.
- Narrativa visual antes que iconografía suelta.
- Fondo negro dominante en dark theme.
- Fondo blanco, marfil o amarillo solar en light theme.
- Luz cálida dorada o ámbar como foco visual.
- Alto contraste y espacio negativo real.
- Elementos técnicos con propósito narrativo.
- Evitar morado y azul como colores dominantes.
- Evitar cyberpunk exagerado.
- Evitar íconos flotantes, dashboards falsos, texto ilegible, código aleatorio,
  collages, hojas de contacto, marcas reales y decoración sin función.
- Recomponer cada formato; no hacer recortes mecánicos.

## Comandos de validación

```bash
python3 tools/academy-assets/validate_assets.py assets/courses/<course>/export
```

Si el usuario pide un ZIP explícitamente, empaqueta después de validar.

## Criterio de terminado

No declarar terminado hasta que:

- existan los 14 PNG aprobados;
- sus nombres y dimensiones coincidan con `config/asset-specs.json`;
- los 14 PNG estén copiados en `public/assets/illustrations/courses/<course>/`;
- los prompts queden guardados;
- la imagen no parezca una maqueta HTML/SVG disfrazada de ilustración;
- el usuario haya aprobado el resultado antes de considerarlo final.

## Modo corto

Cuando exista `art-direction.md`, el usuario puede pedir:

```text
course: design-patterns
asset: hero-mobile
```

o:

```text
Genera el paquete visual completo de Design Patterns en dark, light y YouTube.
```

El agente debe derivar el prompt desde la dirección de arte, no escribir una
idea visual nueva desde cero.
