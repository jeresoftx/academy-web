# Contrato técnico: modelo maestro y derivado web de Nexo

**Estado:** propuesta de producción v2; requiere revisión humana antes de
crear la fuente maestra.

**Trazabilidad:** [issue #27](https://github.com/jeresoftx/academy-web/issues/27).
Complementa la [biblia de modelo](./model-sheet.md): aquella define qué se
construye; este contrato separa cómo se conserva la calidad maestra y cómo se
deriva una entrega responsable para la web.

## Decisión

Nexo tendrá dos entregables distintos:

1. **Modelo maestro:** fuente Blender de alta fidelidad para renders,
   comparaciones artísticas, texturas y rig.
2. **Derivado web:** malla optimizada, UV y mapas horneados que se exportan a
   GLB. Nunca es la fuente de verdad del diseño.

Un límite de runtime no autoriza degradar el maestro. Una mejora del maestro no
se publica hasta que su derivado web se mida y se apruebe de forma independiente.

## Estructura de archivos

```text
assets/mascot/nexo-3d/
├── source/
│   ├── nexo-v1.blend                 # Exploración actual; no canónica
│   ├── nexo-master-v1.blend          # Fuente maestra aprobada
│   └── nexo-web-v1.blend             # Retopología y horneado derivados
├── reference/
│   ├── README.md                     # Procedencia y prioridad de láminas
│   └── nexo-orthographic-v1.*        # Guías aprobadas de frente/perfil/reverso
├── textures/
│   ├── master/                       # Fuentes PBR de máxima resolución
│   └── web/                          # Mapas derivados y comprimidos
└── exports/
    ├── review/                       # Renders y GLB de revisión, no publicados
    └── nexo-web-v1.glb               # Candidato a entrega de runtime

public/assets/mascot/
├── nexo.glb                          # Entrega web aprobada
└── nexo-static.webp                  # Respaldo estático con transparencia
```

El archivo `nexo-v1.blend` ya creado se conserva como exploración. No se
renombra, modifica ni incorpora al export final sin una revisión explícita.

## Colecciones de Blender

| Colección      | Contenido                                   | Exportación                    |
| -------------- | ------------------------------------------- | ------------------------------ |
| `REF_NEXO`     | Láminas y guías ortográficas                | Nunca                          |
| `BLK_NEXO`     | Blockout revisable                          | Nunca                          |
| `HIG_NEXO`     | Modelo maestro de alta fidelidad            | Renders de revisión únicamente |
| `LOW_NEXO`     | Malla retopologizada para web               | Sí, mediante `EXPORT_NEXO`     |
| `RIG_NEXO`     | Armature de deformación                     | Sí, para el derivado web       |
| `CTRL_NEXO`    | Controles IK, guías y helpers               | Nunca                          |
| `LOOKDEV_NEXO` | Cámaras, luces y suelo de comparación       | Nunca                          |
| `EXPORT_NEXO`  | Solo mallas, materiales, rig y acciones web | Sí                             |

Una colección no se usa como sustituto de otra. En particular, `HIG_NEXO` no
se exporta por accidente como GLB.

## Convención de nombres

Los identificadores usan minúsculas y `snake_case`.

| Tipo             | Patrón                | Ejemplo                  |
| ---------------- | --------------------- | ------------------------ |
| Malla maestra    | `nexo_<pieza>_high`   | `nexo_visor_bezel_high`  |
| Malla web        | `nexo_<pieza>_low`    | `nexo_visor_bezel_low`   |
| Material maestro | `mat_nexo_<rol>_high` | `mat_nexo_graphite_high` |
| Material web     | `mat_nexo_<rol>_web`  | `mat_nexo_graphite_web`  |
| Mapa horneado    | `nexo_<pieza>_<tipo>` | `nexo_head_shell_normal` |
| Hueso            | `def_<lado>_<pieza>`  | `def_l_forearm`          |
| Control          | `ctrl_<lado>_<pieza>` | `ctrl_r_hand`            |
| Acción           | `nexo_<accion>`       | `nexo_think`             |

Los lados son `l` y `r`; el centro es `c`. Los pivotes se colocan en la
junta física que representan, nunca donde resulte cómodo para una pose aislada.

## Requisitos del modelo maestro

- No tiene un presupuesto de triángulos arbitrario. La densidad se justifica
  por silueta, biseles, cavidades y cámara de revisión.
- Conserva modificadores y fuentes editables hasta la aprobación de cada
  puerta; no se destruye la capacidad de corregir el diseño.
- Usa geometría real para detalles que alteran el borde, proyectan sombra o
  cambian el reflejo a cámara cercana.
- Usa UVs limpias y texturas PBR de fuente de hasta `4096 px` cuando la
  comparación de render lo justifique. La resolución no se incrementa por
  costumbre.
- Genera renders de revisión en frente, perfil, reverso y tres cuartos, sobre
  fondo neutro y con iluminación editorial separada.

## Requisitos del derivado web

| Recurso               |    Objetivo | Revisión obligatoria por encima de |
| --------------------- | ----------: | ---------------------------------: |
| Triángulos            | `<= 18 000` |                           `25 000` |
| Materiales exportados |      `<= 4` |                                `4` |
| Resolución por mapa   |   `1024 px` |                          `2048 px` |
| Peso de GLB           | `<= 1.5 MB` |                             `2 MB` |
| Respaldo WebP         |  `<= 80 KB` |                           `120 KB` |

La malla web puede conservar más geometría si una comparación documentada
demuestra que perderla altera de forma visible el casco, visor, núcleo,
articulaciones o silueta a los tamaños de uso. La justificación no cambia la
fuente maestra ni se oculta en un comentario de código.

## Materiales y horneado

El maestro puede emplear materiales de revisión separados para comprobar
lectura. El derivado web consolida, como máximo, estos cuatro roles:

1. `mat_nexo_graphite_web`: carcasa, torso y extremidades.
2. `mat_nexo_dark_metal_web`: articulaciones, biseles y cavidades.
3. `mat_nexo_visor_web`: superficie interior negra del rostro.
4. `mat_nexo_gold_web`: núcleo, nodos, ojos y acentos emisivos.

Normal, AO y metallic-roughness se hornean desde `HIG_NEXO` a `LOW_NEXO`
solo después de fijar UVs. No se hornean ojos, boca, cejas o el icono del núcleo
si necesitan cambiar de estado.

## Rig y acciones

El rig empieza cuando modelo maestro y derivado web comparten jerarquía de
piezas aprobada. Las mallas rígidas se parentan a huesos; no se deforman como
goma.

| Clip             | Uso                    | Repetición              |
| ---------------- | ---------------------- | ----------------------- |
| `nexo_idle`      | Reposo mínimo          | Sí, cuando esté visible |
| `nexo_wave`      | Saludo breve           | No                      |
| `nexo_think`     | Búsqueda u orientación | No                      |
| `nexo_celebrate` | Confirmación discreta  | No                      |

Rostro y núcleo usan controles independientes. La voz, el navegador y las
futuras capacidades de Nexo no forman parte del contrato de malla.

## Exportación y validación

1. Verificar que `EXPORT_NEXO` contiene solo `LOW_NEXO`, rig exportable,
   materiales web y acciones aprobadas.
2. Exportar GLB sin referencias, cámaras, luces, colecciones de control ni
   geometría maestra.
3. Comparar maestro y derivado a `112 px`, `224 px` y `448 px` en fondo
   claro y oscuro.
4. Medir triángulos, bytes, materiales y resolución de mapas.
5. Revisar escala, frente, ojos, boca, núcleo, clips y orientación en un visor
   GLB antes de integrarlo.
6. Probar carga diferida, `prefers-reduced-motion` y `nexo-static.webp` en el
   sitio.

No se agregan compresores, loaders o dependencias de renderizado sin un issue
que explique problema, alternativas y justificación, conforme a RFC-0001 §13.

## Trabajo bloqueado hasta revisión

No se crea `nexo-master-v1.blend`, no se retopologiza ni se exporta GLB hasta
que la biblia de modelo y el plan de producción reciban revisión humana.
