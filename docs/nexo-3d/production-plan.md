# Plan de producción: Nexo 3D de alta fidelidad

**Estado:** propuesta de producción; requiere revisión humana.

**Trazabilidad:** [issue #27](https://github.com/jeresoftx/academy-web/issues/27).
Este plan transforma las láminas aprobadas en un modelo maestro y, solo al
final, en un asset web. La calidad de la referencia gobierna el ritmo.

## Principio rector

La persona modeladora no debe adivinar el diseño mientras mueve vértices. Cada
fase entrega evidencia visual y obtiene aprobación antes de volver costosa una
decisión. Si una referencia se contradice, se pausa, se documenta y se decide;
nunca se tapa con detalle, textura o iluminación.

## Roles

| Rol                           | Responsabilidad                                                          |
| ----------------------------- | ------------------------------------------------------------------------ |
| Equipo de diseño              | Mantiene las láminas aprobadas y resuelve ambigüedades visuales.         |
| Dirección de modelado         | Define despiece, topología, lookdev, revisión y la derivación web.       |
| Persona asistente de modelado | Construye contra la biblia, guarda iteraciones y presenta comparaciones. |
| Revisión humana               | Aprueba cada puerta; ninguna aprobación se infiere de un avance técnico. |

## Puerta 0: preparar la verdad visual

**Propósito:** convertir láminas editoriales en un paquete de referencia usable.

1. Registrar procedencia y prioridad de las dos láminas.
2. Elegir una vista frontal, una lateral, una posterior y una tres cuartos de
   la lámina de producción como canon geométrico.
3. Crear guías ortográficas limpias con el mismo alto, línea de suelo, centro
   y ejes; no se estiran imágenes de perspectiva para fingir ortografía.
4. Dibujar o anotar límites de casco, bisel, visor, módulos laterales, panel
   trasero, núcleo, articulaciones y antena.
5. Registrar las zonas ambiguas en una tabla de decisiones antes de modelar.

**Salida:** paquete `nexo-orthographic-v1` y tabla de ambigüedades aprobados.

**No avanzar hasta confirmar:** que las cuatro vistas representan al mismo
personaje y que la lectura de la base del visor está resuelta.

## Puerta 1: despiece y blockout maestro

**Propósito:** aprobar la anatomía completa sin detalles que distraigan.

1. Crear `BLK_NEXO` con cascos, bisel, visor, módulos, antena, cuello, torso,
   núcleo, brazos, piernas y pies como masas separadas.
2. Usar simetría por `Mirror` y pivotes reales desde el inicio.
3. No añadir tornillos, arañazos, mapas, rig, emisión ni iluminación dramática.
4. Renderizar frente, perfil, reverso y tres cuartos con cámara ortográfica o
   con la cámara documentada por la referencia.
5. Superponer cada render sobre la guía correspondiente y anotar diferencias.

**Salida:** `nexo-master-v1.blend` con blockout aprobado y capturas de
comparación.

**No avanzar hasta confirmar:** que cabeza, visor y banda inferior leen como
una carcasa; que las cuatro vistas corresponden a un mismo volumen; y que el
centro de masa parece estable.

## Puerta 2: modelo maestro hard-surface

**Propósito:** transformar el blockout aprobado en geometría de render.

1. Construir jaulas de subdivisión para casco, biseles, torso y placas.
2. Definir espesor, juntas, cavidades y biseles físicos antes de microdetalle.
3. Modelar módulos laterales, panel trasero, rejilla, núcleo y articulaciones
   como ensamblajes reales.
4. Usar geometría para todo borde que cambie reflejo o sombra a cámara cercana.
5. Aplicar simetría solo después de validar frente, perfil y reverso.

**Salida:** colección `HIG_NEXO` sin UVs finales, con turnarounds comparables.

**No avanzar hasta confirmar:** que Nexo se reconoce sin color ni ojos y que
ninguna unión crítica depende de una textura para existir.

## Puerta 3: UV, PBR y lookdev

**Propósito:** reproducir grafito, visor y energía dorada sin esconder errores
de modelado.

1. Preparar UVs sin estiramiento visible en superficies relevantes.
2. Crear materiales de revisión: grafito, metal oscuro, visor y dorado.
3. Añadir desgaste selectivo, variación de rugosidad y microdetalle PBR.
4. Iluminar con un set neutro para evaluación y otro editorial para el render
   de presentación; nunca usar el segundo para ocultar defectos.
5. Comparar reflejos, profundidad del visor, legibilidad del núcleo y lectura
   de uniones contra el arte aprobado.

**Salida:** renders de revisión a alta resolución y fuentes de textura.

**No avanzar hasta confirmar:** que el rostro sigue legible, el dorado es un
acento y no domina el cuerpo, y el desgaste parece oficio, no suciedad.

## Puerta 4: rig y expresiones

**Propósito:** conservar calidad al mover el personaje.

1. Construir armature con huesos por articulación física.
2. Parentar piezas rígidas; usar deformación solo donde la pieza lo requiera.
3. Crear ojos, cejas, boca y núcleo como controles intercambiables.
4. Validar reposo, saludo, pensamiento, señalamiento y celebración de las
   láminas de referencia.
5. Revisar intersecciones en máximos de rotación y desde la cámara de web.

**Salida:** acciones del maestro y hoja de poses aprobadas.

**No avanzar hasta confirmar:** que una pose no rompe las uniones ni obliga a
deformar una pieza rígida para aparentar movilidad.

## Puerta 5: derivado web

**Propósito:** proteger el modelo maestro y crear una entrega sostenible.

1. Duplicar el maestro a `LOW_NEXO`; jamás reducir la única fuente existente.
2. Retopologizar por silueta y zonas móviles, manteniendo los objetos de
   expresión y núcleo que deben cambiar.
3. Hornear normal, AO y mapas de material desde `HIG_NEXO`.
4. Consolidar materiales sin cambiar la lectura.
5. Exportar GLB de revisión y comparar con el maestro a tamaños reales del
   sitio: `112 px`, `224 px` y `448 px`.

**Salida:** `nexo-web-v1.glb`, mediciones y justificaciones de presupuesto.

**No avanzar hasta confirmar:** que el GLB conserva la identidad de Nexo y que
la carga no bloquea lectura, navegación ni accesibilidad del sitio.

## Puerta 6: integración y conservación

**Propósito:** integrar sin convertir la mascota en una carga permanente.

1. Cargar el GLB solo por visibilidad, ociosidad o interacción.
2. Proveer `nexo-static.webp` y respetar `prefers-reduced-motion`.
3. Probar en themes oscuro y claro, móvil y escritorio.
4. Versionar la fuente, derivado, export y renders de aprobación.
5. Registrar futuras mejoras como issues nuevos, no como cambios implícitos a
   la versión aprobada.

## Registro mínimo por revisión

Cada puerta conserva fecha, captura de frente/perfil/reverso/tres cuartos,
archivo fuente, diferencias detectadas, decisión humana y siguiente paso. Un
"se ve bien" sin estas evidencias no cierra una puerta.
