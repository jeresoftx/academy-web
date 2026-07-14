# Sistema visual del sitio

**Estado:** dirección inicial acordada, pendiente de producción de assets.

Este documento registra la dirección visual explorada para `academy-web`.
No reemplaza al Manual Fundacional: la fuente de verdad sigue siendo RFC-0001,
en especial §3 (identidad de marca) y §6 (sitio web). Aquí se aterrizan
decisiones operativas para no perder el criterio visual mientras se construye
el sitio.

## Concepto

Jeresoft Academy debe sentirse como una mesa de trabajo de ingeniería:
clara, exigente, viva y con oficio. El sitio no es un folleto ni un dashboard
corporativo. Es la puerta de entrada al camino de aprendizaje: video, artículo
y código conectados por una misma identidad (RFC-0001 §5).

La marca conserva los tres rasgos decididos en RFC-0001 §3:

- tema oscuro como cara principal;
- monospace como acento de identidad;
- color cálido de ingeniería.

La exploración actual concreta ese acento en una familia amarillo / ámbar /
dorado, con negro fuerte y blanco limpio.

## Problema

El sitio necesita dos temas visuales que se sientan parte de la misma marca:

- **Dark theme:** elegante, sobrio, técnico, con negro dominante y luz dorada.
- **Light theme:** claro y enérgico, con amarillo protagonista, blanco limpio
  y negro firme.

También necesita arte de apoyo por curso y capítulo. Ese arte no debe sentirse
como decoración genérica: debe reforzar el tema que se estudia.

## Alternativas consideradas

1. **Solo tarjetas tipográficas.** Simples y rápidas, pero pueden sentirse
   planas para una academia con 33 cursos.
2. **Una ilustración editorial por sección.** Da fuerza visual, pero no crea
   identidad individual para cada curso o capítulo.
3. **Sistema de ilustraciones por tema.** Más trabajo de producción, pero
   permite que cada curso tenga una portada reconocible sin romper la marca.

## Decisión

Adoptar un **sistema de ilustraciones por tema**:

- **Curso:** portada/thumbnail con un motivo visual fuerte.
- **Capítulo:** variación más pequeña del motivo del curso.
- **Ejercicio o recurso puntual:** icono, diagrama mínimo o micro-ilustración
  derivada.

La página puede incluir ilustraciones editoriales grandes, como "Del ruido al
criterio", pero cada curso y capítulo debe tener identidad visual propia.

## Dirección de themes

### Dark theme

El dark theme es la cara principal de la marca (RFC-0001 §3).

Carácter:

- negro dominante;
- dorado / ámbar como luz y acento;
- marfil para lectura;
- atmósfera elegante, técnica y sobria;
- terminales, editor, diagramas y arte de sistemas como elementos recurrentes.

Uso recomendado:

- home en modo oscuro;
- assets promocionales;
- YouTube thumbnails;
- portadas de cursos con tono más editorial.

### Light theme

El light theme no debe ser "blanco genérico". Debe tener carácter propio.

Carácter:

- amarillo solar protagonista;
- blanco limpio para lectura;
- negro fuerte para peso visual;
- tarjetas y terminales oscuras como contraste;
- energía de aprendizaje sin parecer template comercial.

Uso recomendado:

- lectura larga;
- listados de cursos y capítulos;
- páginas donde la claridad de texto gane sobre la atmósfera.

## Paleta de trabajo

Estos valores son punto de partida, no decisión final de marca.

| Token        | Hex       | Uso                           |
| ------------ | --------- | ----------------------------- |
| `ink`        | `#0a0907` | Negro principal               |
| `panel`      | `#11100d` | Paneles oscuros               |
| `ivory`      | `#f5efe6` | Texto claro cálido            |
| `paper`      | `#ffffff` | Fondo claro                   |
| `paper-soft` | `#faf8f2` | Fondo claro secundario        |
| `sun`        | `#ffd21a` | Amarillo protagonista         |
| `sun-soft`   | `#f6c661` | Franja/tarjeta amarilla suave |
| `gold`       | `#d99a32` | Acento dorado                 |
| `gold-soft`  | `#f0bd64` | Luz dorada                    |
| `muted`      | `#6f675b` | Texto secundario claro        |
| `line`       | `#e7dfce` | Bordes en light theme         |

## Lenguaje gráfico

El arte debe usar una misma familia visual:

- fondo negro o amarillo, según theme;
- grilla técnica sutil;
- terminales, editores, diagramas, nodos, notas, pantallas y documentos;
- luz dorada/ámbar como foco;
- tipografía monospace en etiquetas técnicas;
- composiciones limpias, sin exceso de elementos.

No copiar literalmente referencias externas. Las referencias sirven para color,
composición o atmósfera; el resultado debe sentirse propio de Jeresoft Academy.

## Dirección de arte IA

Cada curso debe tener una dirección de arte propia antes de generar prompts. El
sistema no debe pedir "una imagen de algoritmos" o "una imagen de patrones de
diseño"; debe contar una historia visual concreta.

Ruta por curso:

```text
assets/courses/<course>/art-direction.md
```

Flujo de decisión:

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
```

La imagen base debe ser preferentemente concept art editorial sin texto. El copy
aprobado se coloca después, mediante HTML, Canva o una capa determinística. Esto
mantiene la calidad tipográfica y permite adaptar la misma historia a dark,
light, YouTube, Open Graph y tarjetas del sitio.

## Motivos por curso

Primer mapa de motivos visuales:

| Curso                    | Motivo visual                                           |
| ------------------------ | ------------------------------------------------------- |
| Algoritmos               | Grafos, caminos, ventanas, búsqueda, complejidad        |
| Estructuras de datos     | Bloques, nodos, punteros, árboles, memoria              |
| Redes                    | Paquetes, rutas, capas, latencia, DNS/TLS               |
| Sistemas operativos      | Procesos, memoria, scheduler, filesystem                |
| Bases de datos internals | B-trees, LSM, WAL, índices, transacciones               |
| Concurrencia             | Hilos, locks, atómicos, canales, deadlocks              |
| Distribuidos             | Nodos, consenso, relojes, réplicas, gossip              |
| System Design            | Capacidad, colas, caches, límites, tradeoffs            |
| Arquitectura             | Capas, puertos/adaptadores, módulos, eventos            |
| Cloud                    | Regiones, redes, identidad, costos, servicios manejados |
| AI Engineering           | Vectores, RAG, herramientas, evaluación, agentes        |
| Travel Tech              | Inventario, disponibilidad, reservas, estados           |
| Patrones de diseño       | Piezas, composición, interfaces, estructura             |
| Testing                  | Checkpoints, propiedades, contratos, mutaciones         |
| Performance              | Cache, perfiles, memoria, mediciones                    |

## Tamaños de assets

Generar arte maestro en alta resolución. El sitio debe recortar/adaptar, no
pedir imágenes pequeñas desde el origen.

| Uso                       |  Ratio | Tamaño maestro |
| ------------------------- | -----: | -------------: |
| Hero principal home       |   16:9 |    `2560x1440` |
| Hero editorial ancho      |   21:9 |    `2560x1080` |
| Hero móvil                |    4:5 |    `1440x1800` |
| Card de curso             |   16:9 |     `1600x900` |
| Card compacta de capítulo |   16:9 |     `1200x675` |
| Header de capítulo        |    2:1 |     `1800x900` |
| Imagen inline educativa   |    4:3 |    `1600x1200` |
| Open Graph / social       | 1.91:1 |     `1200x630` |
| YouTube thumbnail         |   16:9 |     `1280x720` |
| Insignia / medalla        |    1:1 |    `1024x1024` |
| Banner README GitHub      |    2:1 |     `1600x800` |

Assets obligatorios por curso para el arranque:

1. `course-cover.dark.png` y `course-cover.light.png` (`1600x900`)
2. `chapter-cover.dark.png` y `chapter-cover.light.png` (`1200x675`)
3. `editorial-wide.dark.png` y `editorial-wide.light.png` (`2560x1080`)
4. `hero-desktop.dark.png` y `hero-desktop.light.png` (`2560x1440`)
5. `hero-mobile.dark.png` y `hero-mobile.light.png` (`1440x1800`)
6. `og-image.dark.png` y `og-image.light.png` (`1200x630`)
7. `youtube-thumbnail.dark.png` y `youtube-thumbnail.light.png` (`1280x720`)

Destino final del sitio:

```text
public/assets/illustrations/courses/<course>/
```

La carpeta `assets/courses/<course>/export/` conserva los PNG aprobados como
salida de producción; `public/` contiene la copia que consume el sitio. El ZIP
queda como entrega opcional, no como salida principal.

## Convención de nombres

Usar nombres descriptivos y estables:

```text
assets/illustrations/
  courses/
    algorithms/course-cover.dark.png
    algorithms/course-cover.light.png
    algorithms/chapters/two-pointers.cover.dark.png
    algorithms/chapters/two-pointers.cover.light.png
  editorial/
    del-ruido-al-criterio.dark.png
    del-ruido-al-criterio.light.png
  social/
    home.og.png
```

Si una composición funciona bien en ambos themes, se puede usar una sola
versión neutral. Si no, producir variante `dark` y `light`.

## Guía para GPT Images / Nano Banana

Prompt base sugerido:

```text
Jeresoft Academy educational software engineering illustration, modern technical
editorial style, black and warm golden amber palette, monospace code labels,
subtle engineering grid, clean composition, premium but not luxury advertising,
Spanish open academy, software craftsmanship, no logos, no real brand names,
no copied UI, no random decorative elements
```

Para light theme:

```text
white clean layout, solar yellow dominant background, strong black technical
elements, warm amber accents, readable educational composition
```

Para dark theme:

```text
dominant black background, warm golden light, ivory text areas, elegant sober
engineering atmosphere, terminal/editor glow
```

Reglas:

- pedir siempre espacio limpio para texto si la imagen se usará como hero;
- evitar texto generado dentro de la imagen salvo etiquetas monospace simples;
- no generar logos definitivos dentro del arte;
- no copiar personajes, marcas, interfaces reales o composiciones de referencia;
- priorizar diagramas, objetos técnicos y escenas de trabajo sobre fantasía visual.
- evitar resultados que parezcan maqueta HTML/SVG con cajas, grillas y texto sin
  narrativa visual.

## Flujo de producción por curso y capítulo

Cada curso, capítulo o bloque nuevo de la academia debe seguir este flujo para
producir guion, escena, apoyo gráfico y publicación.

```text
Claude
  ↓
Escribe el guion

  ↓

ChatGPT
  ↓
Diseña la escena como director de arte
Genera prompts

  ↓

GPT Image
  ↓
Genera la imagen

  ↓

Canva
  ↓
Ajustes mínimos

  ↓

Revisión humana
  ↓
Publicar
```

La revisión humana antes de publicar es obligatoria por RFC-0001 §20: la IA
acelera, pero el criterio humano decide. "Ajustes mínimos" en Canva significa
correcciones de composición, recorte, contraste, texto externo o adaptación al
formato final; no debe convertir cada pieza en un rediseño manual desde cero.

## Pendiente

- Definir tipografías finales (sans y monospace).
- Cerrar hex finales de marca.
- Decidir si las ilustraciones finales se guardan como PNG/WebP/AVIF por tipo.
- Regenerar prompts e imágenes desde `art-direction.md` para los cursos que aún
  no tengan arte aprobado.
- Convertir esta dirección en componentes reales del sitio cuando se implemente
  la home.
