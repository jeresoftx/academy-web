# Contrato técnico: Blender a GLB para Nexo 3D

**Estado:** propuesta de producción; requiere revisión humana antes de iniciar el
blockout.

**Trazabilidad:** [issue #11](https://github.com/jeresoftx/academy-web/issues/11)
del Project de Nexo. Complementa la
[ficha canónica de modelado](./model-sheet.md): aquella define qué es Nexo;
este documento define cómo se produce y entrega sin dañar la experiencia web.

## Concepto

El modelo de Nexo debe ser un asset de tiempo real: una sola fuente editable en
Blender produce un archivo GLB optimizado, animable y verificable para una isla
Vue. El modelo no es una escena de cine ni un render estático; debe conservar
el carácter editorial dentro de un presupuesto que permita cargarlo de forma
opcional en el sitio.

## Problema

Un archivo `.blend` puede contener cámaras, luces, modificadores, texturas y
geometría útiles para el trabajo artístico, pero innecesarios o incompatibles
para web. Sin convenciones, las animaciones se rompen, el peso aumenta y cada
exportación obliga a adivinar qué se debe conservar.

## Alternativas

1. Modelar libremente y resolver el export al final.
2. Exportar la escena completa con sus ayudas de producción.
3. Definir colecciones, nombres, presupuesto y validaciones antes de modelar.

## Decisión

Se adopta la tercera alternativa. Blender conserva la fuente de producción;
`nexo.glb` es el único artefacto 3D que consume el sitio. La exportación se
prueba antes de integrarse y siempre existe un respaldo estático para visitantes
sin WebGL o con movimiento reducido.

## Estructura de archivos

```text
assets/mascot/nexo-3d/
├── source/
│   └── nexo-v1.blend              # Fuente editable de Blender
├── reference/
│   └── README.md                  # Procedencia de las láminas aprobadas
└── exports/
    └── nexo-review.glb            # Export de revisión, no consumido por la web

public/assets/mascot/
├── nexo.glb                       # Entrega optimizada para runtime
└── nexo-static.webp               # Respaldo estático con transparencia
```

El archivo `.blend` se conserva como fuente de trabajo. No se reemplaza con un
GLB ni se edita directamente después de una exportación. Si el archivo fuente
supera un tamaño que Git pueda manejar cómodamente, se propone una estrategia
de almacenamiento antes de agregar Git LFS u otro servicio.

## Escala y orientación

- Unidad de escena: métrica, escala `1.0`.
- Altura canónica de Nexo, incluyendo antena: `1.00 m`.
- El origen del personaje está centrado entre los pies, sobre el plano de
  suelo. No se coloca en el centro de la cabeza ni dentro del torso.
- Las transformaciones de objetos exportables deben aplicarse: ubicación,
  rotación y escala coherentes antes de rig y exportación.
- El frente se valida visualmente en Blender y en un visor GLB de destino; no
  se compensan ejes con rotaciones ocultas dentro de la isla web.

La escala física no implica que Nexo se muestre a tamaño real en pantalla. Solo
normaliza luz, cámara, rig y exportación.

## Colecciones de Blender

| Colección      | Contenido                                  | ¿Se exporta?                               |
| -------------- | ------------------------------------------ | ------------------------------------------ |
| `REF_NEXO`     | Láminas de referencia y guías visuales     | No                                         |
| `GEO_NEXO`     | Malla final visible y sus piezas           | Sí                                         |
| `RIG_NEXO`     | Armature y huesos de deformación           | Sí                                         |
| `CTRL_NEXO`    | Controles artísticos, guías e IK           | No, salvo huesos de deformación necesarios |
| `LOOKDEV_NEXO` | Luces, cámara y suelo de revisión          | No                                         |
| `EXPORT_NEXO`  | Colección temporal que reúne lo exportable | Sí                                         |

Solo `EXPORT_NEXO` participa en el export. Esta separación evita incluir por
accidente referencias, ayudas de rig, cámaras o luces de trabajo.

## Convención de nombres

Los nombres son estables, en minúsculas y `snake_case`. No se usa `Cube.001`,
`Armature.002` ni nombres dependientes de idioma en objetos técnicos.

| Tipo                 | Patrón                | Ejemplos                                     |
| -------------------- | --------------------- | -------------------------------------------- |
| Malla                | `nexo_<pieza>`        | `nexo_head_shell`, `nexo_visor`, `nexo_core` |
| Material             | `mat_nexo_<rol>`      | `mat_nexo_graphite`, `mat_nexo_gold`         |
| Hueso de deformación | `def_<lado>_<pieza>`  | `def_l_upper_arm`, `def_r_foot`              |
| Control de rig       | `ctrl_<lado>_<pieza>` | `ctrl_l_hand`, `ctrl_head`                   |
| Acción               | `nexo_<accion>`       | `nexo_idle`, `nexo_wave`                     |
| Export               | `nexo.glb`            | Entrega de runtime                           |

Los lados usan `l` y `r`; el centro usa `c`. La cara, boca, cejas y núcleo se
nombran de forma independiente para permitir futuras expresiones sin romper la
anatomía base.

## Materiales y texturas

La primera entrega admite un máximo de cuatro materiales exportados:

| Material            | Uso                           | Texturas permitidas                                                   |
| ------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `mat_nexo_graphite` | Carcasa, torso y extremidades | Base color, normal, metallic-roughness, AO opcional                   |
| `mat_nexo_visor`    | Visor oscuro                  | Base color, metallic-roughness y emisión mínima si aporta legibilidad |
| `mat_nexo_gold`     | Antena, ojos y acentos        | Base color, metallic-roughness y emisión selectiva                    |
| `mat_nexo_core`     | Núcleo e icono de estado      | Base color, metallic-roughness, emisión y normal si es necesaria      |

- Resolución inicial: mapas de `1024 px`; `2048 px` requiere comparación visual
  y justificación escrita.
- El brillo del núcleo se produce con material emisivo, no con un halo o luz
  horneada en una textura.
- Sombras, humo, escarcha y reflejos de estudio de la lámina no forman parte de
  las texturas base.
- Las texturas se empaquetan en el GLB de entrega; las fuentes editables se
  conservan junto al `.blend` mientras el tamaño lo permita.

## Presupuesto de runtime

| Recurso                   |    Objetivo | Límite que requiere justificación |
| ------------------------- | ----------: | --------------------------------: |
| Triángulos de LOD inicial | `<= 18 000` |                        `> 25 000` |
| Materiales                |      `<= 4` |                             `> 4` |
| Resolución por mapa       |   `1024 px` |                         `2048 px` |
| Peso de `nexo.glb`        | `<= 1.5 MB` |                          `> 2 MB` |
| Respaldo WebP             |  `<= 80 KB` |                        `> 120 KB` |
| Clips iniciales           |         `4` |              `> 5` antes de medir |

El presupuesto se mide sobre el artefacto final publicado, no sobre el archivo
`.blend`. Un resultado que supere un límite puede aprobarse si explica qué
legibilidad o expresividad gana y cómo protege la carga diferida.

## Rig y clips iniciales

El rig se construye después de aprobar malla, UV y materiales. Las acciones de
la primera versión se exportan con estos nombres:

| Clip             | Propósito                      | Repetición                  |
| ---------------- | ------------------------------ | --------------------------- |
| `nexo_idle`      | Reposo mínimo con pausa amplia | Sí, solo cuando sea visible |
| `nexo_wave`      | Saludo breve                   | No                          |
| `nexo_think`     | Orientación o búsqueda         | No                          |
| `nexo_celebrate` | Confirmación discreta          | No                          |

Las expresiones de visor y los iconos del núcleo serán controles independientes.
No se promete sincronía labial en esta etapa. Cualquier nuevo clip exige una
razón de producto y una revisión visual.

## Exportación y validación

1. Aplicar transformaciones y confirmar que solo `EXPORT_NEXO` está seleccionada.
2. Exportar GLB con mallas, materiales, skinning y acciones nombradas.
3. Revisar el archivo en un visor GLB antes de integrarlo: escala, frente,
   materiales, clips, ojos, boca y núcleo.
4. Medir triángulos, materiales, texturas y bytes frente al presupuesto.
5. Probar la carga en una isla local con fondo claro y oscuro.
6. Validar el respaldo estático y `prefers-reduced-motion`.

No se agregan compresores, loaders o dependencias de renderizado hasta que un
issue de integración documente el problema, las alternativas y la justificación
de esa dependencia, conforme a RFC-0001 §13.

## Contrato web

- Astro entrega la página estática; la escena 3D vive en una isla Vue opcional.
- El GLB se carga después de interacción, ociosidad o visibilidad, nunca como
  requisito para leer contenido.
- Al ocultarse Nexo, cambiar de pestaña o activarse movimiento reducido, el
  render y las animaciones se pausan.
- Si WebGL, el modelo o la carga fallan, se muestra `nexo-static.webp` sin
  bloquear navegación, arrastre ni texto alternativo.
- La posición proporcional en `localStorage` sigue perteneciendo al componente
  de Nexo, no al archivo GLB.

## Revisión humana previa al blockout

- [ ] La estructura de archivos evita mezclar fuente y entrega web.
- [ ] Las colecciones separan referencia, geometría, rig, controles y export.
- [ ] Escala, origen, materiales y nombres son comprensibles para otra persona.
- [ ] El presupuesto protege la experiencia móvil sin degradar el arte aprobado.
- [ ] Las acciones iniciales y el respaldo estático son suficientes para la
      primera integración.
- [ ] Ninguna dependencia externa se aprobó implícitamente.

Tras esta revisión, [#12](https://github.com/jeresoftx/academy-web/issues/12)
puede comenzar el blockout de Blender contra dos contratos: visual y técnico.
